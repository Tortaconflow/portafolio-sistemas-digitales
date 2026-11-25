import { content as c } from "./content.ts";
import { track } from "./analytics.ts";
const Arrow = () => <span aria-hidden="true">↗</span>;
export function HomeHero() {
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
          <p className="hero-description">{c.hero.body}</p>
          <div className="hero-actions">
            <a
              className="button"
              href="/comunidad/"
              onClick={() => track("hero_cta_click", { target: "comunidad" })}
            >
              {c.hero.primary}
              <Arrow />
            </a>
            <a
              className="button button-light"
              href="/asesor-ia/"
              onClick={() => track("hero_cta_click", { target: "asesor" })}
            >
              {c.hero.ai}
              <Arrow />
            </a>
            <a
              className="inline-link"
              href="#servicios"
              onClick={() => track("hero_cta_click", { target: "servicios" })}
            >
              {c.hero.secondary}
              <Arrow />
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
    </section>
  );
}
