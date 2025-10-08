import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { SemesterStage, StudentProfile } from '@/lib/types';
import type { DiagnosticResult, DiagnosticAnswer } from '@/lib/types.goal-templates';
import { generateRecommendations } from '@/lib/recommend';

// Inicializar Firebase Admin solo si las variables de entorno están disponibles
if (!getApps().length && process.env.FIREBASE_PROJECT_ID) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Las instancias de auth y db se inicializarán dentro de las funciones

// Función para validar sesión
async function validateSession(): Promise<string | null> {
  try {
    if (!process.env.FIREBASE_PROJECT_ID) return null;
    
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) return null;
    
    const auth = getAuth();
    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
}

// Función para normalizar scores
function normalizeScores(answers: DiagnosticAnswer[]): DiagnosticAnswer[] {
  return answers.map(answer => ({
    ...answer,
    score: Math.max(1, Math.min(5, answer.score))
  }));
}

export async function POST(
  request: NextRequest,
  { params }: { params: { stage: string } }
) {
  try {
    const uid = await validateSession();
    if (!uid) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const stage = params.stage as SemesterStage;
    const body = await request.json();
    const { periodKey, answers } = body;

    // Validar stage
    const validStages: SemesterStage[] = ['exploracion', 'enfoque', 'especializacion', 'graduacion'];
    if (!validStages.includes(stage)) {
      return NextResponse.json({ error: 'Etapa inválida' }, { status: 400 });
    }

    // Validar answers
    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'Respuestas requeridas' }, { status: 400 });
    }

    // Normalizar scores
    const normalizedAnswers = normalizeScores(answers);

    // Obtener perfil del estudiante
    const db = getFirestore();
    const profileDoc = await db.collection('student_profiles').doc(uid).get();
    const profile = profileDoc.exists ? profileDoc.data() as StudentProfile : undefined;

    // Generar recomendaciones
    const recommendations = generateRecommendations({
      stage,
      answers: normalizedAnswers,
      profile
    });

    const recommendedGoalIds = recommendations.map(rec => rec.id);

    // Crear resultado de diagnóstico
    const diagnosticResult: DiagnosticResult = {
      id: `${uid}_${stage}_${Date.now()}`,
      uid,
      stage,
      periodKey,
      answers: normalizedAnswers,
      createdAt: new Date().toISOString(),
      recommendedGoalIds
    };

    // Guardar en Firestore
    await db.collection('diagnostics').doc(uid).collection('results').doc(diagnosticResult.id).set(diagnosticResult);

    return NextResponse.json({ recommendedGoalIds });
  } catch (error) {
    console.error('Error processing diagnostic:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { stage: string } }
) {
  try {
    const uid = await validateSession();
    if (!uid) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const stage = params.stage as SemesterStage;
    const { searchParams } = new URL(request.url);
    const latest = searchParams.get('latest') === '1';
    const periodKey = searchParams.get('periodKey');

    // Validar stage
    const validStages: SemesterStage[] = ['exploracion', 'enfoque', 'especializacion', 'graduacion'];
    if (!validStages.includes(stage)) {
      return NextResponse.json({ error: 'Etapa inválida' }, { status: 400 });
    }

    const db = getFirestore();
    let query = db.collection('diagnostics').doc(uid).collection('results')
      .where('stage', '==', stage)
      .orderBy('createdAt', 'desc');

    if (periodKey) {
      query = query.where('periodKey', '==', periodKey);
    }

    if (latest) {
      query = query.limit(1);
    }

    const snapshot = await query.get();
    const results = snapshot.docs.map(doc => doc.data() as DiagnosticResult);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error getting diagnostics:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
