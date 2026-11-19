import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const activity = "Taller de bicicletas: mantenimiento y reparación.";
const problem = "Las consultas llegan por WhatsApp y perdemos el seguimiento.";
async function continueStep(page: Page, step: number) {
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.locator("form[data-advisor-step]")).toHaveAttribute("data-advisor-step", String(step));
  await expect(page.locator("#advisor-step-title")).toBeFocused();
}
async function business(page: Page) {
  await page.goto("/asesor-ia/");
  await page.getByRole('button', { name: /Quiero responder unas preguntas/ }).click();
  await page.getByRole("combobox", { name: "Tipo de negocio", exact: true }).selectOption("servicios");
  await page.getByRole("textbox", { name: "¿Qué vendes o qué servicio ofreces principalmente?", exact: true }).fill(activity);
  await continueStep(page, 2);
}
async function diagnosis(page: Page) {
  await page.getByRole("textbox", { name: "¿Qué problema o fricción te gustaría resolver primero?", exact: true }).fill(problem);
  await page.getByRole("radio", { name: "Organizar mejor a mis clientes", exact: true }).check();
  await page.getByRole("radio", { name: "Olvidar escribirle a clientes que dejaron su mensaje hace días", exact: true }).check();
  await page.getByRole("radio", { name: "Estructurar bien las bases del negocio con visión a mediano plazo", exact: true }).check();
  await continueStep(page, 3);
}
async function finish(page: Page) {
  await continueStep(page, 4);
  await page.getByRole("button", { name: "Generar mi brief", exact: true }).click();
  await expect(page.locator("form[data-advisor-step]")).toHaveAttribute("data-advisor-step", "5");
  await expect(page.locator("#advisor-step-title")).toBeFocused();
}
async function fullBrief(page: Page) {
  await business(page);
  await diagnosis(page);
  await finish(page);
}
async function accessible(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(result.violations, JSON.stringify(result.violations, null, 2)).toEqual([]);
  const sizes = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(sizes.document).toBeLessThanOrEqual(sizes.viewport + 1);
}

test("brief completo, edición sin perder espacios y entrega voluntaria", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await fullBrief(page);
  await expect(page.locator('textarea[id^="advisor-brief-"]')).toHaveCount(12);
  const message = page.getByLabel("Vista previa del mensaje", { exact: true });
  await expect(message).toHaveValue(new RegExp(activity));
  const before = await message.inputValue();
  const edit = page.locator("#advisor-brief-problem");
  await edit.fill("Necesitamos un seguimiento claro ");
  await edit.pressSequentially("y sencillo.");
  await expect(edit).toHaveValue("Necesitamos un seguimiento claro y sencillo.");
  await expect(page.getByRole("button", { name: "Copiar brief", exact: true })).toBeDisabled();
  await expect(message).toHaveValue(before);
  await page.getByRole("button", { name: "Guardar ediciones del brief", exact: true }).click();
  await expect(message).toHaveValue(/Necesitamos un seguimiento claro y sencillo\./);
  await page.getByRole("button", { name: "Copiar brief", exact: true }).click();
  await expect(page.getByText("Brief copiado. Tú decides cuándo compartirlo.", { exact: true })).toBeVisible();
  expect((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n")).toBe(await message.inputValue());
  const link = page.getByRole("link", { name: /Abrir WhatsApp/ });
  const href = new URL((await link.getAttribute("href"))!);
  expect(href.origin + href.pathname).toBe("https://wa.me/529541621210");
  if (href.searchParams.has("text")) expect(href.searchParams.get("text")).toBe(await message.inputValue());
  else await expect(page.getByText(/Tu brief es largo/)).toBeVisible();
  // Intercept the handoff so no message or test data reaches WhatsApp.
  await context.route("https://wa.me/**", (route) => route.fulfill({ contentType: "text/html; charset=utf-8", body: "<p>Canal de prueba: sin envío</p>" }));
  const popup = page.waitForEvent("popup");
  await link.click();
  const opened = await popup;
  await expect(opened.getByText("Canal de prueba: sin envío")).toBeVisible();
  await opened.close();
  await expect(page.getByText(/Todavía no se ha enviado/)).toBeVisible();
});

test("validación, teclado y contexto invalidado al cambiar objetivo", async ({ page }) => {
  await page.goto("/asesor-ia/");
  await page.getByRole('button', { name: /Quiero responder unas preguntas/ }).click();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.locator("form[data-advisor-step]")).toHaveAttribute("data-advisor-step", "1");
  await expect(page.locator(".advisor-errors")).toBeFocused();
  await expect(page.getByRole("combobox", { name: "Tipo de negocio", exact: true })).toHaveAttribute("aria-invalid", "true");
  await page.getByRole("combobox", { name: "Tipo de negocio", exact: true }).selectOption("servicios");
  await page.getByRole("textbox", { name: "¿Qué vendes o qué servicio ofreces principalmente?", exact: true }).fill("   ");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "¿Qué vendes o qué servicio ofreces principalmente?", exact: true })).toHaveAttribute("aria-invalid", "true");
  await page.getByRole("textbox", { name: "¿Qué vendes o qué servicio ofreces principalmente?", exact: true }).fill(activity);
  await continueStep(page, 2);
  await page.getByRole("textbox", { name: "¿Qué problema o fricción te gustaría resolver primero?", exact: true }).fill(problem);
  await page.getByRole("radio", { name: "Organizar mejor a mis clientes", exact: true }).check();
  await page.getByRole("radio", { name: "Olvidar escribirle a clientes que dejaron su mensaje hace días", exact: true }).check();
  await page.getByRole("radio", { name: "Aparecer mejor en Google", exact: true }).check();
  await expect(page.locator('input[name="contextId"]:checked')).toHaveCount(0);
  await page.getByRole("radio", { name: "Estructurar bien las bases del negocio con visión a mediano plazo", exact: true }).check();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.locator("form[data-advisor-step]")).toHaveAttribute("data-advisor-step", "2");
  await expect(page.locator(".advisor-errors")).toBeFocused();
  await page.getByRole("radio", { name: "Solo redes sociales o recomendaciones; no tengo sitio web ni ficha en Google Maps", exact: true }).press("Space");
  await continueStep(page, 3);
  await page.getByRole("button", { name: "Volver", exact: true }).click();
  await expect(page.locator("#advisor-problem")).toHaveValue(problem);
  await expect(page.locator('input[name="contextId"]:checked')).toHaveCount(1);
});

test("referencias: URL segura, duplicados, límite y borrador pendiente", async ({ page }) => {
  await business(page);
  await diagnosis(page);
  const url = page.getByLabel("URL de la página", { exact: true });
  await url.fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Añadir enlace", exact: true }).click();
  await expect(url).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator(".advisor-user-reference")).toHaveCount(0);
  await url.fill("https://example.com/referencia");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.locator("form[data-advisor-step]")).toHaveAttribute("data-advisor-step", "3");
  await expect(page.locator(".advisor-errors")).toContainText("referencia pendiente");
  await page.getByRole("button", { name: "Añadir enlace", exact: true }).click();
  await expect(page.locator(".advisor-user-reference")).toHaveCount(1);
  await url.fill("https://example.com/referencia");
  await page.getByRole("button", { name: "Añadir enlace", exact: true }).click();
  await expect(page.locator("#advisor-referenceUrl-error")).toContainText("ya está");
  await page.getByRole("button", { name: "Descartar enlace pendiente", exact: true }).click();
  const curated = page.locator(".advisor-reference-card input[type=checkbox]");
  for (let i = 0; i < 4; i++) await curated.nth(i).check();
  await curated.nth(4).click();
  await expect(curated.nth(4)).not.toBeChecked();
  await expect(page.locator("#advisor-reference-count")).toContainText("5 de 5");
  await curated.nth(0).uncheck();
  await curated.nth(4).check();
  await finish(page);
  await expect(page.getByLabel("Vista previa del mensaje", { exact: true })).toHaveValue(/https:\/\/example.com\/referencia/);
});

test("borrado de bloque, regreso, regeneración confirmada y reinicio", async ({ page }) => {
  await fullBrief(page);
  await page.locator("#advisor-brief-problem").fill("");
  await page.getByRole("button", { name: "Volver", exact: true }).click();
  await expect(page.locator("form[data-advisor-step]")).toHaveAttribute("data-advisor-step", "5");
  await page.getByRole("button", { name: "Guardar ediciones del brief", exact: true }).click();
  await expect(page.locator("#advisor-brief-problem")).toHaveValue(/Pendiente/);
  await page.getByRole("button", { name: "Volver", exact: true }).click();
  await page.locator("#advisor-resources").fill("Fotografías propias y 2 horas por semana.");
  await page.getByRole("button", { name: "Actualizar mi brief", exact: true }).click();
  await expect(page.getByRole("heading", { name: "¿Reemplazar las ediciones del brief?", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Seguir revisando respuestas", exact: true }).click();
  await expect(page.locator("form[data-advisor-step]")).toHaveAttribute("data-advisor-step", "4");
  await page.getByRole("button", { name: "Actualizar mi brief", exact: true }).click();
  await page.getByRole("button", { name: "Actualizar y reemplazar ediciones", exact: true }).click();
  await expect(page.locator("#advisor-brief-problem")).toHaveValue(problem);
  await expect(page.getByLabel("Vista previa del mensaje", { exact: true })).toHaveValue(/Fotografías propias/);
  await page.getByRole("button", { name: "Empezar de nuevo", exact: true }).click();
  await page.getByRole("button", { name: "Conservar mi diagnóstico", exact: true }).click();
  await expect(page.locator("form[data-advisor-step]")).toHaveAttribute("data-advisor-step", "5");
  await page.getByRole("button", { name: "Empezar de nuevo", exact: true }).click();
  await page.getByRole("button", { name: "Sí, borrar y empezar", exact: true }).click();
  await expect(page.locator("#advisor-activity")).toHaveValue("");
  await expect(page.locator("#advisor-step-title")).toBeFocused();
});

test("accesibilidad y ausencia de desbordamiento en los cinco pasos", async ({ page }) => {
  test.setTimeout(60000);
  await business(page);
  await page.getByRole("button", { name: "Volver", exact: true }).click();
  await accessible(page);
  await continueStep(page, 2);
  await accessible(page);
  await diagnosis(page);
  await accessible(page);
  await continueStep(page, 4);
  await accessible(page);
  await page.getByRole("button", { name: "Generar mi brief", exact: true }).click();
  await expect(page.locator("form[data-advisor-step]")).toHaveAttribute("data-advisor-step", "5");
  await accessible(page);
  await page.setViewportSize({ width: 320, height: 780 });
  await accessible(page);
});

test("sin peticiones externas ni persistencia del diagnóstico", async ({ page, context }) => {
  const external: string[] = [];
  await context.route("**/*", async (route) => {
    if (new URL(route.request().url()).hostname !== "127.0.0.1") {
      external.push(route.request().url());
      await route.abort();
    } else await route.continue();
  });
  await business(page);
  await diagnosis(page);
  await page.getByLabel("URL de la página", { exact: true }).fill("https://example.com/private-not-fetched");
  await page.getByRole("button", { name: "Añadir enlace", exact: true }).click();
  await finish(page);
  expect(external).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  await page.reload();
  await page.getByRole('button', { name: /Quiero responder unas preguntas/ }).click();
  await expect(page.locator("#advisor-activity")).toHaveValue("");
  await expect(page.locator("form[data-advisor-step]")).toHaveAttribute("data-advisor-step", "1");
});

test("mensaje largo completo y alternativa si el portapapeles falla", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("Prueba de permiso denegado")) } }));
  await fullBrief(page);
  const longText = "Áreas y prioridades por revisar. ".repeat(48);
  for (const field of ["problem", "objectives", "audience"]) await page.locator(`#advisor-brief-${field}`).fill(longText);
  await page.getByRole("button", { name: "Guardar ediciones del brief", exact: true }).click();
  const message = page.getByLabel("Vista previa del mensaje", { exact: true });
  expect((await message.inputValue()).split(longText).length).toBe(4);
  await expect(page.getByRole("link", { name: /Abrir WhatsApp y pegar mi brief/ })).toHaveAttribute("href", "https://wa.me/529541621210");
  await page.getByRole("button", { name: "Copiar brief", exact: true }).click();
  await expect(page.getByText(/No pudimos copiar automáticamente/)).toBeVisible();
  await expect(message).toBeFocused();
  expect(await message.evaluate((element: HTMLTextAreaElement) => element.selectionEnd - element.selectionStart)).toBe((await message.inputValue()).length);
});

test("ruta directa, HTML sin JavaScript y navegación editorial existente", async ({ page, browser, baseURL }) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const staticPage = await noJs.newPage();
  expect((await staticPage.goto("/asesor-ia/"))?.status()).toBe(200);
  await expect(staticPage.getByRole("heading", { name: "CÍDIKIS IA", exact: true })).toBeVisible();
  await expect(staticPage.getByText(/El recorrido guiado requiere JavaScript/)).toBeVisible();
  await expect(staticPage.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://reilycastro.com/asesor-ia/");
  await staticPage.getByRole("link", { name: "guías de CÍDIKS", exact: true }).click();
  await expect(staticPage).toHaveURL(/\/conocimiento\/$/);
  await noJs.close();
  await page.goto("/");
  await page.getByRole("link", { name: "Crear un brief con CÍDIKIS IA", exact: true }).click();
  await page.getByRole('button', { name: /Quiero responder unas preguntas/ }).click();
  await expect(page.locator("#advisor-activity")).toBeVisible();
  await page.getByRole("link", { name: "Conocimiento", exact: true }).click();
  await expect(page).toHaveURL(/\/conocimiento\/$/);
  await expect(page.locator("h1")).toHaveCount(1);
  await page.goto("/conocimiento/necesito-realmente-una-pagina-web/");
  await expect(page.locator("h1")).toContainText("página web");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://reilycastro.com/conocimiento/necesito-realmente-una-pagina-web/");
});

test("diagnóstico original, ASTRA y contacto siguen funcionando", async ({ page }) => {
  await page.goto("/#diagnostico");
  const original = page.locator("#diagnostico");
  await original.getByRole("button", { name: "Organizar mejor a mis clientes", exact: true }).click();
  await original.getByRole("button", { name: "Olvidar escribirle a clientes que dejaron su mensaje hace días", exact: true }).click();
  await original.getByRole("button", { name: "Estructurar bien las bases del negocio con visión a mediano plazo", exact: true }).click();
  await expect(original.getByRole("heading", { name: /Área principal a revisar: Operación/ })).toBeVisible();
  await page.getByText("Añadir contexto con preguntas guiadas", { exact: true }).click();
  await page.getByRole("button", { name: "Comenzar diagnóstico consultivo", exact: true }).click();
  await expect(page.locator(".astra-bubble-question")).toBeVisible();
  await original.getByRole("link", { name: "Quiero hablar sobre mi proyecto", exact: true }).click();
  await expect(page).toHaveURL(/#contacto$/);
  const form = page.locator(".contact-form");
  await form.locator('input[name="name"]').fill("Visitante de prueba");
  await form.locator('input[name="business"]').fill("Taller de prueba");
  await form.locator('textarea[name="problem"]').fill("Ordenar consultas y seguimiento.");
  await form.locator('button[type="submit"]').click();
  await expect(form.locator(".message-result")).toBeVisible();
  const href = await form.getByRole("link", { name: "Abrir WhatsApp con mi mensaje", exact: true }).getAttribute("href");
  expect(new URL(href!).searchParams.get("text")).toContain("Ordenar consultas y seguimiento.");
  await expect(form.getByText(/Todavía no se ha enviado/)).toBeVisible();
});

test("las rutas de casos existentes conservan contenido y recursos", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#paraiso-laguna");
  await expect(page.locator("#paraiso-laguna")).toBeVisible();
  await expect(page.locator("#paraiso-laguna img").first()).toBeVisible();
  await page.goto("/#altitud");
  await expect(page.locator("#altitud")).toBeVisible();
  await expect(page.locator("#altitud img").first()).toBeVisible();
  expect(errors).toEqual([]);
});
