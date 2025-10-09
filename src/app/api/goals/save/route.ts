import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { getFirestore } from 'firebase-admin/firestore';
import type { CuratedGoal } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { goal } = body;

    // Validar meta
    if (!goal || !goal.metaSmarter) {
      return NextResponse.json(
        { error: 'Meta inválida' },
        { status: 400 }
      );
    }

    const db = getFirestore();
    const uid = session.sub;

    // Crear documento de meta en Firestore
    const goalDoc = {
      userId: uid,
      goalId: goal.id || `saved_${Date.now()}`,
      title: goal.metaSmarter,
      dimension: goal.dimension,
      categoria: goal.categoria,
      pasosAccion: goal.pasosAccion,
      status: 'sin-empezar' as const,
      progress: 0,
      generated: goal.generated || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Guardar en Firestore bajo la colección de metas del usuario
    const docRef = await db
      .collection('goals')
      .doc(uid)
      .collection('items')
      .add(goalDoc);

    return NextResponse.json({
      success: true,
      goalId: docRef.id,
      message: 'Meta guardada exitosamente',
    });
  } catch (error) {
    console.error('Error guardando meta:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

