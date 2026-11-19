import { content } from "./content.ts";

/** Only prepares a handoff. It never sends a message or confirms receipt. */
export function buildWhatsAppUrl(
  message: string,
  destination: string = content.links.whatsapp,
): string {
  if (!message.trim()) return "";
  const base = getWhatsAppDestination(destination);
  if (!base) return "";
  const url = new URL(base);
  url.searchParams.set("text", message);
  return url.href;
}

/** Validated destination for users who will copy and paste a long message. */
export function getWhatsAppDestination(destination: string = content.links.whatsapp): string {
  try {
    const url = new URL(destination);
    if (
      url.protocol !== "https:" || url.username || url.password ||
      url.hostname !== "wa.me" || !/^\/\d{8,15}\/?$/.test(url.pathname)
    ) return "";
    url.searchParams.delete("text");
    url.hash = "";
    return url.href;
  } catch {
    return "";
  }
}

// A conservative link-size guard; copying preserves the entire brief.
export const MAX_WHATSAPP_URL_LENGTH = 7500;
