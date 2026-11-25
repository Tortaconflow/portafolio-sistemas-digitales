// Acceso al chat flotante de CÍDIKS IA desde la home. Solo abre el panel existente (sin tocar el Worker).
export const OPEN_CHAT_EVENT = "cidiks:open-chat";
/** El chat solo existe con JavaScript; en el HTML estático la home enlaza al diagnóstico guiado. */
export const chatAvailable = () => typeof window !== "undefined";
export const openChat = () => window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
