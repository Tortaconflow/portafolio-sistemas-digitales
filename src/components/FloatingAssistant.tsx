import { useEffect, useRef, useState } from "react";
import {
  bootstrapLocalSession,
  requestFloatingChat,
  type FloatingChatMessage,
} from "../advisor/ai-client.ts";
import "./floating-assistant.css";

const STARTER_CHIPS = [
  "¿Qué necesita mi negocio?",
  "¿Web o solo WhatsApp?",
  "¿Cómo trabaja CÍDIKS?",
];

const INITIAL_MESSAGE: FloatingChatMessage = {
  role: "assistant",
  text: "Hola, soy CÍDIKS IA. Cuéntame sobre tu negocio o pregúntame cualquier duda digital; te respondo claro y sin rodeos.",
};

export function FloatingAssistant({ whatsappUrl }: { whatsappUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<FloatingChatMessage[]>([
    INITIAL_MESSAGE,
  ]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, busy]);

  async function sendMessage(rawText: string) {
    const text = rawText.trim();
    if (!text || busy) return;
    setError(null);
    setDraft("");
    const nextHistory: FloatingChatMessage[] = [
      ...messages,
      { role: "user", text },
    ];
    setMessages(nextHistory);
    setBusy(true);
    try {
      tokenRef.current ??= await bootstrapLocalSession();
      const { reply } = await requestFloatingChat(
        tokenRef.current,
        text,
        nextHistory.slice(1, -1),
      );
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      tokenRef.current = null;
      setError(
        err instanceof Error
          ? err.message
          : "No pude responder ahora. Puedes usar el diagnóstico rápido o WhatsApp.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cidiks-fab-root">
      {open && (
        <section
          className="cidiks-chat-panel"
          role="dialog"
          aria-label="Asistente CÍDIKS IA"
        >
          <header className="cidiks-chat-head">
            <div className="cidiks-chat-brand">
              <span className="cidiks-chat-dot" aria-hidden="true" />
              <div>
                <strong>CÍDIKS IA</strong>
                <span>Asistente digital</span>
              </div>
            </div>
            <button
              type="button"
              className="cidiks-chat-close"
              onClick={() => setOpen(false)}
              aria-label="Cerrar asistente"
            >
              ✕
            </button>
          </header>

          <div
            className="cidiks-chat-body"
            ref={listRef}
            aria-live="polite"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`cidiks-chat-msg cidiks-chat-msg--${m.role}`}
              >
                {m.text}
              </div>
            ))}
            {busy && (
              <div className="cidiks-chat-msg cidiks-chat-msg--assistant cidiks-chat-typing">
                Pensando…
              </div>
            )}
            {error && <p className="cidiks-chat-error">{error}</p>}
          </div>

          {messages.length === 1 && !busy && (
            <div className="cidiks-chat-chips" aria-label="Preguntas rápidas">
              {STARTER_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="cidiks-chat-chip"
                  onClick={() => void sendMessage(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <form
            className="cidiks-chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage(draft);
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Escribe tu duda…"
              maxLength={600}
              disabled={busy}
              aria-label="Escribe tu pregunta para CÍDIKS IA"
            />
            <button type="submit" disabled={busy || !draft.trim()}>
              Enviar
            </button>
          </form>

          <footer className="cidiks-chat-foot">
            <a href="/asesor-ia/">Diagnóstico rápido (3 preguntas) ↗</a>
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp ↗
              </a>
            )}
          </footer>
        </section>
      )}

      <button
        type="button"
        className="cidiks-fab-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Cerrar asistente CÍDIKS IA" : "Abrir asistente CÍDIKS IA"}
        title="Pregúntale a CÍDIKS IA"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"
            fill="currentColor"
          />
          <circle cx="18.5" cy="5.5" r="1.5" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
