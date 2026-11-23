import { buildOrientation } from './quick-orientation.ts';

export interface FloatingChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const CHAT_STARTERS = [
  'Quiero que me encuentren',
  'Me cuesta atender pedidos',
  'Tengo una idea y no sé por dónde empezar',
] as const;

export const GUIDED_CHAT_OPTIONS = [
  { label: 'Quiero que me encuentren', need: 'visibilidad', channel: 'unsure' },
  { label: 'Quiero ordenar mi WhatsApp', need: 'whatsapp', channel: 'whatsapp-persona' },
  { label: 'Quiero mostrar lo que vendo', need: 'catalogo', channel: 'unsure' },
  { label: 'Quiero revisar mi página', need: 'visibilidad', channel: 'web-actual' },
  { label: 'Todavía no sé qué mejorar', need: 'unsure', channel: 'unsure' },
] as const;

export function chatOrientation(option: { need: string; channel: string }) {
  const orientation = buildOrientation({ business: 'unsure', ...option });
  // El texto del formulario de /asesor-ia/ habla de "tres respuestas"; en el chat no aplica.
  if (orientation.ruleId === 'exploratory') {
    return { ...orientation, why: 'Antes de elegir una herramienta conviene saber qué te preguntan más tus clientes. Así evitas gastar en algo que todavía no necesitas.' };
  }
  return orientation;
}

const ORDERS_QUESTION = '¿Por dónde te llegan más pedidos hoy: WhatsApp, redes sociales, llamadas o en persona?';
const VISIBILITY_QUESTION = '¿Te cuesta que gente nueva conozca tu negocio, o ya te escriben y pocas personas terminan comprando?';

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

// Cubre faltas comunes: whatsapp, whats app, watsapp, whatsap, wasap, wassap, wasapp, guasap, whasap, wsp, wpp.
const WA = String.raw`(?:wh?|gu)at?s{0,2} ?a{1,2}pp?|whats?|wats|wsp|wpp`;
const WHATSAPP = new RegExp(String.raw`\b(?:${WA})\b`);
/** Respuesta corta de canal ("por wasap", "en el whats"): solo eso dispara la respuesta fija. */
const CHANNEL_ANSWER = new RegExp(String.raw`^(?:(?:por|en|x|pues|mas|mayormente|casi siempre) )*(?:el |mi )?(?:${WA})(?: business)?$`);
const ORDER_CONTEXT = /\b(?:vend\w*|pedid\w*|client\w*|me preguntan|me escriben)\b/;
const REPEATED = /\b(?:me (?:preguntan|piden)|lo mismo|repet\w*|repit\w*|cada (?:pedido|vez|rato)|a cada rato|siempre me (?:preguntan|piden|escriben)|se me junt\w*)\b/;
const PRICE = /\b(?:precios?|cuanto|costos?)\b/;
const DELIVERY = /\b(?:entreg\w*|envios?|envia[sn]?|enviar|domicilio|mand(?:as|an|ar|o|amos))\b/;
const WEBSITE = /\b(?:web|pagin\w*|sitio)\b/;
const WEB_OR_WHATSAPP = new RegExp(String.raw`^(?:(?:mi negocio necesita|necesito|me conviene) )?(?:una )?(?:web|pagina(?: web)?|sitio(?: web)?) o (?:solo |basta con |nomas )?(?:el )?(?:${WA})$`);
// Casos en los que la respuesta fija contestaría otra cosa: mejor que responda el modelo.
const NEGATED_CHANNEL = /\b(?:no|nunca|ya no|casi no) (?:uso|usamos|tengo|ocupo|manejo|vendo|me escriben|me llegan)\b/;
const ASKS_WEB_PRICE = /\bcuanto (?:cobras|cobran|cuesta (?:una|la|hacer|tu)|sale (?:una|la|hacer))\b|\bprecio de (?:una|la|tu) (?:web|pagina|sitio)\b/;
const HAS_WEBSITE = /\bya tengo (?:una |mi )?(?:web|pagina|sitio)\b/;

function repetitiveWhatsAppReply(text: string, comparesWebsite: boolean): string | null {
  const hasPrice = PRICE.test(text);
  const hasDelivery = DELIVERY.test(text);
  if (!WHATSAPP.test(text) || !ORDER_CONTEXT.test(text) || !REPEATED.test(text) || !(hasPrice || hasDelivery)) {
    return null;
  }
  if (NEGATED_CHANNEL.test(text) || ASKS_WEB_PRICE.test(text) || HAS_WEBSITE.test(text)) return null;
  const topic = hasPrice && hasDelivery ? 'el precio y cómo entregas' : hasPrice ? 'el precio' : 'cómo entregas';
  const firstStep = comparesWebsite ? 'Para tu caso, empezaría por ordenar WhatsApp antes de invertir en una web. ' : '';
  return `${firstStep}Ya te escriben por WhatsApp y te toca repetir ${topic}. Deja lista una respuesta corta con esa información o guárdala como respuesta rápida si usas WhatsApp Business. ¿Quieres que armemos el texto?`;
}

/** Only handles clear, low-risk cases. Open-ended conversation remains with the model. */
export function guidedChatReply(message: string, history: readonly FloatingChatMessage[]): string | null {
  const text = normalize(message);
  const previous = history.at(-1);

  if (text === normalize(CHAT_STARTERS[0])) {
    return '¿Cómo te encuentra la gente hoy: pasa por tu negocio, te recomienda alguien o te busca en internet?';
  }
  if (text === normalize(CHAT_STARTERS[1])) return ORDERS_QUESTION;
  if (text === normalize(CHAT_STARTERS[2]) || text === 'no se por donde empezar') {
    return 'Podemos empezar por algo pequeño. ¿Qué te gustaría que fuera más fácil en tu negocio esta semana?';
  }

  const orderReply = repetitiveWhatsAppReply(text, WEBSITE.test(text));
  if (orderReply) return orderReply;
  if (CHANNEL_ANSWER.test(text) && previous?.role === 'assistant' && previous.text === ORDERS_QUESTION) {
    return `${chatOrientation({ need: 'whatsapp', channel: 'whatsapp-persona' }).freeStep} ¿Qué es lo que más te preguntan?`;
  }

  if (WEBSITE.test(text) && /\b(?:no me (?:llega|yega) gente|no me encuentran)\b/.test(text)) {
    return VISIBILITY_QUESTION;
  }
  if (WEB_OR_WHATSAPP.test(text)) {
    const lastUserMessage = history.findLast(turn => turn.role === 'user');
    const contextualReply = lastUserMessage && repetitiveWhatsAppReply(normalize(lastUserMessage.text), true);
    if (contextualReply) return contextualReply;
    return 'WhatsApp puede bastar si tus clientes ya te encuentran y te hacen pedidos por ahí. Una web puede ayudar si necesitan consultar tu oferta antes de escribirte. ¿Qué te cuesta más hoy: que te encuentren o atender a quienes ya te escriben?';
  }
  return null;
}
