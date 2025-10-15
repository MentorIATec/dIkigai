export const BRUJULA_TESTS = {
  exploracion: {
    stageLabel: "Test Exploración",
    title: "Brújula de Cambio de Etapa",
    description:
      "Completa este diagnóstico para prepararte para tu siguiente etapa académica.",
    questions: [
      {
        key: "carrera",
        title:
          "🎓 ¿Qué tan claro tengo la carrera que deseo elegir y mi proceso para decidir?",
        options: [
          "No tengo nada claro, necesito orientación.",
          "Tengo algunas ideas, pero sigo confundido/a.",
          "Estoy explorando opciones (cursos, talleres o asesoría).",
          "Tengo casi decidido mi camino.",
          "Estoy totalmente seguro/a de mi elección.",
        ],
      },
      {
        key: "academico",
        title:
          "📚 ¿Cómo evalúo mi desempeño académico y mi promedio actual?",
        options: [
          "Me siento insatisfecho/a con mi promedio.",
          "Mi promedio no refleja mi esfuerzo.",
          "Estoy en un promedio aceptable, pero quiero mejorar.",
          "Estoy satisfecho/a con mi desempeño.",
          "Mi promedio es excelente y constante.",
        ],
      },
      {
        key: "practicas",
        title:
          "💼 ¿Qué tanto sé sobre cómo y dónde buscar mis primeras prácticas profesionales?",
        options: [
          "No sé nada aún sobre prácticas.",
          "He escuchado algo, pero no tengo claro el proceso.",
          "Estoy investigando opciones y requisitos.",
          "Ya identifiqué oportunidades concretas.",
          "Estoy por aplicar o ya apliqué a prácticas.",
        ],
      },
      {
        key: "servicio_social",
        title:
          "🤝 ¿Qué tan claro tengo mi plan para completar las 480 horas de servicio social?",
        options: [
          "No he pensado en el servicio social.",
          "Sé que es requisito, pero no tengo plan.",
          "Estoy revisando opciones o proyectos.",
          "Ya tengo una opción identificada.",
          "Estoy inscrito/a y avanzando en horas.",
        ],
      },
    ],
  },
  enfoque: {
    stageLabel: "Test Enfoque",
    title: "Brújula de Cambio de Etapa",
    description:
      "Completa este diagnóstico para prepararte para tu siguiente etapa académica.",
    questions: [
      {
        key: "servicio_social",
        title:
          "🤝 Antes de cursar mi Semestre Tec, ¿cuál es mi estatus con las 480 horas de Servicio Social?",
        options: [
          "No tengo claro cuándo lo terminaré ni cuántas horas me faltan.",
          "Tengo un plan, pero me preocupa no terminar antes de mi Semestre Tec.",
          "Pienso terminarlo en el próximo periodo intensivo (verano o invierno).",
          "Estoy en mi último proyecto y planeo terminarlo este semestre.",
          "¡Misión cumplida! Ya completé mis 480 horas o más.",
        ],
      },
      {
        key: "semestre_tec",
        title:
          "✈️ ¿Qué tan definida tengo mi elección para mi(s) Semestre(s) Tec (intercambio, prácticas, concentración)?",
        options: [
          "Tengo algunas ideas generales, pero no sé por dónde empezar a decidir.",
          "Estoy investigando, pero aún no defino una opción clara.",
          "Tengo solo una opción; si no funciona, no sabría qué elegir.",
          "Tengo al menos tres alternativas que me gustan y planeo validarlas con mi Director/a de Programa.",
          "Ya tengo cinco opciones bien estudiadas, me siento informado/a y ya las validé con mi Director/a de Programa.",
        ],
      },
      {
        key: "idioma",
        title:
          "🌍 Si considero un intercambio, ¿cuál es mi estatus con el examen de certificación de idioma (inglés, francés, alemán, etc.)?",
        options: [
          "No estoy considerando un intercambio / No tengo claro qué examen o puntaje necesito.",
          "Sé lo que necesito, pero aún no he comenzado a prepararme formalmente.",
          "Estoy preparándome para un idioma distinto al inglés (ej. francés, alemán) que es requisito.",
          "Me siento listo/a para presentar el examen, pero todavía no agendo fecha.",
          "¡Listo! Ya tengo mi certificado vigente con el puntaje necesario para mis opciones de intercambio.",
        ],
      },
      {
        key: "practicas",
        title:
          "💼 Si tuviera que aplicar hoy mismo a mis prácticas profesionales soñadas, ¿qué tan preparado/a me siento?",
        options: [
          "No me sentiría preparado/a; no he adaptado mi CV ni he explorado empresas.",
          "Tengo un CV básico, pero necesito mucho trabajo para adaptarlo y aún no busco activamente.",
          "Estoy mejorando mi CV y tengo una lista de empresas que me interesan.",
          "Me siento seguro/a con mi CV y ya estoy aplicando a vacantes o preparándome para entrevistas.",
          "Estoy totalmente preparado/a; ya estoy en procesos de entrevista, tengo una oferta o ya conseguí prácticas.",
        ],
      },
    ],
  },
  especializacion: {
    stageLabel: "Test Especialización",
    title: "Checklist de Graduación",
    description:
      "Valida tu preparación profesional, metas de primer año como EXATEC y balance de vida para una transición exitosa.",
    questions: [
      {
        key: "situacion_profesional",
        title:
          "1️⃣ ¿Cuál es mi situación profesional actual?",
        options: [
          "💼 Ya tengo un empleo de tiempo completo.",
          "🧑‍💻 Estoy en prácticas profesionales (medio tiempo).",
          "🚀 Estoy emprendiendo mi propio proyecto.",
          "🔎 Sigo buscando y explorando oportunidades.",
        ],
      },
      {
        key: "tipo_meta_post_graduacion",
        title:
          "2️⃣ ¿Qué tipo de meta profesional tengo más clara para mi primer año post-graduación?",
        options: [
          "💼 Consolidarme en un empleo estable en mi área.",
          "🎓 Obtener certificaciones profesionales específicas.",
          "💡 Crecer mi emprendimiento o negocio propio.",
          "📚 Aplicar a posgrados o especializaciones.",
          "🌍 Explorar oportunidades internacionales.",
        ],
      },
      {
        key: "preparacion_financiera",
        title:
          "3️⃣ ¿Qué tan preparado/a estoy financieramente para la transición post-graduación?",
        options: [
          "💰 Tengo ahorros y un plan financiero claro.",
          "📊 Tengo algunos ahorros, pero necesito planificar mejor.",
          "💸 Estoy justo/a, necesito estrategias para generar ingresos.",
          "😰 Me preocupa mi situación financiera post-graduación.",
          "❓ No he pensado en mi situación financiera.",
        ],
      },
      {
        key: "red_profesional",
        title:
          "4️⃣ ¿Cómo evalúas tu red profesional actual?",
        options: [
          "🤝 Tengo una red sólida y activa en mi área.",
          "👥 Tengo contactos, pero necesito fortalecerla.",
          "🔗 Estoy construyendo mi red profesional activamente.",
          "📱 Tengo pocos contactos relevantes en mi área.",
          "😔 No tengo una red profesional desarrollada.",
        ],
      },
      {
        key: "bienestar_integral",
        title:
          "5️⃣ ¿En qué dimensión del bienestar sientes que necesitas más apoyo durante esta transición?",
        options: [
          "🧘 Bienestar emocional y manejo de estrés.",
          "💪 Salud física y rutinas de autocuidado.",
          "🤝 Relaciones personales y apoyo social.",
          "🎯 Claridad de propósito y valores personales.",
          "✨ Balance integral de todas las dimensiones.",
        ],
      },
    ],
  },
  graduacion: {
    stageLabel: "Test Graduación",
    title: "Checklist de Graduación",
    description:
      "Valida tu preparación profesional, metas de primer año como EXATEC y balance de vida para una transición exitosa.",
    questions: [
      {
        key: "situacion_profesional",
        title:
          "1️⃣ ¿Cuál es mi situación profesional actual?",
        options: [
          "💼 Ya tengo un empleo de tiempo completo.",
          "🧑‍💻 Estoy en prácticas profesionales (medio tiempo).",
          "🚀 Estoy emprendiendo mi propio proyecto.",
          "🔎 Sigo buscando y explorando oportunidades.",
        ],
      },
      {
        key: "tipo_meta_post_graduacion",
        title:
          "2️⃣ ¿Qué tipo de meta profesional tengo más clara para mi primer año post-graduación?",
        options: [
          "💼 Consolidarme en un empleo estable en mi área.",
          "🎓 Obtener certificaciones profesionales específicas.",
          "💡 Crecer mi emprendimiento o negocio propio.",
          "📚 Aplicar a posgrados o especializaciones.",
          "🌍 Explorar oportunidades internacionales.",
        ],
      },
      {
        key: "preparacion_financiera",
        title:
          "3️⃣ ¿Qué tan preparado/a estoy financieramente para la transición post-graduación?",
        options: [
          "💰 Tengo ahorros y un plan financiero claro.",
          "📊 Tengo algunos ahorros, pero necesito planificar mejor.",
          "💸 Estoy justo/a, necesito estrategias para generar ingresos.",
          "😰 Me preocupa mi situación financiera post-graduación.",
          "❓ No he pensado en mi situación financiera.",
        ],
      },
      {
        key: "red_profesional",
        title:
          "4️⃣ ¿Cómo evalúas tu red profesional actual?",
        options: [
          "🤝 Tengo una red sólida y activa en mi área.",
          "👥 Tengo contactos, pero necesito fortalecerla.",
          "🔗 Estoy construyendo mi red profesional activamente.",
          "📱 Tengo pocos contactos relevantes en mi área.",
          "😔 No tengo una red profesional desarrollada.",
        ],
      },
      {
        key: "bienestar_integral",
        title:
          "5️⃣ ¿En qué dimensión del bienestar sientes que necesitas más apoyo durante esta transición?",
        options: [
          "🧘 Bienestar emocional y manejo de estrés.",
          "💪 Salud física y rutinas de autocuidado.",
          "🤝 Relaciones personales y apoyo social.",
          "🎯 Claridad de propósito y valores personales.",
          "✨ Balance integral de todas las dimensiones.",
        ],
      },
    ],
  },
} as const;

export type BrujulaTestKey = keyof typeof BRUJULA_TESTS;
export type BrujulaTest = typeof BRUJULA_TESTS[BrujulaTestKey];
