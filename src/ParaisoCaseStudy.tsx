import { content as c } from "./content";

type EvidenceLevel = "A" | "B" | "C";

const evidence: {
  name: string;
  state: string;
  level: EvidenceLevel;
  detail: string;
}[] = [
  { name: "WEB", state: "✅", level: "B", detail: "Código local multipágina, capturas del sitio público y rutas de experiencias. La equivalencia exacta entre ambas versiones requiere confirmación." },
  { name: "SEO", state: "✅", level: "B", detail: "Metadatos, canonical, JSON-LD, robots.txt y sitemap.xml presentes en la implementación local. No se atribuyen cambios de posición." },
  { name: "CONTENIDO", state: "✅", level: "B", detail: "Ficha de campaña, matriz de formatos, carrusel de tortugas y archivo audiovisual clasificado. Son piezas de trabajo, no constancia de publicación." },
  { name: "BRANDING", state: "✅", level: "B", detail: "Master visual y versiones para Feed 4:5 y Story 9:16. Autoría y derechos deben verificarse antes de reutilizar piezas fuera del caso." },
  { name: "WHATSAPP", state: "🟡", level: "B", detail: "El sitio local contiene CTAs, formulario y eventos de contacto. No hay prueba en este paquete de reservas ni recepción de eventos en producción." },
  { name: "REDES", state: "🟡", level: "B", detail: "Hay piezas creadas y preparadas para Instagram y Facebook. Su publicación todavía requiere enlaces o capturas fechadas." },
  { name: "GOOGLE", state: "🟡", level: "C", detail: "Google y Maps figuran como canales de descubrimiento. No se encontró evidencia administrativa de gestión de Google Business." },
  { name: "TRIPADVISOR", state: "🟡", level: "C", detail: "Se identificó la ficha como canal. Las capturas de la página de reseñas no prueban administración del perfil." },
  { name: "IA", state: "🟡", level: "C", detail: "Automatización inteligente en evolución. Falta una demostración autorizable de configuración y funcionamiento." },
];

const channels = [
  { name: "Google", state: "Canal de búsqueda", note: "Datos de búsqueda observados en Search Console; gestión del buscador no aplica." },
  { name: "Google Maps", state: "Canal identificado", note: "Enlace de ubicación; edición de la ficha pendiente de evidencia." },
  { name: "Instagram", state: "Perfil identificado", note: "Piezas creadas; publicaciones no verificadas en este paquete." },
  { name: "Facebook", state: "Perfil identificado", note: "Adaptación de contenido prevista; publicaciones no verificadas." },
  { name: "TripAdvisor", state: "Ficha identificada", note: "Administración del perfil pendiente de evidencia." },
  { name: "Website", state: "Implementación documentada", note: "Arquitectura, tours, blog y contacto en la copia local." },
  { name: "WhatsApp", state: "Integración en código", note: "CTAs y formulario; atención y resultados no medidos aquí." },
  { name: "Reserva", state: "Objetivo del recorrido", note: "No hay cifras verificadas de reservas." },
  { name: "Seguimiento", state: "Etapa propuesta", note: "Operación pendiente de demostración." },
];

const built = ["WEB", "SEO", "CONTENIDO", "IDENTIDAD", "CONVERSIÓN", "MEDICIÓN", "QA"];

function Label({ n, children }: { n: string; children: string }) {
  return <p className="eyebrow case-section-label">{n} / {children}</p>;
}

export function ParaisoCaseStudy({ onOpenGallery }: { onOpenGallery: () => void }) {
  return (
    <section id="paraiso-laguna" className="featured-case section evidence-case" aria-labelledby="featured-title">
      <div className="container">
        <header className="featured-intro">
          <div>
            <p className="eyebrow">CASO DESTACADO · EVIDENCIA VERIFICABLE</p>
            <h2 id="featured-title">PARAÍSO LAGUNA</h2>
            <p className="featured-subtitle">Un ecosistema digital para una experiencia turística que necesita ser descubierta, entendida y contactada.</p>
          </div>
          <div>
            <Label n="01" >EL RETO</Label>
            <p>Conectar las experiencias turísticas con información útil para decidir y una vía clara de contacto. El trabajo documentado aborda esa ruta desde el contenido, el sitio y WhatsApp; no presupone un resultado comercial.</p>
          </div>
        </header>

        <figure className="featured-hero-image surface-glass surface-glass--strong">
          <img src="/projects/paraiso-laguna/sitio-real-desktop.webp" alt="Captura de la página pública de Paraíso Laguna en escritorio" width="1600" height="1000" loading="lazy" decoding="async" />
          <figcaption className="featured-image-caption"><span>Captura del sitio público revisada el 23 de septiembre de 2026 · WEB / UX / CONVERSIÓN</span><a href={c.projects[0].url} target="_blank" rel="noreferrer">Visitar sitio público ↗</a></figcaption>
        </figure>

        <section className="evidence-block" aria-labelledby="strategy-title">
          <Label n="02">LA ESTRATEGIA</Label>
          <h3 id="strategy-title">Un recorrido diseñado para conectar cada pieza.</h3>
          <p className="evidence-lead">La matriz editorial define qué necesita cada canal. La web concentra la información de experiencias y abre una conversación de contacto.</p>
          <ol className="evidence-flow" aria-label="Descubrimiento, experiencia, conversión y operación">
            {["Descubrimiento", "Experiencia", "Conversión", "Operación"].map((step, i) => <li key={step} className="surface-glass surface-glass--subtle"><span className="mono">0{i + 1}</span><strong>{step}</strong><small>{["Búsqueda y redes", "Tours, contenido y confianza", "Sitio → WhatsApp", "Seguimiento por verificar"][i]}</small></li>)}
          </ol>
          <p className="case-proof">[B] Matriz de formatos y arquitectura local. El seguimiento se presenta como etapa del diseño, con operación pendiente de prueba.</p>
        </section>

        <section className="evidence-block" aria-labelledby="ecosystem-title">
          <Label n="03">EL ECOSISTEMA</Label>
          <h3 id="ecosystem-title">Cada canal tiene un papel y un estado de prueba distinto.</h3>
          <div className="evidence-channel-grid">
            {channels.map((channel) => <article key={channel.name} className="surface-glass surface-glass--subtle"><strong>{channel.name}</strong><span className="mono">{channel.state}</span><p>{channel.note}</p></article>)}
          </div>
          <p className="case-proof">Canal identificado ≠ acción administrativa comprobada. Google Business y TripAdvisor siguen pendientes de evidencia de gestión.</p>
        </section>

        <section className="evidence-block evidence-split" aria-labelledby="web-title">
          <div>
            <Label n="04">WEB</Label>
            <h3 id="web-title">Experiencias, respuestas y contacto en una estructura móvil.</h3>
            <p>La copia local reúne portada, páginas de tours, blog, formulario, CTAs a WhatsApp, metadatos y datos estructurados. Las capturas muestran el sitio público; falta confirmar que coincide exactamente con esa copia de código.</p>
            <div className="case-tag-list" aria-label="Áreas técnicas"><span>WEB</span><span>UX</span><span>SEO</span><span>RESPONSIVE</span><span>CONVERSIÓN</span></div>
            <ul className="evidence-list"><li>Portada, rutas de experiencias y guía de bioluminiscencia.</li><li>Imágenes WebP y estilos para varios anchos.</li><li>Formulario y enlaces visibles a WhatsApp.</li></ul>
            <p className="case-proof">[B] HTML, CSS y JS locales; capturas públicas existentes.</p>
          </div>
          <figure className="evidence-mobile-shot surface-glass surface-glass--medium"><img src="/projects/paraiso-laguna/sitio-real-mobile.webp" alt="Captura del sitio público de Paraíso Laguna en móvil" width="390" height="844" loading="lazy" decoding="async" /><figcaption>Vista móvil · captura real</figcaption></figure>
        </section>

        <section className="evidence-block" aria-labelledby="seo-title">
          <Label n="05">SEO Y MEDICIÓN</Label>
          <h3 id="seo-title">Lo implementado y lo observado se muestran por separado.</h3>
          <div className="evidence-two-up">
            <article className="surface-glass surface-glass--medium"><span className="mono">IMPLEMENTACIÓN · [B]</span><h4>SEO técnico en la copia local</h4><ul><li><code>robots.txt</code> y <code>sitemap.xml</code></li><li>Metadatos y URL canónica</li><li>Datos estructurados JSON-LD</li><li>Páginas de tours y blog</li></ul><p>La presencia del código no acredita indexación ni una mejora de posiciones.</p></article>
            <article className="surface-glass surface-glass--medium"><span className="mono">MEDICIÓN · [A]</span><h4>Datos históricos observados</h4><div className="evidence-metrics"><div><strong>148</strong><span>clics</span></div><div><strong>11 233</strong><span>impresiones</span></div></div><p>Periodo exportado: 30 de mayo–29 de agosto de 2026 (92 días). Fuente: exportación de Google Search Console, búsqueda web. Estas cifras no demuestran causalidad ni reservas.</p></article>
          </div>
        </section>

        <section className="evidence-block" aria-labelledby="content-title">
          <Label n="06">CONTENIDO</Label>
          <h3 id="content-title">De una experiencia a piezas con función propia.</h3>
          <ol className="evidence-process"><li>Ficha maestra</li><li>Matriz multicanal</li><li>Carrusel creado</li><li>Adaptación Feed</li><li>Adaptación Story</li></ol>
          <figure className="evidence-contact-sheet"><img src="/projects/paraiso-laguna/evidence-carrusel-tortugas.webp" alt="Hoja de contacto del carrusel de seis láminas sobre tortugas" width="1200" height="800" loading="lazy" decoding="async" /><figcaption>Carrusel de tortugas v2 · pieza creada, publicación no verificada.</figcaption></figure>
          <button type="button" className="inline-link case-gallery-link" onClick={onOpenGallery}>Ver galería de dirección de arte ↗</button>
        </section>

        <section className="evidence-block" aria-labelledby="art-title">
          <Label n="07">DIRECCIÓN DE ARTE</Label>
          <h3 id="art-title">Una dirección visual, tres contextos.</h3>
          <p className="evidence-lead">El mismo concepto se preparó como master, pieza de Feed 4:5 y Story 9:16. Son artefactos locales: no equivalen a publicaciones.</p>
          <div className="evidence-art-grid">
            {[
              ["MASTER", "evidence-master-kayak.webp", "Master visual de kayak al atardecer"],
              ["FEED 4:5", "evidence-feed-kayak.webp", "Adaptación de kayak al atardecer para feed"],
              ["STORY 9:16", "evidence-story-kayak.webp", "Adaptación de kayak al atardecer para story"],
            ].map(([label, file, alt]) => <figure key={label}><img src={`/projects/paraiso-laguna/${file}`} alt={alt} width="800" height="1200" loading="lazy" decoding="async" /><figcaption>{label}</figcaption></figure>)}
          </div>
          <p className="case-proof">[B] Archivos master y derivados del Evidence Pack. Autoría, licencias y rostros requieren revisión antes de publicar el caso.</p>
        </section>

        <section className="evidence-block evidence-split" aria-labelledby="whatsapp-title">
          <div><Label n="08">WHATSAPP</Label><h3 id="whatsapp-title">Del CTA a la conversación.</h3><p>El código local incluye enlaces y un formulario que prepara el contacto por WhatsApp. También contiene eventos <code>whatsapp_click</code> y <code>generate_lead</code>; falta verificar su recepción en producción.</p><p className="case-proof">[B] Código y documento de entrega. Reservas, atención real y resultados no documentados.</p></div>
          <div className="evidence-action-diagram" aria-label="Flujo de contacto"><span className="surface-glass surface-glass--medium">CTA del sitio</span><span aria-hidden="true">↓</span><span className="surface-glass surface-glass--medium">WhatsApp</span><small>Automatización inteligente · en evolución, demostración pendiente</small></div>
        </section>

        <section className="evidence-block" aria-labelledby="qa-title">
          <Label n="09">QA</Label>
          <h3 id="qa-title">La verificación también forma parte del trabajo.</h3>
          <div className="evidence-two-up"><article className="surface-glass surface-glass--medium"><span className="mono">TEST ESCRITO · [B]</span><h4>Suite Playwright</h4><p>Cubre 375 px y 1280 px, hero, tours, FAQ, galería, formulario, consola y diferencias del CTA en móvil/escritorio.</p></article><article className="surface-glass surface-glass--medium"><span className="mono">TEST EJECUTADO</span><h4>Pendiente de resultado fechado</h4><p>El Evidence Pack conserva el archivo de pruebas, pero no una salida que confirme su ejecución exitosa sobre esta versión del sitio.</p></article></div>
          <p className="case-proof">El CSS también incluye reglas responsive y <code>prefers-reduced-motion</code>; la experiencia pública requiere una revisión visual fechada.</p>
        </section>

        <section className="evidence-block" aria-labelledby="built-title">
          <Label n="10">LO QUE QUEDÓ CONSTRUIDO</Label>
          <h3 id="built-title">Un inventario verificable del sistema.</h3>
          <div className="evidence-built-grid">{built.map((item) => <span key={item} className="surface-glass surface-glass--subtle">{item}</span>)}</div>
          <p className="case-proof">Web, SEO, contenido, identidad, integración de contacto, medición histórica y tests escritos. Cada área tiene un alcance distinto de verificación.</p>
        </section>

        <section className="evidence-block" aria-labelledby="evidence-title">
          <Label n="11">EVIDENCE</Label>
          <h3 id="evidence-title">Abrir la prueba detrás de cada área.</h3>
          <p className="evidence-lead">A = dato directo · B = trabajo documentado · C = indicio o gestión pendiente. El panel describe el tipo de respaldo sin exponer archivos internos.</p>
          <div className="evidence-panel">{evidence.map((item) => <details key={item.name} className="surface-glass surface-glass--subtle"><summary><span>{item.state} {item.name}</span><span className="mono">[{item.level}]</span></summary><p>{item.detail}</p></details>)}</div>
        </section>

        <aside className="evidence-limits" aria-labelledby="limits-title"><Label n="12">QUÉ NO AFIRMAMOS</Label><h3 id="limits-title">El alcance de la evidencia importa.</h3><p>Este caso no presenta métricas comerciales no verificadas, no atribuye crecimiento sin prueba causal, no llama publicadas a piezas creadas y no afirma gestión de Google Business o TripAdvisor sin respaldo administrativo.</p></aside>
      </div>
    </section>
  );
}
