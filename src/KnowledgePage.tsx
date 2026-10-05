import { content as c } from "./content.ts";
import { EDUCATION_ARTICLES, type EducationArticle } from "./education.ts";
import { HomeHero } from "./HomeHero.tsx";
import { HomeJourney } from "./HomeJourney.tsx";

export function StaticHome() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <HomeHero onInterest={() => {}} onSelectProject={() => {}} />
        <HomeJourney onInterest={() => {}} />
      </main>
      <SiteFooter />
    </>
  );
}

function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main">
        Ir al contenido
      </a>
      <header className="editorial-header">
        <div className="container">
          <a
            className="brand"
            href="/#inicio"
            aria-label="Cídiks · Reily Castro · Inicio"
          >
            <img src={c.brand.symbol} width="40" height="40" alt="" />
            <span>
              <img
                className="cidiks-wordmark"
                src={c.brand.wordmark}
                width="96"
                height="40"
                alt="Cídiks"
              />
              <small>Reily Castro</small>
            </span>
          </a>
          <nav aria-label="Principal">
            <a href="/#casos">Proyectos</a>
            <a href="/#proceso">Método</a>
            <a href="/conocimiento/">Conocimiento</a>
            <a href="/#contacto">
              Quiero un diagnóstico <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
function SiteFooter() {
  return (
    <footer className="editorial-footer container">
      <a href="/#inicio">Cídiks · Reily Castro</a>
      <p>Comprender la raíz. Construir con sentido. · Oaxaca, México</p>
      <a href="/#contacto">Cuéntame qué quieres resolver ↗</a>
    </footer>
  );
}
export function KnowledgePage({ article }: { article?: EducationArticle }) {
  const categories = [...new Set(EDUCATION_ARTICLES.map((a) => a.category))];
  const related = EDUCATION_ARTICLES.filter((a) => a.id !== article?.id).slice(
    0,
    3,
  );
  return (
    <>
      <SiteHeader />
      <main id="main" className="container editorial-main">
        <nav aria-label="Ruta de navegación" className="editorial-breadcrumb">
          <a href="/">Inicio</a>
          <span aria-hidden="true">/</span>
          {article ? (
            <>
              <a href="/conocimiento/">Conocimiento</a>
              <span aria-hidden="true">/</span>
              <span>{article.category}</span>
            </>
          ) : (
            <span>Conocimiento</span>
          )}
        </nav>
        {article ? (
          <article
            data-article-id={article.slug}
            data-category={article.category}
            className="editorial-article"
          >
            <header>
              <p className="eyebrow">
                {article.category} / {article.readTime}
              </p>
              <h1>{article.title}</h1>
              <p className="editorial-deck">{article.tagline}</p>
              <p className="small muted">Por Reily Castro · CÍDIKS</p>
            </header>
            <div className="editorial-body">
              <section>
                <h2>De qué se trata</h2>
                <p>{article.concept}</p>
              </section>
              <section>
                <h2>Por qué importa</h2>
                <p>{article.whyItMatters}</p>
              </section>
              <section className="editorial-example">
                <h2>Un ejemplo para entenderlo</h2>
                <p>{article.practicalExample}</p>
              </section>
              <section>
                <h2>Qué puedes revisar hoy</h2>
                <ul className="checklist">
                  {article.whatToCheck.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h2>Errores que conviene evitar</h2>
                <ul>
                  {article.frequentMistakes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h2>Un recurso para empezar</h2>
                <h3>{article.toolOrResource.name}</h3>
                <p>{article.toolOrResource.description}</p>
                {article.toolOrResource.officialUrl && (
                  <a
                    href={article.toolOrResource.officialUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Consultar {article.toolOrResource.name} ↗
                  </a>
                )}
              </section>
              <section className="editorial-next">
                <h2>Tu siguiente paso</h2>
                <p>{article.suggestedStep}</p>
                <a
                  className="button"
                  href="/#contacto"
                  data-contact-origin="education"
                >
                  Revisar este tema con Reily <span aria-hidden="true">↗</span>
                </a>
              </section>
              <section className="editorial-sources">
                <h2>Fuentes y alcance</h2>
                {article.sources.length ? (
                  <>
                    <ul>
                      {article.sources
                        .filter((s) => s.url)
                        .map((s) => (
                          <li key={s.url}>
                            <a href={s.url} target="_blank" rel="noreferrer">
                              {s.title}
                            </a>{" "}
                            · {s.organization}
                          </li>
                        ))}
                    </ul>
                    <p>
                      Las fuentes respaldan los conceptos señalados. Los
                      ejemplos y pasos sugeridos son criterios editoriales de
                      CÍDIKS, no resultados de clientes ni garantías de
                      rendimiento.
                    </p>
                  </>
                ) : (
                  <p>
                    Esta guía presenta criterios editoriales propios de CÍDIKS.
                    Los ejemplos se usan para explicar decisiones; no
                    constituyen resultados comerciales comprobados ni una
                    validación externa.
                  </p>
                )}
              </section>
            </div>
          </article>
        ) : (
          <>
            <header className="editorial-index-heading">
              <p className="eyebrow">CONOCIMIENTO CÍDIKS</p>
              <h1>Aprende antes de decidir.</h1>
              <p className="editorial-deck">
                Guías para comprender tu presencia digital, ordenar procesos y
                elegir el siguiente paso con criterio.
              </p>
            </header>
            <nav
              className="editorial-categories"
              aria-label="Categorías de conocimiento"
            >
              {categories.map((category) => (
                <a
                  key={category}
                  href={`#${category
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()}`}
                >
                  {category}
                </a>
              ))}
            </nav>
            {categories.map((category) => (
              <section
                className="editorial-category"
                key={category}
                id={category
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()}
              >
                <h2>{category}</h2>
                <div className="home-guide-grid">
                  {EDUCATION_ARTICLES.filter(
                    (a) => a.category === category,
                  ).map((a) => (
                    <a key={a.id} href={`/conocimiento/${a.slug}/`}>
                      <span className="mono">{a.readTime}</span>
                      <h3>{a.title}</h3>
                      <p>{a.tagline}</p>
                      <span className="inline-link">Leer guía ↗</span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
        {article && (
          <aside className="editorial-related" aria-label="Guías relacionadas">
            <h2>Sigue explorando</h2>
            <div className="home-guide-grid">
              {related.map((a) => (
                <a href={`/conocimiento/${a.slug}/`} key={a.id}>
                  <span className="eyebrow">{a.category}</span>
                  <h3>{a.title}</h3>
                  <span className="inline-link">Leer guía ↗</span>
                </a>
              ))}
            </div>
          </aside>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
