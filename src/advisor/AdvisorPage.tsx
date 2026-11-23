import { content } from "../content.ts";
import { SiteHeader, SiteFooter } from "../KnowledgePage.tsx";

/** Build-time HTML remains readable without JavaScript or any AI service. */
export function AdvisorPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="advisor container">
        <nav aria-label="Ruta de navegación" className="editorial-breadcrumb">
          <a href="/">Inicio</a><span aria-hidden="true">/</span>
          <span aria-current="page">{content.advisor.name}</span>
        </nav>
        <div className="advisor-intro">
          <p className="eyebrow">COMPRENDER LA RAÍZ. CONSTRUIR CON SENTIDO.</p>
          <h1>{content.advisor.name}</h1>
          <p className="advisor-lead">Dale forma a lo que tu negocio necesita.</p>
          <p>Cuéntanos qué quieres resolver, explora referencias y prepara un brief
            que puedas revisar antes de conversar con CÍDIKS.</p>
          <p className="advisor-mode">Asesor guiado CÍDIKS · Diagnóstico paso a paso con reglas guiadas · Sin IA conectada</p>
        </div>
        <div id="advisor-root">
          <p>El recorrido guiado requiere JavaScript. La información de esta página
            y las <a href="/conocimiento/">guías de CÍDIKS</a> siguen disponibles.
            También puedes <a href="/#contacto">contarnos qué necesitas</a>.</p>
        </div>
        <section className="advisor-explainer" aria-labelledby="advisor-how">
          <h2 id="advisor-how">Una guía para empezar con criterio.</h2>
          <p>Primero entendemos tu actividad, el problema y tus objetivos. Después
            reunimos preferencias y recursos para proponer qué conviene revisar.</p>
          <p>El diagnóstico utiliza reglas locales reutilizadas de CÍDIKS y ASTRA.
            Sus recomendaciones son hipótesis para conversar, no una auditoría
            completa, cotización ni compromiso de resultados o plazos.</p>
          <p>Las referencias son enlaces seleccionados para explorar patrones.
            Recibir una URL no significa que hayamos analizado visualmente esa web.</p>
          <p>No necesitas nombre, correo ni teléfono para usar el recorrido.
            Tus respuestas permanecen en la memoria de esta pestaña y se borran
            al recargar o cerrarla. Este recorrido guiado no envía respuestas a proveedores
            de IA ni a un servidor de CÍDIKS. El chat flotante es distinto: si pides
            una respuesta en línea, su servicio de IA (Cloudflare Workers AI) recibe
            tu mensaje y hasta seis anteriores.</p>
          <p>Compartir es tu decisión: revisa el mensaje antes de abrir WhatsApp.
            El envío se completa en esa aplicación, con sus propias condiciones de
            privacidad. No se confirma recepción desde este sitio.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
