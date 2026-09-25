import { content as c } from "./content";
import { useEffect, useRef, useState } from "react";

type EvidenceLevel = "A" | "B" | "C";

const evidence: {
  name: string;
  state: "DOCUMENTADO" | "PARCIAL" | "PENDIENTE";
  level: EvidenceLevel;
  detail: string;
}[] = [
  { name: "WEB", state: "DOCUMENTADO", level: "B", detail: "Código local multipágina y capturas del sitio público. La equivalencia exacta entre ambas versiones requiere confirmación." },
  { name: "SEO", state: "DOCUMENTADO", level: "B", detail: "Metadatos, canonical, JSON-LD, robots.txt y sitemap.xml en la copia local; no prueban mejora de posiciones." },
  { name: "CONTENIDO", state: "DOCUMENTADO", level: "B", detail: "Ficha, matriz y carrusel creado. No hay constancia de publicación." },
  { name: "BRANDING", state: "DOCUMENTADO", level: "B", detail: "Existen master y versiones Feed 4:5 y Story 9:16. Las piezas visuales esperan confirmación de permisos." },
  { name: "WHATSAPP", state: "PARCIAL", level: "B", detail: "CTAs, formulario y eventos en código local; no hay prueba de recepción de eventos o reservas." },
  { name: "REDES", state: "PARCIAL", level: "B", detail: "Piezas creadas y preparadas; publicación sin verificar." },
  { name: "GOOGLE", state: "PENDIENTE", level: "C", detail: "Canal identificado sin evidencia de gestión de Google Business." },
  { name: "TRIPADVISOR", state: "PENDIENTE", level: "C", detail: "Ficha identificada sin evidencia de administración del perfil." },
  { name: "IA", state: "PENDIENTE", level: "C", detail: "Falta demostración autorizable del asistente y su funcionamiento." },
];

const built = ["WEB", "SEO", "CONTENIDO", "IDENTIDAD", "RUTA DE CONTACTO", "DATOS HISTÓRICOS / INSTRUMENTACIÓN", "TESTS ESCRITOS"];
const carouselSequence = ["Portada", "Experiencia", "Cuidado", "Recorrido", "Incluye", "Reserva"];
const featuredDesignIndices = [0, 4, 9, 13];
const featuredDesigns = featuredDesignIndices.map((index) => c.projects[0].gallery![index]);

function Label({ n, children }: { n: string; children: string }) {
  return <p className="eyebrow case-section-label">{n} / {children}</p>;
}

export function ParaisoCaseStudy({ onOpenGallery }: { onOpenGallery: () => void }) {
  const [chapter, setChapter] = useState<"sistema" | "web" | "contenido" | "evidencia">("sistema");
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null);
  const designViewer = useRef<HTMLDialogElement>(null);
  const designTrigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (selectedDesign !== null && !designViewer.current?.open) designViewer.current?.showModal();
    if (selectedDesign === null && designViewer.current?.open) {
      designViewer.current.close();
      designTrigger.current?.focus();
    }
  }, [selectedDesign]);
  const openDesign = (index: number) => {
    designTrigger.current = document.activeElement as HTMLElement;
    setSelectedDesign(index);
  };
  const chapters = [
    { id: "sistema", label: "Estrategia y canales" },
    { id: "web", label: "Web y SEO" },
    { id: "contenido", label: "Contenido y contacto" },
    { id: "evidencia", label: "QA y evidencia" },
  ] as const;
  return (
    <section id="paraiso-laguna" className="featured-case section evidence-case" aria-labelledby="featured-title">
      <div className="container">
        <header className="featured-intro">
          <div>
            <p className="eyebrow">CASO DESTACADO · TRABAJO DOCUMENTADO</p>
            <h1 id="featured-title">PARAÍSO LAGUNA</h1>
            <p className="featured-subtitle">Un ecosistema digital para una experiencia turística que necesita ser descubierta, entendida y contactada.</p>
          </div>
          <div>
            <Label n="01" >EL RETO</Label>
            <p>Conectar experiencias turísticas, información para decidir y una vía clara de contacto.</p>
          </div>
        </header>

        <div className="case-at-a-glance" aria-label="Resumen del caso">
          <div><strong>RETO</strong><span>Ordenar experiencias y facilitar el contacto.</span></div>
          <div><strong>SISTEMA</strong><span>Contenido, sitio y ruta a WhatsApp.</span></div>
          <div><strong>EVIDENCIA</strong><span>Código local, piezas creadas y datos históricos.</span></div>
          <div><strong>PENDIENTES</strong><span>Publicación social, operación e impacto comercial.</span></div>
        </div>

        <figure className="featured-hero-image surface-glass surface-glass--strong">
          <img src="/projects/paraiso-laguna/sitio-real-desktop.webp" alt="Captura de la página pública de Paraíso Laguna en escritorio" width="1600" height="1000" loading="lazy" decoding="async" />
          <figcaption className="featured-image-caption"><span>Referencia visual del sitio público · correspondencia exacta con la copia local pendiente.</span><a href={c.projects[0].url} target="_blank" rel="noreferrer">Visitar sitio público ↗</a></figcaption>
        </figure>

        <section className="case-design-showcase" aria-labelledby="design-showcase-title">
          <div className="case-design-heading">
            <div>
              <p className="eyebrow">TRABAJO VISUAL</p>
              <h2 id="design-showcase-title">Diseños creados para Paraíso Laguna.</h2>
              <p>Selección de dirección de arte. Estas piezas existen como trabajo visual; su publicación en redes no está verificada.</p>
            </div>
            <button type="button" className="inline-link case-gallery-link" onClick={onOpenGallery}>Explorar las {c.projects[0].gallery!.length} piezas ↗</button>
          </div>
          <div className="case-design-grid">
            {featuredDesigns.map((item, position) => <figure key={item.src} className="surface-glass surface-glass--subtle"><button type="button" className="case-design-button" onClick={() => openDesign(featuredDesignIndices[position])} aria-label={`Ampliar diseño: ${item.alt}`}><img src={item.preview || item.src} alt="" width="900" height="1125" loading="lazy" decoding="async" /><span aria-hidden="true">↗</span></button><figcaption>{item.category} · pieza creada</figcaption></figure>)}
          </div>
          <dialog ref={designViewer} className="art-viewer" aria-label="Diseño de Paraíso Laguna" onCancel={(event) => { event.preventDefault(); setSelectedDesign(null); }} onClick={(event) => { if (event.target === event.currentTarget) setSelectedDesign(null); }}>
            {selectedDesign !== null && <><div className="viewer-toolbar"><span className="mono">Pieza creada · {c.projects[0].gallery![selectedDesign].category}</span><button type="button" autoFocus onClick={() => setSelectedDesign(null)}>Cerrar <span aria-hidden="true">×</span></button></div><img className="viewer-image" src={c.projects[0].gallery![selectedDesign].src} alt={c.projects[0].gallery![selectedDesign].alt} width="900" height="1125" /><p className="viewer-caption">{c.projects[0].gallery![selectedDesign].alt} · publicación en redes no verificada.</p></>}
          </dialog>
        </section>

        <nav className="case-chapter-nav" aria-label="Capítulos del caso">
          {chapters.map((item, index) => <button key={item.id} type="button" aria-pressed={chapter === item.id} aria-controls="case-chapter-content" onClick={() => setChapter(item.id)}><span className="mono">0{index + 1}</span>{item.label}</button>)}
        </nav>
        <p className="case-chapter-context" id="case-chapter-context">Capítulo {chapters.findIndex((item) => item.id === chapter) + 1} de 4 · {chapters.find((item) => item.id === chapter)?.label}</p>
        <div id="case-chapter-content" role="region" aria-labelledby="case-chapter-context">

        {chapter === "sistema" && <>

        <section className="evidence-block" aria-labelledby="strategy-title">
          <Label n="02">LA ESTRATEGIA</Label>
          <h3 id="strategy-title">Un recorrido diseñado para conectar cada pieza.</h3>
          <p className="evidence-lead">La matriz editorial asigna una función a cada canal; la web reúne información y acceso a WhatsApp.</p>
          <ol className="evidence-flow" aria-label="Descubrimiento, experiencia, ruta de contacto y operación">
            {["Descubrimiento", "Experiencia", "Ruta de contacto", "Operación"].map((step, i) => <li key={step} className="surface-glass surface-glass--subtle"><span className="mono">0{i + 1}</span><strong>{step}</strong><small>{["Búsqueda y redes", "Tours, contenido y confianza", "Sitio → WhatsApp", "Seguimiento por verificar"][i]}</small></li>)}
          </ol>
          <p className="case-proof">[B] Matriz y arquitectura local. Seguimiento: operación pendiente de prueba.</p>
        </section>

        </>}

        {chapter === "web" && <>
        <section className="evidence-block evidence-split" aria-labelledby="web-title">
          <div>
            <Label n="03">WEB</Label>
            <h3 id="web-title">Experiencias, respuestas y contacto en una estructura móvil.</h3>
            <p>La copia local reúne portada, páginas de tours, blog, formulario, CTAs a WhatsApp, metadatos y datos estructurados. Las capturas muestran el sitio público; falta confirmar que coincide exactamente con esa copia de código.</p>
            <div className="case-tag-list" aria-label="Áreas técnicas"><span>WEB</span><span>UX</span><span>SEO</span><span>RESPONSIVE</span><span>RUTA DE CONTACTO</span></div>
            <ul className="evidence-list"><li>Portada, rutas de experiencias y guía de bioluminiscencia.</li><li>Imágenes WebP y estilos para varios anchos.</li><li>Formulario y enlaces visibles a WhatsApp.</li></ul>
            <p className="case-proof">[B] HTML, CSS y JS locales; capturas públicas existentes.</p>
          </div>
          <figure className="evidence-mobile-shot surface-glass surface-glass--medium"><img src="/projects/paraiso-laguna/sitio-real-mobile.webp" alt="Referencia visual de la página pública de Paraíso Laguna en móvil" width="390" height="844" loading="lazy" decoding="async" /><figcaption>Referencia pública móvil · versión local exacta pendiente de cotejo.</figcaption></figure>
        </section>

        <section className="evidence-block" aria-labelledby="seo-title">
          <Label n="04">SEO Y DATOS HISTÓRICOS</Label>
          <h3 id="seo-title">Lo implementado y lo observado se muestran por separado.</h3>
          <div className="evidence-two-up">
            <article className="surface-glass surface-glass--medium"><span className="mono">IMPLEMENTACIÓN · [B]</span><h4>SEO técnico en la copia local</h4><ul><li><code>robots.txt</code> y <code>sitemap.xml</code></li><li>Metadatos y URL canónica</li><li>Datos estructurados JSON-LD</li><li>Páginas de tours y blog</li></ul><p>La presencia del código no acredita indexación ni una mejora de posiciones.</p></article>
            <article className="surface-glass surface-glass--medium"><span className="mono">DATOS HISTÓRICOS · [A]</span><h4>Análisis de Search Console</h4><p>Se analizaron datos históricos de búsqueda web exportados entre el 30 de mayo y el 29 de agosto de 2026. Las cifras se conservan en el Evidence Pack interno; aquí no se publican. El análisis no demuestra causalidad ni reservas.</p></article>
          </div>
        </section>
        </>}

        {chapter === "contenido" && <>
        <section className="evidence-block" aria-labelledby="content-title">
          <Label n="05">CONTENIDO</Label>
          <h3 id="content-title">De una experiencia a piezas con función propia.</h3>
          <ol className="evidence-process"><li>Ficha maestra</li><li>Matriz multicanal</li><li>Carrusel creado</li><li>Adaptación Feed</li><li>Adaptación Story</li></ol>
          <div className="evidence-carousel-record" role="group" aria-label="Secuencia documentada del carrusel de tortugas">
            <p className="mono">CARRUSEL TORTUGAS V2 · SECUENCIA DE TRABAJO</p>
            <ol>{carouselSequence.map((step) => <li key={step}><span className="mono">{String(carouselSequence.indexOf(step) + 1).padStart(2, "0")}</span><strong>{step}</strong></li>)}</ol>
            <p>La secuencia y las decisiones editoriales están documentadas. La pieza visual completa se retiró de esta versión pública hasta confirmar permisos, personas y datos comerciales.</p>
          </div>
        </section>

        <section className="evidence-block" aria-labelledby="art-title">
          <Label n="06">DIRECCIÓN DE ARTE</Label>
          <h3 id="art-title">Una dirección visual, tres contextos.</h3>
          <p className="evidence-lead">El archivo de trabajo conserva un master y adaptaciones para Feed y Story. La comparación siguiente describe formatos documentados, sin mostrar piezas pendientes de autorización.</p>
          <div className="evidence-art-grid">
            {[
              ["MASTER", "Archivo de composición base"],
              ["FEED 4:5", "Adaptación para publicación vertical"],
              ["STORY 9:16", "Adaptación para pantalla completa"],
            ].map(([label, description]) => <article key={label} className="surface-glass surface-glass--subtle"><span className="mono">{label}</span><p>{description}</p></article>)}
          </div>
          <p className="case-proof">[B] Archivos master y derivados del Evidence Pack. Las piezas visuales esperan confirmación de derechos y consentimiento.</p>
        </section>

        <section className="evidence-block evidence-split" aria-labelledby="whatsapp-title">
          <div><Label n="07">WHATSAPP</Label><h3 id="whatsapp-title">Del CTA a la conversación.</h3><p>El código local incluye enlaces y un formulario que prepara el contacto por WhatsApp. También contiene eventos <code>whatsapp_click</code> y <code>generate_lead</code>; falta verificar su recepción en producción.</p><p className="case-proof">[B] Código y documento de entrega. Reservas, atención real y resultados no documentados.</p></div>
          <div className="evidence-action-diagram" aria-label="Flujo de contacto"><span className="surface-glass surface-glass--medium">CTA del sitio</span><span aria-hidden="true">↓</span><span className="surface-glass surface-glass--medium">WhatsApp</span><small>Automatización inteligente · en evolución, demostración pendiente</small></div>
        </section>
        </>}

        {chapter === "evidencia" && <>
        <section className="evidence-block" aria-labelledby="qa-title">
          <Label n="08">QA</Label>
          <h3 id="qa-title">La verificación también forma parte del trabajo.</h3>
          <div className="evidence-two-up"><article className="surface-glass surface-glass--medium"><span className="mono">TEST ESCRITO · [B]</span><h4>Suite Playwright</h4><p>Cubre 375 px y 1280 px, hero, tours, FAQ, galería, formulario, consola y diferencias del CTA en móvil/escritorio.</p></article><article className="surface-glass surface-glass--medium"><span className="mono">TEST EJECUTADO</span><h4>Pendiente de resultado fechado</h4><p>El Evidence Pack conserva el archivo de pruebas, pero no una salida que confirme su ejecución exitosa sobre esta versión del sitio.</p></article></div>
          <p className="case-proof">El CSS también incluye reglas responsive y <code>prefers-reduced-motion</code>; la experiencia pública requiere una revisión visual fechada.</p>
        </section>

        <section className="evidence-block" aria-labelledby="built-title">
          <Label n="09">LO QUE QUEDÓ CONSTRUIDO</Label>
          <h3 id="built-title">Componentes documentados del sistema.</h3>
          <div className="evidence-built-grid">{built.map((item) => <span key={item} className="surface-glass surface-glass--subtle">{item}</span>)}</div>
          <p className="case-proof">Cada componente tiene un alcance distinto de verificación; el panel siguiente lo detalla.</p>
        </section>

        <section className="evidence-block" aria-labelledby="evidence-title">
          <Label n="10">EVIDENCE</Label>
          <h3 id="evidence-title">Abrir la prueba detrás de cada área.</h3>
          <p className="evidence-lead">DOCUMENTADO = artefacto de trabajo; PARCIAL = parte del flujo sin resultado operativo; PENDIENTE = indicio sin demostración. A = dato directo, B = trabajo documentado, C = indicio.</p>
          <div className="evidence-panel">{evidence.map((item) => <details key={item.name} className="surface-glass surface-glass--subtle"><summary><span>{item.name}</span><span className="evidence-state">{item.state} · [{item.level}]</span></summary><p>{item.detail}</p></details>)}</div>
        </section>

        <aside className="evidence-limits" aria-labelledby="limits-title"><Label n="11">QUÉ NO AFIRMAMOS</Label><h3 id="limits-title">El alcance de la evidencia importa.</h3><p>Este caso no presenta métricas comerciales no verificadas, no atribuye crecimiento sin prueba causal, no llama publicadas a piezas creadas y no afirma gestión de Google Business o TripAdvisor sin respaldo administrativo.</p></aside>
        </>}
        </div>
      </div>
    </section>
  );
}
