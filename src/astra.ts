export type AstraCategory =
  | "descubrimiento"
  | "confianza"
  | "conversion"
  | "comunicacion"
  | "automatizacion"
  | "organizacion"
  | "presencia"
  | "ventas"
  | "reservas"
  | "seguimiento";

export interface AstraQuestionStep {
  id: string;
  field: string;
  question: string;
  clarification: string;
  quickOptions: string[];
}

export interface AstraDiagnosisCard {
  currentSituation: string;
  mainOpportunity: string;
  detectedFriction: string;
  possibleSolution: string;
  priority: "Alta" | "Media" | "Exploratoria";
  recommendedNextStep: string;
  classifiedNeed: AstraCategory;
  recommendsWebImmediately: boolean;
}

export const ASTRA_CONSULTATIVE_STEPS: AstraQuestionStep[] = [
  {
    id: "step_business",
    field: "businessType",
    question: "¿Qué tipo de negocio tienes y en qué ciudad estás?",
    clarification: "Para entender el contexto de tu cliente y si tu atención es física, local o foránea.",
    quickOptions: [
      "Taller artesanal / producción propia",
      "Restaurante / cafetería / alimentos",
      "Hospedaje / tours / ecoturismo",
      "Servicios profesionales / despacho",
      "Comercio local o mayoreo",
      "Proyecto personal / independiente",
    ],
  },
  {
    id: "step_offer",
    field: "offer",
    question: "¿Qué vendes o qué servicio ofreces principalmente?",
    clarification: "Tu oferta clave: aquello que genera la mayor parte de tus ingresos o interés.",
    quickOptions: [
      "Productos físicos con catálogo",
      "Servicios por cita o cotización",
      "Experiencias o recorridos",
      "Venta de mayoreo a distribuidores",
    ],
  },
  {
    id: "step_acquisition",
    field: "acquisition",
    question: "¿Cómo llegan actualmente tus clientes?",
    clarification: "Saber de dónde provienen nos dice si el freno está en atraer o en cerrar.",
    quickOptions: [
      "100% recomendación boca a boca",
      "Publicaciones en redes sociales (Facebook / Instagram)",
      "Búsquedas en Google / Google Maps",
      "Gente que pasa frente al local físico",
      "Aún no tengo un flujo constante",
    ],
  },
  {
    id: "step_info_location",
    field: "infoLocation",
    question: "¿Dónde encuentran información detallada sobre ti?",
    clarification: "Precios, horarios, catálogos, fotos reales o ubicación.",
    quickOptions: [
      "Tienen que mandarme mensaje porque no está en ningún lado",
      "En fotos o publicaciones de redes",
      "Tengo una página pero está desactualizada",
      "En Google Maps / ficha local",
    ],
  },
  {
    id: "step_contact_channel",
    field: "contactChannel",
    question: "¿Cómo te contactan habitualmente?",
    clarification: "El canal donde ocurre la primera conversación seria.",
    quickOptions: [
      "Mensajes directos de WhatsApp",
      "Llamadas telefónicas directas",
      "Mensajes privados de Facebook o Instagram",
      "Visita directa al local",
    ],
  },
  {
    id: "step_core_problem",
    field: "coreProblem",
    question: "¿Qué problema o fricción te gustaría resolver primero?",
    clarification: "Lo que hoy te preocupa o sientes que te frena.",
    quickOptions: [
      "Que más personas me encuentren",
      "Que entiendan mis precios sin regatear",
      "Que dejen de hacerme las mismas preguntas siempre",
      "No perder prospectos por tardar en responder",
      "Vender a personas fuera de mi ciudad",
    ],
  },
  {
    id: "step_current_efforts",
    field: "currentEfforts",
    question: "¿Qué haces actualmente para intentar resolverlo?",
    clarification: "Para no proponerte algo que ya probaste y no funcionó.",
    quickOptions: [
      "Publico más seguido en redes",
      "Respondo mensajes a mano a cualquier hora",
      "Mando fotos y textos largos uno por uno",
      "Aún no he implementado nada formal",
    ],
  },
  {
    id: "step_time_sink",
    field: "timeSink",
    question: "¿Qué parte del proceso te quita más tiempo o esfuerzo?",
    clarification: "La tarea más desgastante o repetitiva en tu semana.",
    quickOptions: [
      "Explicar qué incluye y dar cotizaciones manuales",
      "Dar seguimiento a personas que preguntaron y no contestaron",
      "Explicar horarios y ubicación",
      "Coordinar fechas y agendar citas/reservas",
    ],
  },
  {
    id: "step_horizon_goal",
    field: "horizonGoal",
    question: "¿Qué te gustaría que ocurriera durante los próximos meses?",
    clarification: "El resultado práctico y observable que esperas del cambio.",
    quickOptions: [
      "Tener un canal claro y ordenado para que me contacten",
      "Ahorrar 1 a 2 horas diarias de responder lo mismo",
      "Tener presencia profesional para generar confianza",
      "Recibir pedidos o reservas estructuradas",
    ],
  },
];

/**
 * Motor consultivo de ASTRA: evalúa las respuestas y genera el diagnóstico honesto.
 * Principio: NO sobre-vender web si el negocio necesita catálogo por WhatsApp, Maps o reservas.
 */
export function evaluateAstraConsultation(answers: Record<string, string>): AstraDiagnosisCard {
  const business = (answers["businessType"] || "").toLowerCase();
  const offer = (answers["offer"] || "").toLowerCase();
  const acq = (answers["acquisition"] || "").toLowerCase();
  const info = (answers["infoLocation"] || "").toLowerCase();
  const problem = (answers["coreProblem"] || "").toLowerCase();
  const timeSink = (answers["timeSink"] || "").toLowerCase();
  const goal = (answers["horizonGoal"] || "").toLowerCase();

  // Escenario 1: Necesita ubicación local y Google Maps antes que web costosa
  if (acq.includes("local físico") || problem.includes("más personas me encuentren") || info.includes("google maps") || timeSink.includes("ubicación")) {
    if (!info.includes("página")) {
      return {
        currentSituation:
          "Negocio con base física o servicio local cuyos clientes potenciales buscan cómo llegar o si está abierto.",
        mainOpportunity:
          "Aparecer con datos verificados en Google Maps y búsqueda local antes de construir una web compleja.",
        detectedFriction:
          "Las personas no tienen certeza de tu horario, dirección o cómo comunicarse directamente.",
        possibleSolution:
          "Optimización de Perfil de Negocio en Google (Maps) con horarios reales, fotos de fachada y enlace a WhatsApp.",
        priority: "Alta",
        recommendedNextStep:
          "Verificar tu ficha oficial en Google y publicar 5 fotografías claras de tu espacio y servicios.",
        classifiedNeed: "descubrimiento",
        recommendsWebImmediately: false,
      };
    }
  }

  // Escenario 2: Preguntas repetidas y cotización manual -> Reducir tiempo de respuesta con catálogo o FAQs
  if (timeSink.includes("cotizaciones manuales") || problem.includes("mismas preguntas") || timeSink.includes("explicar qué incluye")) {
    return {
      currentSituation:
        "Inviertes demasiado tiempo manual explicando características, precios y dudas básicas a prospectos individuales.",
      mainOpportunity:
        "Ordenar tu oferta en un catálogo accesible o página de consulta que resuelva dudas antes de que te escriban.",
      detectedFriction:
        "El cliente tiene que esperar a que estés desocupado para saber si puedes atenderle o cuánto cuesta.",
      possibleSolution:
        "Ficha digital o catálogo ágil con preguntas frecuentes y botón a WhatsApp que incluye el servicio de interés.",
      priority: "Alta",
      recommendedNextStep:
        "Escribir las 5 preguntas que más te hacen y crear respuestas rápidas o una página breve de consulta.",
      classifiedNeed: "comunicacion",
      recommendsWebImmediately: true,
    };
  }

  // Escenario 3: Reservas y citas -> Flujo estructurado
  if (offer.includes("experiencias") || timeSink.includes("citas/reservas") || goal.includes("reservas")) {
    return {
      currentSituation:
        "Negocio de experiencias o servicios donde la coordinación de fechas se hace manualmente por chat.",
      mainOpportunity:
        "Canalizar al visitante hacia una página de experiencias con condiciones de reserva y enlace directo a WhatsApp.",
      detectedFriction:
        "Conversaciones lentas para acordar fecha, número de personas y anticipo.",
      possibleSolution:
        "Página de experiencias con itinerario claro, recomendaciones, mapa y botón para apartar con mensaje pre-estructurado.",
      priority: "Alta",
      recommendedNextStep:
        "Documentar qué incluye cada experiencia y qué datos mínimos necesitas del cliente para agendarlo.",
      classifiedNeed: "reservas",
      recommendsWebImmediately: true,
    };
  }

  // Escenario 4: Clientes foráneos o necesidad de confianza
  if (problem.includes("fuera de mi ciudad") || goal.includes("generar confianza") || business.includes("artesanal")) {
    return {
      currentSituation:
        "Productos o servicios de alto valor que requieren que el comprador foráneo verifique tu seriedad y trayectoria.",
      mainOpportunity:
        "Construir presencia digital profesional que cuente tu historia, muestre la calidad y ofrezca certeza de compra.",
      detectedFriction:
        "El visitante foráneo tiene desconfianza de transferir o pagar a distancia sin ver un respaldo sólido.",
      possibleSolution:
        "Sitio web editorial con dirección de arte cuidada, políticas de envío transparentes y contacto directo.",
      priority: "Media",
      recommendedNextStep:
        "Seleccionar tus 5 piezas o casos de mayor orgullo con fotografías nítidas y testimonios reales.",
      classifiedNeed: "confianza",
      recommendsWebImmediately: true,
    };
  }

  // Escenario 5: Operación y seguimiento
  if (timeSink.includes("seguimiento") || problem.includes("perder prospectos")) {
    return {
      currentSituation:
        "Llegan consultas de personas interesadas pero se pierden en la bandeja de entrada sin un seguimiento ordenado.",
      mainOpportunity:
        "Crear un flujo de registro y seguimiento para recordar a prospectos indecisos sin saturarlos.",
      detectedFriction:
        "Mensajes que quedan sin respuesta de seguimiento a los 3 días de haber enviado información.",
      possibleSolution:
        "Implementación de etiquetas organizadas en WhatsApp Business o conexión simple con hoja de control de prospectos.",
      priority: "Alta",
      recommendedNextStep:
        "Configurar la aplicación WhatsApp Business y definir un mensaje de cortesía para recontactar a los 3 días.",
      classifiedNeed: "seguimiento",
      recommendsWebImmediately: false,
    };
  }

  // Por defecto: Evaluación de presencia y conversión
  return {
    currentSituation:
      "Negocio en marcha que busca ordenar su comunicación digital para transformar interés en oportunidades concretas.",
    mainOpportunity:
      "Alinear tus canales actuales (redes, mapa, WhatsApp) bajo una propuesta clara y sin fricción de contacto.",
    detectedFriction:
      "La información actual está fragmentada y depende de interacción manual para cada duda del cliente.",
    possibleSolution:
      "Ecosistema digital coordinado: presencia local clara + ruta ágil hacia WhatsApp sin pasos innecesarios.",
    priority: "Media",
    recommendedNextStep:
      "Revisar qué información ve hoy un cliente nuevo en los primeros 30 segundos de encontrarte.",
    classifiedNeed: "presencia",
    recommendsWebImmediately: true,
  };
}
