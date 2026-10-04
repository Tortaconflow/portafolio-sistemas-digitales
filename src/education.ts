// Base de conocimiento editorial: "Aprende antes de decidir"
// Principio: Contenido real, riguroso y honesto. Sin relleno genérico de agencia, sin falsas garantías ni métricas inventadas.

export interface EducationArticle {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category:
    | "Presencia"
    | "Conversión"
    | "Operación"
    | "Estrategia"
    | "Seguridad"
    | "Identidad"
    | "Aprendizaje";
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
    id: "seguridad-entrega",
    slug: "seguridad-en-la-entrega-digital",
    title: "¿Qué preguntas hacer antes de recibir una solución digital?",
    category: "Seguridad",
    readTime: "3 min de lectura",
    tagline:
      "Accesos, datos y recuperación: una entrega que puedes revisar sin promesas de seguridad absoluta.",
    concept:
      "Una entrega responsable explica quién controla los accesos, qué información guarda el sistema y cómo se recupera ante un error. Las prácticas deben corresponder al alcance y al riesgo de tu proyecto.",
    whyItMatters:
      "Una solución puede verse terminada y seguir dependiendo de una cuenta ajena o de un secreto expuesto. Conocer los límites permite acordar mantenimiento y responsabilidades.",
    practicalExample:
      "Ejemplo hipotético: un sitio informativo prepara un mensaje localmente y no guarda consultas. Un CRM sí almacena datos y necesita permisos, respaldos y un procedimiento de recuperación. Sus controles deben ser diferentes.",
    whatToCheck: [
      "¿El dominio y las cuentas quedan bajo tu control?",
      "¿Las credenciales se gestionan fuera del código público y con permisos mínimos?",
      "¿Qué datos se guardan, quién puede verlos y durante cuánto tiempo?",
      "Si se guardan datos: ¿hay respaldo y se ha probado cómo recuperarlo?",
      "¿Quién revisa las acciones sensibles y las actualizaciones?",
    ],
    frequentMistakes: [
      "Confundir una lista de prácticas con una certificación formal.",
      "Pedir que todas las personas compartan una cuenta con acceso total.",
      "Aceptar '100% seguro' sin alcance, evidencia ni límites.",
    ],
    toolOrResource: {
      name: "Lista de entrega",
      description:
        "Usa estas preguntas para acordar accesos, responsabilidades y límites por escrito.",
    },
    suggestedStep:
      "Pide un inventario de cuentas, datos y dependencias antes de dar la entrega por terminada.",
    sources: [
      {
        title: "Secrets Management Cheat Sheet",
        organization: "OWASP",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html",
        type: "técnica",
      },
    ],
  },
  {
    id: "identidad-decisiones",
    slug: "elegir-colores-con-criterio",
    title: "Elegir colores también es aprender a decidir",
    category: "Identidad",
    readTime: "3 min de lectura",
    tagline:
      "Una paleta debe ayudarte a comunicar y permitir leer, además de gustarte.",
    concept:
      "Elegir una identidad visual implica acordar qué quieres comunicar, dónde se verá y cómo funcionará. Las asociaciones del color dependen del contexto; no son una receta universal para vender.",
    whyItMatters:
      "Comprender los criterios de una paleta permite aplicarla de forma consistente y revisar si el texto, los botones y la información se leen bien.",
    practicalExample:
      "Experiencia relatada por el fundador: ante la necesidad de definir una identidad visual, desarrolló una herramienta educativa sobre color para que la clienta participara en la decisión. Aquí se describe el enfoque, sin publicar datos de la clienta ni atribuir resultados comerciales.",
    whatToCheck: [
      "¿La paleta corresponde al contexto, contenido y aplicaciones del negocio?",
      "¿El texto normal alcanza una relación de contraste de al menos 4.5:1?",
      "¿El texto grande alcanza al menos 3:1?",
      "¿Los estados también se entienden con texto o símbolos, sin depender sólo del color?",
    ],
    frequentMistakes: [
      "Tratar la psicología del color como una garantía de conducta o ventas.",
      "Elegir una combinación para una imagen y asumir que funcionará igual en todos los botones y textos.",
    ],
    toolOrResource: {
      name: "Criterios de contraste de WCAG",
      description:
        "La referencia explica qué se considera texto grande y las excepciones del criterio; revisar un color no demuestra conformidad completa.",
      officialUrl:
        "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
    },
    suggestedStep:
      "Prueba la paleta en un párrafo, un botón y una ficha de producto. Revisa legibilidad y coherencia antes de aprobarla.",
    sources: [
      {
        title: "Understanding SC 1.4.3: Contrast (Minimum)",
        organization: "W3C WAI",
        url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
        type: "técnica",
      },
    ],
  },
  {
    id: "aprender-proyectos",
    slug: "aprender-de-cada-proyecto",
    title: "Cada proyecto puede ayudar a decidir mejor el siguiente",
    category: "Aprendizaje",
    readTime: "3 min de lectura",
    tagline:
      "Registrar hipótesis, decisiones, horas y errores para aprender con evidencia.",
    concept:
      "Un registro útil distingue qué esperabas, qué hiciste, qué ocurrió y qué información todavía falta. Aprender requiere comparar; una impresión aislada no prueba que un cambio funcionó.",
    whyItMatters:
      "Cerrar más clientes importa junto con el margen, las horas humanas, la entrega y el retrabajo. Crecer sin revisar estos datos puede aumentar el esfuerzo más rápido que el ingreso.",
    practicalExample:
      "Ejemplo hipotético: crees que un resumen previo hará más claras las consultas. Registra consultas antes y después, qué dudas aparecen y el tiempo de atención. Revisa también diferencias de canal o temporada antes de atribuir el cambio a la web.",
    whatToCheck: [
      "¿La hipótesis tiene una señal observable y un periodo de revisión?",
      "¿Registras horas, costos y cambios de alcance por proyecto?",
      "¿Separas apertura de WhatsApp, mensaje recibido y cliente cerrado?",
      "¿Documentas errores y condiciones para evitar repetirlos?",
    ],
    frequentMistakes: [
      "Convertir clics en supuestas ventas.",
      "Usar porcentajes con muestras pequeñas sin mostrar su tamaño.",
      "Automatizar un proceso sin conocer su frecuencia ni su costo de errores.",
    ],
    toolOrResource: {
      name: "Registro de aprendizaje",
      description:
        "Problema → evidencia → hipótesis → decisión → resultado → siguiente revisión. Pauta editorial propia de CÍDIKS.",
    },
    suggestedStep:
      "Elige una pregunta de negocio y registra su línea base durante una semana antes de cambiar el proceso.",
    sources: [],
  },
  {
    id: "google-maps-perfil-negocio",
    slug: "google-maps-perfil-de-negocio",
    title: "¿Para qué sirve realmente Google Maps para un negocio?",
    tagline:
      "Diferencia entre solo aparecer en el mapa y presentar información que permita a un cliente visitarte o contactarte.",
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
      "Comprar reseñas falsas incumple las políticas de Google. Google puede retirar esas reseñas o restringir el perfil; sus decisiones sobre restricciones y suspensiones cuentan con vías de apelación.",
    ],
    toolOrResource: {
      name: "Google Business Profile Manager",
      description:
        "Plataforma oficial gratuita de Google para verificar y gestionar la información de tu negocio en Maps y el Buscador.",
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
      {
        title: "Restricciones por infracciones de políticas y apelación",
        organization: "Google Business Profile Help",
        url: "https://support.google.com/business/answer/14114287",
        type: "oficial",
      },
      {
        title: "Apelar un Perfil de Negocio suspendido",
        organization: "Google Business Profile Help",
        url: "https://support.google.com/business/answer/4569145",
        type: "oficial",
      },
    ],
  },
  {
    id: "paginas-web-necesidad-real",
    slug: "necesito-realmente-una-pagina-web",
    title: "¿Necesito realmente una página web para mi negocio?",
    tagline:
      "Cuándo una web resuelve un problema real y cuándo es preferible empezar optimizando canales más simples.",
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
      name: "PageSpeed Insights (Google)",
      description:
        "Herramienta de Google que presenta datos de laboratorio y, cuando están disponibles, datos de campo para evaluar el rendimiento móvil y de escritorio.",
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
        title: "Acerca de PageSpeed Insights: datos de laboratorio y de campo",
        organization: "Google for Developers",
        url: "https://developers.google.com/speed/docs/insights/v5/about",
        type: "oficial",
      },
    ],
  },
  {
    id: "whatsapp-y-seguimiento",
    slug: "whatsapp-y-seguimiento-de-clientes",
    title:
      "¿Qué diferencia hay entre atender por WhatsApp y tener un flujo de seguimiento?",
    tagline:
      "Cómo evitar que las conversaciones con prospectos se enfríen o se pierdan en el desorden de chats.",
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
      name: "Funciones de la aplicación WhatsApp Business",
      description:
        "Página oficial de la aplicación con perfil de empresa, horario, etiquetas y respuestas rápidas.",
      officialUrl:
        "https://whatsappbusiness.com/es-la/products/business-app-features/",
    },
    suggestedStep:
      "Si aún utilizas WhatsApp personal para tu negocio, evalúa usar la aplicación WhatsApp Business. Configura tu horario de atención y crea 3 respuestas rápidas para tus dudas más frecuentes.",
    sources: [
      {
        title: "Funciones de la aplicación WhatsApp Business",
        organization: "WhatsApp for Business",
        url: "https://whatsappbusiness.com/es-la/products/business-app-features/",
        type: "oficial",
      },
    ],
  },
  {
    id: "automatizacion-ia-aplicada",
    slug: "cuando-vale-la-pena-automatizar-e-ia",
    title: "¿Cuándo vale la pena automatizar o usar IA en un negocio?",
    tagline:
      "Cómo distinguir entre resolver un cuello de botella real y añadir tecnología costosa que nadie va a utilizar.",
    category: "Operación",
    readTime: "4 min de lectura",
    concept:
      "Automatizar es hacer que una tarea definida se ejecute con menos intervención manual, dentro de una herramienta o entre varias. La IA aplicada puede ayudar a clasificar texto, resumir o redactar borradores; sus resultados requieren revisión según el riesgo de la tarea.",
    whyItMatters:
      "La inteligencia artificial no resuelve procesos que están desordenados desde la raíz. Automatizar un proceso roto solo produce errores más rápido. Vale la pena incorporar automatización cuando una tarea ya tiene pasos claros, se repite con alta frecuencia y quita tiempo valioso que el equipo debería dedicar a la atención o al servicio.",
    practicalExample:
      "Si cada vez que alguien llena un formulario de contacto debes copiar su nombre, teléfono y necesidad a mano en un documento para luego escribirle, una conexión sencilla puede guardar la fila automáticamente y notificarte en tu teléfono al instante con el enlace listo para responder.",
    whatToCheck: [
      "¿El proceso que quieres automatizar ya funciona hoy de forma manual con reglas claras?",
      "Como criterio práctico propio: ¿se repite con suficiente frecuencia —por ejemplo, unas 10 veces por semana— para justificar el esfuerzo de automatizarla? No es un umbral universal.",
      "¿Sabes exactamente qué error podría ocurrir si la conexión falla y cómo detectarlo a tiempo?",
    ],
    frequentMistakes: [
      "Crear un 'agente de IA' para atender clientes sin supervisión humana cuando las preguntas requieren juicio de negocio o empatía.",
      "Pagar suscripciones mensuales complejas para automatizar algo que toma 2 minutos a la semana.",
    ],
    toolOrResource: {
      name: "Marco de gestión de riesgos de IA (NIST AI RMF)",
      description:
        "Marco voluntario para gestionar riesgos de sistemas de IA; no define ni prescribe cuándo automatizar una tarea común.",
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
  {
    id: "caso-textil-likes-vs-ventas",
    slug: "caso-textil-por-que-los-likes-no-son-ventas",
    title: "Ejemplo textil: ¿por qué los likes no son ventas?",
    tagline:
      "El recorrido completo desde el descubrimiento artesanal hasta la confianza y el pedido.",
    category: "Estrategia",
    readTime: "4 min de lectura",
    concept:
      "Las reacciones en redes sociales representan atención momentánea o simpatía estética, pero no compromiso de compra. Un negocio artesanal necesita un sistema donde la atención se convierta en confianza, información clara y contacto directo.",
    whyItMatters:
      "Una artesana textil puede publicar piezas hermosas en Facebook y recibir decenas de 'me gusta'. Sin embargo, si el interesado no sabe qué medidas tiene el huipil, qué técnica de telar se utilizó, cuánto cuesta el envío o cómo pagar con seguridad, la venta nunca ocurre. El problema no es que Facebook no funcione, sino que falta el sistema de conversión.",
    practicalExample:
      "Ejemplo hipotético, no un caso de cliente: un taller textil recibe preguntas sobre medidas y envíos. Una ficha con disponibilidad, fotos, condiciones y contacto podría ayudar a que el comprador consulte con más contexto. El efecto en pedidos tendría que medirse.",
    whatToCheck: [
      "¿El interesado puede conocer precios, medidas y disponibilidad sin tener que esperar horas a que respondas un mensaje privado?",
      "¿Explicas con transparencia la historia, el tiempo de elaboración y el origen de los materiales para sustentar el valor?",
      "¿Ofreces una vía de contacto confiable donde el comprador sienta certeza antes de transferir dinero?",
    ],
    frequentMistakes: [
      "Concluir apresuradamente que 'las redes no sirven' cuando en realidad faltaba información de decisión y confianza.",
      "Creer que una página web generará ventas por sí sola sin un canal que la alimente (recomendación, búsqueda local o redes).",
    ],
    toolOrResource: {
      name: "Guía de comercio para artesanías y talleres",
      description:
        "Buenas prácticas de documentación visual y comunicación directa para productos con valor cultural y técnico.",
    },
    suggestedStep:
      "Revisa tu última publicación con más likes. Pregúntate: si una persona de otra ciudad quisiera comprar esa pieza en este instante, ¿sabe exactamente cuánto cuesta, cómo se envía y a dónde escribir?",
    sources: [],
  },
  {
    id: "presencia-vs-sistema-digital",
    slug: "diferencia-entre-presencia-digital-y-sistema-digital",
    title:
      "¿Qué diferencia hay entre tener presencia digital y tener un sistema digital?",
    tagline:
      "Tener un perfil abierto es solo existir; un sistema trabaja para ahorrar tiempo y captar oportunidades.",
    category: "Estrategia",
    readTime: "3 min de lectura",
    concept:
      "Presencia digital es existir en internet (tener un perfil de Facebook, una cuenta de Instagram o una página web estática). Un sistema digital es la conexión organizada entre cómo te descubren, cómo entienden tu oferta, cómo te contactan y cómo das seguimiento.",
    whyItMatters:
      "Tener presencia pasiva suele generar más trabajo del que resuelve: llegan mensajes dispersos, dudas incompletas y tareas manuales de copia y pega. Un sistema digital filtra consultas, responde dudas básicas por adelantado y te entrega prospectos con contexto claro.",
    practicalExample:
      "Presencia: tener una página de Facebook donde publicas y esperas que alguien pregunte. Sistema: tener tu perfil en Google Maps sincronizado con tu web ligera, donde el cliente ve catálogo y horarios, y al dar clic a WhatsApp entra un mensaje diciendo 'Hola, vi el lote #14 en su web y tengo $50,000 de enganche, ¿podemos agendar visita?'.",
    whatToCheck: [
      "¿Tus canales digitales trabajan juntos o cada uno está desconectado del otro?",
      "¿La información sobre lo que vendes es idéntica en Google, redes y tu web?",
      "¿El cliente tiene un camino claro de un paso a otro sin perderse?",
    ],
    frequentMistakes: [
      "Pagar publicidad para enviar personas a un perfil incompleto o a un chat sin seguimiento.",
      "Comprar herramientas digitales complejas sin tener claro qué tarea específica van a resolver.",
    ],
    toolOrResource: {
      name: "Mapeo de recorrido del cliente",
      description:
        "Metodología para identificar en qué punto exacto se detienen las personas antes de contratar o comprar.",
    },
    suggestedStep:
      "Haz el ejercicio como si fueras un cliente nuevo: búscate en Google, intenta entender qué vendes en 30 segundos y fíjate qué tan fácil es hacerte una pregunta concreta.",
    sources: [],
  },
  {
    id: "como-saber-si-funciona",
    slug: "como-saber-si-una-herramienta-digital-esta-funcionando",
    title: "¿Cómo saber si una herramienta digital realmente está funcionando?",
    tagline:
      "Métricas humanas vs. métricas de vanidad: cómo evaluar la utilidad real en tu día a día.",
    category: "Conversión",
    readTime: "3 min de lectura",
    concept:
      "Una herramienta digital funciona cuando ahorra tiempo comprobable, reduce errores repetitivos o facilita que personas interesadas lleguen a la conversación adecuada. Las visitas a una web o los seguidores no significan nada si no resuelven fricción del negocio.",
    whyItMatters:
      "Muchos dueños de negocio pagan mensualidades por herramientas que nadie utiliza o se frustran porque 'su web no vende'. Al definir métricas observables desde el principio, sabes con certeza si la inversión valió la pena.",
    practicalExample:
      "En lugar de medir 'cuántas visitas tuvo la página', mide: '¿cuántas personas llegaron a WhatsApp ya sabiendo el precio y las condiciones?', o '¿cuántas horas a la semana me ahorré de mandar cotizaciones manuales?'. Si el tiempo disminuye, compara el ahorro real con el costo de implementar, operar y mantener la herramienta; eso permite evaluar su valor.",
    whatToCheck: [
      "¿Redujo el tiempo que dedicas a tareas repetitivas?",
      "¿Los prospectos que te contactan entienden mejor lo que ofreces antes de hablar contigo?",
      "¿Tus clientes te dicen que les fue fácil encontrar tu información o ubicación?",
    ],
    frequentMistakes: [
      "Obsesionarse con métricas de vanidad (visitas totales, likes, impresiones) que no tienen correlación con la operación.",
      "No medir antes de implementar, haciendo imposible comparar si hubo una mejora real.",
    ],
    toolOrResource: {
      name: "Evaluación de fricciones operativas",
      description:
        "Pauta de diagnóstico para comparar el tiempo dedicado a atención antes y después de una solución digital.",
    },
    suggestedStep:
      "Anota durante una semana cuántas veces respondes la misma duda y cuánto tiempo te toma. Prueba una mejora pequeña y compara; la frecuencia por sí sola no demuestra que debas construir una herramienta.",
    sources: [],
  },
];
