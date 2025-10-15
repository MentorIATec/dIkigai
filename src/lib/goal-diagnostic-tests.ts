import type { StageDiagnosticTest } from '@/lib/types';
import { stageDiagnosticBankSchema } from '@/lib/schemas';

export const goalDiagnosticTests: StageDiagnosticTest[] = stageDiagnosticBankSchema.parse([
  {
    stage: 'exploracion',
    stageLabel: 'Test de Etapa de Enfoque (2.º a 3.º semestre)',
    title: 'Test de Etapa de Enfoque',
    description:
      'Evalúa tu claridad vocacional, tus hábitos académicos y los primeros pasos profesionales que necesitas para avanzar con seguridad a tu Semestre Tec.',
    questions: [
      {
        key: 'carrera',
        title: '🎓 ¿Qué tan claro tengo la carrera que deseo elegir y mi proceso para decidir?',
        options: [
          'No tengo nada claro, necesito orientación.',
          'Tengo algunas ideas, pero sigo confundido/a.',
          'Estoy explorando opciones (cursos, talleres o asesoría).',
          'Tengo casi decidido mi camino.',
          'Estoy totalmente seguro/a de mi elección.',
        ],
        focusAreas: [
          {
            dimension: 'Ocupacional',
            categoria: 'carrera',
            label: 'Claridad vocacional y exploración de opciones profesionales',
          },
        ],
      },
      {
        key: 'academico',
        title: '📚 ¿Cómo evalúo mi desempeño académico y mi promedio actual?',
        options: [
          'Me siento insatisfecho/a con mi promedio.',
          'Mi promedio no refleja mi esfuerzo.',
          'Estoy en un promedio aceptable, pero quiero mejorar.',
          'Estoy satisfecho/a con mi desempeño.',
          'Mi promedio es excelente y constante.',
        ],
        focusAreas: [
          {
            dimension: 'Intelectual',
            categoria: 'academico',
            label: 'Hábitos y herramientas académicas',
          },
        ],
      },
      {
        key: 'practicas',
        title: '💼 ¿Qué tanto sé sobre cómo y dónde buscar mis primeras prácticas profesionales?',
        options: [
          'No sé nada aún sobre prácticas.',
          'He escuchado algo, pero no tengo claro el proceso.',
          'Estoy investigando opciones y requisitos.',
          'Ya identifiqué oportunidades concretas.',
          'Estoy por aplicar o ya apliqué a prácticas.',
        ],
        focusAreas: [
          {
            dimension: 'Ocupacional',
            categoria: 'carrera',
            label: 'Primeros pasos hacia experiencias profesionales',
          },
        ],
      },
      {
        key: 'servicio_social',
        title: '🤝 ¿Qué tan claro tengo mi plan para completar las 480 horas de servicio social?',
        options: [
          'No he pensado en el servicio social.',
          'Sé que es requisito, pero no tengo plan.',
          'Estoy revisando opciones o proyectos.',
          'Ya tengo una opción identificada.',
          'Estoy inscrito/a y avanzando en horas.',
        ],
        focusAreas: [
          {
            dimension: 'Social',
            categoria: 'social',
            label: 'Participación en proyectos de impacto y servicio social',
          },
        ],
      },
    ],
  },
  {
    stage: 'enfoque',
    stageLabel: 'Test de Etapa de Especialización (4.º a 6.º semestre)',
    title: 'Diagnóstico de Especialización y Planeación Profesional',
    description:
      'Profundiza en tu Semestre Tec, certificaciones clave, preparación para prácticas profesionales y avance de servicio social durante tu etapa de especialización.',
    questions: [
      {
        key: 'servicio_social',
        title:
          '🤝 Antes de cursar mi Semestre Tec, ¿cuál es mi estatus con las 480 horas de Servicio Social?',
        options: [
          'No tengo claro cuándo lo terminaré ni cuántas horas me faltan.',
          'Tengo un plan, pero me preocupa no terminar antes de mi Semestre Tec.',
          'Pienso terminarlo en el próximo periodo intensivo (verano o invierno).',
          'Estoy en mi último proyecto y planeo terminarlo este semestre.',
          '¡Misión cumplida! Ya completé mis 480 horas o más.',
        ],
        focusAreas: [
          {
            dimension: 'Social',
            categoria: 'social',
            label: 'Servicio social y liderazgo con impacto',
          },
        ],
      },
      {
        key: 'semestre_tec',
        title:
          '✈️ ¿Qué tan definida tengo mi elección para mi(s) Semestre(s) Tec (intercambio, prácticas, concentración)?',
        options: [
          'Tengo algunas ideas generales, pero no sé por dónde empezar a decidir.',
          'Estoy investigando, pero aún no defino una opción clara.',
          'Tengo solo una opción; si no funciona, no sabría qué elegir.',
          'Tengo al menos tres alternativas que me gustan y planeo validarlas con mi Director/a de Programa.',
          'Ya tengo cinco opciones bien estudiadas, me siento informado/a y ya las validé con mi Director/a de Programa.',
        ],
        focusAreas: [
          {
            dimension: 'Ocupacional',
            categoria: 'carrera',
            label: 'Planeación de Semestre Tec y experiencias profesionales',
          },
        ],
      },
      {
        key: 'idioma',
        title:
          '🌍 Si considero un intercambio, ¿cuál es mi estatus con el examen de certificación de idioma (inglés, francés, alemán, etc.)?',
        options: [
          'No estoy considerando un intercambio / No tengo claro qué examen o puntaje necesito.',
          'Sé lo que necesito, pero aún no he comenzado a prepararme formalmente.',
          'Estoy preparándome para un idioma distinto al inglés (ej. francés, alemán) que es requisito.',
          'Me siento listo/a para presentar el examen, pero todavía no agendo fecha.',
          '¡Listo! Ya tengo mi certificado vigente con el puntaje necesario para mis opciones de intercambio.',
        ],
        focusAreas: [
          {
            dimension: 'Intelectual',
            categoria: 'academico',
            label: 'Certificaciones e idiomas para intercambio',
          },
        ],
      },
      {
        key: 'practicas',
        title:
          '💼 Si tuviera que aplicar hoy mismo a mis prácticas profesionales soñadas, ¿qué tan preparado/a me siento?',
        options: [
          'No me sentiría preparado/a; no he adaptado mi CV ni he explorado empresas.',
          'Tengo un CV básico, pero necesito mucho trabajo para adaptarlo y aún no busco activamente.',
          'Estoy mejorando mi CV y tengo una lista de empresas que me interesan.',
          'Me siento seguro/a con mi CV y ya estoy aplicando a vacantes o preparándome para entrevistas.',
          'Estoy totalmente preparado/a; ya estoy en procesos de entrevista, tengo una oferta o ya conseguí prácticas.',
        ],
        focusAreas: [
          {
            dimension: 'Ocupacional',
            categoria: 'carrera',
            label: 'Preparación para prácticas profesionales y networking',
          },
        ],
      },
    ],
  },
  {
    stage: 'especializacion',
    stageLabel: 'Checklist de Graduación (7.º semestre en adelante)',
    title: 'Checklist de Graduación',
    description:
      'Valida tu preparación profesional, las metas para tu primer año como EXATEC y el equilibrio de vida en la recta final.',
    questions: [
      {
        key: 'situacion_profesional',
        title: '1️⃣ ¿Cuál es mi situación profesional actual?',
        options: [
          '💼 Ya tengo un empleo de tiempo completo.',
          '🧑‍💻 Estoy en prácticas profesionales (medio tiempo).',
          '🚀 Estoy emprendiendo mi propio proyecto.',
          '🔎 Sigo buscando y explorando oportunidades.',
        ],
        focusAreas: [
          {
            dimension: 'Ocupacional',
            categoria: 'ocupacional',
            label: 'Transición profesional y búsqueda de oportunidades',
          },
        ],
      },
      {
        key: 'tipo_meta_post_graduacion',
        title: '2️⃣ ¿Qué tipo de meta profesional tengo más clara para mi primer año como EXATEC?',
        options: [
          '💼 Consolidarme en un empleo que me apasione.',
          '🎓 Aplicar a un posgrado en el extranjero.',
          '🚀 Emprender o hacer crecer mi negocio.',
          '📜 Adquirir certificaciones profesionales.',
          '🔍 Aún estoy explorando mis opciones.',
        ],
        focusAreas: [
          {
            dimension: 'Ocupacional',
            categoria: 'tipo_meta_post_graduacion',
            label: 'Especificación de tipo de meta profesional',
          },
        ],
      },
      {
        key: 'preparacion_financiera',
        title: '3️⃣ ¿Qué tan preparado/a estoy financieramente para la transición post-graduación?',
        options: [
          '💰 Tengo un plan financiero sólido y ahorros.',
          '💳 Tengo algunos ahorros pero necesito más planificación.',
          '📊 Tengo poco ahorro, necesito crear un presupuesto.',
          '😅 No he pensado en mi situación financiera post-graduación.',
        ],
        focusAreas: [
          {
            dimension: 'Financiera',
            categoria: 'preparacion_financiera',
            label: 'Preparación financiera para la transición',
          },
        ],
      },
      {
        key: 'red_profesional',
        title: '4️⃣ ¿Cómo evalúas tu red profesional actual?',
        options: [
          '🔗 Tengo una red sólida y activa en LinkedIn.',
          '👥 Tengo contactos pero necesito expandir mi red.',
          '🤷 Tengo pocos contactos profesionales relevantes.',
          '📱 No he desarrollado mi red profesional aún.',
        ],
        focusAreas: [
          {
            dimension: 'Social',
            categoria: 'red_profesional',
            label: 'Desarrollo y mantenimiento de red profesional',
          },
        ],
      },
      {
        key: 'bienestar_integral',
        title: '5️⃣ ¿En qué dimensión del bienestar sientes que necesitas más apoyo durante esta transición?',
        options: [
          '💪 Bienestar físico (ejercicio, salud).',
          '🧘 Bienestar emocional (estrés, ansiedad).',
          '✨ Bienestar espiritual (propósito, valores).',
          '🤝 Bienestar social (relaciones, comunidad).',
          '⚖️ Me siento equilibrado/a en todas las dimensiones.',
        ],
        focusAreas: [
          {
            dimension: 'Emocional',
            categoria: 'bienestar_integral',
            label: 'Bienestar integral durante la transición',
          },
        ],
      },
    ],
  },
]);

export const goalDiagnosticTestMap = goalDiagnosticTests.reduce<Record<string, StageDiagnosticTest>>(
  (acc, test) => {
    acc[test.stage] = test;
    return acc;
  },
  {},
);
