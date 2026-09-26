// Base de conocimiento editorial: "Aprende antes de decidir"
// Principio: Contenido real, riguroso y honesto. Sin relleno genérico de agencia, sin falsas garantías ni métricas inventadas.

export interface EducationArticle {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: "Presencia" | "Conversión" | "Operación" | "Estrategia";
  readTime: string;
  concept: string;
  whyItMatters: string;
  practicalExample: string;
  whatToCheck: string[];
  frequentMistakes: string[];
  toolOrResource: {
    name: string;
    description: string;
    officialUrl?: string;
  };
  suggestedStep: string;
  sources: {
    title: string;
    organization: string;
    url?: string;
    type: "oficial" | "técnica" | "institucional";
  }[];
}

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: "google-maps-perfil-negocio",
    slug: "google-maps-perfil-de-negocio",
    title: "¿Para qué sirve realmente Google Maps para un negocio?",
    tagline: "Diferencia entre solo aparecer en el mapa y presentar información que permita a un cliente visitarte o contactarte.",
    category: "Presencia",
    readTime: "4 min de lectura",
    concept:
      "El Perfil de Negocio en Google (Google Business Profile) es la ficha oficial que muestra a las personas tu ubicación, horarios, fotos, reseñas y vías de contacto directo cuando buscan tus servicios en Google Maps o en la búsqueda de Google.",
    whyItMatters:
      "Aparecer en el mapa no es una garantía de ventas, pero no tener los datos actualizados crea fricción inmediata: personas que llegan en horarios erróneos, números telefónicos desconectados o dudas sobre si el negocio sigue abierto. La información confiable reduce la desconfianza antes de la primera visita.",
    practicalExample:
      "Un taller artesanal o un restaurante en Oaxaca puede tener excelentes productos, pero si en Maps figura cerrado los domingos (cuando realmente abre) o no tiene fotos reales de la fachada ni menú visible, un visitante local o turista optará por otra opción que sí confirme qué ofrece y a qué hora atiende.",
    whatToCheck: [
      "¿El nombre, dirección y número de teléfono coinciden exactamente con tus otros canales?",
      "¿Los horarios habituales y de días festivos están actualizados?",
      "¿La categoría principal describe con exactitud tu actividad principal (ej. 'Restaurante de comida tradicional' vs. genérico 'Comercio')?",
      "¿Tienes fotografías recientes y claras de la fachada, interior y productos/servicios?",
      "¿Tienes activo el enlace a tu sitio web o canal directo de WhatsApp para resolver dudas?",
    ],
    frequentMistakes: [
      "Crear perfiles duplicados al cambiar de ubicación en lugar de actualizar la dirección oficial.",
      "Asumir que por tener una ficha en Maps ya no se necesita explicar con profundidad el valor de la oferta en una web.",
      "Comprar reseñas falsas: incumple las políticas oficiales de Google y puede derivar en la suspensión irreversible del perfil.",
    ],
    toolOrResource: {
      name: "Google Business Profile Manager",
      description: "Plataforma oficial gratuita de Google para verificar y gestionar la información de tu negocio en Maps y el Buscador.",
      officialUrl: "https://support.google.com/business/answer/3038063",
    },
    suggestedStep:
      "Antes de contratar publicidad local o herramientas complejas, verifica tu perfil oficial en Google, actualiza tus horarios reales y sube 5 fotografías nítidas tomadas con luz natural.",
    sources: [
      {
        title: "Directrices para representar a tu empresa en Google",
        organization: "Google Business Profile Help",
        url: "https://support.google.com/business/answer/3038177",
        type: "oficial",
      },
      {
        title: "Cómo mejorar el posicionamiento local en Google",
        organization: "Google Search Central",
        url: "https://support.google.com/business/answer/7091",
        type: "oficial",
      },
    ],
  },
  {
    id: "paginas-web-necesidad-real",
    slug: "necesito-realmente-una-pagina-web",
    title: "¿Necesito realmente una página web para mi negocio?",
    tagline: "Cuándo una web resuelve un problema real y cuándo es preferible empezar optimizando canales más simples.",
    category: "Presencia",
    readTime: "4 min de lectura",
    concept:
      "Un sitio web es un espacio propio en internet donde tú decides cómo se organiza la información, sin depender de los cambios de algoritmo, límites de diseño o formatos cerrados de las redes sociales.",
    whyItMatters:
      "No todo negocio necesita un sitio web sofisticado desde el primer día. Si apenas estás validando si alguien pagará por tu idea, un canal directo puede ser suficiente. Sin embargo, cuando tus clientes potenciales hacen preguntas repetidas, necesitan ver un catálogo ordenado o buscan verificar que existes antes de pagar, una web ahorra tiempo y genera certeza.",
    practicalExample:
      "Un proveedor de recorridos turísticos que atiende por Instagram suele pasar horas respondiendo en mensajes directos '¿qué incluye?', '¿cuál es el precio?' y enviando fotos sueltas. Una página web sencilla reúne las experiencias, los precios claros, las condiciones de cancelación y un botón para reservar por WhatsApp, filtrando consultas verdaderamente interesadas.",
    whatToCheck: [
      "¿Pasas más de 30 minutos al día respondiendo las mismas preguntas básicas en mensajes privados?",
      "¿Tus clientes te piden ver un catálogo, lista de precios o ejemplos de trabajos anteriores antes de decidirse?",
      "¿Dependes 100% de una sola red social para que te contacten?",
      "¿Tu propuesta de valor es difícil de explicar en el espacio breve de una biografía de perfil?",
    ],
    frequentMistakes: [
      "Construir una página web cargada de animaciones pesadas que tarda más de 5 segundos en cargar en conexiones móviles.",
      "Llenar la página de textos técnicos o palabras vacías ('somos líderes innovadores') en vez de explicar claramente qué vendes y cómo ayuda al cliente.",
      "Crear una web sin un llamado a la acción visible (teléfono, WhatsApp o formulario claro).",
    ],
    toolOrResource: {
      name: "PageSpeed Insights (W3C / Google)",
      description: "Herramienta técnica gratuita para auditar el rendimiento y velocidad real de un sitio web en teléfonos móviles.",
      officialUrl: "https://pagespeed.web.dev/",
    },
    suggestedStep:
      "Anota en una hoja las 5 preguntas que más te hacen tus prospectos. Si tus respuestas actuales son confusas o están dispersas, ese es el contenido base con el que debe iniciar tu primera página web.",
    sources: [
      {
        title: "Guía básica sobre el funcionamiento de los motores de búsqueda",
        organization: "Google Search Central",
        url: "https://developers.google.com/search/docs/fundamentals/how-search-works",
        type: "oficial",
      },
      {
        title: "Prácticas recomendadas para sitios móviles",
        organization: "W3C Web Standards",
        url: "https://www.w3.org/standards/webdesign/accessibility",
        type: "institucional",
      },
    ],
  },
  {
    id: "whatsapp-y-seguimiento",
    slug: "whatsapp-y-seguimiento-de-clientes",
    title: "¿Qué diferencia hay entre atender por WhatsApp y tener un flujo de seguimiento?",
    tagline: "Cómo evitar que las conversaciones con prospectos se enfríen o se pierdan en el desorden de chats.",
    category: "Conversión",
    readTime: "3 min de lectura",
    concept:
      "Atender por WhatsApp es responder los mensajes que van entrando; un flujo de seguimiento es el acuerdo y orden con el que registras en qué etapa está cada persona para no olvidar responderle ni dejar cotizaciones a medias.",
    whyItMatters:
      "Muchas pérdidas de ventas no ocurren porque el cliente haya rechazado la propuesta, sino porque nadie le dio seguimiento después de enviar la información, o porque el mensaje quedó enterrado bajo docenas de conversaciones nuevas.",
    practicalExample:
      "Un negocio inmobiliario o de servicios recibe 15 preguntas a la semana. Con WhatsApp normal, si el cliente dice 'lo consulto con mi socio y te aviso', ese chat baja en la bandeja. Con un flujo mínimo (etiquetas de WhatsApp Business o una hoja de control), a los tres días hay un recordatorio para preguntar si tuvieron oportunidad de revisarlo.",
    whatToCheck: [
      "¿Utilizas WhatsApp Business con mensajes de bienvenida y respuestas rápidas para preguntas comunes?",
      "¿Cuentas con un método (etiquetas, libreta o CRM) para saber quién pidió cotización y no ha respondido?",
      "¿Los enlaces desde tu sitio web o redes sociales abren WhatsApp con un mensaje predeterminado que te indica qué servicio buscan?",
    ],
    frequentMistakes: [
      "Instalar sistemas de respuestas automáticas (chatbots) agresivos que impiden hablar con una persona real cuando la consulta es específica.",
      "Enviar cadenas masivas de promociones a personas que solo hicieron una consulta puntual (riesgo de bloqueo por spam).",
    ],
    toolOrResource: {
      name: "WhatsApp Business Platform Guides",
      description: "Documentación oficial sobre el uso de perfiles de empresa, catálogos y herramientas de mensajería responsable.",
      officialUrl: "https://www.whatsapp.com/business",
    },
    suggestedStep:
      "Si aún utilizas WhatsApp personal para tu negocio, migra a la app gratuita WhatsApp Business, configura tu horario de atención y crea 3 respuestas rápidas para tus dudas más frecuentes.",
    sources: [
      {
        title: "Buenas prácticas de mensajería empresarial",
        organization: "Meta Business Support",
        url: "https://www.facebook.com/business/help/whatsapp-business-app",
        type: "oficial",
      },
    ],
  },
  {
    id: "automatizacion-ia-aplicada",
    slug: "cuando-vale-la-pena-automatizar-e-ia",
    title: "¿Cuándo vale la pena automatizar o usar IA en un negocio?",
    tagline: "Cómo distinguir entre resolver un cuello de botella real y añadir tecnología costosa que nadie va a utilizar.",
    category: "Operación",
    readTime: "4 min de lectura",
    concept:
      "Automatizar significa conectar dos o más herramientas para que una tarea fija ocurra sin intervención manual. La IA aplicada permite clasificar texto, resumir o redactar borradores a partir de reglas y modelos lingüísticos.",
    whyItMatters:
      "La inteligencia artificial no resuelve procesos que están desordenados desde la raíz. Automatizar un proceso roto solo produce errores más rápido. Vale la pena incorporar automatización cuando una tarea ya tiene pasos claros, se repite con alta frecuencia y quita tiempo valioso que el equipo debería dedicar a la atención o al servicio.",
    practicalExample:
      "Si cada vez que alguien llena un formulario de contacto debes copiar su nombre, teléfono y necesidad a mano en un documento para luego escribirle, una conexión sencilla puede guardar la fila automáticamente y notificarte en tu teléfono al instante con el enlace listo para responder.",
    whatToCheck: [
      "¿El proceso que quieres automatizar ya funciona hoy de forma manual con reglas claras?",
      "¿Es una tarea que se repite al menos 10 veces por semana de la misma manera?",
      "¿Sabes exactamente qué error podría ocurrir si la conexión falla y cómo detectarlo a tiempo?",
    ],
    frequentMistakes: [
      "Crear un 'agente de IA' para atender clientes sin supervisión humana cuando las preguntas requieren juicio de negocio o empatía.",
      "Pagar suscripciones mensuales complejas para automatizar algo que toma 2 minutos a la semana.",
    ],
    toolOrResource: {
      name: "Principios de diseño de automatizaciones (NIST & Open Web)",
      description: "Pautas de trazabilidad, supervisión humana en el bucle y control de errores en flujos digitales.",
      officialUrl: "https://www.nist.gov/itl/ai-risk-management-framework",
    },
    suggestedStep:
      "Identifica cuál es la tarea manual más aburrida y repetitiva de tu semana. Describe sus pasos del 1 al 5 en papel. Si no puedes describirla en pasos lógicos, primero hay que ordenar el proceso humano.",
    sources: [
      {
        title: "Artificial Intelligence Risk Management Framework (AI RMF)",
        organization: "National Institute of Standards and Technology (NIST)",
        url: "https://www.nist.gov/itl/ai-risk-management-framework",
        type: "institucional",
      },
    ],
  },
];
