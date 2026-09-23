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
      "Estrategia, diseño, tecnología y automatización para conectar descubrimiento, confianza, contacto y seguimiento. Sistemas digitales para negocios de Oaxaca y México.",
    image: "/og-cover.png",
  },
  release: { approved: true },
  nav: [
    { id: "paraiso-laguna", label: "Caso destacado" },
    { id: "casos", label: "Más casos" },
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
    filterProjects: "Explorar proyectos por sector",
    projectCount: "proyectos disponibles",
    serviceDetails: "Explorar alcance",
    serviceIncludes: "Podemos trabajar en",
    serviceCta: "Consultar este servicio",
    quickContact: "Hablemos por WhatsApp",
    quickNote: "¿Tienes un proyecto?",

    custom: "¿Tu proyecto necesita otra estructura?",
    customBody:
      "Catálogos, herramientas con IA, plataformas educativas y sistemas internos se cotizan a medida.",
    customCta: "Platiquemos del alcance",
  },
  hero: {
    signature: "REILY CASTRO / PORTAFOLIO",
    headline: "Diseño que",
    headlineAccent: "conecta.",
    discipline:
      "Sistemas digitales que conectan presencia, captación y operación.",
    visualLabel: "Selección de trabajo real para Paraíso Laguna",
    featured: "EN FOCO / ECOSISTEMA DIGITAL",
    visualNote: "Oaxaca, México · Diseño con intención",

    eyebrow: "SISTEMAS DIGITALES · OAXACA + REMOTO",
    lead: "Tu negocio ya tiene valor.",
    before: "Construyo el sistema para que ",
    find: "lo encuentren,",
    middle: " contacten y ",
    buy: "compren.",
    body: "Ayudo a negocios que necesitan que sus canales trabajen juntos: presencia local, contenido, sitio web, conversación y seguimiento. Entiendo primero cómo funciona el negocio; después diseño el recorrido y construyo las herramientas necesarias.",
    primary: "Cuéntame sobre tu negocio",
    secondary: "Explorar caso destacado",
    note: "Empezamos con una conversación de 15 minutos.",
    diagramLabel: "DE LA PRIMERA VISITA AL SIGUIENTE PASO",
    diagramTitle: "Todo conectado.",
    diagramSteps: [
      { n: "01", title: "Te encuentran", text: "Búsqueda + contenido" },
      { n: "02", title: "Confían", text: "Web + casos reales" },
      { n: "03", title: "Te contactan", text: "Conversación + seguimiento" },
    ],
    indexLabel: "EXPLORA LOS PROYECTOS",
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
    title: "No solo construyo páginas.",
    emphasis: "Diseño cómo funciona el sistema completo.",
    body: "Una persona puede descubrirte en una búsqueda, ver tu contenido, visitar tu sitio y escribirte por WhatsApp. Cada paso debe responder a la misma propuesta y facilitar el siguiente.",
    end: "Diseño las conexiones según lo que vendes, cómo atiendes y dónde se detiene hoy la conversación.",
    pieces: [
      "Que te encuentren",
      "Que entiendan tu valor",
      "Que den el siguiente paso",
    ],
  },
  ecosystem: {
    label: "UN SISTEMA, CUATRO FUNCIONES",
    items: [
      {
        title: "Descubrimiento",
        detail: "Google, Maps, redes y plataformas donde empieza la búsqueda.",
      },
      {
        title: "Experiencia",
        detail: "Sitio, contenido e identidad que explican el valor.",
      },
      {
        title: "Conversión",
        detail: "WhatsApp, formularios y una ruta hacia la reserva.",
      },
      {
        title: "Operación",
        detail: "Seguimiento, automatización e IA cuando hacen falta.",
      },
    ],
  },
  featuredCase: {
    label: "02 / CASO DE ESTUDIO DESTACADO · TURISMO",
    title: "Paraíso Laguna",
    subtitle:
      "Una experiencia digital conectada para explorar, preguntar y reservar.",
    intro:
      "El reto de diseño fue unir la forma en que una persona descubre una experiencia turística con la información que necesita para decidir y el canal donde puede preguntar.",
    siteCaption:
      "Capturas reales del sitio de Paraíso Laguna, consultado el 23 de septiembre de 2026.",
    flowLabel: "EL SISTEMA PARAÍSO LAGUNA",
    flowEntry: ["Google / Maps", "Instagram / Facebook", "TripAdvisor"],
    flowCore: ["Sitio web", "WhatsApp", "Objetivo: reserva", "Seguimiento"],
    flowCaption:
      "Un ecosistema, no una colección de canales. El esquema describe la arquitectura; no atribuye tráfico ni reservas.",
    discoveryTitle: "Donde empieza el viaje del cliente.",
    discoveryBody:
      "El sistema contempla distintos puntos de entrada. Cada canal necesita información coherente y una ruta clara hacia la conversación; su estado y alcance se documentan por separado.",
    channels: [
      {
        name: "Google / Maps",
        role: "Búsqueda y ubicación local",
        status: "Enlace al mapa identificado",
        url: "https://maps.app.goo.gl/qfz93511MBGykmCL6",
      },
      {
        name: "Instagram",
        role: "Relato visual de experiencias",
        status: "Perfil identificado",
        url: "https://www.instagram.com/paraisolagunamx",
      },
      {
        name: "Facebook",
        role: "Comunidad y contenido adaptable",
        status: "Perfil identificado",
        url: "https://www.facebook.com/profile.php?id=61587637104410",
      },
      {
        name: "TripAdvisor",
        role: "Descubrimiento en plataformas turísticas",
        status: "Ficha confirmada por el propietario",
        url: "https://www.tripadvisor.com/overview?locationId=34223557",
      },
    ],
    contentTitle: "Una marca, varios puntos de contacto.",
    contentBody:
      "La dirección de arte y el sistema editorial reúnen fotografía, tipografía, color, composición y mensajes para contar las experiencias con consistencia en web y piezas destinadas a redes. Las piezas mostradas son activos del proyecto; su publicación en Instagram y Facebook se verifica por separado.",
    webTitle: "Un sitio que convierte interés en una pregunta concreta.",
    webBody:
      "La web funciona como punto central: organiza experiencias, contenido e información para facilitar la exploración en móvil y ofrece acceso visible a WhatsApp. Las capturas muestran la versión pública revisada; no representan una simulación ni un resultado comercial.",
    webEvidence: [
      {
        title: "Arquitectura",
        detail: "Experiencias y preguntas organizadas para decidir.",
      },
      {
        title: "SEO técnico",
        detail:
          "Metadatos, URL canónica y datos estructurados visibles en el sitio.",
      },
      {
        title: "Rendimiento",
        detail: "Imágenes WebP y versiones adaptables para distintos anchos.",
      },
      {
        title: "Contacto",
        detail: "Acceso directo a WhatsApp desde la experiencia.",
      },
    ],
    automationTitle: "La conversación como parte del sistema.",
    automationBody:
      "El propietario reporta una implementación de automatización con IA para atender consultas. La web pública permite verificar el acceso a WhatsApp; la configuración del asistente, sus respuestas y sus resultados quedan pendientes de evidencia autorizada.",
    automationSteps: [
      "Sitio",
      "WhatsApp",
      "Asistente con IA",
      "Clasificación de necesidad",
      "Atención / seguimiento",
    ],
    comparisonTitle: "De piezas por conectar a un recorrido diseñado.",
    comparisonBefore:
      "Necesidad de diseño: coordinar canales, contenido, información del sitio y atención en una ruta comprensible.",
    comparisonAfter:
      "Sistema mostrado: identidad editorial, sitio público, entradas desde canales identificados y contacto por WhatsApp.",
    evidenceNote:
      "No se atribuyen reservas, mejoras de conversión ni posiciones en buscadores sin datos verificables.",
    galleryCta: "Ver la dirección de arte completa",
  },
  cases: {
    label: "03 / CASOS EN DESARROLLO EDITORIAL",
    title: "Otros sistemas, otros contextos.",
    body: "Proyectos construidos en comercio, desarrollo inmobiliario e inteligencia artificial. Sus fichas se amplían conforme se documenta nueva evidencia.",
    footnote:
      "Alcances descritos por el propietario. Sin métricas comerciales ni testimonios atribuidos.",
  },
  projects: [
    {
      id: "paraiso-laguna",
      title: "Paraíso Laguna",
      sector: "Turismo",
      tagline: "Identidad, web, contenido y conversación conectados.",
      status: "Trabajo construido · 16 piezas seleccionadas",
      problem:
        "Articular la presencia y el contenido de un proyecto ecoturístico de la costa de Oaxaca con su sitio y su canal de contacto.",
      solution:
        "Dirección visual y editorial, sitio público de experiencias y un recorrido hacia WhatsApp. El propietario reporta automatización con IA; su funcionamiento interno queda por documentar.",
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
  method: {
    label: "04 / LO QUE REALMENTE HAGO",
    title: "Cuatro disciplinas. Una decisión de negocio.",
    body: "La combinación cambia según lo que el proyecto necesita; la herramienta se elige después de entender el objetivo.",
    items: [
      {
        title: "Estrategia",
        text: "Entender la oferta, el cliente, los puntos de entrada y dónde se pierde el siguiente paso.",
      },
      {
        title: "Diseño",
        text: "Dar claridad a la identidad, el contenido y la experiencia que una persona recorre.",
      },
      {
        title: "Tecnología",
        text: "Construir una web y conexiones que sean rápidas, utilizables y fáciles de mantener.",
      },
      {
        title: "Automatización",
        text: "Ordenar consultas y tareas repetidas con reglas claras e IA cuando aporte valor.",
      },
    ],
  },
  services: {
    label: "05 / EN QUÉ PUEDO AYUDARTE",
    title: "Tecnología con una tarea clara.",
    items: [
      {
        icon: "↗",
        title: "Presencia que convierte",
        text: "Para que una visita entienda qué ofreces y sepa cómo contactarte. Sitios, landing pages y catálogos claros, rápidos y adaptados a móvil.",
        tags: "WEB / CATÁLOGOS / UX",
        deliverables: [
          "Arquitectura de contenidos y recorrido del visitante",
          "Diseño adaptable a móvil y desarrollo web",
          "Catálogo, formulario o contacto según el objetivo",
        ],
      },
      {
        icon: "◎",
        title: "Sistemas de captación",
        text: "Para que el interés no se pierda. Conecto contenido, anuncios, formularios, WhatsApp, reseñas, Google Business y seguimiento.",
        tags: "CONTACTO / SEGUIMIENTO",
        deliverables: [
          "Revisión del recorrido desde el contenido al contacto",
          "Formularios y mensajes con contexto",
          "Organización del seguimiento y puntos de conversión",
        ],
      },
      {
        icon: "⌘",
        title: "Automatización e IA aplicada",
        text: "Para reducir tareas repetidas y ordenar información. Automatizaciones, asistentes y herramientas internas con un propósito definido.",
        tags: "PROCESOS / HERRAMIENTAS",
        deliverables: [
          "Identificación de tareas repetitivas y fuentes de datos",
          "Prototipo de automatización o asistente",
          "Pruebas, documentación y entrega de uso",
        ],
      },
      {
        icon: "↗",
        title: "Educación y capacitación con IA",
        text: "Para que docentes y equipos sepan aplicar la IA en su trabajo. Cursos, recursos, plataformas y acompañamiento contextualizado.",
        tags: "APRENDIZAJE / EQUIPOS",
        deliverables: [
          "Diagnóstico de necesidades del equipo",
          "Sesiones y ejercicios aplicados a su contexto",
          "Material de consulta y pautas de uso responsable",
        ],
      },
    ],
  },
  process: {
    label: "06 / CÓMO TRABAJAMOS",
    title: "Primero el negocio.\nDespués la tecnología.",
    body: "Partimos del objetivo y del recorrido real de tus clientes. Priorizamos las piezas necesarias, las construimos y comprobamos cómo se conectan antes de entregarlas.",
    items: [
      {
        title: "Entender",
        text: "Escuchamos qué vendes, a quién atiendes, por dónde llegan hoy las personas y qué necesitas mejorar.",
      },
      {
        title: "Detectar",
        text: "Identificamos las fricciones del recorrido y definimos una prioridad con alcance verificable.",
      },
      {
        title: "Construir",
        text: "Diseñamos y desarrollamos las piezas acordadas, desde contenido y web hasta integraciones.",
      },
      {
        title: "Activar",
        text: "Probamos enlaces, contacto y experiencia móvil; publicamos y dejamos claro cómo operar el sistema.",
      },
    ],
  },
  pricing: {
    label: "07 / UN PUNTO DE PARTIDA",
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
    label: "08 / DETRÁS DEL SISTEMA",
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
    label: "09 / SIN LETRA CHIQUITA",
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
    label: "10 / CONVERSEMOS",
    title: "Cuéntame qué quieres conseguir.",
    body: "Antes de hablar de tecnología, entendemos el problema. Dime qué vendes, cómo te encuentran hoy y qué debería funcionar mejor.",
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
      offer: "¿Qué vendes o qué servicio ofreces?",
      goal: "¿Qué te gustaría conseguir?",
      currentChannels: "¿Por dónde llegan hoy tus clientes?",
      website: "Sitio web actual (opcional)",
      social: "Red social principal (opcional)",
      problem: "¿Qué está frenando ese objetivo?",
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
      offer: "Describe tu oferta en una frase",
      goal: "Ejemplo: recibir consultas más claras",
      currentChannels: "Ejemplo: Google Maps, Instagram, recomendaciones",
      website: "https://tusitio.com",
      social: "Enlace al perfil",
      problem: "Cuéntame qué pasa ahora y dónde se detiene el proceso",
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
