import { test } from "node:test";
import assert from "node:assert/strict";
import { COMMUNITY_ROUTES } from "../../src/comunidad.ts";
import {
  COMMUNITY_INSTITUTIONS,
  COMMUNITY_RESOURCES,
  MAX_COMMUNITY_RESOURCES,
  communityResourceIssues,
  formatCheckedOn,
  pendingResources,
  verifiedResourcesForRoute,
  type CommunityResource,
  type VerifiedCommunityResource,
} from "../../src/comunidad-recursos.ts";

// Recurso de ejemplo SOLO para estas pruebas: no es un dato de la biblioteca.
const sample: VerifiedCommunityResource = {
  status: "verified",
  id: "ejemplo-de-prueba",
  institutionId: "microsoft-learn",
  title: "Módulo de ejemplo para pruebas",
  url: "https://learn.microsoft.com/es-mx/training/modules/ejemplo-de-prueba/",
  routeId: "organizar-mi-negocio",
  topic: "Tema de ejemplo para las pruebas",
  level: "inicial",
  languages: ["es-MX", "en"],
  free: { conditions: "Condiciones de ejemplo declaradas por la página.", account: "no" },
  learn: "Contenido de ejemplo solo para pruebas unitarias.",
  activity: "Actividad de ejemplo solo para pruebas unitarias.",
  verification: { checkedOn: "2026-01-15", method: "Método de ejemplo solo para pruebas." },
};
const hasIssue = (resources: readonly CommunityResource[], text: string) =>
  communityResourceIssues(resources).some((issue) => issue.includes(text));

test("la biblioteca real cumple las reglas editoriales", () => {
  assert.deepEqual(communityResourceIssues(), []);
  assert.ok(COMMUNITY_RESOURCES.length <= MAX_COMMUNITY_RESOURCES);
});

test("las cinco instituciones candidatas aparecen una sola vez, verificadas o pendientes", () => {
  const ids = COMMUNITY_RESOURCES.map((r) => r.institutionId);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...ids].sort(), Object.keys(COMMUNITY_INSTITUTIONS).sort());
  assert.deepEqual(Object.values(COMMUNITY_INSTITUTIONS).map((i) => i.name).sort(), [
    "Google Skillshop",
    "HubSpot Academy",
    "Meta Blueprint",
    "Microsoft Learn",
    "Santander Open Academy",
  ]);
});

test("identificadores únicos y rutas existentes", () => {
  const routeIds = new Set(COMMUNITY_ROUTES.map((route) => route.id));
  const ids = COMMUNITY_RESOURCES.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const resource of COMMUNITY_RESOURCES) assert.ok(routeIds.has(resource.routeId), resource.id);
});

test("los enlaces verificados son oficiales, HTTPS, concretos y sin rastreo", () => {
  const urls = new Set<string>();
  for (const resource of COMMUNITY_RESOURCES) {
    if (resource.status !== "verified") continue;
    const url = new URL(resource.url);
    assert.equal(url.protocol, "https:", resource.id);
    assert.ok(COMMUNITY_INSTITUTIONS[resource.institutionId].officialHosts.includes(url.hostname), resource.id);
    assert.notEqual(url.pathname, "/", `${resource.id}: debe ser un recurso concreto`);
    assert.equal(url.search, "", `${resource.id}: sin parámetros de rastreo`);
    assert.equal(url.hash, "", resource.id);
    assert.ok(!urls.has(url.href), `${resource.id}: url repetida`);
    urls.add(url.href);
  }
});

test("cada recurso verificado trae fecha, método, español y condiciones de gratuidad", () => {
  for (const resource of COMMUNITY_RESOURCES) {
    if (resource.status !== "verified") continue;
    assert.match(resource.verification.checkedOn, /^\d{4}-\d{2}-\d{2}$/, resource.id);
    assert.ok(resource.verification.method.trim().length >= 20, resource.id);
    assert.ok(resource.languages.some((l) => l.startsWith("es")), resource.id);
    assert.ok(resource.free.conditions.trim().length >= 20, resource.id);
    assert.ok(resource.learn.trim().length >= 20 && resource.activity.trim().length >= 20, resource.id);
  }
});

test("los recursos pendientes no declaran enlace ni verificación", () => {
  for (const resource of pendingResources()) {
    for (const key of ["url", "verification", "free", "languages", "level", "learn", "activity"])
      assert.ok(!(key in resource), `${resource.id}: ${key}`);
    assert.ok(resource.pending.trim().length >= 20, resource.id);
  }
  assert.equal(
    pendingResources().length + COMMUNITY_RESOURCES.filter((r) => r.status === "verified").length,
    COMMUNITY_RESOURCES.length,
  );
});

test("verifiedResourcesForRoute solo devuelve verificados de esa ruta", () => {
  for (const route of COMMUNITY_ROUTES)
    for (const resource of verifiedResourcesForRoute(route.id)) {
      assert.equal(resource.status, "verified");
      assert.equal(resource.routeId, route.id);
    }
  assert.deepEqual(verifiedResourcesForRoute("organizar-mi-negocio", [sample]), [sample]);
  assert.deepEqual(verifiedResourcesForRoute("empezar-a-vender", [sample]), []);
});

test("el validador acepta un recurso bien formado y detecta cada defecto", () => {
  assert.deepEqual(communityResourceIssues([sample]), []);
  assert.ok(hasIssue([{ ...sample, url: "http://learn.microsoft.com/es-mx/training/modules/x/" }], "HTTPS"));
  assert.ok(hasIssue([{ ...sample, url: "https://ejemplo.test/es-mx/training/modules/x/" }], "dominio oficial"));
  assert.ok(hasIssue([{ ...sample, url: `${sample.url}?utm_source=cidiks` }], "rastreo"));
  assert.ok(hasIssue([{ ...sample, url: `${sample.url}#inicio` }], "fragmento"));
  assert.ok(hasIssue([{ ...sample, url: "https://learn.microsoft.com/" }], "recurso concreto"));
  assert.ok(hasIssue([{ ...sample, url: "https://usuario:clave@learn.microsoft.com/es-mx/training/" }], "credenciales"));
  assert.ok(hasIssue([{ ...sample, url: "no es una url" }], "url inválida"));
  assert.ok(hasIssue([{ ...sample, verification: { ...sample.verification, checkedOn: "2026-02-30" } }], "fecha"));
  assert.ok(hasIssue([{ ...sample, verification: { ...sample.verification, checkedOn: "15/01/2026" } }], "fecha"));
  assert.ok(hasIssue([{ ...sample, verification: { ...sample.verification, method: "" } }], "verification.method"));
  assert.ok(hasIssue([{ ...sample, languages: ["en"] }], "español"));
  assert.ok(hasIssue([{ ...sample, languages: ["es", "es"] }], "idiomas repetidos"));
  assert.ok(hasIssue([{ ...sample, learn: "corto" }], "learn"));
  assert.ok(hasIssue([{ ...sample, activity: "" }], "activity"));
  assert.ok(hasIssue([{ ...sample, free: { ...sample.free, conditions: "" } }], "free.conditions"));
  assert.ok(hasIssue([{ ...sample, free: { ...sample.free, paidExtras: "corto" } }], "paidExtras"));
  assert.ok(hasIssue([{ ...sample, routeId: "no-existe" as never }], "no existe"));
  assert.ok(hasIssue([{ ...sample, id: "Id Inválido" }], "id inválido"));
  assert.ok(hasIssue([sample, { ...sample, url: `${sample.url}otro/` }], "id repetido"));
  assert.ok(hasIssue([sample, { ...sample, id: "otro-id", url: `${sample.url}otro/` }], "más de una vez"));
  assert.ok(hasIssue([{ ...sample, institutionId: "no-existe" as never }], "institución desconocida"));
});

test("el validador rechaza pendientes con enlace y más de cinco recursos", () => {
  const pending: CommunityResource = {
    status: "pending",
    id: "pendiente-de-prueba",
    institutionId: "hubspot-academy",
    routeId: "empezar-a-vender",
    topic: "Tema de ejemplo para las pruebas",
    pending: "Falta elegir y comprobar un curso concreto.",
  };
  assert.deepEqual(communityResourceIssues([pending]), []);
  assert.ok(hasIssue([{ ...pending, url: "https://academy.hubspot.com/x" } as unknown as CommunityResource], 'no puede declarar "url"'));
  assert.ok(hasIssue([{ ...pending, pending: "" }], "pendiente"));
  const six = Array.from({ length: 6 }, (_, i) => ({ ...pending, id: `p-${i}`, institutionId: Object.keys(COMMUNITY_INSTITUTIONS)[i % 5] as never }));
  assert.ok(hasIssue(six, "máximo"));
});

test("formatCheckedOn escribe la fecha en español sin depender del sistema", () => {
  assert.equal(formatCheckedOn("2026-11-23"), "23 de noviembre de 2026");
  assert.equal(formatCheckedOn("2027-01-05"), "5 de enero de 2027");
});
