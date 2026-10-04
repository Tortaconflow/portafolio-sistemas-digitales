import { Component, type ReactNode } from "react";
export class SiteErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="container section" id="main">
          <p className="eyebrow">CÍDIKS · REILY CASTRO</p>
          <h1>No pudimos cargar esta vista.</h1>
          <p>
            Comprueba tu conexión. Si el sitio acaba de actualizarse, recargar
            permite obtener la versión disponible.
          </p>
          <button className="button" onClick={() => window.location.reload()}>
            Recargar la página
          </button>
          <p>
            <a href="https://wa.me/529541621210">
              También puedes conversar por WhatsApp ↗
            </a>
          </p>
        </main>
      );
    return this.props.children;
  }
}
