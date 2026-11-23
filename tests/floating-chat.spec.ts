import { test, expect } from '@playwright/test';

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
  const site = 'https://reilycastro.com/';
  const endpoint = 'https://cidiks-ia-advisor.reilyvica.workers.dev';
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
    return route.fulfill({ json: { reply: 'Prueba apuntar las citas en un solo lugar.' } });
  });

  await page.goto(site);
  await page.getByRole('button', { name: /Abrir asistente/ }).click();
  const panel = page.getByRole('dialog', { name: 'Asistente CÍDIKS IA' });
  const message = 'Tengo un taller y pierdo citas entre llamadas y mensajes';
  await panel.getByRole('textbox').fill(message);
  await panel.getByRole('button', { name: 'Enviar' }).click();
  // La precarga al abrir el chat consumió el primer fallo de carga en silencio:
  // el envío reintenta la carga por su cuenta y llega hasta el Worker.
  await expect(panel.getByRole('status')).toContainText('No pude recibir una respuesta');
  await expect(panel.getByRole('textbox')).toHaveValue(message);
  await panel.getByRole('button', { name: 'Reintentar' }).click();
  await expect(panel.getByRole('log')).toContainText('Prueba apuntar las citas en un solo lugar.');
  await expect(panel.getByRole('log').getByText(message, { exact: true })).toHaveCount(1);
  await expect(panel.getByRole('textbox')).toBeEmpty();
  expect(turnstileLoads).toBe(2);
  expect(requestIds).toHaveLength(2);
  expect(requestIds[1]).toBe(requestIds[0]);
});

async function mockSite(page: import('@playwright/test').Page, request: import('@playwright/test').APIRequestContext, baseURL: string | undefined) {
  const site = 'https://reilycastro.com/';
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route(`${site}**`, async (route) => {
    const local = new URL(route.request().url()).pathname;
    await route.fulfill({ response: await request.get(new URL(local, baseURL).href) });
  });
  await page.route('https://cidiks-ia-advisor.reilyvica.workers.dev/v2/**', (route) => {
    if (route.request().url().endsWith('/session')) return route.fulfill({ json: { sessionToken: 'fixture-session' } });
    return route.fulfill({ json: { reply: 'Prueba apuntar las citas en un solo lugar.' } });
  });
  return site;
}

const turnstileFixture = (body: string) => (route: import('@playwright/test').Route) =>
  route.fulfill({ contentType: 'application/javascript', body: `window.turnstile = { ${body}, remove() {}, reset() {} };` });

async function askOnce(page: import('@playwright/test').Page, site: string) {
  await page.goto(site);
  await page.getByRole('button', { name: /Abrir asistente/ }).click();
  const panel = page.getByRole('dialog', { name: 'Asistente CÍDIKS IA' });
  await panel.getByRole('textbox').fill('Tengo un taller y pierdo citas entre llamadas y mensajes');
  await panel.getByRole('button', { name: 'Enviar' }).click();
  return panel;
}

test('un error reintentable de Turnstile (600010) no cancela la verificación: el widget reintenta y el chat responde', async ({ page, request, baseURL }) => {
  const site = await mockSite(page, request, baseURL);
  await page.route(/^https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/, turnstileFixture(
    `render(_el, config) { config['error-callback']('600010'); setTimeout(() => config.callback('fixture-token'), 50); return 'fixture'; }`,
  ));
  const panel = await askOnce(page, site);
  await expect(panel.getByRole('log')).toContainText('Prueba apuntar las citas en un solo lugar.');
});

test('un error de configuración de Turnstile (dominio no autorizado) falla de inmediato con un mensaje específico', async ({ page, request, baseURL }) => {
  const site = await mockSite(page, request, baseURL);
  await page.route(/^https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/, turnstileFixture(
    `render(_el, config) { config['error-callback']('110200'); return 'fixture'; }`,
  ));
  const panel = await askOnce(page, site);
  await expect(panel.getByRole('status')).toContainText('no está disponible en este momento');
});

test('si el script de Cloudflare no carga, el mensaje lo dice y la pregunta se conserva', async ({ page, request, baseURL }) => {
  const site = await mockSite(page, request, baseURL);
  await page.route(/^https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/, (route) => route.abort());
  const panel = await askOnce(page, site);
  await expect(panel.getByRole('status')).toContainText('No pude cargar la verificación de seguridad');
  await expect(panel.getByRole('textbox')).toHaveValue('Tengo un taller y pierdo citas entre llamadas y mensajes');
});
