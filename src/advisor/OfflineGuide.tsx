import { chatOrientation, GUIDED_CHAT_OPTIONS } from '../../shared/floating-chat-guidance.ts';

export function OfflineGuide() {
  return (
    <main>
      <a className="brand" href="/">CÍDIKS</a>
      <h1>Un primer paso para tu negocio</h1>
      <p>Elige lo que te gustaría mejorar hoy.</p>
      <section aria-label="Opciones de la guía rápida">
        {GUIDED_CHAT_OPTIONS.map(option => {
          const orientation = chatOrientation(option);
          return (
            <details key={option.label}>
              <summary>{option.label}</summary>
              <p>{orientation.freeStep}</p>
              <a href={orientation.guideHref}>Leer la guía completa</a>
            </details>
          );
        })}
      </section>
      <p data-guide-status role="status">Abre esta guía con conexión una vez para poder volver cuando te falte señal.</p>
      <a href="/asesor-ia/">Hacer el diagnóstico de tres preguntas</a>
    </main>
  );
}
