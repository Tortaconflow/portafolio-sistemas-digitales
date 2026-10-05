import { useState } from "react";
import { content as c } from "./content.ts";
import { HOME_GUIDES } from "./guide-previews.ts";
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

export function HomeJourney({
  onInterest,
}: {
  onInterest: (text: string) => void;
}) {
  const guides = HOME_GUIDES;
  return (
    <div className="home-journey">
      <section
        className="section container friction-intro"
        aria-labelledby="friction-title"
      >
        <p className="eyebrow">EL PUNTO DE PARTIDA</p>
        <h2 id="friction-title">
          ¿Una página nueva… o un problema por entender?
        </h2>
        <div>
          <p>
            Quizá te encuentran, pero tu oferta no se entiende. Quizá llegan
            consultas, pero se quedan sin respuesta. O una tarea repetida
            consume el tiempo que necesitas para atender.
          </p>
          <p>
            Empezamos por identificar dónde se detiene el recorrido. La solución
            puede ser una web, contenido más claro o un proceso más simple.
          </p>
        </div>
      </section>
      <MethodPreview />
      <section
        className="section container journey-solutions"
        aria-labelledby="solutions-title"
      >
        <p className="eyebrow">QUÉ PODEMOS RESOLVER</p>
        <h2 id="solutions-title">
          Elige el problema. La herramienta viene después.
        </h2>
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
        <a className="inline-link" href="#servicios">
          Explorar alcances y soluciones <span aria-hidden="true">↗</span>
        </a>
      </section>
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
            Todos los proyectos <span aria-hidden="true">↗</span>
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
                Paraíso Laguna <span aria-hidden="true">↗</span>
              </h3>
              <p>
                Organizar experiencias y llevar las preguntas a WhatsApp. Sitio
                y piezas visuales como evidencia; resultados comerciales por
                medir.
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
                ALTITUD <span aria-hidden="true">↗</span>
              </h3>
              <p>
                Territorio, prenda y campaña dentro de un sistema visual. Siete
                piezas conceptuales; sin cliente ni ventas atribuidas.
              </p>
            </div>
          </a>
        </div>
      </section>
      <section
        className="section container client-capacity"
        aria-labelledby="capacity-title"
      >
        <div>
          <p className="eyebrow">COMPRENDER PARA PODER USAR</p>
          <h2 id="capacity-title">
            La entrega también te deja herramientas para decidir.
          </h2>
          <p>
            Mi formación relacionada con Ciencias de la Educación se traduce en
            explicaciones, guías y documentación: qué construimos, por qué, cómo
            usarlo y qué puedes cambiar después.
          </p>
          <a className="inline-link" href="/conocimiento/">
            Explorar biblioteca de guías prácticas <span aria-hidden="true">↗</span>
          </a>
        </div>
        <ol>
          <li>
            <span className="mono">01</span>
            <strong>Entender las decisiones</strong>
            <p>Recorrido y criterios explicados con ejemplos de tu negocio.</p>
          </li>
          <li>
            <span className="mono">02</span>
            <strong>Operar la solución</strong>
            <p>Accesos, pasos de uso y límites según el alcance acordado.</p>
          </li>
          <li>
            <span className="mono">03</span>
            <strong>Elegir el siguiente paso</strong>
            <p>Qué revisar y cómo saber si necesitas ampliar lo construido.</p>
          </li>
        </ol>
      </section>
      <section
        id="aprende"
        className="section container home-guides"
        aria-labelledby="guides-title"
      >
        <p className="eyebrow">CONOCIMIENTO / GUÍAS PRÁCTICAS</p>
        <h2 id="guides-title">Criterios que puedes usar hoy.</h2>
        <div className="home-guide-grid">
          {guides.map((a) => (
            <a key={a.id} href={`/conocimiento/${a.slug}/`}>
              <span className="eyebrow">{a.category}</span>
              <h3>{a.title}</h3>
              <p>{a.tagline}</p>
              <span className="inline-link">
                Leer guía <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
      </section>
      <OriginSection />
      <section
        className="section final-invitation"
        aria-labelledby="final-title"
      >
        <div className="container">
          <p className="eyebrow">EL SIGUIENTE PASO</p>
          <h2 id="final-title">Cuéntame qué quieres resolver.</h2>
          <p>
            Una conversación inicial para entender tu situación y elegir por
            dónde empezar.
          </p>
          <a
            className="button"
            href="#contacto"
            onClick={() => onInterest("Diagnóstico inicial")}
          >
            Analicemos tu negocio <span aria-hidden="true">↗</span>
          </a>
          <a className="inline-link" href="#diagnostico">
            Prefiero explorar primero en 3 preguntas{" "}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}
