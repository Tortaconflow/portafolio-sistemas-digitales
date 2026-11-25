import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { EDUCATION_ARTICLES } from "../src/education.ts";
import { HOME_COMMUNITY_ROUTES, HOME_RESOURCES_CHECKED_ON } from "../src/home-community.ts";
import { content } from "../src/content.ts";
import { COMMUNITY_PAGE, COMMUNITY_ROUTES } from "../src/comunidad.ts";
import {
  ACCOUNT_LABELS,
  COMMUNITY_INSTITUTIONS,
  COMMUNITY_RESOURCES,
  formatCheckedOn,
  type VerifiedCommunityResource,
} from "../src/comunidad-recursos.ts";
import { track } from "../src/analytics.ts";

const html = readFileSync("dist/index.html", "utf8");
assert.ok(
  html.includes("Comprender antes"),
  "Home should have readable HTML before JS",
);
assert.ok(html.includes("de construir."));
assert.ok(
  /<title>[^<]*Educación gratuita[^<]*Oaxaca<\/title>/.test(html) &&
    /<meta name="description" content="[^"]*Aprende gratis[^"]*orientación[^"]*servicios|<meta name="description" content="[^"]*Aprende gratis[^"]*contrata[^"]*Oaxaca/.test(html),
  "Home: título y descripción reflejan educación gratuita, orientación y servicios en Oaxaca",
);
assert.ok(content.seo.title.length <= 75 && content.seo.description.length <= 165, "SEO: longitudes razonables");
assert.ok(!/Asesor IA/.test(html), "El diagnóstico basado en reglas no se presenta como IA");
assert.ok(html.includes('name="google-site-verification"'));
assert.ok(!html.includes("Ingeniero de Software"));
assert.equal(
  new Set(EDUCATION_ARTICLES.map((a) => a.slug)).size,
  EDUCATION_ARTICLES.length,
  "Unique article slugs",
);
// La vista previa de Comunidad en la home no importa las fuentes (peso del JavaScript):
// aquí se comprueba que sus rutas y cantidades coinciden con /comunidad/ y los recursos verificados.
const verifiedForHome = COMMUNITY_RESOURCES.filter(
  (r): r is VerifiedCommunityResource => r.status === "verified",
);
assert.deepEqual(
  HOME_COMMUNITY_ROUTES.map((r) => ({
    id: r.id,
    title: r.title,
    guides: r.guides,
    courses: r.courses,
  })),
  COMMUNITY_ROUTES.map((r) => ({
    id: r.id,
    title: r.title,
    guides: r.guideSlugs.length,
    courses: verifiedForHome.filter((x) => x.routeId === r.id).length,
  })),
  "Home: rutas, guías y cursos externos coinciden con /comunidad/",
);
assert.equal(
  HOME_COMMUNITY_ROUTES.reduce((n, r) => n + r.guides, 0),
  EDUCATION_ARTICLES.length,
  "Home: las guías de las rutas son todas las guías propias",
);
for (const resource of verifiedForHome)
  assert.equal(HOME_RESOURCES_CHECKED_ON, formatCheckedOn(resource.verification.checkedOn));
const pages = [
  "/conocimiento/",
  ...EDUCATION_ARTICLES.map((a) => `/conocimiento/${a.slug}/`),
  COMMUNITY_PAGE.path,
];
const sitemap = readFileSync("dist/sitemap.xml", "utf8");
for (const path of pages) {
  const page = readFileSync(`dist${path}index.html`, "utf8");
  assert.ok(
    page.includes(
      `<link rel="canonical" href="${content.links.domain}${path}">`,
    ),
    `Canonical ${path}`,
  );
  assert.ok(sitemap.includes(content.links.domain + path));
  assert.equal((page.match(/<h1[ >]/g) || []).length, 1, `One h1: ${path}`);
  for (const match of page.matchAll(/(?:href|src)="(\/[^"#?]+)"/g)) {
    const resource = match[1];
    assert.ok(
      existsSync(
        `dist${resource}${resource.endsWith("/") ? "index.html" : ""}`,
      ),
      `Missing ${resource}`,
    );
  }
}
// CÍDIKS Comunidad: página estática sin JavaScript, compatible con la CSP de public/.htaccess.
const community = readFileSync(`dist${COMMUNITY_PAGE.path}index.html`, "utf8");
assert.ok(
  community.includes('<meta name="robots" content="index, follow">'),
  "Comunidad indexable como el resto de páginas editoriales",
);
assert.deepEqual(
  community.match(/<script[^>]*>/g),
  ['<script type="application/ld+json">'],
  "Comunidad no carga ni ejecuta JavaScript (solo datos JSON-LD)",
);
assert.ok(!/<style[\s>]|\sstyle=/.test(community), "Comunidad sin estilos en línea (CSP)");
assert.ok(!/https?:\/\/(?!reilycastro\.com)[^"'\s<]*\.(?:js|css)/.test(community), "Sin recursos externos");
const communityIds = new Set([...community.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const m of community.matchAll(/href="#([^"]+)"/g))
  assert.ok(communityIds.has(m[1]), `Ancla sin destino: #${m[1]}`);
for (const route of COMMUNITY_ROUTES) {
  assert.ok(communityIds.has(route.id), `Ruta ausente: ${route.id}`);
  for (const slug of route.guideSlugs)
    assert.equal(
      community.split(`href="/conocimiento/${slug}/"`).length - 1,
      1,
      `Guía enlazada una sola vez: ${slug}`,
    );
}
// Biblioteca de recursos externos: un enlace seguro por recurso verificado; los pendientes, sin enlace.
const verifiedResources = COMMUNITY_RESOURCES.filter(
  (r): r is VerifiedCommunityResource => r.status === "verified",
);
const externalAnchors = [...community.matchAll(/<a\s[^>]*href="(https?:\/\/[^"]+)"[^>]*>/g)];
assert.equal(externalAnchors.length, verifiedResources.length, "Un enlace externo por recurso verificado");
for (const [tag, href] of externalAnchors) {
  assert.ok(href.startsWith("https://"), `Enlace externo HTTPS: ${href}`);
  assert.ok(
    /target="_blank"/.test(tag) && /rel="noopener noreferrer"/.test(tag),
    `Enlace externo seguro (noopener noreferrer): ${href}`,
  );
  assert.ok(verifiedResources.some((r) => r.url === href), `Enlace externo no registrado: ${href}`);
}
for (const r of verifiedResources)
  assert.ok(new RegExp(`datetime="${r.verification.checkedOn}"`, "i").test(community), `Fecha de verificación visible: ${r.id}`);
for (const r of verifiedResources) {
  assert.ok(community.includes(ACCOUNT_LABELS[r.free.account]), `Condición de cuenta visible: ${r.id}`);
  if (r.duration) assert.ok(community.includes(r.duration), `Duración visible: ${r.id}`);
  if (r.levelSource === "editorial")
    assert.ok(community.includes("clasificación editorial de CÍDIKS"), `Nivel editorial declarado: ${r.id}`);
}
const pendingHtml = community.match(/<section class="community-pending"[\s\S]*?<\/section>/)?.[0] ?? "";
for (const r of COMMUNITY_RESOURCES.filter((r) => r.status === "pending")) {
  const name = COMMUNITY_INSTITUTIONS[r.institutionId].name;
  if (r.publicEntry) assert.ok(pendingHtml.includes(name), `Pendiente público visible aparte: ${r.id}`);
  else assert.ok(!community.includes(name), `Entrada pendiente oculta: ${r.id}`);
  assert.ok(!community.includes(`data-community-resource="${r.id}"`), `Un pendiente no se muestra como recurso: ${r.id}`);
}
assert.ok(!/<a[\s>]/.test(pendingHtml), "Los recursos pendientes no llevan enlaces");
// Descubrimiento: Comunidad es visible en la home (hero, selector, sección propia y cierre)
// y se enlaza desde el índice de Conocimiento.
const knowledgeIndex = readFileSync("dist/conocimiento/index.html", "utf8");
assert.equal(
  knowledgeIndex.split(`href="${COMMUNITY_PAGE.path}"`).length - 1,
  2,
  "Conocimiento enlaza a Comunidad desde el encabezado y desde su cuerpo",
);
const homeLinks = html.split(`href="${COMMUNITY_PAGE.path}"`).length - 1;
assert.ok(homeLinks >= 4, `La home enlaza a Comunidad desde varios bloques (${homeLinks})`);
const learnSection = html.match(/<section[^>]*id="aprende"[\s\S]*?<\/section>/)?.[0] ?? "";
assert.ok(
  learnSection.includes(`href="${COMMUNITY_PAGE.path}"`),
  "La sección de Comunidad de la home (#aprende) enlaza a /comunidad/",
);
assert.ok(
  !/href="\/conocimiento\/[a-z]/.test(learnSection),
  "La home solo orienta: las guías se enlazan desde /comunidad/ y /conocimiento/",
);
assert.ok(!/<script/.test(learnSection) && !/https?:\/\//.test(learnSection), "#aprende sin scripts ni enlaces externos");
// Orden de la home: selector de necesidades y Comunidad antes que los servicios.
const at = (needle: string) => html.indexOf(needle);
assert.ok(
  at('id="necesidades"') > at('id="inicio"') &&
    at('id="aprende"') > at('id="necesidades"') &&
    at('id="soluciones"') > at('id="aprende"'),
  "Orden: hero, necesidades, Comunidad, servicios",
);
for (const href of ["/comunidad/", "/asesor-ia/", "/conocimiento/", "#servicios"]) {
  const needs = html.match(/<section[^>]*id="necesidades"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(needs.includes(`href="${href}"`), `Selector de necesidades enlaza a ${href}`);
}
for (const path of ["/", content.advisor.path, ...pages]) {
  const nav =
    readFileSync(`dist${path}index.html`, "utf8").match(
      /<nav aria-label="Principal">(.*?)<\/nav>/s,
    )?.[1] ?? "";
  assert.equal((nav.match(/<a /g) || []).length, 5, `Encabezado con 5 enlaces: ${path}`);
  assert.ok(nav.includes(`href="${COMMUNITY_PAGE.path}"`), `Comunidad en el encabezado: ${path}`);
}
const testWindow = {
  cidiksAnalyticsBuffer: [] as Array<{
    event: string;
    data: Record<string, unknown>;
  }>,
};
Object.assign(globalThis, { window: testWindow });
track("hero_cta_click", { target: "contacto" });
track("form_prepare", { channel_selected: "whatsapp", has_interest: true });
assert.ok(
  !testWindow.cidiksAnalyticsBuffer.some((e) =>
    ["contact_submit", "contact_submitted", "form_submit"].includes(e.event),
  ),
  "Preparing is not sending",
);
track("contact_submit", { channel: "whatsapp", stage: "channel_opened" });
assert.equal(
  testWindow.cidiksAnalyticsBuffer.at(-1)?.data.stage,
  "channel_opened",
);
track("demo_view", {
  demo_id: "demo",
  kind: "illustration",
  name: "Never collect",
  email: "test@example.test",
  message: "Never collect",
} as Parameters<typeof track<"demo_view">>[1]);
assert.deepEqual(testWindow.cidiksAnalyticsBuffer.at(-1)?.data, {
  demo_id: "demo",
  kind: "illustration",
});
for (let i = 0; i < 105; i++) track("demo_select", { demo_id: "oferta" });
assert.equal(testWindow.cidiksAnalyticsBuffer.length, 100);
Object.assign(testWindow, {
  gtag: () => {
    throw new Error("Transport failure");
  },
});
assert.doesNotThrow(() => track("hero_cta_click", { target: "casos" }));
Reflect.deleteProperty(globalThis, "window");
console.log(
  `OK: home HTML, ${pages.length} editorial pages, metadata, local links, previews and analytics semantics/privacy.`,
);
