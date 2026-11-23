import { test, expect } from '@playwright/test';

const publishedSite = 'https://reilycastro.com/';
const endpoint = 'https://cidiks-ia-advisor.reilyvica.workers.dev';

test('el asesor conversacional conserva sus mensajes en el navegador en el dominio real', async ({ page, request, baseURL }) => {
  await page.route(`${publishedSite}**`, async route => {
    const path = new URL(route.request().url()).pathname;
    await route.fulfill({ response: await request.get(new URL(path, baseURL).href) });
  });
  const externalRequests: string[] = [];
  await page.route(/^https:\/\/(?:challenges\.cloudflare\.com|cidiks-ia-advisor\.reilyvica\.workers\.dev)\//, route => {
    externalRequests.push(route.request().url());
    return route.abort();
  });
  await page.goto(`${publishedSite}asesor-ia/`);
  await page.getByRole('button', { name: 'Prefiero contar mi idea' }).click();
  await page.getByRole('textbox', { name: 'Cuéntanos qué tienes en mente' }).fill('Tengo un taller y pierdo citas entre llamadas y mensajes');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('log', { name: 'Conversación guiada' }).getByText('CÍDIKS · GUÍA AUTOMÁTICA')).toBeVisible();
  expect(externalRequests).toEqual([]);
});

for (const size of [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 15', width: 390, height: 844 },
  { name: 'Android', width: 412, height: 915 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'escritorio', width: 1440, height: 900 },
]) {
  test(`chat flotante responsive sin desbordes: ${size.name}`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto('/');
    await page.getByRole('button', { name: /Abrir asistente/ }).click();
    const panel = page.getByRole('dialog', { name: 'Asistente CÍDIKS IA' });
    await expect(panel).toBeVisible();

    const box = await panel.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(size.width + 0.5);
    expect(box!.y + box!.height).toBeLessThanOrEqual(size.height + 0.5);

    // Cada elemento interactivo queda dentro del panel visible.
    for (const locator of [panel.getByRole('textbox'), panel.getByRole('button', { name: 'Enviar' }), panel.getByRole('button', { name: /Cerrar asistente$/ })]) {
      const b = await locator.boundingBox();
      expect(b).not.toBeNull();
      expect(b!.x + b!.width).toBeLessThanOrEqual(size.width + 0.5);
    }
    for (const chip of await panel.locator('.cidiks-chat-chip').all()) {
      const b = await chip.boundingBox();
      expect(b!.x).toBeGreaterThanOrEqual(0);
      expect(b!.x + b!.width).toBeLessThanOrEqual(size.width + 0.5);
    }

    // 16px evita el zoom automático de iOS Safari al enfocar el campo.
    const fontSize = await panel.getByRole('textbox').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(16);

    // La página no gana desplazamiento horizontal por abrir el chat.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    // Objetivos táctiles de al menos 44px.
    const input = await panel.getByRole('textbox').boundingBox();
    expect(input!.height).toBeGreaterThanOrEqual(44);
  });
}

test('orienta con lenguaje informal y retoma el canal que la persona ya mencionó', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Abrir asistente/ }).click();
  const panel = page.getByRole('dialog', { name: 'Asistente CÍDIKS IA' });
  await expect(panel).toContainText('Puedes escribir como hablas.');
  await expect(panel.getByRole('textbox')).toHaveAccessibleDescription(/Cloudflare Workers AI/);

  await panel.getByRole('button', { name: 'Me cuesta atender pedidos' }).click();
  await expect(panel.getByRole('log')).toContainText('¿Por dónde te llegan más pedidos hoy');
  await panel.getByRole('textbox').fill('por wasap');
  await panel.getByRole('button', { name: 'Enviar' }).click();
  await expect(panel.getByRole('log')).toContainText('3 a 5 respuestas rápidas');

  await panel.getByRole('textbox').fill('vendo gelatinas me preguntan cuanto y donde x wasap y se me juntan');
  await panel.getByRole('button', { name: 'Enviar' }).click();
  await expect(panel.getByRole('log')).toContainText('una respuesta corta con esa información');
  await expect(panel.getByRole('log')).not.toContainText('Google Maps');

  await panel.getByRole('textbox').fill('¿Web o solo WhatsApp?');
  await panel.getByRole('button', { name: 'Enviar' }).click();
  await expect(panel.getByRole('log')).toContainText('empezaría por ordenar WhatsApp antes de invertir en una web');
});

test('permite seguir con la guía sin conexión y conserva la pregunta en la pestaña', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Abrir asistente/ }).click();
  const panel = page.getByRole('dialog', { name: 'Asistente CÍDIKS IA' });
  const message = 'Tengo un taller y pierdo citas entre llamadas y mensajes';
  await context.setOffline(true);
  await panel.getByRole('textbox').fill(message);
  await panel.getByRole('button', { name: 'Enviar' }).click();
  await expect(panel.getByRole('status')).toContainText('se cortó la conexión');
  await panel.getByRole('button', { name: 'Seguir con la guía' }).click();
  await panel.getByRole('button', { name: 'Quiero ordenar mi WhatsApp' }).click();
  await expect(panel.getByText(/Configura en WhatsApp Business/)).toBeVisible();
  await panel.getByRole('button', { name: 'Cerrar asistente', exact: true }).click();
  await page.getByRole('button', { name: /Abrir asistente/ }).click();
  await expect(panel.getByRole('textbox')).toHaveValue(message);
});

test('reintenta la carga de Turnstile y usa el mismo ID si se pierde la conexión con el Worker', async ({ page, request, baseURL }) => {
  const site = publishedSite;
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route(`${site}**`, async (route) => {
    const local = new URL(route.request().url()).pathname;
    await route.fulfill({ response: await request.get(new URL(local, baseURL).href) });
  });

  let turnstileLoads = 0;
  await page.route(/^https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/, (route) => {
    turnstileLoads++;
    if (turnstileLoads === 1) return route.abort();
    return route.fulfill({
      contentType: 'application/javascript',
      body: 'window.turnstile = { render(_el, config) { config.callback("fixture-token"); return "fixture"; }, remove() {} };',
    });
  });

  const requestIds: string[] = [];
  await page.route(`${endpoint}/v2/**`, (route) => {
    if (route.request().url().endsWith('/session')) {
      return route.fulfill({ json: { sessionToken: 'fixture-session' } });
    }
    requestIds.push(route.request().postDataJSON().requestId);
    if (requestIds.length === 1) return route.abort();
    return route.fulfill({ headers: { 'Server-Timing': 'inference;dur=87', 'Access-Control-Expose-Headers': 'Server-Timing' }, json: { reply: 'Prueba apuntar las citas en un solo lugar.' } });
  });

  await page.goto(site);
  await page.getByRole('button', { name: /Abrir asistente/ }).click();
  const panel = page.getByRole('dialog', { name: 'Asistente CÍDIKS IA' });
  const message = 'Tengo un taller y pierdo citas entre llamadas y mensajes';
  await panel.getByRole('textbox').fill(message);
  await panel.getByRole('button', { name: 'Enviar' }).click();
  await expect(panel.getByRole('status')).toContainText('No pude completar la verificación');
  await expect(panel.getByRole('textbox')).toHaveValue(message);
  await panel.getByRole('button', { name: 'Reintentar' }).click();
  await expect(panel.getByRole('status')).toContainText('No pude recibir una respuesta');
  await expect(panel.getByRole('textbox')).toHaveValue(message);
  await panel.getByRole('button', { name: 'Reintentar' }).click();
  await expect(panel.getByRole('log')).toContainText('Prueba apuntar las citas en un solo lugar.');
  await expect(panel.getByRole('log').getByText(message, { exact: true })).toHaveCount(1);
  await expect(panel.getByRole('textbox')).toBeEmpty();
  expect(turnstileLoads).toBe(2);
  expect(requestIds).toHaveLength(2);
  expect(requestIds[1]).toBe(requestIds[0]);
  const timing = await page.evaluate(() => window.cidiksAnalyticsBuffer?.filter(event => event.event === 'chat_timing').map(event => event.data) ?? []);
  expect(timing).toEqual(expect.arrayContaining([
    expect.objectContaining({ stage: 'turnstile', outcome: 'error' }),
    expect.objectContaining({ stage: 'turnstile', outcome: 'ok' }),
    expect.objectContaining({ stage: 'request', outcome: 'error' }),
    { stage: 'model', outcome: 'ok', duration_ms: 87 },
    expect.objectContaining({ stage: 'request', outcome: 'ok' }),
  ]));
  expect(timing.every(event => Object.keys(event).sort().join(',') === 'duration_ms,outcome,stage')).toBe(true);
});
