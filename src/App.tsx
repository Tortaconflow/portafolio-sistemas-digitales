import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  content as c,
  isEmail,
  isWebUrl,
  releaseIssues,
  type Project,
} from "./content";

const Arrow = () => <span aria-hidden="true">↗</span>;
function ButtonLink({
  children,
  href = "#contacto",
  secondary = false,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  secondary?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      className={`button ${secondary ? "button-light" : ""}`}
      href={href}
      onClick={onClick}
      target={isWebUrl(href) ? "_blank" : undefined}
      rel={isWebUrl(href) ? "noreferrer" : undefined}
    >
      {children}
      <Arrow />
    </a>
  );
}
function Heading({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      {body && <p className="section-description">{body}</p>}
    </div>
  );
}
function ProjectImage({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  return project.image ? (
    <div className="project-image">
      <img
        src={project.image}
        alt={project.imageAlt}
        width="1200"
        height="750"
        loading="lazy"
        decoding="async"
      />
    </div>
  ) : (
    <div className={`project-art ${project.tone} ${compact ? "compact" : ""}`}>
      <span className="art-index" aria-hidden="true">
        {String(c.projects.indexOf(project) + 1).padStart(2, "0")} /{" "}
        {project.sector}
      </span>
      <span className="art-title">{project.title}</span>
      <span className="art-caption">
        <span aria-hidden="true">◌</span> {c.ui.imagePending}
      </span>
    </div>
  );
}
function CaseDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (project) {
      ref.current?.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
        ref.current?.close();
      };
    }
  }, [project]);
  return (
    <dialog
      ref={ref}
      aria-label={project?.title}
      className="case-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {project && (
        <>
          <div className="dialog-top">
            <span className="eyebrow">{project.sector}</span>
            <button className="text-button" onClick={onClose} autoFocus>
              {c.ui.close} <span aria-hidden="true">×</span>
            </button>
          </div>
          <h2>{project.title}</h2>
          <p className="status">
            <span />
            {project.status}
          </p>
          {isWebUrl(project.url) && (
            <ButtonLink href={project.url}>{c.ui.visit}</ButtonLink>
          )}
          <ProjectImage project={project} compact />
          {!project.image && <p className="small muted">{c.ui.imageNote}</p>}
          {project.gallery?.length ? (
            <section
              className="case-gallery"
              aria-labelledby="case-gallery-title"
            >
              <div className="case-gallery-heading">
                <div>
                  <h3 id="case-gallery-title">{c.ui.gallery}</h3>
                  <p>{c.ui.galleryNote}</p>
                </div>
                <span className="mono">{project.gallery.length} / MASTERS</span>
              </div>
              <div className="case-gallery-grid">
                {project.gallery.map((item, index) => (
                  <figure key={item.src}>
                    <a
                      href={item.src}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${c.ui.openImage}: ${item.alt}`}
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        width="900"
                        height="1260"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                    <figcaption>
                      <span className="mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.category}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ) : null}
          <h3>{c.ui.problem}</h3>
          <p>{project.problem}</p>
          <h3>{c.ui.system}</h3>
          <p>{project.solution}</p>
          <h3>{c.ui.components}</h3>
          <ul className="checklist">
            {project.components.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}
    </dialog>
  );
}
function Contact({ interest }: { interest: string }) {
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("Correo");
  const [feedback, setFeedback] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  const emailReady = isEmail(c.links.email),
    messengerReady = isWebUrl(c.links.messenger);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const fields = c.contact.fields;
    setMessage(
      `${c.contact.subject}\n${interest ? `${c.contact.interest}: ${interest}\n` : ""}\n${Object.entries(
        fields,
      )
        .map(([key, label]) => `${label}: ${data.get(key) || "—"}`)
        .join("\n")}`,
    );
    setFeedback("");
    window.setTimeout(() => resultRef.current?.focus(), 0);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setFeedback(c.contact.copied);
    } catch {
      setFeedback(c.contact.copyError);
    }
  }
  return (
    <section id="contacto" className="contact-section section">
      <div className="container contact-grid">
        <div>
          <Heading
            label={c.contact.label}
            title={c.contact.title}
            body={c.contact.body}
          />
          <div className="contact-direct">
            <p className="eyebrow">{c.contact.direct}</p>
            {messengerReady && (
              <a href={c.links.messenger}>
                {c.contact.messenger} <Arrow />
              </a>
            )}
            {emailReady && (
              <a href={`mailto:${c.links.email}`}>
                {c.contact.email} <Arrow />
              </a>
            )}
            {isWebUrl(c.links.whatsapp) && (
              <a href={c.links.whatsapp}>
                {c.contact.whatsapp} <Arrow />
              </a>
            )}
            {!emailReady && !messengerReady && (
              <p className="small">{c.contact.missing}</p>
            )}
          </div>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <div className="form-grid">
            <label>
              {c.contact.fields.name}
              <input
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                placeholder={c.contact.placeholders.name}
              />
            </label>
            <label>
              {c.contact.fields.business}
              <input
                name="business"
                autoComplete="organization"
                required
                maxLength={150}
                placeholder={c.contact.placeholders.business}
              />
            </label>
            <label>
              {c.contact.fields.sector}
              <select name="sector" required defaultValue="">
                <option value="" disabled>
                  {c.contact.choose}
                </option>
                {c.contact.sectors.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              {c.contact.fields.city}
              <input
                name="city"
                autoComplete="address-level2"
                required
                maxLength={100}
                placeholder={c.contact.placeholders.city}
              />
            </label>
            <label className="full">
              {c.contact.fields.problem}
              <textarea
                name="problem"
                required
                rows={4}
                maxLength={1500}
                placeholder={c.contact.placeholders.problem}
              />
            </label>
            <label>
              {c.contact.fields.channel}
              <select
                name="channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
              >
                {c.contact.channels.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              {c.contact.fields.budget}
              <select name="budget" required defaultValue="">
                <option value="" disabled>
                  {c.contact.choose}
                </option>
                {c.contact.budgets.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="privacy">{c.contact.privacy}</p>
          <button className="button" type="submit">
            {c.contact.submit}
            <Arrow />
          </button>
          {message && (
            <div className="message-result" ref={resultRef} tabIndex={-1}>
              <h3>{c.contact.prepared}</h3>
              <label>
                {c.contact.preview}
                <textarea readOnly value={message} rows={10} />
              </label>
              <div className="result-actions">
                <button
                  type="button"
                  className="button button-light"
                  onClick={copy}
                >
                  {c.contact.copy}
                </button>
                {channel === "Correo" && emailReady && (
                  <a
                    className="button"
                    href={`mailto:${c.links.email}?subject=${encodeURIComponent(c.contact.subject)}&body=${encodeURIComponent(message)}`}
                  >
                    {c.contact.mail}
                    <Arrow />
                  </a>
                )}
                {channel === "Messenger" && messengerReady && (
                  <a
                    className="button"
                    href={c.links.messenger}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.contact.messengerSend}
                    <Arrow />
                  </a>
                )}
              </div>
              {channel === "Messenger" && messengerReady && (
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
export function App() {
  const [menu, setMenu] = useState(false),
    [project, setProject] = useState<Project | null>(null),
    [planIndex, setPlanIndex] = useState(0),
    [interest, setInterest] = useState("");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const plan = c.pricing.plans[planIndex];
  const pending = releaseIssues();
  useEffect(() => {
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") setMenu(false);
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        {c.ui.skip}
      </a>
      <header className="site-header">
        <div className="container nav-row">
          <a
            className="brand"
            href="#inicio"
            aria-label={`${c.owner.name} · ${c.owner.role} · ${c.ui.backTop}`}
          >
            <span className="brand-mark" aria-hidden="true">
              RC
            </span>
            <span>
              {c.owner.name}
              <small>{c.owner.role}</small>
            </span>
          </a>
          <button
            className="menu-toggle text-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-controls="navigation"
          >
            {menu ? c.ui.closeMenu : c.ui.menu}
            <span aria-hidden="true">{menu ? "×" : "+"}</span>
          </button>
          <nav
            id="navigation"
            className={menu ? "open" : ""}
            aria-label="Principal"
          >
            {c.nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setMenu(false)}>
                {n.label}
              </a>
            ))}
          </nav>
          <a
            className="nav-cta"
            href="#contacto"
            onClick={() => {
              setInterest(c.ui.diagnosis);
              setMenu(false);
            }}
          >
            {c.ui.diagnosis}
            <Arrow />
          </a>
        </div>
      </header>
      <main id="main">
        <section id="inicio" className="hero container">
          <div className="hero-top">
            <p className="eyebrow">
              <span className="live-dot" />
              {c.hero.eyebrow}
            </p>
            <span className="hero-coordinate" aria-hidden="true">
              OAX. / MX
            </span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-signature">{c.hero.signature}</p>
              <h1>
                {c.hero.headline}
                <br />
                <strong>{c.hero.headlineAccent}</strong>
              </h1>
              <p className="hero-discipline">{c.hero.discipline}</p>
              <p className="hero-description">{c.hero.body}</p>
              <div className="hero-actions">
                <ButtonLink>{c.hero.primary}</ButtonLink>
                <a className="inline-link" href="#casos">
                  {c.hero.secondary}
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
              <p className="hero-note">
                <span aria-hidden="true">↳</span> {c.hero.note}
              </p>
            </div>
            <aside className="visual-stage" aria-label={c.hero.visualLabel}>
              <div className="glass-ribbon" aria-hidden="true" />
              <span className="stage-star" aria-hidden="true">
                ✧
              </span>
              <div className="artwork-stack">
                {[
                  c.projects[0].gallery![9],
                  c.projects[0].gallery![13],
                  c.projects[0].gallery![0],
                ].map((item, i) => (
                  <div className={`artwork-sheet sheet-${i}`} key={item.src}>
                    <img
                      src={item.preview || item.src}
                      alt={item.alt}
                      width="900"
                      height="1125"
                      fetchPriority={i === 1 ? "high" : "auto"}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
              <a className="stage-caption" href="#casos">
                <span>
                  <small>{c.hero.featured}</small>
                  <strong>{c.projects[0].title}</strong>
                </span>
                <span className="stage-caption-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <span className="stage-note">{c.hero.visualNote}</span>
            </aside>
          </div>
          <div className="hero-index">
            <div>
              <span className="eyebrow">{c.hero.indexLabel}</span>
              <p>{c.hero.indexNote}</p>
            </div>
            <div className="index-cases">
              {c.projects.slice(0, 3).map((p, i) => (
                <button key={p.id} onClick={() => setProject(p)}>
                  <span className="mono">0{i + 1}</span>
                  {p.title}
                  <Arrow />
                </button>
              ))}
            </div>
          </div>
        </section>
        <div className="capabilities">
          <div className="container">
            {c.capabilities.map((x) => (
              <span key={x}>
                {x}
                <span aria-hidden="true">✳</span>
              </span>
            ))}
          </div>
        </div>
        <section className="section container problem-section">
          <p className="eyebrow">{c.problem.label}</p>
          <div className="two-col">
            <h2>
              {c.problem.title}
              <span className="muted"> {c.problem.emphasis}</span>
            </h2>
            <div>
              <p>{c.problem.body}</p>
              <p>{c.problem.end}</p>
              <ul className="plain-list">
                {c.problem.pieces.map((x, i) => (
                  <li key={x}>
                    <span className="mono">0{i + 1}</span>
                    {x}
                    <Arrow />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section id="casos" className="section cases-section">
          <div className="container">
            <Heading
              label={c.cases.label}
              title={c.cases.title}
              body={c.cases.body}
            />
            <div className="project-grid">
              {c.projects.map((p, i) => (
                <article className="project-card" key={p.id}>
                  <ProjectImage project={p} />
                  <div className="project-info">
                    <div className="project-meta">
                      <span className="eyebrow">{p.sector}</span>
                      <span className="mono">0{i + 1}</span>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.tagline}</p>
                    <div className="project-bottom">
                      <span className="status">
                        <span />
                        {p.status}
                      </span>
                      <button
                        className="text-button"
                        onClick={() => setProject(p)}
                        aria-label={`${c.ui.case}: ${p.title}`}
                      >
                        {c.ui.case}
                        <Arrow />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="small muted case-footnote">{c.cases.footnote}</p>
          </div>
        </section>
        <section id="servicios" className="section container">
          <Heading label={c.services.label} title={c.services.title} />
          <div className="service-grid">
            {c.services.items.map((s, i) => (
              <article className="service-card" key={s.title}>
                <div className="service-top">
                  <span aria-hidden="true">{s.icon}</span>
                  <span className="mono">0{i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="eyebrow">{s.tags}</span>
              </article>
            ))}
          </div>
        </section>
        <section id="proceso" className="section process-section">
          <div className="container">
            <div className="process-header">
              <Heading label={c.process.label} title={c.process.title} />
              <p>{c.process.body}</p>
            </div>
            <div className="process-grid">
              {c.process.items.map((s, i) => (
                <article key={s.title}>
                  <div className="process-number">
                    <span className="mono">0{i + 1}</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="precios" className="section container pricing-section">
          <Heading
            label={c.pricing.label}
            title={c.pricing.title}
            body={c.pricing.body}
          />
          <div
            className="pricing-tabs"
            role="tablist"
            aria-label={c.pricing.tabsLabel}
          >
            {c.pricing.plans.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                id={`tab-${p.id}`}
                aria-selected={i === planIndex}
                aria-controls="price-panel"
                tabIndex={i === planIndex ? 0 : -1}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                onClick={() => setPlanIndex(i)}
                onKeyDown={(e) => {
                  const next =
                    e.key === "ArrowRight"
                      ? (i + 1) % 3
                      : e.key === "ArrowLeft"
                        ? (i + 2) % 3
                        : e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? 2
                            : null;
                  if (next !== null) {
                    e.preventDefault();
                    setPlanIndex(next);
                    tabs.current[next]?.focus();
                  }
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div
            className="price-panel"
            id="price-panel"
            role="tabpanel"
            aria-labelledby={`tab-${plan.id}`}
            tabIndex={0}
          >
            <div className="price-summary">
              <span className="eyebrow">{plan.name}</span>
              <div className="price">
                {plan.price > 0 && (
                  <span className="price-from">{c.pricing.from}</span>
                )}
                <strong>${plan.price.toLocaleString("es-MX")}</strong>
                <span>{c.pricing.currency}</span>
              </div>
              <h3>{plan.subtitle}</h3>
              <p>{plan.description}</p>
              <ButtonLink onClick={() => setInterest(plan.name)}>
                {plan.cta}
              </ButtonLink>
            </div>
            <div className="price-details">
              <p className="eyebrow">{c.pricing.includes}</p>
              <ul className="checklist">
                {plan.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="small muted">{plan.note}</p>
            </div>
          </div>
          <div className="pricing-notes">
            <strong>{c.pricing.advance}</strong>
            <p>{c.pricing.extra}</p>
          </div>
          <div className="custom-project">
            <div>
              <h3>{c.ui.custom}</h3>
              <p>{c.ui.customBody}</p>
            </div>
            <a
              href="#contacto"
              className="inline-link"
              onClick={() => setInterest("A medida")}
            >
              {c.ui.customCta}
              <Arrow />
            </a>
          </div>
        </section>
        <section id="sobre-mi" className="section about-section">
          <div className="container about-grid">
            <div className="about-art">
              <span className="eyebrow">{c.owner.location}</span>
              <div className="editorial-symbol" aria-hidden="true">
                RC<span>✧</span>
              </div>
              <p>{c.about.stamp}</p>
              <span className="mono">{c.about.location}</span>
            </div>
            <div>
              <Heading label={c.about.label} title={c.about.title} />
              <h3>{c.about.emphasis}</h3>
              <p>{c.about.body.replace("[NOMBRE]", c.owner.shortName)}</p>
              <ul className="plain-list">
                {c.about.principles.map((x) => (
                  <li key={x}>
                    <span aria-hidden="true">↗</span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="section container faq-section">
          <Heading label={c.faq.label} title={c.faq.title} />
          <div>
            {c.faq.items.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <Contact interest={interest} />
        {pending.length > 0 && (
          <aside className="container pending-section">
            <details>
              <summary>
                {c.ui.draft}
                <span aria-hidden="true">+</span>
              </summary>
              <h2>{c.ui.pending}</h2>
              <p>{c.ui.pendingNote}</p>
              <ul>
                {c.ui.pendingItems.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <div className="pending-markers">
                <code>{c.owner.name}</code>
                <code>{c.links.email}</code>
                <code>{c.links.messenger}</code>
                <code>{c.links.whatsapp}</code>
                <code>{c.links.domain}</code>
              </div>
            </details>
          </aside>
        )}
      </main>
      <footer className="container">
        <div>
          <a href="#inicio" className="footer-name">
            {c.owner.name}
          </a>
          <p>{c.footer.tagline}</p>
        </div>
        <div className="footer-links">
          {(["facebook", "instagram", "github"] as const)
            .filter((k) => isWebUrl(c.links[k]))
            .map((k) => (
              <a key={k} href={c.links[k]}>
                {k === "github" ? "GitHub" : k[0].toUpperCase() + k.slice(1)}
                <Arrow />
              </a>
            ))}
          <a href="#contacto">
            {c.nav.at(-1)?.label}
            <Arrow />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} · {c.footer.rights}
          </span>
          <span>{c.footer.note}</span>
          <a href="#inicio" aria-label={c.ui.backTop}>
            ↑
          </a>
        </div>
      </footer>
      <CaseDialog project={project} onClose={() => setProject(null)} />
    </>
  );
}
