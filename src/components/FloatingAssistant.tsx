import { useEffect, useRef, useState } from "react";
import {
  CHAT_STARTERS,
  GUIDED_CHAT_OPTIONS,
  chatOrientation,
  guidedChatReply,
  type FloatingChatMessage,
} from "../../shared/floating-chat-guidance.ts";
import { bootstrapLocalSession, FloatingChatError, requestFloatingChat } from "../advisor/ai-client.ts";
import { OFFLINE_GUIDE_PATH } from "../../shared/offline-guide.ts";
import "./floating-assistant.css";

const INITIAL_MESSAGE: FloatingChatMessage = {
  role: "assistant",
  text: "Cuéntame qué te está costando trabajo en tu negocio. Puedes escribir como hablas.",
};

export function FloatingAssistant({ whatsappUrl }: { whatsappUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<FloatingChatMessage[]>([
    INITIAL_MESSAGE,
  ]);
  const [draft, setDraft] = useState("");
  const [phase, setPhase] = useState<"verification" | "answer" | null>(null);
  const [error, setError] = useState<FloatingChatError | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideChoice, setGuideChoice] = useState<(typeof GUIDED_CHAT_OPTIONS)[number] | null>(null);
  const attemptRef = useRef<{ text: string; id: string } | null>(null);
  const submitting = useRef(false);
  const tokenRef = useRef<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const busy = phase !== null;
  const guide = guideChoice ? chatOrientation(guideChoice) : null;

  function closeAssistant() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current!;
    panel.focus({ preventScroll: true });
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panel.contains(document.activeElement)) closeAssistant();
    };
    const viewport = window.visualViewport;
    function fitAboveKeyboard() {
      if (!viewport || viewport.scale !== 1 || window.innerHeight - viewport.height < 100) {
        delete panel.dataset.keyboard;
        return;
      }
      panel.dataset.keyboard = "open";
      panel.style.setProperty("--chat-visible-height", `${viewport.height}px`);
      panel.style.setProperty("--chat-keyboard-gap", `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`);
    }
    panel.addEventListener("keydown", onKeyDown);
    viewport?.addEventListener("resize", fitAboveKeyboard);
    viewport?.addEventListener("scroll", fitAboveKeyboard);
    fitAboveKeyboard();
    return () => {
      panel.removeEventListener("keydown", onKeyDown);
      viewport?.removeEventListener("resize", fitAboveKeyboard);
      viewport?.removeEventListener("scroll", fitAboveKeyboard);
    };
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, phase, error, guideOpen, guideChoice]);

  function completeTurn(text: string, reply: string) {
    setMessages((previous) => [...previous, { role: "user", text }, { role: "assistant", text: reply }]);
    setDraft("");
    setError(null);
    attemptRef.current = null;
  }

  async function sendMessage(rawText: string) {
    const text = rawText.trim();
    if (!text || submitting.current || (error?.options.alreadyAnswered && attemptRef.current?.text === text)) return;

    const history = messages.slice(1);
    const localReply = guidedChatReply(text, history);
    if (localReply) {
      completeTurn(text, localReply);
      return;
    }

    submitting.current = true;
    setDraft(text);
    setError(null);
    try {
      if (!navigator.onLine) {
        throw new FloatingChatError("Parece que se cortó la conexión. Tu pregunta sigue aquí. Puedes continuar con la guía.");
      }
      if (attemptRef.current?.text !== text) {
        attemptRef.current = { text, id: crypto.randomUUID() };
      }
      const { id } = attemptRef.current;
      if (!tokenRef.current) {
        setPhase("verification");
        tokenRef.current = await bootstrapLocalSession();
      }
      setPhase("answer");
      const result = await requestFloatingChat(tokenRef.current, text, history, id);
      completeTurn(text, result.reply);
    } catch (err) {
      const failure = err instanceof FloatingChatError
        ? err
        : new FloatingChatError("No pude recibir una respuesta. Tu pregunta sigue aquí. Puedes reintentar o seguir con la guía.");
      if (failure.options.refreshSession) tokenRef.current = null;
      if (failure.options.retryWithNewId) attemptRef.current = null;
      setError(failure);
    } finally {
      submitting.current = false;
      setPhase(null);
    }
  }

  return (
    <div className="cidiks-fab-root">
      {open && (
        <section
          className="cidiks-chat-panel"
          ref={panelRef}
          role="dialog"
          aria-label="Asistente CÍDIKS IA"
          tabIndex={-1}
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
              onClick={closeAssistant}
              aria-label="Cerrar asistente"
            >
              ✕
            </button>
          </header>

          <div className="cidiks-chat-body" ref={listRef}>
            <div className="cidiks-chat-transcript" role="log" aria-label="Conversación">
              {messages.map((message, i) => (
                <div key={i} className={`cidiks-chat-msg cidiks-chat-msg--${message.role}`}>
                  {message.text}
                </div>
              ))}
              {busy && (
                <p className="cidiks-chat-msg cidiks-chat-msg--assistant cidiks-chat-typing" role="status">
                  {phase === "verification" ? "Preparando el chat y verificando la conexión…" : "Estoy preparando tu respuesta…"}
                </p>
              )}
              {error && <p className="cidiks-chat-error" role="status">{error.message}</p>}
            </div>
            {messages.length === 1 && !busy && !error && !guideOpen && (
              <div className="cidiks-chat-chips" aria-label="Ideas para empezar" role="group">
                {CHAT_STARTERS.map((chip) => (
                  <button key={chip} type="button" className="cidiks-chat-chip" onClick={() => void sendMessage(chip)}>
                    {chip}
                  </button>
                ))}
              </div>
            )}
            {guideOpen && (
              <div className="cidiks-chat-guided" aria-labelledby="cidiks-chat-guide-heading">
                <h3 id="cidiks-chat-guide-heading">Guía rápida</h3>
                <p><a href={OFFLINE_GUIDE_PATH}>Abrir la versión para usar sin conexión ↗</a></p>
                {guide ? (
                  <>
                    <p role="status">{guide.why} {guide.freeStep}</p>
                    <button type="button" className="cidiks-chat-chip" onClick={() => setGuideChoice(null)}>
                      Elegir otra opción
                    </button>
                  </>
                ) : (
                  <div className="cidiks-chat-chips" role="group" aria-label="¿Qué quieres mejorar primero?">
                    {GUIDED_CHAT_OPTIONS.map((option) => (
                      <button key={option.label} type="button" className="cidiks-chat-chip" onClick={() => setGuideChoice(option)}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <form
            className="cidiks-chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage(draft);
            }}
          >
            <p className="cidiks-chat-privacy" id="cidiks-chat-privacy">
              Al pedir una respuesta en línea, Cloudflare Workers AI puede recibir tu mensaje y hasta seis anteriores. Evita incluir datos personales.
            </p>
            <input
              type="text"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setError(null);
              }}
              placeholder="Cuéntame qué pasó…"
              maxLength={600}
              disabled={busy}
              aria-label="Escribe tu pregunta para CÍDIKS IA"
              aria-describedby="cidiks-chat-privacy"
            />
            <button type="submit" disabled={busy || !draft.trim() || Boolean(error?.options.alreadyAnswered)}>
              {error && !error.options.alreadyAnswered ? "Reintentar" : "Enviar"}
            </button>
          </form>

          <footer className="cidiks-chat-foot">
            <button type="button" onClick={() => setGuideOpen((value) => !value)} aria-expanded={guideOpen}>
              {guideOpen ? "Cerrar guía" : "Seguir con la guía"}
            </button>
            <a href="/asesor-ia/">Diagnóstico de 3 preguntas ↗</a>
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
        ref={triggerRef}
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
