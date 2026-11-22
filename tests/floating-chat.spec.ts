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
