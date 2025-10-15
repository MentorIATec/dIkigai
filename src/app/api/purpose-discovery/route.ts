import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { 
  type PurposeAnswer, 
  type PurposeProfile,
  calculateProgress,
  determineStage
} from '@/lib/purpose-discovery';

// Simulación de base de datos en memoria (en producción usarías una DB real)
const purposeProfiles = new Map<string, PurposeProfile>();

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    const profile = purposeProfiles.get(session.sub);
    
    return NextResponse.json({
      profile: profile || null
    });
  } catch (error) {
    console.error('Error fetching purpose profile:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { answers, progress, stage, lastUpdated } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Respuestas requeridas' },
        { status: 400 }
      );
    }

    // Validar que las respuestas tengan la estructura correcta
    for (const answer of answers) {
      if (!answer.questionId || !answer.response || !answer.category || !answer.type) {
        return NextResponse.json(
          { error: 'Formato de respuesta inválido' },
          { status: 400 }
        );
      }
    }

    const currentProfile = purposeProfiles.get(session.sub);
    
    // Calcular métricas
    const calculatedProgress = calculateProgress(answers);
    const calculatedStage = determineStage(answers, calculatedProgress);
    
    // Extraer temas clave de las respuestas
    const keyThemes = extractKeyThemes(answers);
    
    // Generar insights (esto se haría más sofisticado en producción)
    const insights = generateBasicInsights(answers);

    const updatedProfile: PurposeProfile = {
      studentId: session.sub,
      answers: answers,
      insights: insights,
      currentStage: calculatedStage,
      completionProgress: calculatedProgress,
      lastUpdated: new Date(lastUpdated || Date.now()),
      keyThemes: keyThemes,
      purposeStatement: currentProfile?.purposeStatement
    };

    purposeProfiles.set(session.sub, updatedProfile);

    return NextResponse.json({
      profile: updatedProfile,
      message: 'Perfil actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error saving purpose profile:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { purposeStatement, lastUpdated } = body;

    if (!purposeStatement || typeof purposeStatement !== 'string') {
      return NextResponse.json(
        { error: 'Declaración de propósito requerida' },
        { status: 400 }
      );
    }

    const currentProfile = purposeProfiles.get(session.sub);
    
    if (!currentProfile) {
      return NextResponse.json(
        { error: 'Perfil no encontrado' },
        { status: 404 }
      );
    }

    const updatedProfile: PurposeProfile = {
      ...currentProfile,
      purposeStatement: purposeStatement.trim(),
      lastUpdated: new Date(lastUpdated || Date.now())
    };

    purposeProfiles.set(session.sub, updatedProfile);

    return NextResponse.json({
      profile: updatedProfile,
      message: 'Declaración de propósito actualizada'
    });

  } catch (error) {
    console.error('Error updating purpose statement:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Funciones helper
function extractKeyThemes(answers: PurposeAnswer[]): string[] {
  const wordCount = new Map<string, number>();
  
  answers.forEach(answer => {
    const words = answer.response.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 4 && 
        !['que', 'para', 'como', 'donde', 'cuando', 'porque', 'desde', 'hasta', 'sobre', 'bajo', 'entre', 'hacia'].includes(word)
      );
    
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
  });
  
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

function generateBasicInsights(answers: PurposeAnswer[]): any[] {
  // Esta es una implementación básica. En producción, podrías usar
  // análisis más sofisticado o incluso IA para generar insights
  
  const insights = [];
  
  // Insight basado en categorías más exploradas
  const categoryCount = new Map<string, number>();
  answers.forEach(answer => {
    categoryCount.set(answer.category, (categoryCount.get(answer.category) || 0) + 1);
  });
  
  const mostExploredCategory = Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])[0];
  
  if (mostExploredCategory) {
    insights.push({
      id: 'category_focus',
      title: `Enfoque en ${mostExploredCategory[0]}`,
      description: `Has explorado más profundamente el área de ${mostExploredCategory[0]}, lo que sugiere que es un aspecto importante de tu propósito.`,
      category: mostExploredCategory[0],
      actionableSteps: [
        `Reflexiona más sobre cómo ${mostExploredCategory[0]} se conecta con tu propósito`,
        'Busca oportunidades para desarrollar esta área',
        'Considera cómo puedes usar este enfoque para ayudar a otros'
      ]
    });
  }
  
  // Insight basado en longitud de respuestas
  const avgResponseLength = answers.reduce((sum, answer) => sum + answer.response.length, 0) / answers.length;
  
  if (avgResponseLength > 200) {
    insights.push({
      id: 'deep_reflection',
      title: 'Pensador Profundo',
      description: 'Tus respuestas detalladas muestran una capacidad excepcional para la reflexión profunda.',
      category: 'autoconocimiento',
      actionableSteps: [
        'Considera escribir un diario de reflexión regular',
        'Comparte tus insights con mentores o consejeros',
        'Explora oportunidades de mentoría para otros'
      ]
    });
  }
  
  return insights;
}
