/**
 * El widget muestra texto plano. Si el modelo responde con markdown o se corta por
 * max_tokens, la persona vería asteriscos o una frase a medias. Esto lo limpia antes
 * del filtro de salida (el filtro va al final para que el texto seguro nunca se altere).
 */

export function toPlainChatText(raw: string): string {
  return raw.replace(/\r\n?/g, '\n')
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    .replace(/__([^_\n]+)__/g, '$1')
    .replace(/^[ \t]*#{1,6}[ \t]+/gm, '')
    .replace(/^[ \t]*(?:[-*•]|\d{1,2}[.)])[ \t]+/gm, '')
    .replace(/[*`]/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Si el texto no termina en cierre de frase, lo recorta a la última frase completa. */
export function trimToLastSentence(text: string): string {
  if (/[.!?…»"”)]\s*$/.test(text)) return text;
  const cut = text.match(/^[\s\S]*[.!?…»](?=\s|$)/)?.[0].trim();
  return cut && cut.length >= 20 ? cut : text;
}

export type FormattedReply = { text: string; stripped: boolean; trimmed: boolean };

export function formatModelReply(raw: string): FormattedReply {
  const plain = toPlainChatText(raw);
  const text = trimToLastSentence(plain);
  return { text, stripped: plain !== raw.trim(), trimmed: text !== plain };
}
