import { OPEN_CHAT_EVENT } from "../ai-chat";
import { useEffect, useRef, useState } from "react";
import {
  CHAT_STARTERS,
  GUIDED_CHAT_OPTIONS,
  chatOrientation,
  guidedChatReply,
  type FloatingChatMessage,
} from "../../shared/floating-chat-guidance.ts";
import { bootstrapLocalSession, exhaustedChatError, FloatingChatError, preloadTurnstile, requestFloatingChat } from "../advisor/ai-client.ts";
import { track } from "../analytics.ts";
import "./floating-assistant.css";

/** Esperas antes de reintentar cuando el Worker dice que hay mucha gente (concurrency_limit). */
const BUSY_WAITS_MS = [2000, 4000];

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
  const [phase, setPhase] = useState<"verification" | "answer" | "waiting" | null>(null);
  const [error, setError] = useState<FloatingChatError | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const exhaustedRef = useRef(false);
  const attemptRef = useRef<{ text: string; id: string } | null>(null);
  const submitting = useRef(false);
  const tokenRef = useRef<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const busy = phase !== null;

  function closeAssistant() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, show);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, show);
  }, []);

  // Al abrir el chat se descarga la verificación de Cloudflare, para que el primer mensaje no espere.
  useEffect(() => {
    if (open) preloadTurnstile();
  }, [open]);

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
  }, [messages, open, phase, error, guideOpen]);

  function completeTurn(text: string, reply: string) {
    setMessages((previous) => [...previous, { role: "user", text }, { role: "assistant", text: reply }]);
    setDraft("");
    setError(null);
    attemptRef.current = null;
  }

  /**
   * La opción elegida en la guía entra a la conversación como si la persona la
   * hubiera escrito: así el modelo la conoce en el siguiente mensaje. No toca el
   * borrador para no perder lo que la persona ya había escrito.
   */
  function chooseGuideOption(option: (typeof GUIDED_CHAT_OPTIONS)[number]) {
    const orientation = chatOrientation(option);
    setMessages((previous) => [
      ...previous,
      { role: "user", text: option.label },
      { role: "assistant", text: `${orientation.why} ${orientation.freeStep}` },
    ]);
    setGuideOpen(false);
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

    if (exhaustedRef.current) {
      setDraft(text);
      setError(exhaustedChatError());
      setGuideOpen(true);
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
      let result: Awaited<ReturnType<typeof requestFloatingChat>>;
      // Si hay mucha gente a la vez, espera y reintenta solo antes de mostrar un error.
      // Un 429 no registra la solicitud, así que se puede reusar el mismo ID.
      for (let wait = 0; ; wait++) {
        try {
          result = await requestFloatingChat(tokenRef.current, text, history, id);
          break;
        } catch (err) {
          const busy = err instanceof FloatingChatError && err.options.code === "concurrency_limit";
          if (!busy || wait >= BUSY_WAITS_MS.length) throw err;
          setPhase("waiting");
          await new Promise((resolve) => setTimeout(resolve, BUSY_WAITS_MS[wait]));
          setPhase("answer");
        }
      }
      // Mide cuántas respuestas filtra el Worker, solo con el motivo y nunca el texto.
      if (result.blocked) track("chat_reply_blocked", { reason: result.blocked });
      completeTurn(text, result.reply);
      if (typeof result.remaining === "number") setRemaining(result.remaining);
    } catch (err) {
      const failure = err instanceof FloatingChatError
        ? err
        : new FloatingChatError("No pude recibir una respuesta. Tu pregunta sigue aquí. Puedes reintentar o seguir con la guía.");
      if (failure.options.refreshSession) tokenRef.current = null;
      if (failure.options.retryWithNewId) attemptRef.current = null;
      if (failure.options.exhausted) {
        // Sin respuestas en línea, la guía queda abierta como siguiente paso útil.
        exhaustedRef.current = true;
        setGuideOpen(true);
      }
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
                  {phase === "verification"
                    ? "Preparando el chat… Si aparece una casilla para confirmar que no eres un robot, márcala."
                    : phase === "waiting"
                      ? "Hay varias personas usando el chat; te respondo en un momento…"
                      : "Estoy preparando tu respuesta…"}
                </p>
              )}
              {error && <p className="cidiks-chat-error" role="status" data-code={error.options.code}>{error.message}</p>}
              {!error && remaining !== null && remaining > 0 && remaining <= 2 && (
                <p className="cidiks-chat-note">Te {remaining === 1 ? "queda 1 respuesta" : `quedan ${remaining} respuestas`} en línea en esta sesión.</p>
              )}
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
                <div className="cidiks-chat-chips" role="group" aria-label="¿Qué quieres mejorar primero?">
                  {GUIDED_CHAT_OPTIONS.map((option) => (
                    <button key={option.label} type="button" className="cidiks-chat-chip" onClick={() => chooseGuideOption(option)}>
                      {option.label}
                    </button>
                  ))}
                </div>
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
              Este chat usa una IA de Cloudflare: puede recibir lo que escribes y tus últimos 6 mensajes. No escribas datos personales como tu dirección o datos bancarios.
            </p>
            <input
              type="text"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setError(null);
              }}
              placeholder="Escribe o dicta tu mensaje…"
              maxLength={600}
              disabled={busy}
              aria-label="Escribe tu pregunta para CÍDIKS IA"
              aria-describedby="cidiks-chat-privacy"
            />
            <button type="submit" disabled={busy || !draft.trim() || Boolean(error?.options.alreadyAnswered)}>
              {error && !error.options.alreadyAnswered && !error.options.exhausted ? "Reintentar" : "Enviar"}
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
