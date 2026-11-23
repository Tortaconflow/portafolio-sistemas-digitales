import { COMMUNITY_PAGE, COMMUNITY_ROUTES, guidesForRoute } from "./comunidad.ts";
import {
  ACCOUNT_LABELS,
  COMMUNITY_INSTITUTIONS,
  LANGUAGE_LABELS,
  LEVEL_LABELS,
  formatCheckedOn,
  pendingResources,
  verifiedResourcesForRoute,
  type VerifiedCommunityResource,
} from "./comunidad-recursos.ts";
import { SiteFooter, SiteHeader } from "./KnowledgePage.tsx";

/** Recurso externo ya verificado. El enlace sale en otra pestaña, sin referrer ni acceso a esta página. */
function ResourceCard({ resource }: { resource: VerifiedCommunityResource }) {
  const institution = COMMUNITY_INSTITUTIONS[resource.institutionId].name;
  return (
    <article className="community-resource" data-community-resource={resource.id}>
      <p className="mono">
        {institution} · {resource.topic}
      </p>
      <h4>{resource.title}</h4>
      <dl>
        <div>
          <dt>Qué aprenderás en este recurso</dt>
          <dd>{resource.learn}</dd>
        </div>
        <div>
          <dt>Nivel recomendado</dt>
          <dd>{LEVEL_LABELS[resource.level]}</dd>
        </div>
        <div>
          <dt>Idioma disponible</dt>
          <dd>{resource.languages.map((language) => LANGUAGE_LABELS[language]).join(", ")}</dd>
        </div>
        <div>
          <dt>Gratuidad</dt>
          <dd>
            {resource.free.conditions}
            {resource.free.paidExtras ? ` ${resource.free.paidExtras}` : ""}
          </dd>
        </div>
        <div>
          <dt>Cuenta</dt>
          <dd>{ACCOUNT_LABELS[resource.free.account]}</dd>
        </div>
        <div>
          <dt>Actividad después del curso</dt>
          <dd>{resource.activity}</dd>
        </div>
        <div>
          <dt>Verificación</dt>
          <dd>
            Revisado el{" "}
            <time dateTime={resource.verification.checkedOn}>
              {formatCheckedOn(resource.verification.checkedOn)}
            </time>
            . {resource.verification.method}
          </dd>
        </div>
      </dl>
      <a className="inline-link" href={resource.url} target="_blank" rel="noopener noreferrer">
        Abrir en {institution} (pestaña nueva) <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

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
          const resources = verifiedResourcesForRoute(route.id);
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
              {resources.length > 0 && (
                <section className="community-resources" aria-labelledby={`${route.id}-recursos`}>
                  <h3 id={`${route.id}-recursos`}>Para profundizar: cursos gratuitos de otras instituciones</h3>
                  <p>
                    Son recursos de terceros que ya revisamos. Su contenido y condiciones los
                    define cada institución y pueden cambiar.
                  </p>
                  <ul className="community-resource-list">
                    {resources.map((resource) => (
                      <li key={resource.id}>
                        <ResourceCard resource={resource} />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </section>
          );
        })}
        {pendingResources().length > 0 && (
          <section className="community-pending" aria-labelledby="recursos-pendientes">
            <h2 id="recursos-pendientes">Recursos en verificación</h2>
            <p>
              Son instituciones que queremos revisar para esta biblioteca. Todavía no elegimos ni
              verificamos un curso concreto de ellas, así que no las recomendamos ni las enlazamos.
            </p>
            <dl className="community-facts">
              {pendingResources().map((resource) => (
                <div key={resource.id}>
                  <dt>{COMMUNITY_INSTITUTIONS[resource.institutionId].name}</dt>
                  <dd>
                    Ruta prevista:{" "}
                    {COMMUNITY_ROUTES.find((route) => route.id === resource.routeId)?.title}. Tema
                    que se quiere revisar: {resource.topic}. Falta: {resource.pending}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
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
            las enlaza al final. Los cursos de otras instituciones son de
            terceros: su contenido, disponibilidad, idioma y condiciones pueden
            cambiar, así que revisa la fecha de verificación y confirma las
            condiciones en su página oficial.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
