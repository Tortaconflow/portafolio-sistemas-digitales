export interface QuickAnswers {
  business: string;
  need: string;
  channel: string;
}

interface QuickOrientation {
  ruleId: string;
  headline: string;
  why: string;
  freeStep: string;
  missingInfo: string[];
  guideHref: string;
  guideLabel: string;
  disclaimer: string;
}

/**
 * Precedencia explícita (la necesidad expresada manda sobre el canal):
 * 1. need = unsure | otra -> orientación exploratoria (sin recomendar ni descartar web).
 * 2. need = whatsapp -> ordenar atención en WhatsApp Business (gratis) primero.
 * 3. need = catalogo -> catálogo gratuito de WhatsApp Business o evaluar web según contexto.
 * 4. need = visibilidad + channel = web-actual -> revisar la web actual antes de rehacerla.
 * 5. need = visibilidad (otros canales) -> Google Perfil de Negocio condicionado a elegibilidad presencial/área de servicio.
 */
export function buildOrientation(answers: QuickAnswers): QuickOrientation {
  const disclaimer = 'Orientación inicial basada solo en tres respuestas. No sustituye una revisión real de tu negocio ni es una cotización.';
  const channelNote = answers.channel === 'unsure'
    ? 'Aún no sabemos por qué canales te contactan hoy tus clientes.'
    : '';

  if (answers.need === 'unsure' || answers.need === 'otra') {
    return {
      ruleId: 'exploratory',
      headline: 'Conviene empezar ordenando qué necesitan tus clientes antes de elegir herramienta',
      why: 'Con tres respuestas aún es pronto para recomendar o descartar una página web u otra herramienta. Definir primero qué te preguntan con más frecuencia ayuda a evitar gastos innecesarios.',
      freeStep: 'Durante esta semana, anota en una libreta o notas del celular las 5 dudas más frecuentes de tus clientes y cómo las respondes hoy.',
      missingInfo: [
        'Cuál es tu oferta principal y qué problema concreto quieres resolver primero.',
        channelNote || 'Con cuánto tiempo cuentas para mantener una herramienta digital al día.',
      ],
      guideHref: '/conocimiento/diferencia-entre-presencia-digital-y-sistema-digital/',
      guideLabel: 'Guía: diferencia entre presencia digital y sistema digital',
      disclaimer,
    };
  }

  if (answers.need === 'whatsapp') {
    const webExtra = answers.channel === 'web-actual'
      ? ' Si ya tienes una página web, también conviene revisar que el botón de WhatsApp sea claro en celular.'
      : '';
    return {
      ruleId: 'whatsapp',
      headline: 'Podrías empezar ordenando tu atención con las funciones gratuitas de WhatsApp Business',
      why: `Antes de evaluar herramientas de pago o automatizaciones, ordenar respuestas frecuentes y etiquetas suele aliviar gran parte de la carga diaria.${webExtra}`,
      freeStep: 'Configura en WhatsApp Business (gratis) 3 a 5 respuestas rápidas para tus preguntas más repetidas y usa etiquetas para distinguir consultas pendientes.',
      missingInfo: [
        'Si atiendes solo o con un equipo y qué tipo de mensajes se pierden con más frecuencia.',
        channelNote || 'Si necesitas seguimiento fuera de WhatsApp o si con ordenarlo es suficiente por ahora.',
      ],
      guideHref: '/conocimiento/whatsapp-y-seguimiento-de-clientes/',
      guideLabel: 'Guía: WhatsApp y seguimiento de clientes',
      disclaimer,
    };
  }

  if (answers.need === 'catalogo') {
    return {
      ruleId: 'catalogo',
      headline: 'Podrías empezar con un catálogo gratuito en WhatsApp Business y evaluar si necesitas algo más',
      why: 'Cuando el objetivo es mostrar con claridad qué ofreces, un catálogo nativo y gratuito permite compartir fotos y descripciones sin invertir de inmediato; una página web puede evaluarse después si necesitas más estructura o alcance.',
      freeStep: 'Reúne fotos claras y descripciones cortas de tus productos o servicios principales y súbelos al catálogo gratuito de WhatsApp Business.',
      missingInfo: [
        'Con qué frecuencia cambian tus productos, precios o disponibilidad.',
        channelNote || 'Si tus clientes suelen buscarte fuera de redes sociales o prefieren resolver todo por mensaje.',
      ],
      guideHref: '/conocimiento/necesito-realmente-una-pagina-web/',
      guideLabel: 'Guía: ¿necesito realmente una página web?',
      disclaimer,
    };
  }

  if (answers.channel === 'web-actual') {
    return {
      ruleId: 'audit-web',
      headline: 'Antes de invertir en algo nuevo, conviene revisar qué está fallando en tu página actual',
      why: 'Cuando ya existe una página pero no ayuda al negocio, muchas veces el problema está en la claridad del mensaje, la velocidad en celular o un contacto difícil de encontrar, no en falta de funciones.',
      freeStep: 'Abre tu página desde un celular con datos móviles y comprueba si en menos de 10 segundos queda claro qué haces, dónde estás y cómo escribirte.',
      missingInfo: [
        'Qué parte de tu página actual genera confusión o abandona el visitante.',
        'Si hoy recibes visitas que no contactan o si casi nadie llega todavía a la página.',
      ],
      guideHref: '/conocimiento/como-saber-si-una-herramienta-digital-esta-funcionando/',
      guideLabel: 'Guía: cómo saber si una herramienta digital está funcionando',
      disclaimer,
    };
  }

  return {
    ruleId: 'visibilidad-local',
    headline: 'Si atiendes en un local o zona definida, Google Perfil de Negocio (gratis) puede ser un buen primer paso',
    why: 'Para negocios elegibles con atención presencial o área de servicio local, aparecer con horario real, ubicación y contacto claro en Google Maps suele ayudar antes de evaluar una página web.',
    freeStep: 'Verifica si tu negocio cumple las directrices de Google para Perfil de Negocio; si aplica, crea o actualiza tu ficha gratuita con horario real, fotos claras y un canal de contacto.',
    missingInfo: [
      'Si cuentas con atención presencial o área de servicio elegible para Google Perfil de Negocio.',
      channelNote || 'Si te conviene complementar esa ficha con una página web más adelante según cómo te buscan tus clientes.',
    ],
    guideHref: '/conocimiento/google-maps-perfil-de-negocio/',
    guideLabel: 'Guía: ¿para qué sirve realmente Google Maps?',
    disclaimer,
  };
}
