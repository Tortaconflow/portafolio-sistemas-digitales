import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';

async function start(page: Page) { await page.goto('/asesor-ia/'); await page.getByRole('button', { name: /Prefiero contar mi idea/ }).click(); }
async function send(page: Page, text: string) { await page.getByLabel('Cuéntanos qué tienes en mente', { exact: true }).fill(text); await page.getByRole('button', { name: 'Enviar mensaje', exact: true }).click(); await expect(page.getByRole('button', { name: 'Enviar mensaje', exact: true })).toBeEnabled(); await expect(page.locator('.hybrid-message.assistant').last()).toBeVisible(); }
async function confirm(page: Page, field: string) { await page.getByRole('button', { name: `Confirmar interpretación de ${field}`, exact: true }).click(); }
async function accessible(page: Page) { const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze(); expect(result.violations, JSON.stringify(result.violations, null, 2)).toEqual([]); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true); }

test('entrada clara, conversación accesible, confirmación y cambio de modo sin pérdida', async ({ page }, info) => {
  await page.goto('/asesor-ia/'); await accessible(page);
  const folder = process.env.CIDIKIS_PREVIEW_DIR;
  if (folder) { await mkdir(folder, { recursive: true }); await page.screenshot({ path: `${folder}/entrada-${info.project.name}.png`, fullPage: true }); }
  await page.getByRole('button', { name: /Prefiero contar mi idea/ }).click();
  await expect(page.getByRole('heading', { name: 'Cuéntanos tu idea', exact: true })).toBeFocused();
  await send(page, 'Tengo una barbería y quiero conseguir más clientes, pero no sé qué necesito');
  await expect(page.getByRole('log')).toContainText('¿Cómo te encuentran');
  await confirm(page, 'actividad'); await confirm(page, 'objetivo');
  await send(page, 'Nos contactan por WhatsApp e Instagram'); await confirm(page, 'canales actuales');
  await expect(page.getByRole('log')).toContainText('¿En qué momento');
  await send(page, 'Se pierden consultas porque tardamos en responder'); await confirm(page, 'problema');
  await accessible(page);
  if (folder) await page.screenshot({ path: `${folder}/chat-${info.project.name}.png`, fullPage: true });
  await page.getByRole('button', { name: 'Responder preguntas', exact: true }).click();
  await expect(page.locator('#advisor-activity')).toHaveValue('Tengo una barbería');
  await page.locator('#advisor-sector').selectOption('servicios');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.locator('#advisor-problem')).toHaveValue('Se pierden consultas porque tardamos en responder');
  await page.getByRole('button', { name: 'Conversar sobre mi idea', exact: true }).click();
  await expect(page.getByRole('log')).toContainText('Nos contactan por WhatsApp');
  await page.getByRole('button', { name: 'Generar un brief con lo comprendido', exact: true }).click();
  await expect(page.locator('textarea[id^="advisor-brief-"]')).toHaveCount(12);
  await expect(page.locator('#advisor-brief-sector')).toHaveValue(/barbería/);
  await expect(page.locator('#advisor-brief-objectives')).toHaveValue('conseguir más clientes');
  await page.locator('#advisor-brief-problem').fill('Necesitamos responder consultas con claridad ');
  await expect(page.getByRole('button', { name: 'Copiar brief', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Conversar sobre mi idea', exact: true }).click();
  await expect(page.getByText('Guarda o descarta las ediciones del brief antes de cambiar de modo.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Guardar ediciones del brief', exact: true }).click();
  await expect(page.getByLabel('Vista previa del mensaje', { exact: true })).toHaveValue(/Necesitamos responder consultas con claridad /);
  await accessible(page);
  if (folder) await page.screenshot({ path: `${folder}/brief-${info.project.name}.png`, fullPage: true });
});

for (const [business, text] of [['tatuajes', 'Tengo un estudio de tatuajes y quiero organizar citas'], ['turismo', 'Ofrezco recorridos en Oaxaca y quiero recibir más reservas'], ['incompleto', 'Tengo una idea, pero no sé cómo empezar']]) {
  test(`brief parcial honesto: ${business}`, async ({ page }) => {
    await start(page); await send(page, text); await confirm(page, 'actividad');
    await page.getByRole('button', { name: 'Generar un brief con lo comprendido', exact: true }).click();
    await expect(page.locator('#advisor-brief-sector')).toHaveValue(new RegExp(text.split(/[,.;]| y quiero| pero /i)[0]));
    await expect(page.locator('#advisor-brief-pendingQuestions')).toHaveValue(/Por conocer/);
    await expect(page.locator('#advisor-brief-requestedFeatures')).toHaveValue('Pendiente de conocer.');
    await expect(page.getByLabel('Vista previa del mensaje', { exact: true })).toHaveValue(/Simulación local, sin IA conectada/);
  });
}

test('contradicción explícita conserva el dato previo; corrección invalida la propuesta', async ({ page }) => {
  await start(page); await send(page, 'Tengo una barbería y quiero conseguir más clientes'); await confirm(page, 'actividad');
  await send(page, 'Corrijo: actividad = Tengo un estudio de tatuajes');
  await expect(page.getByText(/Hay una contradicción/)).toBeVisible();
  await expect(page.locator('.hybrid-facts').getByText('Tengo una barbería', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Descartar interpretación de actividad', exact: true }).click();
  await page.getByRole('button', { name: 'Corregir actividad', exact: true }).click();
  await page.getByLabel('Corregir actividad', { exact: true }).fill('Barbería para familias');
  await page.getByRole('button', { name: 'Guardar corrección de actividad', exact: true }).click();
  await page.getByRole('button', { name: 'Responder preguntas', exact: true }).click();
  await expect(page.locator('#advisor-activity')).toHaveValue('Barbería para familias');
  await page.getByRole('button', { name: 'Conversar sobre mi idea', exact: true }).click();
  await expect(page.locator('.hybrid-facts').getByText('Barbería para familias', { exact: true })).toBeVisible();
});

test('mensajes temporales, límites, fallback y ausencia de peticiones externas', async ({ page, context }) => {
  const external: string[] = [];
  await context.route('**/*', route => { const host = new URL(route.request().url()).hostname; if (!['localhost','127.0.0.1'].includes(host)) { external.push(host); return route.abort(); } return route.continue(); });
  await start(page);
  for (let i = 0; i < 8; i++) { await page.getByLabel('Cuéntanos qué tienes en mente', { exact: true }).fill(`Tengo una idea número ${i}`); await page.getByRole('button', { name: 'Enviar mensaje', exact: true }).click(); await expect(page.locator('.hybrid-chat form[aria-busy]')).toHaveAttribute('aria-busy', 'false'); }
  await expect(page.getByRole('button', { name: 'Enviar mensaje', exact: true })).toBeDisabled();
  await expect(page.getByText(/Se agotaron los turnos/)).toBeVisible();
  await page.getByRole('button', { name: 'Responder preguntas', exact: true }).click(); await expect(page.locator('#advisor-sector')).toBeVisible();
  expect(external).toEqual([]); expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  await page.reload(); await page.getByRole('button', { name: /Prefiero contar mi idea/ }).click(); await expect(page.locator('.hybrid-message')).toHaveCount(0);
});

test('modo guiado a conversación retiene borradores y regresa al mismo paso', async ({ page }) => {
  await page.goto('/asesor-ia/'); await page.getByRole('button', { name: /Quiero responder unas preguntas/ }).click();
  await page.locator('#advisor-sector').selectOption('turismo'); await page.locator('#advisor-activity').fill('Recorridos en Oaxaca');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click(); await page.locator('#advisor-problem').fill('Las consultas no se convierten en reservas');
  await page.getByRole('button', { name: 'Conversar sobre mi idea', exact: true }).click();
  await expect(page.locator('.hybrid-facts').getByText('Las consultas no se convierten en reservas', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar problema', exact: true }).click();
  await page.getByRole('button', { name: 'Responder preguntas', exact: true }).click();
  await expect(page.locator('form[data-advisor-step]')).toHaveAttribute('data-advisor-step', '2'); await expect(page.locator('#advisor-problem')).toHaveValue('Las consultas no se convierten en reservas');
});

test('un brief anterior conserva ediciones y bloquea compartir después de una corrección', async ({ page }) => {
  await start(page); await send(page, 'Tengo una barbería y quiero conseguir más clientes'); await confirm(page, 'actividad');
  await page.getByRole('button', { name: 'Generar un brief con lo comprendido', exact: true }).click();
  await page.locator('#advisor-brief-problem').fill('Edición manual del primer brief'); await page.getByRole('button', { name: 'Guardar ediciones del brief', exact: true }).click();
  await page.getByRole('button', { name: 'Conversar sobre mi idea', exact: true }).click();
  await page.getByRole('button', { name: 'Corregir actividad', exact: true }).click(); await page.getByLabel('Corregir actividad', { exact: true }).fill('Barbería para familias'); await page.getByRole('button', { name: 'Guardar corrección de actividad', exact: true }).click();
  await page.getByRole('button', { name: 'Ver mi brief guardado', exact: true }).click();
  await expect(page.locator('#advisor-brief-problem')).toHaveValue('Edición manual del primer brief'); await expect(page.getByRole('button', { name: 'Copiar brief', exact: true })).toBeDisabled();
  await expect(page.getByText(/Cambió lo comprendido desde este brief/)).toBeVisible();
  await page.getByRole('button', { name: 'Conversar sobre mi idea', exact: true }).click(); await page.getByRole('button', { name: 'Generar un brief con lo comprendido', exact: true }).click();
  await page.getByRole('button', { name: 'Conservar mi brief guardado', exact: true }).click();
  await page.getByRole('button', { name: 'Generar un brief con lo comprendido', exact: true }).click(); await page.getByRole('button', { name: 'Reemplazar mi brief guardado', exact: true }).click();
  await expect(page.locator('#advisor-brief-sector')).toHaveValue(/Barbería para familias/); await expect(page.getByRole('button', { name: 'Copiar brief', exact: true })).toBeEnabled();
});

test('reinicio elimina la conversación y sus datos; navegación por teclado y ancho 320', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 }); await start(page); await send(page, 'Tengo una barbería y quiero conseguir más clientes'); await confirm(page, 'actividad');
  await page.getByRole('button', { name: 'Generar un brief con lo comprendido', exact: true }).click(); await accessible(page);
  await page.getByRole('button', { name: 'Empezar de nuevo', exact: true }).click(); await page.getByRole('button', { name: 'Sí, borrar y empezar', exact: true }).click();
  await page.getByRole('button', { name: 'Conversar sobre mi idea', exact: true }).click(); await expect(page.locator('.hybrid-message')).toHaveCount(0);
  await expect(page.locator('.hybrid-facts').getByText('Tengo una barbería', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/7 turnos disponibles/)).toBeVisible();
  await page.getByLabel('Cuéntanos qué tienes en mente', { exact: true }).focus(); await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Enviar mensaje', exact: true })).toBeFocused(); await accessible(page);
});
