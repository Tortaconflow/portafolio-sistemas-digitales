export function EngineeringPhilosophy() {
  return (
    <section
      className="section container responsible-build"
      aria-labelledby="engineering-title"
    >
      <p className="eyebrow">VELOCIDAD CON REVISIÓN</p>
      <h2 id="engineering-title">
        Crear rápido, con decisiones que puedas revisar.
      </h2>
      <p className="section-description">
        La entrega incluye comprobar lo que acordamos y explicar sus límites.
        Estas prácticas se definen según el proyecto; no equivalen a una
        certificación ni a una garantía de seguridad absoluta.
      </p>
      <div className="responsible-grid">
        <article>
          <h3>Datos y accesos</h3>
          <p>
            Credenciales fuera del código público, permisos mínimos e
            información personal limitada a lo necesario. Las acciones sensibles
            requieren revisión humana.
          </p>
        </article>
        <article>
          <h3>Revisar antes de publicar</h3>
          <p>
            Validación de entradas, navegación, experiencia móvil y
            dependencias. Respaldos y recuperación cuando el proyecto guarda
            datos.
          </p>
        </article>
        <article>
          <h3>Entregar con contexto</h3>
          <p>
            Alcance, decisiones, guía de uso y puntos pendientes. Seguimiento y
            mantenimiento según lo acordado.
          </p>
        </article>
      </div>
      <details>
        <summary>Qué está aplicado en este sitio</summary>
        <ul className="checklist">
          <li>
            Archivos estáticos: el formulario prepara el mensaje localmente y no
            guarda datos en una base.
          </li>
          <li>
            Eventos mínimos con exclusión de nombres, mensajes y contacto
            personal; sin plataforma externa de analítica instalada.
          </li>
          <li>
            Imágenes con dimensiones reservadas, WebP en los casos y módulos de
            diagnóstico cargados al entrar en esa vista.
          </li>
          <li>
            Comprobación de TypeScript y control de contenido antes del build.
            El código tiene historial de cambios en Git.
          </li>
        </ul>
        <p>
          El rendimiento se valida con mediciones fechadas y condiciones
          explícitas. Los resultados en dispositivos y conexiones reales pueden
          variar.
        </p>
        <a
          className="inline-link"
          href="/conocimiento/seguridad-en-la-entrega-digital/"
        >
          Guía de preguntas para una entrega responsable ↗
        </a>
      </details>
    </section>
  );
}
