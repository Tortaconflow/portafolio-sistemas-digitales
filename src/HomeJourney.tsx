import { useState } from "react";
import { content as c, type Project } from "./content.ts";
import {
  HOME_ACCOUNT_LABELS,
  HOME_COMMUNITY_ROUTES,
  HOME_EXTERNAL_RESOURCES,
  HOME_RESOURCES_CHECKED_ON,
} from "./home-community.ts";
import { useSectionEvent } from "./section-events.ts";
import { track } from "./analytics.ts";

export function OriginSection({ detailed = false }: { detailed?: boolean }) {
  return (
    <section
      className="section container origin-section"
      aria-labelledby="origin-title"
    >
      <div>
        <p className="eyebrow">EL ORIGEN DE CÍDIKS</p>
        <h2 id="origin-title">Comprender desde la raíz.</h2>
      </div>
      <div>
        <p>
          El nombre parte de una investigación del fundador relacionada con la
          idea de <strong>raíz</strong> y el contexto tabasqueño. “Comprender
          desde la raíz antes de construir” es nuestra interpretación
          contemporánea de marca.
        </p>
        <p className="small muted">
          La frase expresa una forma de trabajar. No es una traducción literal
          indígena ni una afirmación sobre una herencia ancestral.
        </p>
        {detailed ? (
          <>
            <h3>Crear rápido, pero no construir a ciegas.</h3>
            <p>
              La IA me permitió producir con rapidez. Los problemas técnicos de
              uno de mis primeros proyectos me llevaron a estudiar arquitectura,
              seguridad, pruebas y documentación. Hoy el proceso incluye acordar
              el alcance, revisar lo construido y explicar sus límites.
            </p>
            <h3>Que cada proyecto ayude al siguiente.</h3>
            <p>
              La dirección es aprender de decisiones, errores, horas y costos
              reales. Estoy construyendo ese registro; su valor acumulativo
              todavía debe comprobarse con proyectos y datos.
            </p>
            <details>
              <summary>Sobre el intercambio en los primeros proyectos</summary>
              <p>
                El trueque fue una forma temprana de intercambiar capacidad de
                producción por un activo valioso: producto, conocimiento,
                relación o aprendizaje. Cada intercambio necesita alcance, valor
                y condiciones acordadas. El trabajo comercial se cotiza; el
                trueque no es el modelo financiero principal.
              </p>
            </details>
          </>
        ) : (
          <a className="inline-link" href="#sobre-mi">
            Conoce la historia y los criterios de CÍDIKS{" "}
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </section>
  );
}

function MethodPreview() {
  const ref = useSectionEvent("methodology_view", { location: "home" });
  return (
    <section
      ref={ref}
      id="metodo"
      className="section container journey-method"
      aria-labelledby="method-title"
    >
      <p className="eyebrow">MÉTODO CÍDIKS</p>
      <h2 id="method-title">{c.method.title}</h2>
      <p className="section-description">{c.method.body}</p>
      <ol className="journey-method-grid">
        {c.method.items.map((step) => (
          <li key={step.number}>
            <span className="mono">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
      <a className="inline-link" href="#proceso">
        Ver entregables y criterios del método <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}

const demos = [
  {
    id: "oferta",
    label: "Información dispersa",
    friction:
      "Una persona pregunta por lo que necesita para decidir porque la oferta está repartida entre publicaciones.",
    decision:
      "Reunir la oferta y las respuestas básicas antes del contacto. Primero claridad; después evaluamos si hace falta automatizar.",
    before: [
      "Publicación con una foto",
      "Detalles por mensaje",
      "¿Dónde es? ¿Qué incluye?",
    ],
    after: [
      "Experiencia y ubicación",
      "Qué incluye · condiciones",
      "Consulta con contexto",
    ],
    measure:
      "¿Las consultas llegan con menos dudas básicas? Comparar preguntas antes y después.",
  },
  {
    id: "seguimiento",
    label: "Consultas sin seguimiento",
    friction:
      "La cotización se pierde entre chats y nadie sabe cuál es el siguiente paso.",
    decision:
      "Definir etapas y quién responde. Probar un registro simple antes de invertir en un CRM más complejo.",
    before: [
      "Conversaciones mezcladas",
      "Cotización sin responsable",
      "¿A quién le faltaba responder?",
    ],
    after: [
      "Consulta · propuesta · decisión",
      "Responsable y siguiente paso",
      "Recordatorio acordado",
    ],
    measure:
      "¿Se responden las consultas pendientes a tiempo? Registrar etapa, responsable y fecha.",
  },
] as const;

export function DemoSection() {
  const [index, setIndex] = useState(0);
  const demo = demos[index];
  const ref = useSectionEvent("demo_view", {
    demo_id: "frictions",
    kind: "illustration",
  });
  return (
    <section
      ref={ref}
      id="demo"
      className="section demo-section"
      aria-labelledby="demo-title"
    >
      <div className="container">
        <div className="demo-heading">
          <div>
            <p className="eyebrow">DE LA FRICCIÓN A LA ALTERNATIVA</p>
            <h2 id="demo-title">Una decisión, puesta en pantalla.</h2>
          </div>
          <p className="demo-disclosure">
            Demo ilustrativa. Los escenarios son hipotéticos; no representan
            resultados de un cliente.
          </p>
        </div>
        <div
          className="demo-options"
          role="group"
          aria-label="Elegir escenario de demostración"
        >
          {demos.map((item, i) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={index === i}
              onClick={() => {
                setIndex(i);
                track("demo_select", { demo_id: item.id });
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="demo-comparison" aria-live="polite">
          <article className="demo-window demo-before">
            <p className="mono">ANTES / FRICCIÓN</p>
            <div className="demo-window-bar" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <h3>{demo.before[0]}</h3>
            <div className="demo-skeleton" aria-hidden="true" />
            <p>{demo.before[1]}</p>
            <div className="demo-question">{demo.before[2]}</div>
          </article>
          <article className="demo-window demo-after">
            <p className="mono">PROPUESTA / ALTERNATIVA</p>
            <div className="demo-window-bar" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <h3>{demo.after[0]}</h3>
            <div className="demo-info-lines">
              <span>01 / Información ordenada</span>
              <span>02 / Próximo paso visible</span>
            </div>
            <p>{demo.after[1]}</p>
            <div className="demo-action">
              {demo.after[2]} <span aria-hidden="true">↗</span>
            </div>
          </article>
        </div>
        <div className="demo-reasoning">
          <div>
            <h3>Lo que observamos</h3>
            <p>{demo.friction}</p>
          </div>
          <div>
            <h3>Lo que proponemos</h3>
            <p>{demo.decision}</p>
          </div>
          <div>
            <h3>Lo que comprobaríamos</h3>
            <p>{demo.measure}</p>
          </div>
        </div>
        <a className="button" href="#contacto">
          Revisemos una fricción de tu negocio <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

const Arrow = () => <span aria-hidden="true">↗</span>;

const NEEDS = [
  {
    href: "/comunidad/",
    tag: "Gratis",
    title: "CÍDIKS Comunidad",
    text: "Rutas y cursos gratuitos para aprender paso a paso, a tu ritmo.",
  },
  {
    href: "/asesor-ia/",
    tag: "Gratis",
    title: "CÍDIKS IA",
    text: "Responde unas preguntas y recibe orientación sobre por dónde empezar.",
  },
  {
    href: "/conocimiento/",
    tag: "Gratis",
    title: "Conocimiento",
    text: "Guías prácticas y recursos educativos, sin registro.",
  },
  {
    href: "#servicios",
    tag: "Con cotización",
    title: "Servicios profesionales",
    text: "Sitios web, identidad, contenido y automatización cuando necesites apoyo.",
  },
] as const;

function NeedsSelector() {
  return (
    <section
      id="necesidades"
      className="section container needs"
      aria-labelledby="needs-title"
    >
      <h2 id="needs-title">¿Qué necesitas hoy?</h2>
      <div className="needs-grid">
        {NEEDS.map((need, i) => (
          <a
            key={need.href}
            href={need.href}
            className={`need ${i === 0 ? "need--lead" : ""} ${need.href.startsWith("#") ? "need--paid" : ""}`}
          >
            <span className="need-tag">{need.tag}</span>
            <h3>{need.title}</h3>
            <p>{need.text}</p>
            <span className="need-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function CommunityPreview() {
  const guideCount = HOME_COMMUNITY_ROUTES.reduce(
    (total, route) => total + route.guides.length,
    0,
  );
  return (
    <section
      id="aprende"
      className="section container home-community"
      aria-labelledby="community-title"
    >
      <div className="community-head">
        <div>
          <p className="eyebrow">CÍDIKS COMUNIDAD · GRATIS</p>
          <h2 id="community-title">Aprende primero. Decide con criterio.</h2>
        </div>
        <p>
          {HOME_COMMUNITY_ROUTES.length} rutas con {guideCount} guías propias,
          una actividad práctica y una forma de comprobar lo aprendido. Se leen
          sin registro ni datos personales.
        </p>
      </div>
      <ol className="community-routes">
        {HOME_COMMUNITY_ROUTES.map((route, i) => (
          <li key={route.id}>
            <span className="mono">RUTA 0{i + 1}</span>
            <h3>
              <a href={`/comunidad/#${route.id}`}>{route.title}</a>
            </h3>
            <p>{route.summary}</p>
            <ul>
              {route.guides.map((guide) => (
                <li key={guide.slug}>
                  <a href={`/conocimiento/${guide.slug}/`}>{guide.title}</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <div className="community-external">
        <div>
          <h3>Para profundizar: cursos de otras instituciones</h3>
          <p>
            Cuatro recursos revisados el {HOME_RESOURCES_CHECKED_ON}. Son
            gratuitos según sus páginas oficiales; algunos piden cuenta o iniciar
            sesión.
          </p>
        </div>
        <ul>
          {HOME_EXTERNAL_RESOURCES.map((r) => (
            <li key={r.id}>
              <a href={`/comunidad/#${r.routeId}-recursos`}>
                <strong>{r.title}</strong>
                <span>{r.institution}</span>
                <small>
                  {[r.duration, HOME_ACCOUNT_LABELS[r.account]]
                    .filter(Boolean)
                    .join(" · ")}
                </small>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <a className="button" href="/comunidad/">
        Ver las rutas gratuitas de CÍDIKS Comunidad <Arrow />
      </a>
    </section>
  );
}

function SolutionsSection({
  onInterest,
}: {
  onInterest: (text: string) => void;
}) {
  return (
    <section
      id="soluciones"
      className="section container journey-solutions"
      aria-labelledby="solutions-title"
    >
      <p className="eyebrow">SERVICIOS PROFESIONALES · OPCIONALES</p>
      <h2 id="solutions-title">
        Elige el problema. La herramienta viene después.
      </h2>
      <p className="section-description">
        Aprender no depende de contratar. Cuando tu negocio necesite tiempo o
        criterio técnico, empezamos por identificar dónde se detiene el
        recorrido: la solución puede ser una web, contenido más claro o un
        proceso más simple.
      </p>
      <div className="solution-rows">
        {[
          c.services.items[0],
          c.services.items[3],
          c.services.items[1],
          c.services.items[4],
          c.services.items[5],
        ].map((item, i) => (
          <a
            href="#contacto"
            key={item.title}
            onClick={() => onInterest(item.title)}
          >
            <span className="mono">0{i + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <span className="solution-row-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>
      <p className="solution-links">
        <a className="inline-link" href="#servicios">
          Explorar alcances y soluciones <Arrow />
        </a>
        <a className="inline-link" href="#precios">
          Ver alcances e inversión <Arrow />
        </a>
      </p>
    </section>
  );
}

function IdentitySection() {
  return (
    <section
      id="identidad"
      className="section container client-capacity"
      aria-labelledby="capacity-title"
    >
      <div>
        <p className="eyebrow">QUIÉN ESTÁ DETRÁS DE CÍDIKS</p>
        <h2 id="capacity-title">Comprender para poder usar.</h2>
        <p>
          Soy Reily Castro. Mi formación está relacionada con Ciencias de la
          Educación y trabajo desde Oaxaca, de forma presencial y remota. Cada
          contexto tiene hábitos, conocimientos y recursos distintos; el diseño
          empieza por conocerlos.
        </p>
      </div>
      <ol>
        <li>
          <span className="mono">01</span>
          <strong>Autonomía tecnológica</strong>
          <p>
            Explicaciones, guías y documentación: qué construimos, por qué, cómo
            usarlo y qué puedes cambiar después.
          </p>
        </li>
        <li>
          <span className="mono">02</span>
          <strong>Reciprocidad</strong>
          <p>
            Los primeros intercambios fueron acordados con alcance, valor y
            condiciones. Que quien aprende pueda devolver a otros es una
            dirección, aún sin mecanismo en este sitio.
          </p>
        </li>
        <li>
          <span className="mono">03</span>
          <strong>Desarrollo responsable</strong>
          <p>
            Credenciales fuera del código público, permisos mínimos y revisión
            humana en acciones sensibles. No es una certificación ni una garantía
            de seguridad absoluta.
          </p>
        </li>
      </ol>
    </section>
  );
}

export function HomeJourney({
  onInterest,
  onSelectProject,
}: {
  onInterest: (text: string) => void;
  onSelectProject: (project: Project, index: number) => void;
}) {
  const moreProjects = c.projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => !["paraiso-laguna", "altitud"].includes(project.id));
  return (
    <div className="home-journey">
      <NeedsSelector />
      <CommunityPreview />
      <SolutionsSection onInterest={onInterest} />
      <MethodPreview />
      <DemoSection />
      <section
        className="section container journey-cases"
        aria-labelledby="home-cases-title"
      >
        <div className="journey-section-heading">
          <div>
            <p className="eyebrow">PROYECTOS Y EVIDENCIA</p>
            <h2 id="home-cases-title">Decisiones que puedes explorar.</h2>
          </div>
          <a className="inline-link" href="#casos">
            Todos los proyectos <Arrow />
          </a>
        </div>
        <div className="home-case-grid">
          <a href="#paraiso-laguna" className="home-case-card">
            <img
              src="/projects/paraiso-laguna/sitio-real-desktop.webp"
              width="1600"
              height="1000"
              loading="lazy"
              decoding="async"
              alt="Captura del sitio público de experiencias de Paraíso Laguna"
            />
            <div>
              <p className="eyebrow">TURISMO / TRABAJO DOCUMENTADO</p>
              <h3>
                Paraíso Laguna <Arrow />
              </h3>
              <p>
                Ecosistema web y visual con +5,600 impresiones mensuales en
                Google Search y captura directa de consultas a WhatsApp.
              </p>
            </div>
          </a>
          <a href="#altitud" className="home-case-card">
            <img
              src="/projects/altitud/altitud-002-city-900.webp"
              width="1122"
              height="1402"
              loading="lazy"
              decoding="async"
              alt="Campaña conceptual ALTITUD con hoodie y paisaje urbano"
            />
            <div>
              <p className="eyebrow">IDENTIDAD / PROYECTO CONCEPTUAL</p>
              <h3>
                ALTITUD <Arrow />
              </h3>
              <p>
                Territorio, prenda y campaña dentro de un sistema visual. Siete
                piezas conceptuales; sin cliente ni ventas atribuidas.
              </p>
            </div>
          </a>
        </div>
        <p className="evidence-legend">
          <strong>Trabajo documentado:</strong> sitio o sistema construido, con
          su registro. <strong>Proyecto conceptual:</strong> propuesta sin
          cliente ni resultados atribuidos.
        </p>
        <div className="project-index surface-glass surface-glass--subtle">
          <span className="eyebrow">MÁS PROYECTOS</span>
          <div className="index-cases">
            {moreProjects.map(({ project, index }) => (
              <button
                type="button"
                key={project.id}
                onClick={() => onSelectProject(project, index)}
              >
                <span className="index-case-title">
                  <strong>{project.title}</strong>
                  <small>{project.status}</small>
                </span>
                <Arrow />
              </button>
            ))}
          </div>
        </div>
      </section>
      <OriginSection />
      <IdentitySection />
      <section
        className="section final-invitation"
        aria-labelledby="final-title"
      >
        <div className="container">
          <p className="eyebrow">EL SIGUIENTE PASO</p>
          <h2 id="final-title">Elige cómo quieres seguir.</h2>
          <div className="final-paths">
            <div>
              <h3>Quiero aprender</h3>
              <p>Sin registro ni datos personales.</p>
              <a className="inline-link" href="/comunidad/">
                Empezar una ruta gratuita <Arrow />
              </a>
            </div>
            <div>
              <h3>Necesito orientación</h3>
              <p>Un recorrido breve para decidir por dónde empezar.</p>
              <a className="inline-link" href="/asesor-ia/">
                Crear un brief con el Asesor CÍDIKS <Arrow />
              </a>
              <a className="inline-link" href="#diagnostico">
                Prefiero explorar primero en 3 preguntas <Arrow />
              </a>
            </div>
            <div>
              <h3>Quiero contratar una solución</h3>
              <p>
                Una conversación inicial para entender tu situación, sin
                compromiso.
              </p>
              <a
                className="button"
                href="#contacto"
                onClick={() => onInterest("Diagnóstico inicial")}
              >
                Analicemos tu negocio <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
