import { useState } from "react";
import { EDUCATION_ARTICLES, type EducationArticle } from "./education";
import { track } from "./analytics";

interface EducationSectionProps {
  onGoToDiagnostic?: () => void;
  onSelectTopic?: (topicTitle: string) => void;
}

export function EducationSection({ onGoToDiagnostic, onSelectTopic }: EducationSectionProps) {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("Todas");

  const categories = ["Todas", "Presencia", "Conversión", "Operación"];

  const filteredArticles = EDUCATION_ARTICLES.filter(
    (art) => filterCategory === "Todas" || art.category === filterCategory
  );

  const activeArticle = EDUCATION_ARTICLES.find((a) => a.id === activeArticleId);

  const handleArticleToggle = (id: string) => {
    const isOpening = activeArticleId !== id;
    setActiveArticleId(isOpening ? id : null);
    if (isOpening) {
      const art = EDUCATION_ARTICLES.find((a) => a.id === id);
      if (art) {
        track("education_view", {
          article_id: art.slug,
          category: art.category.toLowerCase() as "presencia" | "conversion" | "operacion",
        });
      }
    }
  };

  return (
    <section id="aprende" className="section container education-section" aria-labelledby="education-title">
      <div className="education-header">
        <p className="eyebrow">CONOCIMIENTO ANTES DE CONTRATAR</p>
        <h2 id="education-title">Aprende antes de decidir.</h2>
        <p className="section-description">
          Explicaciones claras y criterios prácticos sobre herramientas digitales para que sepas qué necesitas revisar y evites gastos innecesarios, incluso si nunca trabajas con nosotros.
        </p>

        <div className="gallery-filters" role="group" aria-label="Filtrar temas educativos">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={filterCategory === cat}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="education-list">
        {filteredArticles.map((article) => {
          const isOpen = activeArticleId === article.id;
          return (
            <article
              key={article.id}
              className={`education-card surface-glass surface-glass--medium ${isOpen ? "is-expanded" : ""}`}
            >
              <div className="education-card-top">
                <div className="education-card-meta">
                  <span className="eyebrow">{article.category}</span>
                  <span className="mono">{article.readTime}</span>
                </div>
                <h3>{article.title}</h3>
                <p className="education-card-tagline">{article.tagline}</p>
                <button
                  type="button"
                  className="button button-light education-toggle-btn"
                  onClick={() => handleArticleToggle(article.id)}
                  aria-expanded={isOpen}
                  aria-controls={`article-content-${article.id}`}
                >
                  {isOpen ? "Cerrar guía de consulta" : "Leer guía completa"}
                  <span aria-hidden="true">{isOpen ? "↑" : "↓"}</span>
                </button>
              </div>

              {isOpen && (
                <div id={`article-content-${article.id}`} className="education-card-expanded">
                  <div className="education-block">
                    <h4>¿De qué se trata?</h4>
                    <p>{article.concept}</p>
                  </div>

                  <div className="education-block">
                    <h4>¿Por qué es importante?</h4>
                    <p>{article.whyItMatters}</p>
                  </div>

                  <div className="education-block highlight-box">
                    <h4>Ejemplo práctico</h4>
                    <p>{article.practicalExample}</p>
                  </div>

                  <div className="education-block">
                    <h4>Puntos concretos que puedes revisar hoy</h4>
                    <ul className="checklist">
                      {article.whatToCheck.map((check, idx) => (
                        <li key={idx}>{check}</li>
                      ))}
                    </ul>
                  </div>

                  {article.frequentMistakes.length > 0 && (
                    <div className="education-block">
                      <h4>Errores frecuentes a evitar</h4>
                      <ul className="plain-list mistake-list">
                        {article.frequentMistakes.map((mistake, idx) => (
                          <li key={idx}>
                            <span aria-hidden="true" className="warning-dot">✕</span>
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="education-block tool-box">
                    <h4>Herramienta o recurso recomendado</h4>
                    <p>
                      <strong>{article.toolOrResource.name}: </strong>
                      {article.toolOrResource.description}
                    </p>
                    {article.toolOrResource.officialUrl && (
                      <a
                        href={article.toolOrResource.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-link"
                      >
                        Consultar recurso oficial <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>

                  <div className="education-block next-step-box">
                    <h4>Siguiente paso sugerido</h4>
                    <p>{article.suggestedStep}</p>
                  </div>

                  <div className="education-sources">
                    <h5>Fuentes y documentación de referencia:</h5>
                    <ul>
                      {article.sources.map((src, i) => (
                        <li key={i}>
                          <span className="mono">[{src.type.toUpperCase()}]</span>{" "}
                          {src.url ? (
                            <a href={src.url} target="_blank" rel="noreferrer">
                              {src.title} ({src.organization}) ↗
                            </a>
                          ) : (
                            <span>{src.title} ({src.organization})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="education-footer-cta">
                    <p>¿Tienes dudas sobre cómo aplica esto en tu caso particular?</p>
                    <div className="education-cta-actions">
                      {onGoToDiagnostic && (
                        <button
                          type="button"
                          className="button button-light"
                          onClick={() => {
                            track("education_cta", { article_id: article.slug, target: "diagnostico" });
                            onGoToDiagnostic();
                          }}
                        >
                          Hacer diagnóstico de mi negocio <span aria-hidden="true">↗</span>
                        </button>
                      )}
                      <a
                        href="#contacto"
                        className="button"
                        onClick={() => {
                          track("education_cta", { article_id: article.slug, target: "contacto" });
                          if (onSelectTopic) onSelectTopic(article.title);
                        }}
                      >
                        Revisar este tema con Reily <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
