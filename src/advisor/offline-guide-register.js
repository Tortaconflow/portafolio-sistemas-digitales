if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./offline.js', { updateViaCache: 'none' }).then(async () => {
    await navigator.serviceWorker.ready;
    const showReady = () => {
      const status = document.querySelector('[data-guide-status]');
      if (status && navigator.serviceWorker.controller) {
        status.textContent = 'La guía está lista para reabrir sin conexión en este navegador.';
      }
    };
    navigator.serviceWorker.addEventListener('controllerchange', showReady, { once: true });
    showReady();
  }).catch(() => {
    const status = document.querySelector('[data-guide-status]');
    if (status) status.textContent = 'Puedes usar esta guía ahora. La copia sin conexión todavía no está lista.';
  });
}
