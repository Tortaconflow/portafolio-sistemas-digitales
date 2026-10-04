import { content as c, type Project } from "./content.ts";
import { track } from "./analytics.ts";
const Arrow = () => <span aria-hidden="true">↗</span>;
export function HomeHero({
  onInterest,
  onSelectProject,
}: {
  onInterest: (text: string) => void;
  onSelectProject: (project: Project, index: number) => void;
}) {
  return (
    <section id="inicio" className="hero container">
      <div className="hero-top">
        <p className="eyebrow">
          <span className="live-dot" />
          {c.brand.fullName}
        </p>
        <span className="hero-coordinate" aria-hidden="true">
          OAX. / MX
        </span>
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-signature">{c.hero.signature}</p>
          <p className="hero-descriptor-tag">{c.hero.descriptor}</p>
          <h1>
            {c.hero.headline} <br />
            <strong>{c.hero.headlineAccent}</strong>
          </h1>
          <p className="hero-discipline">{c.hero.discipline}</p>
          <p className="hero-description">{c.hero.body}</p>
          <div className="hero-actions">
            <a
              className="button"
              href="#contacto"
              onClick={() => {
                onInterest(c.hero.primary);
                track("hero_cta_click", { target: "contacto" });
              }}
            >
              {c.hero.primary}
              <Arrow />
            </a>
            <a
              className="inline-link"
              href="#casos"
              onClick={() => track("hero_cta_click", { target: "casos" })}
            >
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
          <a
            className="stage-caption surface-glass surface-glass--medium"
            href="#paraiso-laguna"
          >
            <span>
              <small>
                {c.hero.featured} · {c.hero.caseLabel}
              </small>
              <strong>{c.projects[0].title}</strong>
            </span>
            <span className="stage-caption-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <span className="stage-note">{c.hero.visualNote}</span>
        </aside>
      </div>
      <div className="hero-index surface-glass surface-glass--subtle">
        <div>
          <span className="eyebrow">{c.hero.indexLabel}</span>
          <p>{c.hero.indexNote}</p>
        </div>
        <div className="index-cases">
          {c.projects.slice(0, 3).map((p, i) => (
            <button key={p.id} onClick={() => onSelectProject(p, i)}>
              <span className="mono">0{i + 1}</span>
              <span className="index-case-title">
                <strong>{p.title}</strong>
                {p.heroBrief && <small>{p.heroBrief}</small>}
              </span>
              <Arrow />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
