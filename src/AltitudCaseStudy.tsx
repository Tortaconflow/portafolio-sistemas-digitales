import { useEffect } from "react";

const images = {
  campaign: {
    src: "/projects/altitud/altitud-001-campaign.jpg",
    alt: "ALTITUD 001: modelo con camiseta negra frente a un paisaje urbano de Oaxaca; la composición presenta también vistas frontal y posterior de la prenda.",
    width: 1122,
    height: 1402,
  },
  city: {
    src: "/projects/altitud/altitud-002-city.jpg",
    alt: "ALTITUD 002: modelo con hoodie negro y gráfica posterior en una composición de ciudad, arquitectura y montaña.",
    width: 1122,
    height: 1402,
  },
  sky: {
    src: "/projects/altitud/altitud-003-sky.jpg",
    alt: "ALTITUD 003: look urbano fotografiado desde abajo, con cielo azul, arquitectura y vistas de la bolsa y la prenda.",
    width: 1122,
    height: 1402,
  },
  street: {
    src: "/projects/altitud/altitud-004-street.jpg",
    alt: "ALTITUD en calle: camiseta clara con gráfica posterior, fotografiada en el centro de Oaxaca.",
    width: 900,
    height: 1600,
  },
  fog: {
    src: "/projects/altitud/altitud-005-fog.jpg",
    alt: "ALTITUD 004: hoodie azul y retratos entre niebla, con fotografías de paisaje y detalles gráficos.",
    width: 1122,
    height: 1402,
  },
  lookbook: {
    src: "/projects/altitud/altitud-006-lookbook.jpg",
    alt: "Lookbook ALTITUD al atardecer: modelo con camiseta gráfica y vistas de la prenda y del paisaje oaxaqueño.",
    width: 1024,
    height: 1536,
  },
  product: {
    src: "/projects/altitud/altitud-007-product.jpg",
    alt: "Mockup conceptual de hoodie verde bosque con gráfica de montaña, opciones de color y tallas.",
    width: 1122,
    height: 1402,
  },
} as const;

type ImageKey = keyof typeof images;
function EditorialImage({
  name,
  number,
  caption,
  className = "",
  priority = false,
}: {
  name: ImageKey;
  number: string;
  caption: string;
  className?: string;
  priority?: boolean;
}) {
  const image = images[name];
  const stem = image.src.replace(/\.jpg$/, "");
  const widths = [...new Set([480, Math.min(900, image.width), image.width])];
  const srcSet = widths
    .map((width) => `${stem}-${width}.webp ${width}w`)
    .join(", ");
  const sizes = name === "street"
    ? "(max-width: 760px) 100vw, 75vw"
    : "(max-width: 760px) 100vw, 50vw";
  return (
    <figure className={`altitud-figure ${className}`}>
      <picture>
        <source type="image/webp" srcSet={srcSet} sizes={sizes} />
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
        />
      </picture>
      <figcaption>
        <span>{number} / {caption}</span>
        <span>Oaxaca / MX</span>
      </figcaption>
    </figure>
  );
}

export function AltitudCaseStudy() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "ALTITUD — Streetwear / Oaxaca · Cídiks";
    const frame = window.requestAnimationFrame(() =>
      document.getElementById("altitud")?.scrollIntoView(),
    );
    return () => {
      window.cancelAnimationFrame(frame);
      document.title = previousTitle;
    };
  }, []);

  return (
    <article id="altitud" className="altitud-case" aria-labelledby="altitud-title">
      <section className="altitud-hero" aria-label="ALTITUD, proyecto conceptual">
        <div className="altitud-hero-copy">
          <p className="altitud-micro">Cídiks · Caso conceptual / 002</p>
          <h1 id="altitud-title"><span>ALTI</span><span>TUD<span className="altitud-period">.</span></span></h1>
          <p className="altitud-descriptor">Streetwear / Oaxaca<br />Creative Direction — 2026</p>
          <p className="altitud-manifesto">Raíces en movimiento.</p>
          <div className="altitud-coordinates altitud-micro"><span>17.0732° N</span><span>96.7266° W</span></div>
          <span className="altitud-concept-tag">Concept project</span>
        </div>
        <EditorialImage name="campaign" number="001" caption="Raíces en movimiento" className="altitud-hero-image" priority />
      </section>

      <section className="altitud-intro" aria-labelledby="altitud-intro-title">
        <div className="altitud-disciplines">
          <p className="altitud-label" id="altitud-intro-title">Disciplines</p>
          <ul><li>Creative Direction</li><li>Brand Identity</li><li>Fashion Campaign</li><li>Editorial Design</li><li>Generative AI</li></ul>
        </div>
        <p className="altitud-intro-copy">ALTITUD es un proyecto conceptual de streetwear construido alrededor del territorio oaxaqueño. Explora cómo paisaje, montaña, arquitectura, niebla y cultura urbana pueden convertirse en un lenguaje visual contemporáneo, lejos de una representación turística convencional. Una identidad pensada para vivir en la prenda, la fotografía y la campaña.</p>
      </section>

      <section className="altitud-idea" aria-labelledby="altitud-idea-title">
        <div className="altitud-idea-top">
          <h2 id="altitud-idea-title">Raíces<br /><span>en movimiento.</span></h2>
          <p>La identidad nace de una tensión entre origen y movimiento: pertenecer a un territorio sin permanecer estático.</p>
        </div>
        <ul className="altitud-wordfield" aria-label="Ideas centrales"><li>Territorio</li><li>Ciudad</li><li>Montaña</li><li>Personas</li><li>Memoria</li><li>Movimiento</li><li>Futuro</li></ul>
      </section>

      <section className="altitud-visual-language" aria-labelledby="altitud-visual-title">
        <header className="altitud-section-head"><h2 id="altitud-visual-title">Visual<br />language</h2><p className="altitud-micro">Valles Centrales<br />Series 001</p></header>
        <div className="altitud-image-pair">
          <EditorialImage name="city" number="01" caption="Ciudad y cerro" />
          <EditorialImage name="sky" number="02" caption="Cielo y concreto" className="altitud-offset" />
        </div>
        <EditorialImage name="street" number="03" caption="Mismas raíces. Nuevos caminos." className="altitud-street-image" />
      </section>

      <section className="altitud-product" aria-labelledby="altitud-product-title">
        <header className="altitud-product-head"><h2 id="altitud-product-title">From concept<br />to garment.</h2><p>El sistema visual pasa de campaña a producto mediante gráficos posteriores, símbolos frontales, coordenadas y etiquetas. Cada aplicación conserva una identidad común y su relación con el territorio.</p></header>
        <div className="altitud-image-pair altitud-product-pair">
          <EditorialImage name="product" number="04" caption="Producto / Hoodie territorio" />
          <EditorialImage name="lookbook" number="05" caption="Gráfica / Prenda" className="altitud-offset" />
        </div>
        <p className="altitud-product-note altitud-micro">Series 005 · Mockup conceptual de producto</p>
      </section>

      <section className="altitud-campaign" aria-labelledby="altitud-campaign-title">
        <header className="altitud-campaign-head"><h2 id="altitud-campaign-title">One product.<br />Multiple worlds.</h2><p>Una misma pieza funciona como núcleo de un sistema de contenido. Cambian la atmósfera, la localización y la narrativa; la identidad permanece.</p></header>
        <EditorialImage name="fog" number="06" caption="Niebla / Origen · Serie 004" className="altitud-fog-image" />
      </section>

      <section className="altitud-process" aria-labelledby="altitud-process-title">
        <header className="altitud-section-head"><h2 id="altitud-process-title">Creative<br />process</h2><p className="altitud-micro">Del territorio<br />a la imagen</p></header>
        <ol className="altitud-steps">
          <li><span>01</span><h3>Research</h3><p>Referencias de moda, streetwear, editoriales y campañas; observación del paisaje y la arquitectura local.</p></li>
          <li><span>02</span><h3>Concept</h3><p>Definición de territorio, raíces y movimiento como punto de vista sobre un Oaxaca contemporáneo.</p></li>
          <li><span>03</span><h3>Visual system</h3><p>Tipografía, coordenadas, símbolos, fotografía y composición editorial dentro de un lenguaje reconocible.</p></li>
          <li><span>04</span><h3>Product</h3><p>Aplicación de la identidad a prendas, gráficos, etiquetas y vistas de producto.</p></li>
          <li><span>05</span><h3>Campaign</h3><p>Piezas de campaña que llevan el producto a distintos mundos visuales.</p></li>
          <li><span>06</span><h3>AI + art direction</h3><p>IA generativa como herramienta dentro de un proceso dirigido, seleccionado y refinado creativamente.</p></li>
        </ol>
      </section>

      <section className="altitud-close" aria-labelledby="altitud-close-title">
        <EditorialImage name="campaign" number="ALTITUD" caption="Oaxaca / MX" className="altitud-close-image" />
        <div className="altitud-close-copy"><p className="altitud-micro">Proyecto conceptual / 2026</p><h2 id="altitud-close-title">Mismas raíces.<br /><span>Nuevos caminos.</span></h2><a href="#casos">← Todos los proyectos</a></div>
      </section>
    </article>
  );
}
