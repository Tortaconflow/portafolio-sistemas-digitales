// Única fuente de textos, precios, imágenes y enlaces. Nunca incluir secretos aquí.
export type Project = {
  id: string;
  title: string;
  sector: string;
  tagline: string;
  status: string;
  problem: string;
  solution: string;
  components: string[];
  image: string;
  imageAlt: string;
  url: string;
  tone: string;
  evidenceApproved: boolean;
  gallery?: { src: string; preview?: string; alt: string; category: string }[];
};
export const content = {
  owner: {
    name: "Reily Jesus Castro Vicuña",
    shortName: "Reily",
    role: "Sistemas digitales con IA",
    location: "Oaxaca, México",
  },
  links: {
    email: "reilyvica@gmail.com",
    messenger: "https://m.me/reilyvica",
    whatsapp: "https://wa.me/529541621210",
    domain: "https://sandybrown-turkey-667440.hostingersite.com",
    facebook: "https://www.facebook.com/groups/1394889298845236",
    instagram: "",
    linkedin: "https://www.linkedin.com/feed/",
    github: "https://github.com/Tortaconflow",
  },
  seo: {
    title: "Sistemas digitales con IA en Oaxaca",
    description:
      "Sitios web, automatización y sistemas de captación para negocios de Oaxaca y México. Conoce los proyectos y comienza con un diagnóstico de 15 minutos.",
    image: "/og-cover.png",
  },
  release: { approved: true },
  nav: [
    { id: "casos", label: "Casos" },
    { id: "servicios", label: "Servicios" },
    { id: "proceso", label: "Proceso" },
    { id: "precios", label: "Precios" },
    { id: "sobre-mi", label: "Sobre mí" },
    { id: "contacto", label: "Contacto" },
  ],
  ui: {
    menu: "Menú",
    closeMenu: "Cerrar menú",
    skip: "Ir al contenido",
    diagnosis: "Solicitar diagnóstico",
    case: "Ver caso",
    close: "Cerrar caso",
    visit: "Ver proyecto funcionando",
    problem: "El problema",
    system: "El sistema",
    components: "Qué incluye",
    imagePending: "Capturas reales por incorporar",
    imageNote:
      "La ficha describe el trabajo. Las imágenes se añadirán cuando estén disponibles y autorizadas.",
    gallery: "Dirección de arte seleccionada",
    galleryNote:
      "16 piezas maestras para redes sociales, organizadas por aventura, escapada, fauna y laguna.",
    openImage: "Abrir imagen completa",
    filterGallery: "Filtrar piezas por categoría",
    imageViewer: "Visor de dirección de arte",
    closeImage: "Cerrar imagen",
    previousImage: "Imagen anterior",
    nextImage: "Imagen siguiente",
    originalImage: "Ver original",

    backTop: "Volver al inicio",
    draft: "Vista previa · datos del propietario pendientes",
    pending: "Información pendiente para publicar",
    pendingNote:
      "Esta lista desaparece al completar la configuración y aprobar la publicación.",
    pendingItems: [
      "URL de Messenger real (WhatsApp queda opcional).",
      "Dominio propio y conexión de Hostinger con la rama del repositorio.",
      "Capturas auténticas y autorización de publicación de los cuatro casos.",
      "Confirmación del estado actual de cada proyecto.",
    ],
    sector: "Sector",
    all: "Todos",
    custom: "¿Tu proyecto necesita otra estructura?",
    customBody:
      "Catálogos, herramientas con IA, plataformas educativas y sistemas internos se cotizan a medida.",
    customCta: "Platiquemos del alcance",
  },
  hero: {
    signature: "REILY CASTRO / PORTAFOLIO",
    headline: "Diseño que",
    headlineAccent: "conecta.",
    discipline: "Dirección visual. UX/UI. Sistemas digitales.",
    visualLabel: "Selección de trabajo real para Paraíso Laguna",
    featured: "EN FOCO / DIRECCIÓN DE ARTE",
    visualNote: "Oaxaca, México · Diseño con intención",

    eyebrow: "SISTEMAS DIGITALES · OAXACA + REMOTO",
    lead: "Tu negocio ya tiene valor.",
    before: "Construyo el sistema para que ",
    find: "lo encuentren,",
    middle: " contacten y ",
    buy: "compren.",
    body: "Transformo lo que hace único a tu negocio en una experiencia digital clara, memorable y fácil de usar. Desde su identidad visual hasta la web y el siguiente contacto.",
    primary: "Cuéntame sobre tu negocio",
    secondary: "Ver casos construidos",
    note: "Empezamos con una conversación de 15 minutos.",
    diagramLabel: "DE LA PRIMERA VISITA AL SIGUIENTE PASO",
    diagramTitle: "Todo conectado.",
    diagramSteps: [
      { n: "01", title: "Te encuentran", text: "Búsqueda + contenido" },
      { n: "02", title: "Confían", text: "Web + casos reales" },
      { n: "03", title: "Te contactan", text: "Conversación + seguimiento" },
    ],
    indexLabel: "EXPLORA LOS SISTEMAS",
    indexNote: "Turismo / Inmobiliario / Comercio",
  },
  capabilities: [
    "WEB",
    "CONVERSIÓN",
    "AUTOMATIZACIÓN",
    "IA APLICADA",
    "UX/UI",
    "SISTEMAS",
  ],
  problem: {
    label: "01 / EL PUNTO DE PARTIDA",
    title: "No siempre necesitas publicar más.",
    emphasis: "Necesitas conectar mejor lo que ya haces.",
    body: "Tienes redes, fotografías, WhatsApp y experiencia. Pero, si cada pieza trabaja por su cuenta, las oportunidades se pierden entre una visita y una conversación.",
    end: "Conecto descubrimiento, confianza, contacto y seguimiento en un sistema que tiene sentido para tu negocio.",
    pieces: [
      "Que te encuentren",
      "Que entiendan tu valor",
      "Que den el siguiente paso",
    ],
  },
  cases: {
    label: "02 / PROYECTOS SELECCIONADOS",
    title: "Del problema al sistema.",
    body: "Tres contextos distintos. Una misma forma de trabajar: entender, ordenar y construir.",
    footnote:
      "Alcances descritos por el propietario. Sin métricas comerciales ni testimonios atribuidos.",
  },
  projects: [
    {
      id: "paraiso-laguna",
      title: "Paraíso Laguna",
      sector: "Turismo",
      tagline: "Un ecosistema visual para contar un destino.",
      status: "Trabajo construido · 16 piezas seleccionadas",
      problem:
        "Organizar el material de un proyecto ecoturístico de la costa de Oaxaca y conectar su comunicación con la captación.",
      solution:
        "PARAÍSO VISUAL DIRECTOR: organización editorial de 541 activos visuales, generación de carruseles y un sistema de comunicación turística.",
      components: [
        "Organización y clasificación editorial de 541 activos visuales",
        "Generador de carruseles y exportación",
        "Dirección visual para campañas",
        "Sistemas de copy, distribución, reseñas y captación",
        "Sitio y estrategia digital turística",
      ],
      image: "/projects/paraiso-laguna/portada-direccion-de-arte.webp",
      imageAlt:
        "Selección de dirección de arte para Paraíso Laguna con cabalgata, ballenas y kayak",
      url: "https://paraisolaguna.com/",
      tone: "laguna",
      evidenceApproved: true,
      gallery: [
        {
          src: "/projects/paraiso-laguna/aventura-cabalgata-costa-4x5.webp",
          preview:
            "/projects/paraiso-laguna/aventura-cabalgata-costa-4x5-preview.webp",
          alt: "Pieza Cabalgata frente al mar con una mujer a caballo en la costa",
          category: "Aventura",
        },
        {
          src: "/projects/paraiso-laguna/aventura-cabalgata-mockup-4x5.webp",
          alt: "Pieza editorial Cabalgata con una mujer montando a caballo",
          category: "Aventura",
        },
        {
          src: "/projects/paraiso-laguna/aventura-sin-internet-2x3.webp",
          alt: "Pieza Sin internet con una persona a caballo frente al mar",
          category: "Aventura",
        },
        {
          src: "/projects/paraiso-laguna/aventura-tirolesa-4x5.webp",
          alt: "Pieza Tirolesa con una viajera sobre la vegetación",
          category: "Aventura",
        },
        {
          src: "/projects/paraiso-laguna/escapada-aguas-termales-4x5.webp",
          alt: "Pieza Aguas termales con una pareja dentro del agua",
          category: "Escapada",
        },
        {
          src: "/projects/paraiso-laguna/escapada-copalita-collage-2x3.webp",
          alt: "Collage de las Cascadas Mágicas de Copalita",
          category: "Escapada",
        },
        {
          src: "/projects/paraiso-laguna/escapada-copalita-explora-4x5.webp",
          alt: "Pieza Explora las Cascadas Mágicas de Copalita",
          category: "Escapada",
        },
        {
          src: "/projects/paraiso-laguna/fauna-ballenas-2x3.webp",
          alt: "Pieza Ballenas con vista aérea de dos ballenas en el océano",
          category: "Fauna",
        },
        {
          src: "/projects/paraiso-laguna/fauna-tortugas-escobilla-2x3.webp",
          alt: "Pieza Tortugas con crías avanzando hacia el mar",
          category: "Fauna",
        },
        {
          src: "/projects/paraiso-laguna/laguna-aves-espatula-4x5.webp",
          preview:
            "/projects/paraiso-laguna/laguna-aves-espatula-4x5-preview.webp",
          alt: "Pieza Aves con una espátula rosada entre la vegetación",
          category: "Laguna",
        },
        {
          src: "/projects/paraiso-laguna/laguna-bioluminiscencia-nocturna-2x3.webp",
          alt: "Pieza nocturna de bioluminiscencia con una nadadora",
          category: "Laguna",
        },
        {
          src: "/projects/paraiso-laguna/laguna-bioluminiscencia-pareja-2x3.webp",
          alt: "Pieza Bioluminiscencia con una pareja dentro del agua iluminada",
          category: "Laguna",
        },
        {
          src: "/projects/paraiso-laguna/laguna-cocodrilos-manglar-2x3.webp",
          alt: "Pieza Cocodrilos con imágenes del manglar y su fauna",
          category: "Laguna",
        },
        {
          src: "/projects/paraiso-laguna/laguna-kayak-atardecer-4x5.webp",
          preview:
            "/projects/paraiso-laguna/laguna-kayak-atardecer-4x5-preview.webp",
          alt: "Pieza Kayak con dos personas remando al atardecer",
          category: "Laguna",
        },
        {
          src: "/projects/paraiso-laguna/laguna-kayak-manglares-2x3.webp",
          alt: "Pieza Kayak con una viajera recorriendo los manglares",
          category: "Laguna",
        },
        {
          src: "/projects/paraiso-laguna/laguna-manialtepec-atardecer-4x5.webp",
          alt: "Pieza Manialtepec con un grupo navegando durante la puesta de sol",
          category: "Laguna",
        },
      ],
    },
    {
      id: "gubidxa",
      title: "Fraccionamiento Gubidxa",
      sector: "Inmobiliario",
      tagline: "Certeza, inventario y captación en la Costa de Oaxaca.",
      status: "Trabajo construido y activo",
      problem:
        "Presentar el desarrollo de terrenos en San José El Nanchal (Costa de Oaxaca), resolver dudas sobre financiamiento y filtrar compradores directos a WhatsApp.",
      solution:
        "Landing page orientada a conversión con buscador por presupuesto, calculadora de financiamiento a 42 meses, inventario interactivo y canal directo de atención.",
      components: [
        "Landing page de alta velocidad y conversión inmobiliaria",
        "Calculadora y buscador interactivo por presupuesto",
        "Mapa de certezas jurídicas y comunales",
        "Galería de terreno y entorno natural en la costa",
        "Flujo de atención y visita física directo a WhatsApp",
      ],
      image: "/projects/gubidxa-01.jpeg",
      imageAlt: "Vista del terreno y entorno en Fraccionamiento Gubidxa",
      url: "https://palevioletred-fish-135686.hostingersite.com",
      tone: "brisa",
      evidenceApproved: true,
    },
    {
      id: "senor-gallo",
      title: "Señor Gallo VIP",
      sector: "Comercio",
      tagline: "Del catálogo al pedido, sin pasos de más.",
      status: "Trabajo construido y activo",
      problem:
        "Facilitar la consulta de productos de mayoreo y llevar una selección ordenada directamente a una cotización por WhatsApp.",
      solution:
        "Catálogo digital responsivo de mayoreo, sincronizado con datos estructurados y flujo de carrito a mensaje de WhatsApp.",
      components: [
        "Catálogo digital de mayoreo",
        "Estructura ágil para móviles",
        "Selección de productos y resumen",
        "Cotización y pedido mediante WhatsApp",
        "Optimización de velocidad y conversión",
      ],
      image: "/projects/senor-gallo-og.png",
      imageAlt: "Vista del catálogo digital de mayoreo Señor Gallo VIP",
      url: "https://darkslategray-dinosaur-608809.hostingersite.com",
      tone: "gallo",
      evidenceApproved: true,
    },
    {
      id: "consejo-cien-miradas",
      title: "El Consejo de las Cien Miradas",
      sector: "Inteligencia Artificial",
      tagline: "100 voces históricas y tradiciones frente al dilema de la IA.",
      status: "Trabajo construido y documentado",
      problem:
        "Estructurar un compendio enciclopédico y dialógico de 100 pensadores y civilizaciones para interpelar críticamente la inteligencia artificial.",
      solution:
        "Plataforma interactiva con oráculo dialógico, mapa de dependencias conceptuales, laboratorios de decisión y atlas filosófico.",
      components: [
        "Compendio curado de 100 perspectivas filosóficas e históricas",
        "Motor de diálogo e interpelación ética con IA",
        "Atlas conceptual y mapa de relaciones de pensamiento",
        "Laboratorio de toma de decisiones interdisciplinarias",
        "Interfaz inmersiva desarrollada en React y Tailwind CSS",
      ],
      image: "/projects/consejo-og.svg",
      imageAlt: "Plataforma interactiva El Consejo de las Cien Miradas",
      url: "https://github.com/Tortaconflow/el-consejo-de-las-cien-miradas",
      tone: "edu",
      evidenceApproved: true,
    },
  ] as Project[],
  services: {
    label: "03 / EN QUÉ PUEDO AYUDARTE",
    title: "Tecnología con una tarea clara.",
    items: [
      {
        icon: "↗",
        title: "Presencia que convierte",
        text: "Para que una visita entienda qué ofreces y sepa cómo contactarte. Sitios, landing pages y catálogos claros, rápidos y adaptados a móvil.",
        tags: "WEB / CATÁLOGOS / UX",
      },
      {
        icon: "◎",
        title: "Sistemas de captación",
        text: "Para que el interés no se pierda. Conecto contenido, anuncios, formularios, WhatsApp, reseñas, Google Business y seguimiento.",
        tags: "CONTACTO / SEGUIMIENTO",
      },
      {
        icon: "⌘",
        title: "Automatización e IA aplicada",
        text: "Para reducir tareas repetidas y ordenar información. Automatizaciones, asistentes y herramientas internas con un propósito definido.",
        tags: "PROCESOS / HERRAMIENTAS",
      },
      {
        icon: "↗",
        title: "Educación y capacitación con IA",
        text: "Para que docentes y equipos sepan aplicar la IA en su trabajo. Cursos, recursos, plataformas y acompañamiento contextualizado.",
        tags: "APRENDIZAJE / EQUIPOS",
      },
    ],
  },
  process: {
    label: "04 / CÓMO TRABAJAMOS",
    title: "Primero el negocio.\nDespués la tecnología.",
    body: "Sin tecnicismos innecesarios. Primero entendemos el negocio; después elegimos la tecnología.",
    items: [
      {
        title: "Entender",
        text: "Una conversación breve sobre tu negocio, lo que funciona y el problema que quieres resolver.",
      },
      {
        title: "Detectar",
        text: "Un diagnóstico de oportunidades para decidir qué vale la pena construir primero.",
      },
      {
        title: "Construir",
        text: "Desarrollo del activo o sistema acordado, con alcance y entregables claros.",
      },
      {
        title: "Activar",
        text: "Publicación, conexión de las piezas y acompañamiento inicial para empezar a usarlo.",
      },
    ],
  },
  pricing: {
    label: "05 / UN PUNTO DE PARTIDA",
    title: "Empieza por lo que necesitas.",
    body: "Alcance claro desde el inicio. El presupuesto final depende de lo que acordemos construir.",
    tabsLabel: "Opciones de inversión",
    includes: "QUÉ INCLUYE",
    currency: "MXN",
    from: "Desde",
    advance: "Los proyectos comienzan con 50% de anticipo.",
    extra:
      "Dominio, hosting, contenido adicional y servicios externos se cotizan por separado hasta conocer el proyecto.",
    plans: [
      {
        id: "diagnostico",
        name: "Diagnóstico",
        price: 0,
        subtitle: "Encontrar por dónde empezar.",
        description:
          "Una conversación de 15 minutos para entender tu negocio y detectar tres oportunidades iniciales.",
        items: [
          "Conversación de 15 minutos",
          "Detección inicial de tres oportunidades",
          "Orientación sobre el siguiente paso",
        ],
        note: "No incluye una auditoría extensa gratuita.",
        cta: "Solicitar diagnóstico",
      },
      {
        id: "esencial",
        name: "Presencia esencial",
        price: 2900,
        subtitle: "Un lugar claro para que te contacten.",
        description:
          "Una landing page que explica tu oferta y facilita el primer contacto.",
        items: [
          "Landing page orientada a conversión",
          "Diseño adaptable a móvil",
          "Botón o formulario de contacto",
          "SEO técnico básico",
          "Configuración de analítica básica",
          "Entrega lista para publicar",
        ],
        note: "El alcance se acuerda antes de comenzar.",
        cta: "Quiero una presencia esencial",
      },
      {
        id: "completo",
        name: "Sistema completo",
        price: 4900,
        subtitle: "Las piezas trabajando juntas.",
        description:
          "Una web conectada con tu canal de contacto y un primer flujo de seguimiento.",
        items: [
          "Diagnóstico y arquitectura personalizada",
          "Web orientada a captación",
          "Integración del canal de contacto",
          "Estructura de posicionamiento local",
          "Automatización inicial o flujo de seguimiento",
          "Capacitación de entrega",
        ],
        note: "La integración se define según tu operación.",
        cta: "Quiero conectar mi sistema",
      },
    ],
  },
  about: {
    label: "06 / DETRÁS DEL SISTEMA",
    title: "No construyo páginas aisladas.",
    emphasis: "Diseño cómo las piezas trabajan juntas.",
    body: "Soy [NOMBRE], desarrollador web y creador de sistemas digitales en Oaxaca. Mi trabajo combina tecnología, diseño y análisis de negocio para transformar ideas dispersas en herramientas funcionales. Me interesa entender cómo opera cada proyecto antes de decidir qué construir.",
    stamp: "CRITERIO HUMANO.\nTECNOLOGÍA APLICADA.",
    location: "Desde Oaxaca, para proyectos en México.",
    principles: [
      "Entender antes de construir.",
      "Elegir herramientas con criterio.",
      "Hacer que lo complejo sea útil.",
    ],
  },
  faq: {
    label: "07 / SIN LETRA CHIQUITA",
    title: "Antes de comenzar.",
    items: [
      [
        "¿Necesito saber de tecnología?",
        "No. Tú conoces tu negocio; yo traduzco sus necesidades en una propuesta comprensible. Te explico las decisiones y te acompaño en la entrega.",
      ],
      [
        "¿Trabajas solamente con negocios de Oaxaca?",
        "Trabajo con negocios de Oaxaca y también de forma remota con proyectos de otras partes de México. La comunicación y las entregas se acuerdan desde el inicio.",
      ],
      [
        "¿Cuánto tarda un proyecto?",
        "Depende del alcance, el contenido disponible y las integraciones. Después del diagnóstico te propongo un calendario con entregables y fechas; no te daré un plazo sin conocer el proyecto.",
      ],
      [
        "¿Qué necesitas de mi negocio para comenzar?",
        "Tu oferta, a quién atiendes, qué quieres mejorar y los materiales que ya tienes: textos, fotografías, identidad y enlaces. Revisamos juntos qué falta.",
      ],
      [
        "¿Puedo ver ejemplos funcionando?",
        "Puedes revisar las fichas de casos en esta página. Los enlaces a versiones en funcionamiento se incorporan cuando están disponibles y autorizados; también podemos revisar el material disponible durante la conversación.",
      ],
      [
        "¿Por qué solicitas anticipo?",
        "El 50% permite iniciar el trabajo acordado y reservar el tiempo de desarrollo. El alcance, los entregables y las condiciones del pago restante se establecen por escrito antes de comenzar.",
      ],
      [
        "¿El dominio y hosting están incluidos?",
        "No están incluidos en los precios iniciales. Se cotizan por separado según las necesidades del proyecto y quedan bajo las condiciones que acordemos.",
      ],
      [
        "¿Qué sucede después de la entrega?",
        "Recibes orientación para utilizar lo construido y el acompañamiento inicial acordado. Mantenimiento, nuevas funciones y soporte continuo se definen por separado.",
      ],
      [
        "¿Utilizas inteligencia artificial?",
        "Sí, cuando ayuda a clasificar información, reducir trabajo repetido o producir mejores herramientas. Reviso los resultados y no la incluyo por moda ni como sustituto de entender tu negocio.",
      ],
      [
        "¿Puedes mejorar una página que ya existe?",
        "Sí. Primero revisamos su estructura, claridad, experiencia móvil y flujo de contacto. El diagnóstico ayuda a decidir si conviene mejorarla o reconstruir alguna parte.",
      ],
    ],
  },
  contact: {
    label: "08 / CONVERSEMOS",
    title: "El primer paso es\nentender tu negocio.",
    body: "Cuéntame qué haces, qué quieres mejorar y dónde sientes que estás perdiendo oportunidades.",
    direct: "También podemos empezar por aquí",
    email: "Escribirme por correo",
    messenger: "Conversar en Messenger",
    whatsapp: "Conversar en WhatsApp",
    missing:
      "Los canales de contacto están pendientes de configuración. Puedes preparar y copiar tu mensaje.",
    privacy:
      "Este formulario no guarda ni envía datos a un servidor. Prepara un mensaje para que tú decidas cuándo compartirlo.",
    submit: "Preparar mi mensaje",
    prepared: "Tu mensaje está listo para revisar.",
    copy: "Copiar mensaje",
    copied: "Mensaje copiado.",
    copyError:
      "No fue posible copiarlo. Puedes seleccionar y copiar el texto del mensaje.",
    mail: "Abrir correo con mi mensaje",
    whatsappSend: "Enviar por WhatsApp",
    messengerSend: "Abrir Messenger",
    messengerNote: "Copia el mensaje y pégalo en la conversación de Messenger.",
    subject: "Diagnóstico de sistema digital",
    interest: "Me interesa",
    preview: "Mensaje preparado",
    fields: {
      name: "Nombre",
      business: "Nombre del negocio",
      sector: "Sector",
      city: "Ciudad",
      problem: "Principal problema",
      channel: "Canal de contacto",
      budget: "Presupuesto aproximado",
    },
    choose: "Selecciona una opción",
    sectors: [
      "Turismo y experiencias",
      "Restaurantes y vida nocturna",
      "Inmobiliario",
      "Educación",
      "Servicios profesionales",
      "Comercio",
      "Otro",
    ],
    channels: ["WhatsApp", "Correo", "Messenger"],
    budgets: [
      "Quiero orientación",
      "Hasta $2,900 MXN",
      "$2,900 a $4,900 MXN",
      "Más de $4,900 MXN",
      "Por definir",
    ],
    placeholders: {
      name: "¿Cómo te llamas?",
      business: "Nombre de tu proyecto",
      city: "¿Dónde está tu negocio?",
      problem: "¿Qué te gustaría que funcionara mejor?",
    },
  },
  footer: {
    tagline: "Sistemas digitales con IA · Oaxaca, México",
    note: "Pensado para conectar las piezas.",
    rights: "Todos los derechos reservados.",
  },
};
export function isConfigured(value: string) {
  return Boolean(value.trim()) && !/\[[^\]]+\]/.test(value);
}
export function isWebUrl(value: string) {
  try {
    return isConfigured(value) && new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
export function isEmail(value: string) {
  return isConfigured(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function releaseIssues() {
  const issues: string[] = [];
  if (
    !isConfigured(content.owner.name) ||
    !isConfigured(content.owner.shortName)
  )
    issues.push("Nombre público");
  if (!isEmail(content.links.email)) issues.push("Correo");
  if (!isWebUrl(content.links.messenger)) issues.push("Messenger");
  if (!isWebUrl(content.links.domain)) issues.push("Dominio HTTPS");
  for (const p of content.projects) {
    if (!p.image || !p.imageAlt)
      issues.push(`Captura real y texto alternativo: ${p.title}`);
    if (!p.evidenceApproved || /por confirmar/.test(p.status))
      issues.push(`Estado y autorización: ${p.title}`);
  }
  if (!content.release.approved)
    issues.push("Aprobación editorial del propietario");
  return issues;
}
