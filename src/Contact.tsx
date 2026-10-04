import { useEffect, useRef, useState, type FormEvent } from "react";
import { content as c, isEmail, isWebUrl } from "./content";
import { track } from "./analytics";

type Channel = "WhatsApp" | "Correo" | "Messenger";
const channelId = (channel: Channel) =>
  channel === "Correo"
    ? "correo"
    : channel === "Messenger"
      ? "messenger"
      : "whatsapp";

export function Contact({ interest }: { interest: string }) {
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<Channel>("WhatsApp");
  const [feedback, setFeedback] = useState("");
  const started = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (message) resultRef.current?.focus();
  }, [message]);
  useEffect(() => {
    setMessage("");
    setFeedback("");
  }, [interest]);
  function start() {
    if (started.current) return;
    started.current = true;
    track("contact_start", { origin: "form" });
    track("form_start", { channel_selected: channelId(channel) });
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    for (const key of ["name", "business", "problem"]) {
      if (!String(data.get(key) || "").trim()) {
        const control = event.currentTarget.elements.namedItem(
          key,
        ) as HTMLInputElement;
        control.setCustomValidity("Escribe una respuesta para continuar.");
        control.reportValidity();
        return;
      }
    }
    const entries = Object.entries(c.contact.fields).flatMap(([key, label]) => {
      const value = String(data.get(key) || "").trim();
      return value ? [`${label}: ${value}`] : [];
    });
    setMessage(
      [c.contact.subject, interest ? `Tema: ${interest}` : "", "", ...entries]
        .filter((line, i) => line || i === 2)
        .join("\n"),
    );
    track("form_prepare", {
      channel_selected: channelId(channel),
      has_interest: Boolean(interest),
    });
  }
  function openPrepared() {
    track("contact_submit", {
      channel: channelId(channel),
      stage: "channel_opened",
    });
    track("contact_click", { channel: channelId(channel), origin: "direct" });
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setFeedback(c.contact.copied);
    } catch {
      setFeedback(c.contact.copyError);
    }
  }
  const direct = [
    {
      label: c.contact.whatsapp,
      channel: "whatsapp" as const,
      href: isWebUrl(c.links.whatsapp) ? c.links.whatsapp : "",
    },
    {
      label: c.contact.email,
      channel: "correo" as const,
      href: isEmail(c.links.email) ? `mailto:${c.links.email}` : "",
    },
    {
      label: c.contact.messenger,
      channel: "messenger" as const,
      href: isWebUrl(c.links.messenger) ? c.links.messenger : "",
    },
  ].filter((link) => link.href);
  const readyUrl =
    channel === "WhatsApp" && isWebUrl(c.links.whatsapp)
      ? `${c.links.whatsapp}?text=${encodeURIComponent(message)}`
      : channel === "Correo" && isEmail(c.links.email)
        ? `mailto:${c.links.email}?subject=${encodeURIComponent(c.contact.subject)}&body=${encodeURIComponent(message)}`
        : channel === "Messenger" && isWebUrl(c.links.messenger)
          ? c.links.messenger
          : "";
  return (
    <section id="contacto" className="contact-section section">
      <div className="container contact-grid">
        <div>
          <div className="section-heading">
            <p className="eyebrow">{c.contact.label}</p>
            <h2>{c.contact.title}</h2>
            <p className="section-description">{c.contact.body}</p>
          </div>
          <div className="contact-direct">
            <p className="eyebrow">{c.contact.direct}</p>
            {direct.map((link) => (
              <a
                key={link.channel}
                href={link.href}
                onClick={() => {
                  track("contact_start", {
                    origin: "direct",
                    channel: link.channel,
                  });
                  track("contact_click", {
                    channel: link.channel,
                    origin: "direct",
                  });
                }}
              >
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <p className="small muted">
            Empezamos con una conversación de 15 minutos. El alcance y la
            inversión se acuerdan después de entender el problema.
          </p>
        </div>
        <form
          className="contact-form"
          onSubmit={submit}
          onFocus={start}
          onInvalid={(event) => {
            const details = (event.target as HTMLElement).closest("details");
            if (details) details.open = true;
          }}
          onChange={(event) => {
            const control: EventTarget = event.target;
            if (
              control instanceof HTMLInputElement ||
              control instanceof HTMLTextAreaElement
            )
              control.setCustomValidity("");
            start();
            setMessage("");
            setFeedback("");
          }}
        >
          <p className="small muted">
            Tres datos para empezar. Los campos marcados con * son obligatorios.
          </p>
          {interest && <p className="contact-interest">Tema: {interest}</p>}
          <div className="form-grid">
            <label>
              {c.contact.fields.name} *
              <input
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                placeholder={c.contact.placeholders.name}
              />
            </label>
            <label>
              {c.contact.fields.business} *
              <input
                name="business"
                autoComplete="organization"
                required
                maxLength={150}
                placeholder={c.contact.placeholders.business}
              />
            </label>
            <label className="full">
              {c.contact.fields.problem} *
              <textarea
                name="problem"
                required
                rows={4}
                maxLength={1200}
                placeholder="¿Qué sucede hoy y qué te gustaría mejorar?"
              />
            </label>
            <label className="full">
              {c.contact.fields.channel}
              <select
                name="channel"
                value={channel}
                onChange={(event) => setChannel(event.target.value as Channel)}
              >
                {c.contact.channels.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <details className="contact-extra">
            <summary>Añadir contexto (opcional)</summary>
            <div className="form-grid">
              <label>
                {c.contact.fields.sector}
                <select name="sector" defaultValue="">
                  <option value="">{c.contact.choose}</option>
                  {c.contact.sectors.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label>
                {c.contact.fields.city}
                <input
                  name="city"
                  autoComplete="address-level2"
                  maxLength={100}
                  placeholder={c.contact.placeholders.city}
                />
              </label>
              <label className="full">
                {c.contact.fields.offer}
                <input
                  name="offer"
                  maxLength={250}
                  placeholder={c.contact.placeholders.offer}
                />
              </label>
              <label className="full">
                {c.contact.fields.goal}
                <input
                  name="goal"
                  maxLength={250}
                  placeholder={c.contact.placeholders.goal}
                />
              </label>
              <label className="full">
                {c.contact.fields.currentChannels}
                <input
                  name="currentChannels"
                  maxLength={250}
                  placeholder={c.contact.placeholders.currentChannels}
                />
              </label>
              <label>
                {c.contact.fields.website}
                <input
                  name="website"
                  type="url"
                  maxLength={300}
                  placeholder={c.contact.placeholders.website}
                />
              </label>
              <label>
                {c.contact.fields.social}
                <input
                  name="social"
                  type="url"
                  maxLength={300}
                  placeholder={c.contact.placeholders.social}
                />
              </label>
              <label className="full">
                {c.contact.fields.budget}
                <select name="budget" defaultValue="">
                  <option value="">{c.contact.choose}</option>
                  {c.contact.budgets.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
          </details>
          <p className="privacy">{c.contact.privacy}</p>
          <button className="button" type="submit">
            {c.contact.submit} <span aria-hidden="true">↗</span>
          </button>
          {message && (
            <div className="message-result" ref={resultRef} tabIndex={-1}>
              <h3>{c.contact.prepared}</h3>
              <label>
                {c.contact.preview}
                <textarea readOnly value={message} rows={8} />
              </label>
              <p className="small muted">
                Todavía no se ha enviado. Abre tu canal, revisa el mensaje y
                completa el envío allí.
              </p>
              <div className="result-actions">
                <button
                  type="button"
                  className="button button-light"
                  onClick={copy}
                >
                  {c.contact.copy}
                </button>
                {readyUrl && (
                  <a
                    className="button"
                    href={readyUrl}
                    target={channel === "Correo" ? undefined : "_blank"}
                    rel="noreferrer"
                    onClick={openPrepared}
                  >
                    {channel === "WhatsApp"
                      ? "Abrir WhatsApp con mi mensaje"
                      : channel === "Correo"
                        ? c.contact.mail
                        : c.contact.messengerSend}{" "}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
              {channel === "Messenger" && (
                <p className="small">{c.contact.messengerNote}</p>
              )}
              <p role="status" className="small">
                {feedback}
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
