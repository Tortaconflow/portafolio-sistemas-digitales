import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('diagnóstico rápido: florería, restaurante, negocio inicial, precedencia, guías y accesibilidad', async ({ page }) => {
  await page.goto('/asesor-ia/');

  // 1. Entrada directa + WhatsApp temprano
  await expect(page.getByRole('heading', { name: '¿Qué tipo de negocio o proyecto tienes?' })).toBeVisible();
  const earlyWa = page.getByRole('link', { name: /Escribir directo por WhatsApp/ });
  await expect(earlyWa).toBeVisible();
  expect(await earlyWa.getAttribute('href')).toContain('https://wa.me/529541621210');

  // 2. Ejemplo A: Florería (comercio + catalogo + redes)
  await page.getByRole('button', { name: /Comercio o tienda local/ }).click();
  await page.getByRole('button', { name: /Mostrar mis productos o servicios con claridad/ }).click();
  await page.getByRole('button', { name: /Redes sociales/ }).click();
  await expect(page.locator('.quick-result')).toHaveAttribute('data-rule-id', 'catalogo');
  const learnLinkA = page.getByRole('link', { name: 'Aprender a hacerlo por mi cuenta' });
  await expect(learnLinkA).toHaveAttribute('href', '/conocimiento/necesito-realmente-una-pagina-web/');
  await expect(page.getByRole('button', { name: 'Quiero ayuda profesional' })).toBeVisible();

  // Abrir ayuda profesional y editar brief
  await page.getByRole('button', { name: 'Quiero ayuda profesional' }).click();
  const finalWa = page.getByRole('link', { name: 'Enviar este brief por WhatsApp' });
  await expect(finalWa).toBeVisible();
  expect(await finalWa.getAttribute('href')).toContain('Comercio+o+tienda+local');
  await page.getByRole('button', { name: /Editar mensaje/ }).click();
  await page.locator('#quick-brief-preview').fill('Hola CÍDIKS, tengo una florería y quiero orientación.');
  expect(await finalWa.getAttribute('href')).toContain('flor');

  // Accesibilidad sin violaciones
  const axe = await new AxeBuilder({ page }).include('main').analyze();
  expect(axe.violations).toEqual([]);

  // 3. Ejemplo B: Restaurante (comida-turismo + visibilidad + redes -> Google Maps condicionado)
  await page.getByRole('button', { name: 'Empezar de nuevo' }).click();
  await page.getByRole('button', { name: /Comida, café o turismo/ }).click();
  await page.getByRole('button', { name: /Que más personas encuentren mi negocio/ }).click();
  await page.getByRole('button', { name: /Redes sociales/ }).click();
  await expect(page.locator('.quick-result')).toHaveAttribute('data-rule-id', 'visibilidad-local');
  await expect(page.getByRole('heading', { name: /Si atiendes en un local o zona definida/ })).toBeVisible();
  await expect(learnLinkA).toHaveAttribute('href', '/conocimiento/google-maps-perfil-de-negocio/');

  // 4. Regla en conflicto / precedencia: visibilidad + web-actual -> revisar web actual
  await page.getByRole('button', { name: /Corregir última respuesta/ }).click();
  await page.getByRole('button', { name: /Ya tengo página web/ }).click();
  await expect(page.locator('.quick-result')).toHaveAttribute('data-rule-id', 'audit-web');
  await expect(learnLinkA).toHaveAttribute('href', '/conocimiento/como-saber-si-una-herramienta-digital-esta-funcionando/');

  // 5. Ejemplo C: Negocio empezando / incierto -> exploratorio (sin descartar ni recomendar web categóricamente)
  await page.getByRole('button', { name: 'Empezar de nuevo' }).click();
  await page.getByRole('button', { name: /No estoy seguro \/ estoy empezando/ }).click();
  await page.getByRole('button', { name: /No estoy seguro, quiero orientación/ }).click();
  await page.getByRole('button', { name: /Todavía no tengo canales digitales/ }).click();
  await expect(page.locator('.quick-result')).toHaveAttribute('data-rule-id', 'exploratory');
  await expect(learnLinkA).toHaveAttribute('href', '/conocimiento/diferencia-entre-presencia-digital-y-sistema-digital/');

  // 6. Verificar que las guías enlazadas cargan HTTP 200 y las 3 prioritarias incluyen el bloque práctico en celular
  for (const [href, expectedText] of [
    ['/conocimiento/necesito-realmente-una-pagina-web/', 'Empieza hoy desde tu celular'],
    ['/conocimiento/google-maps-perfil-de-negocio/', 'Antes de empezar: ¿aplica para tu negocio?'],
    ['/conocimiento/whatsapp-y-seguimiento-de-clientes/', 'Plantillas listas para copiar y adaptar'],
    ['/conocimiento/como-saber-si-una-herramienta-digital-esta-funcionando/', ''],
    ['/conocimiento/diferencia-entre-presencia-digital-y-sistema-digital/', ''],
  ]) {
    const res = await page.request.get(href);
    expect(res.status()).toBe(200);
    if (expectedText) {
      expect(await res.text()).toContain(expectedText);
    }
  }
});

test('plantillas WhatsApp Business: botón Copiar exacto, confirmación accesible y alternativa si falla portapapeles', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/conocimiento/whatsapp-y-seguimiento-de-clientes/');

  const templates = page.locator('[data-copy-template]');
  await expect(templates).toHaveCount(3);

  for (let i = 0; i < 3; i++) {
    const box = templates.nth(i);
    const expected = (await box.locator('[data-copy-source]').textContent()) ?? '';
    const btn = box.locator('[data-copy-button]');
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(box.locator('[data-copy-status]')).toHaveText('Plantilla copiada al portapapeles.');
    const actual = await page.evaluate(() => navigator.clipboard.readText());
    expect(actual).toBe(expected);
  }

  // Alternativa comprensible si falla el portapapeles
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    });
  });
  const firstBox = templates.nth(0);
  await firstBox.locator('[data-copy-button]').click();
  await expect(firstBox.locator('[data-copy-status]')).toContainText('El texto quedó seleccionado');
  const selected = await page.evaluate(() => window.getSelection()?.toString() ?? '');
  expect(selected).toBe((await firstBox.locator('[data-copy-source]').textContent()) ?? '');

  const axe = await new AxeBuilder({ page }).include('main').analyze();
  expect(axe.violations).toEqual([]);
});
