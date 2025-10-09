import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { ai } from '@/ai/genkit';
import { curatedGoalStages } from '@/lib/curated-goals';
import type { SemesterStage } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { dimension, stage, context } = body;

    // Validar inputs
    if (!dimension || !stage) {
      return NextResponse.json(
        { error: 'Dimensión y etapa requeridas' },
        { status: 400 }
      );
    }

    // Validar stage
    const validStages: SemesterStage[] = ['exploracion', 'enfoque', 'especializacion', 'graduacion'];
    if (!validStages.includes(stage)) {
      return NextResponse.json({ error: 'Etapa inválida' }, { status: 400 });
    }

    // Obtener información de la etapa
    const stageInfo = curatedGoalStages.find(s => s.etapa === stage);
    if (!stageInfo) {
      return NextResponse.json({ error: 'Información de etapa no encontrada' }, { status: 404 });
    }

    // Crear prompt para generar inspiración
    const prompt = `Eres un asistente educativo experto en desarrollo académico universitario del Tecnológico de Monterrey.

Tu tarea es generar una meta SMARTER personalizada para un estudiante en la etapa "${stageInfo.titulo}".

Contexto de la etapa:
${stageInfo.descripcion}

Dimensión del bienestar seleccionada: ${dimension}
${context ? `Contexto adicional del estudiante: ${context}` : ''}

Genera UNA meta SMARTER que sea:
- Specific (Específica): Clara y bien definida
- Measurable (Medible): Con criterios de éxito medibles
- Achievable (Alcanzable): Realista para un estudiante universitario
- Relevant (Relevante): Alineada con la etapa académica y dimensión
- Time-bound (Con plazo): Con fechas límite claras
- Evaluated (Evaluable): Con puntos de revisión
- Readjusted (Reajustable): Con estrategias de adaptación

Formato de respuesta (JSON):
{
  "metaSmarter": "La meta completa en una oración clara",
  "dimension": "${dimension}",
  "categoria": "categoría apropiada (académico, personal, profesional)",
  "pasosAccion": "Lista de 3-5 pasos de acción concretos, separados por líneas nuevas"
}

Asegúrate de que la meta sea inspiradora, práctica y específica para esta etapa académica.`;

    // Generar con AI
    const { text } = await ai.generate({
      prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 1000,
      },
    });

    // Parsear respuesta
    let generatedGoal;
    try {
      // Extraer JSON de la respuesta (puede venir con markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No se encontró JSON en la respuesta');
      }
      generatedGoal = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Error parseando respuesta de AI:', parseError);
      return NextResponse.json(
        { error: 'Error procesando la respuesta de AI' },
        { status: 500 }
      );
    }

    // Agregar metadatos
    const result = {
      ...generatedGoal,
      id: `generated_${Date.now()}_${dimension}`,
      generated: true,
      userId: session.sub,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ goal: result });
  } catch (error) {
    console.error('Error generando inspiración:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

