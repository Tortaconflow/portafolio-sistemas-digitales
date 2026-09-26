// Sistema de diagnóstico ligero y determinista para Cídiks · Reily Castro
// Principio: Orientación inicial transparente. No usa IA, ni backend, ni almacena datos personales.

export type DiagnosticArea = "presencia" | "conversion" | "operacion";

export interface DiagnosticOption {
  id: string;
  label: string;
  areaWeight: {
    presencia: number;
    conversion: number;
    operacion: number;
  };
  contextQuestionKey?: string;
}

export interface DiagnosticQuestion {
  id: string;
  title: string;
  subtitle?: string;
  options: DiagnosticOption[];
}

export interface DiagnosticResult {
  primaryArea: DiagnosticArea;
  secondaryArea?: DiagnosticArea;
  areaTitle: string;
  areaSubtitle: string;
  explanation: string;
  suggestedStep: string;
  ctaText: string;
}

// Paso 1: ¿Qué quieres conseguir?
export const INITIAL_QUESTION: DiagnosticQuestion = {
  id: "primary_goal",
  title: "¿Qué quieres conseguir?",
  subtitle: "Selecciona el objetivo principal que hoy más necesita tu negocio.",
  options: [
    {
      id: "mas_clientes",
      label: "Conseguir más clientes",
      areaWeight: { presencia: 2, conversion: 2, operacion: 0 },
      contextQuestionKey: "q_adquisicion",
    },
    {
      id: "google",
      label: "Aparecer mejor en Google",
      areaWeight: { presencia: 3, conversion: 1, operacion: 0 },
      contextQuestionKey: "q_presencia_actual",
    },
    {
      id: "reservas",
      label: "Recibir más reservas o solicitudes",
      areaWeight: { presencia: 1, conversion: 3, operacion: 1 },
      contextQuestionKey: "q_atencion_hoy",
    },
    {
      id: "vender_online",
      label: "Vender por internet",
      areaWeight: { presencia: 1, conversion: 3, operacion: 1 },
      contextQuestionKey: "q_catalogo_estado",
    },
    {
      id: "organizar_clientes",
      label: "Organizar mejor a mis clientes",
      areaWeight: { presencia: 0, conversion: 1, operacion: 3 },
      contextQuestionKey: "q_operacion_friccion",
    },
    {
      id: "automatizar",
      label: "Automatizar tareas repetitivas",
      areaWeight: { presencia: 0, conversion: 0, operacion: 3 },
      contextQuestionKey: "q_tiempo_perdido",
    },
    {
      id: "mejorar_presencia",
      label: "Mejorar mi presencia digital",
      areaWeight: { presencia: 3, conversion: 1, operacion: 0 },
      contextQuestionKey: "q_presencia_actual",
    },
    {
      id: "lanzar_idea",
      label: "Tengo una idea, pero no sé cómo convertirla en algo digital",
      areaWeight: { presencia: 2, conversion: 1, operacion: 1 },
      contextQuestionKey: "q_idea_etapa",
    },
  ],
};

// Preguntas contextuales para el Paso 2
export const CONTEXT_QUESTIONS: Record<string, DiagnosticQuestion> = {
  q_adquisicion: {
    id: "q_adquisicion",
    title: "¿Dónde sientes que se detienen hoy las personas interesadas?",
    subtitle: "Identificar este punto nos dice si el freno está en encontrarte o en contactarte.",
    options: [
      {
        id: "no_me_encuentran",
        label: "Casi nadie llega a ver lo que ofrezco o no me encuentran en internet",
        areaWeight: { presencia: 3, conversion: 0, operacion: 0 },
      },
      {
        id: "preguntan_pero_no_cierran",
        label: "Ven mis redes o preguntan por WhatsApp, pero la conversación se enfría y no concretan",
        areaWeight: { presencia: 0, conversion: 3, operacion: 0 },
      },
      {
        id: "muchos_mensajes_desordenados",
        label: "Llegan muchos mensajes y se me complica dar seguimiento rápido y ordenado",
        areaWeight: { presencia: 0, conversion: 1, operacion: 3 },
      },
    ],
  },
  q_presencia_actual: {
    id: "q_presencia_actual",
    title: "¿Qué herramientas utilizas actualmente para que te encuentren?",
    subtitle: "Para saber si hace falta construir desde la base o coordinar lo que ya tienes.",
    options: [
      {
        id: "solo_redes_boca_a_boca",
        label: "Solo redes sociales o recomendaciones; no tengo sitio web ni ficha en Google Maps",
        areaWeight: { presencia: 3, conversion: 0, operacion: 0 },
      },
      {
        id: "tengo_web_vieja",
        label: "Tengo una página o perfil en Maps, pero está desactualizada y no refleja el valor real",
        areaWeight: { presencia: 2, conversion: 2, operacion: 0 },
      },
      {
        id: "informacion_dispersa",
        label: "Tengo varias cosas creadas, pero la información está dispersa y confunde a los visitantes",
        areaWeight: { presencia: 2, conversion: 2, operacion: 1 },
      },
    ],
  },
  q_atencion_hoy: {
    id: "q_atencion_hoy",
    title: "¿Cómo solicitan hoy informes o reservas tus clientes?",
    subtitle: "Analizar el canal actual permite simplificar el camino hacia la decisión.",
    options: [
      {
        id: "mensajes_manuales_repetidos",
        label: "Por WhatsApp o llamadas, respondiendo las mismas dudas una por una de forma manual",
        areaWeight: { presencia: 1, conversion: 2, operacion: 2 },
      },
      {
        id: "falta_claridad_precios",
        label: "Piden informes pero tienen dudas sobre qué incluye o qué opción elegir",
        areaWeight: { presencia: 2, conversion: 2, operacion: 0 },
      },
      {
        id: "sin_calendario_registro",
        label: "No tengo un registro claro de quién preguntó ni cuándo le toca dar seguimiento",
        areaWeight: { presencia: 0, conversion: 1, operacion: 3 },
      },
    ],
  },
  q_catalogo_estado: {
    id: "q_catalogo_estado",
    title: "¿De qué tamaño es tu catálogo o variedad de productos?",
    subtitle: "El volumen define si requieres un catálogo ágil directo a WhatsApp o un sistema estructurado.",
    options: [
      {
        id: "catalogo_corto",
        label: "Menos de 20 productos o servicios clave que necesitan explicarse con mucha claridad",
        areaWeight: { presencia: 2, conversion: 2, operacion: 0 },
      },
      {
        id: "catalogo_mediano_mayoreo",
        label: "Un inventario más amplio o venta de mayoreo donde el cliente necesita armar un pedido rápido",
        areaWeight: { presencia: 1, conversion: 3, operacion: 1 },
      },
    ],
  },
  q_operacion_friccion: {
    id: "q_operacion_friccion",
    title: "¿Dónde se pierde más tiempo en la atención diaria?",
    subtitle: "Diferenciar la causa permite enfocar el esfuerzo operativo con precisión.",
    options: [
      {
        id: "seguimiento_manual",
        label: "Olvidar escribirle a clientes que dejaron su mensaje hace días",
        areaWeight: { presencia: 0, conversion: 2, operacion: 3 },
      },
      {
        id: "copiar_pegar_datos",
        label: "Copiar datos manualmente entre mensajes, notas o formatos",
        areaWeight: { presencia: 0, conversion: 0, operacion: 4 },
      },
      {
        id: "clientes_preguntan_basico",
        label: "Explicar horarios, ubicaciones y datos básicos que deberían estar claros antes",
        areaWeight: { presencia: 3, conversion: 1, operacion: 1 },
      },
    ],
  },
  q_tiempo_perdido: {
    id: "q_tiempo_perdido",
    title: "¿Qué tipo de tareas consumen más horas repetitivas?",
    subtitle: "No todo proceso conviene automatizar; buscamos la tarea más costosa.",
    options: [
      {
        id: "responder_preguntas_frecuentes",
        label: "Responder siempre lo mismo sobre condiciones, disponibilidad o catálogos",
        areaWeight: { presencia: 2, conversion: 1, operacion: 2 },
      },
      {
        id: "enviar_recordatorios",
        label: "Confirmaciones, recordatorios de citas o seguimiento post-atención",
        areaWeight: { presencia: 0, conversion: 1, operacion: 3 },
      },
      {
        id: "organizar_archivos_o_textos",
        label: "Redactar, estructurar o clasificar información en hojas de cálculo o documentos",
        areaWeight: { presencia: 0, conversion: 0, operacion: 4 },
      },
    ],
  },
  q_idea_etapa: {
    id: "q_idea_etapa",
    title: "¿En qué punto se encuentra tu idea?",
    subtitle: "Para saber si es momento de validar con una página ligera o definir la arquitectura.",
    options: [
      {
        id: "idea_en_mente",
        label: "Tengo la propuesta clara en mente, pero aún no tengo identidad ni presencia digital",
        areaWeight: { presencia: 3, conversion: 1, operacion: 0 },
      },
      {
        id: "validando_con_personas",
        label: "Ya tengo primeros clientes y necesito un lugar profesional donde presentar mi oferta",
        areaWeight: { presencia: 2, conversion: 3, operacion: 0 },
      },
    ],
  },
};

// Pregunta 3 final: Nivel de urgencia o prioridad de tiempo
export const FINAL_PRIORITY_QUESTION: DiagnosticQuestion = {
  id: "q_prioridad_tiempo",
  title: "¿Cuál es tu prioridad inmediata?",
  subtitle: "Una última pregunta para calibrar el siguiente paso sugerido.",
  options: [
    {
      id: "resolver_pronto",
      label: "Resolver lo más urgente con una solución ligera que pueda usar cuanto antes",
      areaWeight: { presencia: 1, conversion: 1, operacion: 0 },
    },
    {
      id: "armar_con_calma",
      label: "Estructurar bien las bases del negocio con visión a mediano plazo",
      areaWeight: { presencia: 1, conversion: 1, operacion: 2 },
    },
  ],
};

// Función pura de clasificación determinista
export function classifyDiagnostic(selectedOptionIds: string[]): DiagnosticResult {
  const scores: Record<DiagnosticArea, number> = {
    presencia: 0,
    conversion: 0,
    operacion: 0,
  };

  const allOptions = [
    ...INITIAL_QUESTION.options,
    ...Object.values(CONTEXT_QUESTIONS).flatMap((q) => q.options),
    ...FINAL_PRIORITY_QUESTION.options,
  ];

  selectedOptionIds.forEach((id) => {
    const opt = allOptions.find((o) => o.id === id);
    if (opt) {
      scores.presencia += opt.areaWeight.presencia;
      scores.conversion += opt.areaWeight.conversion;
      scores.operacion += opt.areaWeight.operacion;
    }
  });

  const sortedAreas = (Object.keys(scores) as DiagnosticArea[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  const primary = sortedAreas[0];
  const secondary = sortedAreas[1] !== primary && scores[sortedAreas[1]] > 0 ? sortedAreas[1] : undefined;

  switch (primary) {
    case "presencia":
      return {
        primaryArea: "presencia",
        secondaryArea: secondary,
        areaTitle: "Presencia digital",
        areaSubtitle: "Presentación, claridad de oferta y descubrimiento local",
        explanation:
          "Por lo que nos cuentas, parece que una de las primeras áreas a revisar podría ser cómo te encuentran y qué tan claro se explica lo que ofreces. Si las personas no logran encontrar tu negocio en Google o se confunden al ver información dispersa, el esfuerzo comercial se frena antes de empezar.",
        suggestedStep:
          "Antes de construir herramientas complejas, conviene ordenar tu propuesta en una página web clara y optimizar tu ficha local para que quien busque tus servicios entienda tu valor de inmediato.",
        ctaText: "Revisar presencia digital con Reily",
      };

    case "conversion":
      return {
        primaryArea: "conversion",
        secondaryArea: secondary,
        areaTitle: "Conversión y contacto",
        areaSubtitle: "Ruta desde la visita hasta el mensaje o cotización",
        explanation:
          "Por lo que nos cuentas, parece que tu negocio ya genera cierto interés, pero una de las primeras áreas a revisar podría ser el camino hacia la consulta. Cuando una persona tiene dudas sobre precios, horarios o debe dar demasiados pasos para preguntar por WhatsApp, muchas oportunidades se enfrían.",
        suggestedStep:
          "Conviene simplificar el recorrido: organizar la información de decisión en la web (experiencias, catálogo o condiciones) y colocar rutas directas a WhatsApp con contexto previo para que el cliente pregunte con certeza.",
        ctaText: "Revisar flujo de contacto con Reily",
      };

    case "operacion":
    default:
      return {
        primaryArea: "operacion",
        secondaryArea: secondary,
        areaTitle: "Operación y automatización",
        areaSubtitle: "Organización de consultas y reducción de tareas repetitivas",
        explanation:
          "Por lo que nos cuentas, el cuello de botella actual parece estar en el tiempo que demanda la atención diaria y el seguimiento manual. Repetir las mismas respuestas o perder el rastro de prospectos resta horas valiosas para atender el negocio.",
        suggestedStep:
          "Conviene identificar las dos o tres tareas que más tiempo consumen (preguntas frecuentes, registro de interesados o recordatorios) y conectar una solución ligera que ordene la atención sin añadir complejidad.",
        ctaText: "Revisar operación y tareas con Reily",
      };
  }
}
