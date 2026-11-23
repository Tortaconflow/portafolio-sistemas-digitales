import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { COMMUNITY_PAGE, COMMUNITY_ROUTES } from "../src/comunidad.ts";
import { EDUCATION_ARTICLES } from "../src/education.ts";

const PATH = COMMUNITY_PAGE.path;

test("HTML sin JavaScript: metadatos, tres rutas completas y acceso directo a las guías", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  expect((await page.goto(PATH))?.status()).toBe(200);
  await expect(page).toHaveTitle(COMMUNITY_PAGE.title);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://reilycastro.com${PATH}`);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", COMMUNITY_PAGE.description);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Aprende a mejorar tu negocio");
  for (const route of COMMUNITY_ROUTES) {
    const section = page.locator(`[data-community-route="${route.id}"]`);
    await expect(section.getByRole("heading", { level: 2, name: route.title })).toBeVisible();
    await expect(section.getByText("Para quién es", { exact: true })).toBeVisible();
    await expect(section.getByText("Qué aprenderás", { exact: true })).toBeVisible();
    await expect(section.getByRole("heading", { level: 3, name: "1. Lee estas guías" })).toBeVisible();
    await expect(section.getByRole("heading", { level: 3, name: `2. Haz esta actividad: ${route.activity.title}` })).toBeVisible();
    await expect(section.getByRole("heading", { level: 3, name: "3. Comprueba que aprendiste" })).toBeVisible();
    await expect(section.getByText(route.learningCriterion, { exact: true })).toBeVisible();
    await expect(section.locator(".community-activity li")).toHaveCount(route.activity.steps.length);
  }
  // Acceso sin registro: la primera guía se abre directamente desde la ruta.
  const first = COMMUNITY_ROUTES[0].guideSlugs[0];
  await page.locator(`a[href="/conocimiento/${first}/"]`).click();
  await expect(page).toHaveURL(new RegExp(`/conocimiento/${first}/$`));
  await expect(page.locator("h1")).toHaveCount(1);
  await context.close();
});

test("las rutas muestran exactamente las diez guías existentes, sin copiarlas", async ({ page }) => {
  await page.goto(PATH);
  const links = page.locator('main a[href^="/conocimiento/"]').filter({ has: page.locator("h4") });
  await expect(links).toHaveCount(EDUCATION_ARTICLES.length);
  for (const route of COMMUNITY_ROUTES)
    for (const slug of route.guideSlugs) {
      const article = EDUCATION_ARTICLES.find((a) => a.slug === slug)!;
      const card = page.locator(`[data-community-route="${route.id}"] a[href="/conocimiento/${slug}/"]`);
      await expect(card).toHaveCount(1);
      await expect(card.locator("h4")).toHaveText(article.title);
      await expect(card.locator("p")).toHaveText(article.tagline);
    }
});

test("los enlaces internos y las anclas funcionan", async ({ page, request }) => {
  await page.goto(PATH);
  const hrefs = await page.locator("a[href]").evaluateAll((anchors) =>
    [...new Set(anchors.map((a) => a.getAttribute("href")!))],
  );
  const paths = hrefs.filter((h) => h.startsWith("/") && !h.startsWith("//")).map((h) => h.split("#")[0] || "/");
  expect(paths.length).toBeGreaterThan(10);
  for (const path of new Set(paths)) expect((await request.get(path)).status(), path).toBe(200);
  for (const route of COMMUNITY_ROUTES) {
    await page.getByRole("navigation", { name: "Rutas de aprendizaje" }).getByRole("link", { name: new RegExp(route.title) }).click();
    await expect(page).toHaveURL(new RegExp(`#${route.id}$`));
    await expect(page.locator(`#${route.id}`)).toBeInViewport();
  }
});

test("sin solicitudes de terceros, sin errores y sin recoger datos", async ({ page, baseURL }) => {
  const external: string[] = [];
  const problems: string[] = [];
  page.on("request", (r) => {
    if (!r.url().startsWith(baseURL!)) external.push(r.url());
  });
  page.on("pageerror", (e) => problems.push(e.message));
  page.on("console", (m) => m.type() === "error" && problems.push(m.text()));
  await page.goto(PATH, { waitUntil: "networkidle" });
  expect(external).toEqual([]);
  expect(problems).toEqual([]);
  await expect(page.locator("form, input, textarea, select")).toHaveCount(0);
  await expect(page.locator("script:not([type='application/ld+json'])")).toHaveCount(0);
});

test("compatible con la CSP real de producción (public/.htaccess)", async ({ page }) => {
  const htaccess = readFileSync("public/.htaccess", "utf8");
  const csp = htaccess.match(/Content-Security-Policy "([^"]+)"/)?.[1];
  expect(csp, "CSP encontrada en .htaccess").toBeTruthy();
  // upgrade-insecure-requests no aplica a http://127.0.0.1 y no cambia lo que se prueba.
  const policy = csp!.replace(/;?\s*upgrade-insecure-requests/, "");
  await page.route(`**${PATH}`, async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), "content-security-policy": policy } });
  });
  const violations: string[] = [];
  page.on("console", (m) => /Content Security Policy|Refused to/i.test(m.text()) && violations.push(m.text()));
  await page.addInitScript(() => {
    (window as unknown as { __csp: string[] }).__csp = [];
    document.addEventListener("securitypolicyviolation", (e) =>
      (window as unknown as { __csp: string[] }).__csp.push(`${e.violatedDirective} ${e.blockedURI}`),
    );
  });
  await page.goto(PATH, { waitUntil: "networkidle" });
  expect(violations).toEqual([]);
  expect(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp)).toEqual([]);
  // La hoja de estilos propia se aplicó con style-src 'self'.
  const background = await page.locator(".community-activity").first().evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(background).toBe("rgb(220, 229, 218)");
});

test("accesible (WCAG 2.1 A/AA), sin desbordes y con objetivos táctiles de 44 px", async ({ page }) => {
  await page.goto(PATH);
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(result.violations, JSON.stringify(result.violations, null, 2)).toEqual([]);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `desborde a ${width}px`).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const small = await page.locator("main a, footer a").evaluateAll((anchors) =>
    anchors
      .map((a) => ({ text: a.textContent!.trim().slice(0, 40), height: a.getBoundingClientRect().height }))
      .filter((a) => a.height < 43.5),
  );
  expect(small, "enlaces de menos de 44 px de alto").toEqual([]);
});

test("el foco por teclado es visible en las guías y los enlaces", async ({ page }) => {
  await page.goto(PATH);
  await page.keyboard.press("Tab");
  const link = page.locator(`a[href="/conocimiento/${COMMUNITY_ROUTES[0].guideSlugs[0]}/"]`);
  await link.focus();
  const outline = await link.evaluate((el) => {
    const s = getComputedStyle(el);
    return { style: s.outlineStyle, width: parseFloat(s.outlineWidth) };
  });
  expect(outline.style).not.toBe("none");
  expect(outline.width).toBeGreaterThanOrEqual(2);
});

// --- Descubrimiento (tarea 3): enlaces desde la home y Conocimiento, sin sexto elemento en el encabezado ---
const COMMUNITY_LINK = /rutas gratuitas de CÍDIKS Comunidad/;

test("la home (sin y con JavaScript) y el índice de Conocimiento enlazan a Comunidad", async ({ page, browser, baseURL }) => {
  // HTML estático, el que leen los buscadores antes de ejecutar JavaScript.
  const noJs = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const staticHome = await noJs.newPage();
  await staticHome.goto("/");
  await staticHome.locator("#aprende").getByRole("link", { name: COMMUNITY_LINK }).click();
  await expect(staticHome).toHaveURL(new RegExp(`${PATH}$`));
  await noJs.close();
  // Home ya montada con React.
  await page.goto("/");
  const homeLink = page.locator("#aprende").getByRole("link", { name: COMMUNITY_LINK });
  await homeLink.scrollIntoViewIfNeeded();
  await expect(homeLink).toBeVisible();
  await homeLink.click();
  await expect(page).toHaveURL(new RegExp(`${PATH}$`));
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Aprende a mejorar tu negocio");
  // Índice de Conocimiento, al que lleva el enlace "Conocimiento" de cualquier encabezado.
  await page.goto("/conocimiento/");
  await page.getByRole("main").getByRole("link", { name: COMMUNITY_LINK }).click();
  await expect(page).toHaveURL(new RegExp(`${PATH}$`));
});

test("el encabezado de las páginas estáticas conserva sus cinco enlaces", async ({ page }) => {
  for (const path of ["/conocimiento/", "/asesor-ia/", PATH]) {
    await page.goto(path);
    const links = page.getByRole("navigation", { name: "Principal" }).getByRole("link");
    await expect(links, path).toHaveCount(5);
    await expect(links.filter({ hasText: "Comunidad" }), path).toHaveCount(0);
  }
});

test("las zonas modificadas siguen accesibles (WCAG 2.1 A/AA) y sin desbordes", async ({ page }) => {
  for (const [path, scope] of [["/", "#aprende"], ["/conocimiento/", "main"]] as const) {
    await page.goto(path);
    const result = await new AxeBuilder({ page }).include(scope).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(result.violations, `${path}: ${JSON.stringify(result.violations, null, 2)}`).toEqual([]);
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path} desborde a ${width}px`).toBe(true);
    }
  }
});
