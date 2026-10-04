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
  heroBrief?: string;
  summary?: string;
  gallery?: { src: string; preview?: string; alt: string; category: string }[];
};
export const content = {
  brand: {
    name: "Cídiks",
    creator: "Reily Castro",
    fullName: "Cídiks · Reily Castro",
    ascii: "cidiks",
    symbol: "/brand/symbol/cidiks-symbol-color.svg",
    wordmark: "/brand/wordmark/cidiks-wordmark.svg",
    descriptor:
      "Comprensión y construcción de soluciones digitales para negocios",
    tagline: "Comprender la raíz. Construir con sentido.",
    commercialProposal:
      "De una necesidad concreta a una solución digital que puedas usar.",
  },
  owner: {
    name: "Reily Castro",
    shortName: "Reily",
    role: "Soluciones digitales, automatización e ingeniería para negocios",
    location: "Oaxaca, México",
  },
  links: {
    email: "reilyvica@gmail.com",
    messenger: "https://m.me/reilyvica",
    whatsapp: "https://wa.me/529541621210",
    domain: "https://reilycastro.com",
    facebook: "https://www.facebook.com/groups/1394889298845236",
    instagram: "",
    linkedin: "",
    github: "https://github.com/Tortaconflow",
  },
  seo: {
    title: "CÍDIKS · Soluciones digitales con diagnóstico | Reily Castro",
    description:
      "Entendemos qué frena tu negocio antes de construir. Diseño web, identidad y automatización desde Oaxaca, con diagnóstico, evidencia y guías para usar tu solución.",
    image: "/brand/social/og-cidiks-1200x630.png",
    googleSiteVerification: "YwXexq6z7XtunddelCV-31rZvF8qUGq_QmAimSU4owY",
    // Dominio final confirmado por el propietario; habilitar sólo en el build de producción.
    allowIndexing: true,
  },
  release: { approved: true },
  nav: [
    { id: "casos", label: "Proyectos" },
    { id: "servicios", label: "Servicios" },
    { id: "proceso", label: "Método" },
    { id: "conocimiento", label: "Conocimiento", href: "/conocimiento/" },
    { id: "sobre-mi", label: "CÍDIKS" },
    { id: "contacto", label: "Contacto" },
  ],
  ui: {
    menu: "Menú",
    closeMenu: "Cerrar menú",
    skip: "Ir al contenido",
    diagnosis: "Quiero un diagnóstico",
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
      "Estos campos no pasaron la validación automática. Revisa también los pendientes editoriales y operativos en la documentación.",
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
    brandMark: "Cídiks",
    signature: "Cídiks · Reily Castro",
    descriptor: "Soluciones digitales para negocios · Oaxaca y México",
    headline: "Entendemos primero.",
    headlineAccent: "Construimos después.",
    discipline: "Comprender la raíz. Construir con sentido.",
    body: "Soy Reily Castro. Diseño y desarrollo soluciones digitales para negocios que necesitan claridad antes de invertir en tecnología: explicar mejor su oferta, atender consultas y reducir trabajo repetido.",
    visualLabel: "Selección de trabajo real para Paraíso Laguna",
    featured: "CASO DESTACADO · TURISMO",
    caseLabel: "Web y consultas por WhatsApp",
    visualNote: "Oaxaca, México · Comprender la raíz, construir con sentido",
    primary: "Quiero un diagnóstico",
    secondary: "Ver proyectos",
    note: "Conversación inicial de 15 minutos para orientarte sin compromiso.",
    indexLabel: "EXPLORA PROYECTOS SELECCIONADOS",
    indexNote: "Turismo / Terrenos / Mayoreo",
  },
  capabilities: [
    "CONTEXTO",
    "CRITERIO",
    "SOLUCIÓN",
    "EVIDENCIA",
    "APRENDIZAJE",
  ],
  problem: {
    label: "EL PUNTO DE PARTIDA",
    title: "Una web no genera valor por existir.",
    emphasis: "Tiene valor cuando resuelve una fricción concreta.",
    body: "Tener presencia digital no garantiza ventas. Una solución funciona cuando una persona te descubre, entiende con claridad qué haces, confía en tu negocio, encuentra lo que busca y puede contactarte o reservar sin tropiezos.",
    end: "Diseño sistemas conectados según lo que vendes, cómo atiendes y dónde se enfrían hoy tus oportunidades.",
    pieces: [
      "Descubrimiento y confianza",
      "Claridad de información",
      "Conversación y conversión fluida",
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
    label: "CASO DE ESTUDIO DESTACADO · TURISMO",
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
    label: "PROYECTOS DOCUMENTADOS",
    title: "Qué construí y para qué sirve.",
    body: "Una web para consultar tours, una calculadora de pagos de terrenos, un catálogo para enviar pedidos por WhatsApp y una herramienta para explorar dilemas sobre IA. ALTITUD es una propuesta conceptual de moda desde Oaxaca.",
    footnote:
      "ALTITUD es un proyecto conceptual, no un cliente comercial. Sin métricas comerciales ni testimonios atribuidos.",
  },
  projects: [
    {
      id: "paraiso-laguna",
      title: "Paraíso Laguna",
      sector: "Turismo",
      heroBrief: "Turismo · Web y consultas por WhatsApp",
      summary:
        "Operador ecoturístico en la Costa de Oaxaca: sitio web de experiencias y tours para móvil, dirección de contenido visual y canal directo de consulta y reserva por WhatsApp.",
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
      heroBrief: "Terrenos · Calculadora de pagos",
      summary:
        "Sitio web de terrenos en la Costa de Oaxaca: permite calcular el enganche y los pagos a 42 meses y consultar por WhatsApp con el lote elegido.",
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
      imageAlt:
        "Fraccionamiento Gubidxa: visualización de terrenos y desarrollo inmobiliario en Oaxaca",
      url: "https://palevioletred-fish-135686.hostingersite.com",
      tone: "brisa",
      evidenceApproved: true,
    },
    {
      id: "senor-gallo",
      title: "Señor Gallo VIP",
      sector: "Comercio mayorista",
      heroBrief: "Mayoreo · Catálogo y pedidos por WhatsApp",
      summary:
        "Negocio comercial mayorista: catálogo digital para armar pedidos desde el móvil y enviarlos listos por WhatsApp, reemplazando listas de precios en fotos y PDFs.",
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
      imageAlt:
        "Catálogo digital de mayoreo y sistema de pedidos para Señor Gallo VIP",
      url: "https://darkslategray-dinosaur-608809.hostingersite.com",
      tone: "gallo",
      evidenceApproved: true,
    },
    {
      id: "consejo-cien-miradas",
      title: "El Consejo de las Cien Miradas",
      sector: "Inteligencia Artificial",
      heroBrief: "IA · Consulta de perspectivas éticas",
      summary:
        "Herramienta para estudiantes e investigadores: permite explorar dilemas sobre inteligencia artificial desde 100 perspectivas filosóficas e históricas.",
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
      imageAlt:
        "Plataforma digital interactiva y archivo cultural El Consejo de las Cien Miradas",
      url: "https://github.com/Tortaconflow/el-consejo-de-las-cien-miradas",
      tone: "edu",
      evidenceApproved: true,
    },
    {
      id: "altitud",
      title: "ALTITUD",
      sector: "Moda conceptual",
      heroBrief: "Moda · Identidad y campaña conceptual",
      summary:
        "Propuesta conceptual de moda urbana desde Oaxaca: identidad visual, diseño de prendas y campaña asistida por IA.",
      tagline: "Streetwear / Oaxaca / Creative Direction.",
      status: "Proyecto conceptual · identidad y campaña",
      problem:
        "Explorar una identidad contemporánea inspirada en Oaxaca que conecte territorio, paisaje, arquitectura y cultura urbana sin recurrir a una representación turística convencional.",
      solution:
        "Sistema conceptual de streetwear articulado con dirección creativa, identidad visual, prendas editoriales, campaña y contenido visual asistido por IA.",
      components: [
        "Concepto: Raíces en movimiento",
        "Dirección creativa e identidad visual",
        "Sistema gráfico y aplicaciones en prendas",
        "Campaña editorial y lookbook",
        "Flujo creativo con IA generativa y dirección de arte",
      ],
      image: "/projects/altitud/altitud-001-campaign.jpg",
      imageAlt:
        "Proyecto conceptual ALTITUD: modelo con camiseta gráfica y paisaje urbano de Oaxaca.",
      url: "",
      tone: "altitud",
      evidenceApproved: true,
    },
  ] as Project[],
  method: {
    label: "CÓMO TRABAJO",
    title: "Un problema claro. Una decisión con sentido.",
    body: "Partimos de tu negocio, tus clientes y tus recursos. Elegimos qué conviene resolver y qué puede esperar.",
    items: [
      {
        number: "01",
        title: "Observar",
        text: "Revisar cómo te encuentran, qué preguntan y con qué recursos trabajas.",
      },
      {
        number: "02",
        title: "Comprender",
        text: "Separar lo que pides, lo que observamos y lo que todavía suponemos.",
      },
      {
        number: "03",
        title: "Diagnosticar",
        text: "Priorizar la fricción que más importa y acordar cómo reconocer una mejora.",
      },
      {
        number: "04",
        title: "Resolver",
        text: "Construir, explicar y revisar la intervención adecuada. A veces conviene empezar por contenido o un proceso, y posponer la tecnología.",
      },
    ],
  },
  services: {
    label: "EN QUÉ PUEDO AYUDARTE",
    title: "Servicios organizados por necesidades.",
    subtitle:
      "No necesitas dominar tecnologías para empezar. Partimos de lo que tu negocio necesita resolver.",
    items: [
      {
        icon: "↗",
        title: "No te encuentran",
        subtitle:
          "Para negocios que necesitan ser encontrados y generar confianza.",
        text: "Diseño sitios web y catálogos que explican qué vendes, responden las dudas de tus clientes y facilitan el contacto desde el celular.",
        tags: "SITIOS WEB / CONTENIDO / SEO TÉCNICO / PRESENCIA LOCAL",
        deliverables: [
          "Diseño web y desarrollo adaptable a móviles",
          "Estructura de contenidos clara y orientada a valor",
          "SEO técnico, metadatos y velocidad de carga",
          "Optimización de presencia local en mapas y buscadores",
        ],
      },
      {
        icon: "◎",
        title: "Recibes interés, pero se pierde el seguimiento",
        subtitle:
          "Para negocios que reciben solicitudes pero pierden oportunidades.",
        text: "Conecto tu web, WhatsApp y formularios para que tus clientes puedan contactarte y tú puedas organizar las consultas y darles seguimiento.",
        tags: "WHATSAPP / FORMULARIOS / CONEXIONES / CRM",
        deliverables: [
          "Rutas claras y directas hacia WhatsApp desde la web",
          "Formularios con validación y una ruta de contacto explícita",
          "Conexión entre canales de atención y recopilación de prospectos",
          "Estructuración de flujos simples de seguimiento o CRM",
        ],
      },
      {
        icon: "⌘",
        title: "El trabajo manual te quita tiempo",
        subtitle: "Para procesos manuales y tareas repetitivas.",
        text: "Conecto herramientas para reducir tareas manuales. Revisamos qué conviene automatizar y si la inteligencia artificial ayuda a resolver el problema.",
        tags: "PROCESOS / CONECTIVIDAD / IA APLICADA / REGLAS",
        deliverables: [
          "Identificación de fricciones operativas y tareas repetidas",
          "Conexión entre herramientas y fuentes de información",
          "Asistentes y prototipos de automatización con propósito",
          "Pautas de uso responsable, límites y documentación",
        ],
      },
      {
        icon: "↗",
        title: "Te encuentran, pero no entienden tu oferta",
        subtitle:
          "Para negocios con información dispersa o preguntas repetidas.",
        text: "Ordenamos servicios, condiciones y contenido para que una persona pueda decidir qué le sirve y cómo pedirlo.",
        tags: "OFERTA / CONTENIDO / UX / ARQUITECTURA",
        deliverables: [
          "Revisión de mensajes y preguntas frecuentes",
          "Arquitectura de contenidos y recorrido de contacto",
          "Prototipo para revisar con personas reales",
        ],
      },
      {
        icon: "◎",
        title: "Tu marca cambia en cada canal",
        subtitle:
          "Para negocios que necesitan una identidad coherente y utilizable.",
        text: "Definimos criterios visuales y recursos para aplicar tu identidad con consistencia en la web y el contenido.",
        tags: "IDENTIDAD / SISTEMA VISUAL / GUÍAS",
        deliverables: [
          "Contexto y dirección visual acordados",
          "Sistema de color, tipografía y aplicaciones",
          "Guía de uso y archivos de entrega",
        ],
      },
      {
        icon: "⌘",
        title: "Tienes datos, pero no sabes qué cambiar",
        subtitle:
          "Para negocios que quieren aprender de sus consultas y proyectos.",
        text: "Definimos una pregunta, la evidencia que necesitas y un experimento pequeño antes de sumar herramientas de medición.",
        tags: "MEDICIÓN / EXPERIMENTOS / APRENDIZAJE",
        deliverables: [
          "Mapa de etapas y eventos útiles",
          "Registro de hipótesis y criterios de éxito",
          "Revisión de resultados cuando haya datos suficientes",
        ],
      },
    ],
  },
  process: {
    label: "FILOSOFÍA DE TRABAJO",
    title: "Observar → Comprender → Diagnosticar → Resolver",
    body: "Primero comprendemos la situación y el recorrido de tus clientes. Priorizamos lo esencial, construimos con ejemplos reales y comprobamos que funcione antes de entregar.",
    items: [
      {
        title: "Observar",
        text: "Escuchar y revisar la oferta, los clientes, la competencia, los canales y los recursos disponibles. Entregable: mapa del contexto.",
      },
      {
        title: "Comprender",
        text: "Distinguir la petición inicial de la fricción observada y de las hipótesis pendientes. Entregable: problema y evidencia disponible.",
      },
      {
        title: "Diagnosticar",
        text: "Comparar impacto, esfuerzo, riesgo y evidencia. Entregable: prioridad, alcance y criterio de mejora; también qué posponer.",
      },
      {
        title: "Resolver",
        text: "Diseñar, construir por etapas, validar y explicar cómo usarlo. Entregable: solución y guía; seguimiento según el alcance acordado.",
      },
    ],
  },
  pricing: {
    label: "UN PUNTO DE PARTIDA",
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
    label: "SOBRE MÍ",
    title: "Cídiks · Reily Castro",
    emphasis: "Comprender la raíz. Construir con sentido.",
    body: "Soy Reily Castro. Mi formación está relacionada con Ciencias de la Educación. Trabajo desde Oaxaca para traducir necesidades del negocio en soluciones que puedas comprender y utilizar. Cada contexto tiene distintos hábitos, conocimientos y recursos: el diseño empieza por conocerlos.",
    stamp: "COMPRENDER LA RAÍZ.\nCONSTRUIR CON SENTIDO.",
    location: "Oaxaca, México · Trabajo presencial y remoto.",
    principles: [
      "Comprender la necesidad real antes de elegir tecnología.",
      "Construir herramientas que el negocio pueda operar en su día a día.",
      "Evitar complejidades innecesarias e hipótesis sin evidencia.",
    ],
  },
  faq: {
    label: "SIN LETRA CHIQUITA",
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
    label: "CONVERSEMOS",
    title: "Cuéntame qué quieres resolver.",
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
    subject: "Solicitud de diagnóstico · CÍDIKS",
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
      problem: "¿Qué quieres resolver?",
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
