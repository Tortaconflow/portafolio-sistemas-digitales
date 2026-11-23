import { test, expect } from '@playwright/test';

test('la portada y la guía muestran un primer paso con JavaScript apagado', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 320, height: 568 } });
  try {
    const page = await context.newPage();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('link', { name: /guía rápida para poca señal/ }).click();
    await expect(page).toHaveURL(/\/guia-rapida\/$/);
    await page.getByText('Quiero ordenar mi WhatsApp', { exact: true }).click();
    await expect(page.getByText(/configura en WhatsApp Business/i)).toBeVisible();
  } finally {
    await context.close();
  }
});

test('reabre la guía sin conexión después de la primera visita', async ({ page, context }) => {
  await page.goto('/guia-rapida/');
  await expect(page.getByRole('status')).toContainText('lista para reabrir sin conexión');
  const cached = await page.evaluate(async () => {
    const name = (await caches.keys()).find(key => key.startsWith('cidiks-offline-guide-'))!;
    return (await (await caches.open(name)).keys()).map(request => new URL(request.url).pathname).sort();
  });
  expect(cached).toEqual([
    '/guia-rapida/',
    expect.stringMatching(/^\/guia-rapida\/guia-[a-f0-9]+\.css$/),
    expect.stringMatching(/^\/guia-rapida\/registro-[a-f0-9]+\.js$/),
  ]);

  await context.setOffline(true);
  await page.reload();
  await page.getByText('Quiero revisar mi página', { exact: true }).click();
  await expect(page.getByText(/Abre tu página desde un celular/)).toBeVisible();
});
