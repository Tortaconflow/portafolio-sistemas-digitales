import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { HOME_COMMUNITY_ROUTES } from "../src/home-community.ts";

// La home como puerta de entrada: acciones del hero, selector de necesidades, Comunidad y cierre.
// Se ejecuta en móvil (390 px) y escritorio, igual que el resto de las pruebas.

test("hero: tres acciones; CÍDIKS IA abre el chat y el diagnóstico guiado no se presenta como IA", async ({ page, browser, baseURL }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Comprender antes de construir.");
  const actions = page.locator(".hero-actions");
  await expect(actions.getByRole("link", { name: /Aprender gratis/ })).toHaveAttribute("href", "/comunidad/");
  await expect(actions.getByRole("link", { name: /Explorar servicios profesionales/ })).toHaveAttribute("href", "#servicios");
  await expect(actions.locator("a, button")).toHaveCount(3);
  await expect(page.locator('[aria-label="Asistente CÍDIKS IA"]')).toHaveCount(0);
  await actions.getByRole("button", { name: /Consultar CÍDIKS IA/ }).click();
  await expect(page.locator('[aria-label="Asistente CÍDIKS IA"]')).toBeVisible();
  // Sin JavaScript no existe el chat: la home enlaza al diagnóstico guiado y lo llama así.
  const noJs = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const staticHome = await noJs.newPage();
  await staticHome.goto("/");
  const fallback = staticHome.locator(".hero-actions").getByRole("link", { name: /Diagnóstico guiado \(sin IA\)/ });
  await expect(fallback).toHaveAttribute("href", "/asesor-ia/");
  await expect(staticHome.locator("#necesidades").getByRole("link", { name: /Diagnóstico guiado/ })).toHaveAttribute("href", "/asesor-ia/");
  await noJs.close();
});

test("selector de necesidades: cuatro accesos, tres gratuitos y uno con cotización, cerca del inicio", async ({ page }) => {
  await page.goto("/");
  const needs = page.locator("#necesidades");
  await expect(needs.getByRole("heading", { level: 2, name: "¿Qué necesitas hoy?" })).toBeVisible();
  await expect(needs.locator(".need")).toHaveCount(4);
  const expected = [
    ["CÍDIKS Comunidad", "/comunidad/", "Gratis"],
    ["Conocimiento", "/conocimiento/", "Gratis"],
    ["Servicios profesionales", "#servicios", "Con cotización"],
  ] as const;
  for (const [title, href, tag] of expected) {
    const link = needs.getByRole("link", { name: new RegExp(title) });
    await expect(link.getByRole("heading", { level: 3, name: title })).toBeVisible();
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toContainText(tag);
  }
  const ai = needs.locator(".need", { hasText: "CÍDIKS IA" });
  await expect(ai).toContainText("con inteligencia artificial");
  await expect(needs.getByRole("link", { name: /diagnóstico guiado/ })).toHaveAttribute("href", "/asesor-ia/");
  await ai.getByRole("button", { name: "CÍDIKS IA" }).click();
  await expect(page.locator('[aria-label="Asistente CÍDIKS IA"]')).toBeVisible();
  // Comunidad y el selector aparecen antes de los servicios y dentro de los primeros ~1500 px.
  const top = await page.evaluate(() => {
    const y = (id: string) => document.getElementById(id)!.getBoundingClientRect().top + scrollY;
    return { needs: y("necesidades"), community: y("aprende"), services: y("soluciones") };
  });
  expect(top.needs).toBeLessThan(1400);
  expect(top.community).toBeGreaterThan(top.needs);
  expect(top.services).toBeGreaterThan(top.community);
});

test("Comunidad en la home orienta: tres rutas con cantidades, sin desplegar guías ni cursos", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#aprende");
  await expect(section.locator(".community-routes > li")).toHaveCount(3);
  for (const route of HOME_COMMUNITY_ROUTES) {
    const item = section.locator(".community-routes > li", { hasText: route.title });
    await expect(item.getByRole("link", { name: route.title, exact: true })).toHaveAttribute("href", `/comunidad/#${route.id}`);
    await expect(item).toContainText(`${route.guides} guías`);
  }
  await expect(section).toContainText("10 guías propias");
  await expect(section).toContainText("4 cursos de otras instituciones");
  await expect(section).toContainText("algunos piden cuenta o iniciar sesión");
  // La home no lista guías ni cursos: eso lo desarrolla /comunidad/. Nada sale del sitio ni pide datos.
  await expect(section.locator('a[href^="/conocimiento/"], a[href^="http"], form, input')).toHaveCount(0);
  await expect(section.getByRole("link")).toHaveCount(4);
  await section.getByRole("link", { name: /Ver las rutas gratuitas/ }).click();
  await expect(page).toHaveURL(/\/comunidad\/$/);
});

test("proyectos conservados y cierre por intención", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".home-case-card")).toHaveCount(2);
  await expect(page.locator(".evidence-legend")).toContainText("Proyecto conceptual");
  await page.locator(".project-index button", { hasText: "Fraccionamiento Gubidxa" }).click();
  await expect(page).toHaveURL(/#casos$/);
  await page.goto("/");
  const finale = page.locator("#final-title").locator("xpath=ancestor::section");
  for (const name of ["Quiero aprender", "Necesito orientación", "Quiero contratar una solución"])
    await expect(finale.getByRole("heading", { level: 3, name })).toBeVisible();
  await finale.getByRole("link", { name: /Analicemos tu negocio/ }).click();
  await expect(page).toHaveURL(/#contacto$/);
});

test("home accesible (WCAG 2.1 A/AA) y sin desbordes, con la navegación móvil abierta", async ({ page, isMobile }) => {
  await page.goto("/");
  const result = await new AxeBuilder({ page })
    .include("main")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(result.violations, JSON.stringify(result.violations, null, 2)).toEqual([]);
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `desborde a ${width}px`).toBe(true);
  }
  if (isMobile) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: /Menú/ }).click();
    const nav = page.getByRole("navigation", { name: "Principal" });
    await expect(nav.getByRole("link").first()).toHaveText("Comunidad");
    await expect(nav.getByRole("link", { name: "Contacto" })).toBeVisible();
  }
});
