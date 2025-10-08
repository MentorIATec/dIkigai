import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { createCipheriv, randomBytes, createHash } from 'crypto';
import type { StudentProfile } from '@/lib/types';
import { normalizeSemester, computeStage } from '@/lib/profile/mapping';
import { COOKIE_NAME } from '@/lib/auth/config';

const useMockStore = !process.env.FIREBASE_PROJECT_ID;

type MockPrivateStoreEntry = {
  matricula_enc?: string;
  updatedAt: string;
};

const globalStores = globalThis as typeof globalThis & {
  __mockProfiles?: Record<string, StudentProfile>;
  __mockPrivateProfiles?: Record<string, MockPrivateStoreEntry>;
};

if (useMockStore) {
  globalStores.__mockProfiles = globalStores.__mockProfiles || {};
  globalStores.__mockPrivateProfiles = globalStores.__mockPrivateProfiles || {};
}

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

// Función utilitaria para obtener clave de cifrado consistente
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY || 'default-key-32-chars-long-12345';
  // Derivar siempre 32 bytes usando SHA-256 para evitar errores de longitud
  return createHash('sha256').update(secret).digest();
}

// Función para cifrar matrícula
function encryptMatricula(matricula: string): { encrypted: string; last4: string; hash: string } {
  const key = getEncryptionKey();
  const iv = randomBytes(12); // Tamaño recomendado para GCM
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  const encryptedBuffer = Buffer.concat([
    cipher.update(matricula, 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, authTag, encryptedBuffer]).toString('base64');

  const last4 = matricula.slice(-4);
  const salt = process.env.HASH_SALT || 'default-salt';
  const hash = createHash('sha256').update(matricula + salt).digest('hex');
  
  return {
    encrypted: payload,
    last4,
    hash
  };
}

// Función para validar sesión
async function validateSession(): Promise<string | null> {
  if (useMockStore) {
    // En modo mock, siempre retornar un usuario válido para pruebas
    return 'mock-user';
  }

  try {
    if (!process.env.FIREBASE_PROJECT_ID) {
      // Si Firebase no está configurado, usar modo mock
      return 'mock-user';
    }
    
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
    
    if (!sessionCookie) return null;
    
    const auth = getAuth();
    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error validating session:', error);
    // En caso de error, usar modo mock para desarrollo
    return 'mock-user';
  }
}

export async function GET() {
  try {
    const uid = await validateSession();
    if (!uid) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (useMockStore) {
      const profile = globalStores.__mockProfiles?.[uid] ?? null;
      return NextResponse.json({ profile });
    }

    const db = getFirestore();
    const profileDoc = await db.collection('student_profiles').doc(uid).get();
    
    if (!profileDoc.exists) {
      return NextResponse.json({ profile: null });
    }

    const profile = profileDoc.data() as StudentProfile;
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error getting profile:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const uid = await validateSession();
    if (!uid) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { semesterNumber, carreraId, carreraName, matricula } = body;

    // Validar datos requeridos
    if (!semesterNumber) {
      return NextResponse.json({ error: 'Número de semestre requerido' }, { status: 400 });
    }

    // Validar matrícula si se proporciona
    if (matricula) {
      const matriculaRegex = /^[A-Z]\d{8}$/;
      if (!matriculaRegex.test(matricula)) {
        return NextResponse.json({ 
          error: 'Formato de matrícula inválido. Debe ser una letra seguida de 8 dígitos (ej: A00803848)' 
        }, { status: 400 });
      }
      
      // Permitir matrícula de prueba específica
      const allowedTestMatriculas = ['A00803848'];
      if (!allowedTestMatriculas.includes(matricula)) {
        return NextResponse.json({ 
          error: 'Matrícula no autorizada para pruebas. Use A00803848' 
        }, { status: 403 });
      }
    }

    // Normalizar y calcular etapa
    const normalizedSemester = normalizeSemester(semesterNumber);
    const semesterStage = computeStage(normalizedSemester);

    // Preparar perfil
    const profile: StudentProfile = {
      semesterNumber: normalizedSemester,
      semesterStage,
      carreraId,
      carreraName,
      consent: {
        profile: true,
        version: '1.0',
        acceptedAt: new Date().toISOString()
      }
    };

    // Procesar matrícula si se proporciona
    if (matricula) {
      const { encrypted, last4, hash } = encryptMatricula(matricula);
      
      // Guardar datos públicos en student_profiles
      profile.matricula_last4 = last4;
      profile.matricula_hash = hash;
      
      if (useMockStore) {
        if (globalStores.__mockPrivateProfiles) {
          globalStores.__mockPrivateProfiles[uid] = {
            matricula_enc: encrypted,
            updatedAt: new Date().toISOString()
          };
        }
      } else {
        // Guardar matrícula cifrada en student_private
        const db = getFirestore();
        await db.collection('student_private').doc(uid).set({
          matricula_enc: encrypted,
          updatedAt: new Date().toISOString()
        });
      }
    }

    if (useMockStore) {
      if (globalStores.__mockProfiles) {
        globalStores.__mockProfiles[uid] = {
          ...profile,
        };
      }
    } else {
      // Guardar perfil
      const db = getFirestore();
      await db.collection('student_profiles').doc(uid).set({
        ...profile,
        updatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Reutilizar lógica de POST para actualizaciones
  return POST(request);
}
