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
  return buildOrientation({ business: 'unsure', ...option });
}

const ORDERS_QUESTION = '¿Por dónde te llegan más pedidos hoy: WhatsApp, redes sociales, llamadas o en persona?';
const VISIBILITY_QUESTION = '¿Te cuesta que gente nueva conozca tu negocio, o ya te escriben y pocas personas terminan comprando?';

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

const WHATSAPP = /\b(?:whats? ?app|wasap|wassap|wats(?:ap)?|whats?|wsp)\b/;
const ORDER_CONTEXT = /\b(?:vend\w*|pedid\w*|client\w*|me preguntan|me escriben)\b/;
const REPEATED = /\b(?:me preguntan|mism\w*|repet\w*|cada (?:pedido|vez)|siempre|a cada rato|junt\w*)\b/;
const PRICE = /\b(?:precios?|cuanto|costos?)\b/;
const DELIVERY = /\b(?:entreg\w*|envi\w*|mand\w*|donde)\b/;
const WEBSITE = /\b(?:web|pagin\w*|sitio)\b/;
const WEB_OR_WHATSAPP = /^(?:web|pagina web|mi negocio necesita una web) o (?:solo |basta con )?(?:whatsapp|wasap|wats)$/;

function repetitiveWhatsAppReply(text: string, comparesWebsite: boolean): string | null {
  const hasPrice = PRICE.test(text);
  const hasDelivery = DELIVERY.test(text);
  if (!WHATSAPP.test(text) || !ORDER_CONTEXT.test(text) || !REPEATED.test(text) || !(hasPrice || hasDelivery)) {
    return null;
  }
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
  if (WHATSAPP.test(text) && previous?.role === 'assistant' && previous.text === ORDERS_QUESTION) {
    return chatOrientation({ need: 'whatsapp', channel: 'whatsapp-persona' }).freeStep;
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

export function chatDiagnosticCriteria(): string {
  return GUIDED_CHAT_OPTIONS.map((option) => {
    const orientation = chatOrientation(option);
    return `${option.label}. ${orientation.why} ${orientation.freeStep}`;
  }).join('\n');
}
