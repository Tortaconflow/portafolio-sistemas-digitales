import { COMMUNITY_PAGE, COMMUNITY_ROUTES, guidesForRoute } from "./comunidad.ts";
import { SiteFooter, SiteHeader } from "./KnowledgePage.tsx";

/**
 * /comunidad/: HTML estático generado en el build. No necesita JavaScript,
 * cuentas ni datos del visitante; todo es enlace y texto.
 */
export function ComunidadPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="container editorial-main community">
        <nav aria-label="Ruta de navegación" className="editorial-breadcrumb">
          <a href="/">Inicio</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{COMMUNITY_PAGE.name}</span>
        </nav>
        <header className="editorial-index-heading">
          <p className="eyebrow">{COMMUNITY_PAGE.name}</p>
          <h1>Aprende a mejorar tu negocio, un paso a la vez.</h1>
          <p className="editorial-deck">
            Tres rutas gratuitas para emprendedores. Cada una reúne guías que ya
            puedes leer, una actividad que haces tú y una forma de comprobar lo
            que aprendiste. No necesitas registrarte ni dejar tus datos.
          </p>
        </header>
        <nav className="editorial-categories" aria-label="Rutas de aprendizaje">
          {COMMUNITY_ROUTES.map((route, index) => (
            <a key={route.id} href={`#${route.id}`}>
              {index + 1}. {route.title}
            </a>
          ))}
        </nav>
        <section className="community-how" aria-labelledby="como-funciona">
          <h2 id="como-funciona">Cómo usar cada ruta</h2>
          <ol>
            <li>
              <strong>Lee</strong> las guías en el orden sugerido. Cada una
              dura unos minutos.
            </li>
            <li>
              <strong>Haz</strong> la actividad con tu propio negocio. Solo
              necesitas papel o una hoja de cálculo.
            </li>
            <li>
              <strong>Comprueba</strong> lo aprendido con el criterio de la
              ruta, de preferencia con otra persona.
            </li>
          </ol>
        </section>
        {COMMUNITY_ROUTES.map((route, index) => {
          const titleId = `${route.id}-titulo`;
          return (
            <section
              key={route.id}
              id={route.id}
              className="community-route"
              aria-labelledby={titleId}
              data-community-route={route.id}
            >
              <p className="eyebrow">
                Ruta {index + 1} de {COMMUNITY_ROUTES.length}
              </p>
              <h2 id={titleId}>{route.title}</h2>
              <dl className="community-facts">
                <div>
                  <dt>Para quién es</dt>
                  <dd>{route.audience}</dd>
                </div>
                <div>
                  <dt>Qué aprenderás</dt>
                  <dd>{route.learningGoal}</dd>
                </div>
              </dl>
              <h3>1. Lee estas guías</h3>
              <ol className="community-guides">
                {guidesForRoute(route).map((guide, guideIndex) => (
                  <li key={guide.slug}>
                    <a href={`/conocimiento/${guide.slug}/`}>
                      <span className="mono">
                        Guía {guideIndex + 1} · {guide.category} · {guide.readTime}
                      </span>
                      <h4>{guide.title}</h4>
                      <p>{guide.tagline}</p>
                      <span className="inline-link">
                        Leer guía <span aria-hidden="true">↗</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
              <div className="community-activity">
                <h3>2. Haz esta actividad: {route.activity.title}</h3>
                <p className="mono community-time">
                  Tiempo estimado: {route.activity.duration}
                </p>
                <ol>
                  {route.activity.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p>
                  <strong>Lo que conservas:</strong> {route.activity.evidence}
                </p>
              </div>
              <div className="community-check">
                <h3>3. Comprueba que aprendiste</h3>
                <p>{route.learningCriterion}</p>
              </div>
            </section>
          );
        })}
        <section className="community-next" aria-labelledby="despues">
          <h2 id="despues">Después de una ruta</h2>
          <p>
            Puedes repetir la actividad con otro producto o servicio, o seguir
            con otra ruta. Si prefieres que alguien revise tu caso contigo, la
            conversación es opcional y no necesitas haber terminado nada.
          </p>
          <p>
            <a className="button" href="/#contacto">
              Cuéntame qué quieres resolver <span aria-hidden="true">↗</span>
            </a>
          </p>
          <ul className="community-links">
            <li>
              <a className="inline-link" href="/conocimiento/">
                Ver todas las guías
              </a>
            </li>
            <li>
              <a className="inline-link" href="/asesor-ia/">
                Preparar un brief con el Asesor CÍDIKS
              </a>
            </li>
          </ul>
        </section>
        <section className="community-scope" aria-labelledby="alcance">
          <h2 id="alcance">Alcance de esta página</h2>
          <p>
            Las rutas, actividades y criterios son una propuesta editorial de
            CÍDIKS. No son resultados de clientes, una certificación ni una
            garantía de ventas. Cuando una guía se apoya en fuentes externas,
            las enlaza al final.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
