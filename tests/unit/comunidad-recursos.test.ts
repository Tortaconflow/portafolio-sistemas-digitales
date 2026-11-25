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
  publicPendingResources,
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
    for (const key of url.searchParams.keys())
      assert.equal(key, "locale", `${resource.id}: solo se admite el parámetro de idioma, no rastreo`);
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
    assert.equal(typeof resource.publicEntry, "boolean", resource.id);
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
  assert.deepEqual(communityResourceIssues([{ ...sample, url: `${sample.url}?locale=es` }]), []);
  assert.ok(hasIssue([{ ...sample, url: `${sample.url}?otro=1` }], "no permitido"));
  assert.ok(hasIssue([{ ...sample, url: `${sample.url}?locale=es&utm_medium=x` }], "rastreo"));
  assert.ok(hasIssue([{ ...sample, duration: "" }], "duration"));
  assert.deepEqual(communityResourceIssues([{ ...sample, duration: "18 minutos", levelSource: "editorial" }]), []);
  assert.ok(hasIssue([{ ...sample, levelSource: "oficial" as never }], "levelSource"));
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
    publicEntry: true,
  };
  assert.deepEqual(communityResourceIssues([pending]), []);
  assert.ok(hasIssue([{ ...pending, publicEntry: "sí" as never }], "publicEntry"));
  assert.ok(hasIssue([{ ...pending, url: "https://academy.hubspot.com/x" } as unknown as CommunityResource], 'no puede declarar "url"'));
  assert.ok(hasIssue([{ ...pending, pending: "" }], "pendiente"));
  const six = Array.from({ length: 6 }, (_, i) => ({ ...pending, id: `p-${i}`, institutionId: Object.keys(COMMUNITY_INSTITUTIONS)[i % 5] as never }));
  assert.ok(hasIssue(six, "máximo"));
});

test("formatCheckedOn escribe la fecha en español sin depender del sistema", () => {
  assert.equal(formatCheckedOn("2026-11-23"), "23 de noviembre de 2026");
  assert.equal(formatCheckedOn("2027-01-05"), "5 de enero de 2027");
});

// Evidencia de la revisión externa del 2026-11-23 (información pública oficial, revisada por CÍDIKS;
// este entorno no pudo consultar esos sitios). Es la única puerta para marcar un recurso como
// verificado: un recurso nuevo solo pasa si se registra aquí lo que esa revisión confirmó, nada más.
type Evidence = {
  title: string;
  url: string;
  routeId: string;
  level: "inicial";
  levelSource?: "editorial";
  duration?: string;
  languages: readonly string[];
  account: string;
};
const EXTERNAL_REVIEW_2026_11_23: Record<string, Evidence> = {
  "microsoft-learn-work-smarter-with-ai": {
    title: "Trabaje de forma más inteligente con IA",
    url: "https://learn.microsoft.com/es-mx/training/paths/work-smarter-with-ai/",
    routeId: "organizar-mi-negocio",
    level: "inicial", // "principiante" en la revisión
    languages: ["es"],
    account: "no-para-leer", // "no necesaria para leer el contenido"
  },
  "hubspot-academy-digital-marketing": {
    title: "Marketing digital",
    url: "https://academy.hubspot.com/es/courses/digital-marketing",
    routeId: "mejorar-mi-presencia-digital",
    level: "inicial",
    levelSource: "editorial", // clasificación de CÍDIKS, no un nivel declarado por HubSpot
    duration: "5 horas y 45 minutos",
    languages: ["es"],
    account: "requerida",
  },
  "meta-blueprint-use-whatsapp-business": {
    title: "Usa WhatsApp para un negocio",
    url: "https://www.facebookblueprint.com/student/path/211935-use-whatsapp-business",
    routeId: "empezar-a-vender",
    level: "inicial", // "principiante"
    duration: "18 minutos",
    languages: ["es"],
    account: "sesion-facebook", // "requiere iniciar sesión con Facebook para acceder a las lecciones"
  },
  "google-skillshop-promote-with-content": {
    title: "Promociona una empresa con contenido",
    url: "https://skillshop.exceedlms.com/student/collection/711435-promote-with-content?locale=es",
    routeId: "mejorar-mi-presencia-digital",
    level: "inicial", // "principiante"
    duration: "3 horas",
    languages: ["es"],
    account: "sesion-google", // "requiere iniciar sesión con Google para acceder a la formación"
  },
};

test("cada recurso verificado coincide con la revisión externa y solo con ella", () => {
  const verified = COMMUNITY_RESOURCES.filter((r): r is VerifiedCommunityResource => r.status === "verified");
  assert.deepEqual(
    verified.map((r) => r.id).sort(),
    Object.keys(EXTERNAL_REVIEW_2026_11_23).sort(),
    "hay un recurso verificado sin evidencia registrada en esta prueba (o falta uno)",
  );
  for (const r of verified) {
    const evidence = EXTERNAL_REVIEW_2026_11_23[r.id];
    assert.equal(r.title, evidence.title);
    assert.equal(r.url, evidence.url);
    assert.equal(r.routeId, evidence.routeId);
    assert.equal(r.level, evidence.level);
    assert.equal(r.levelSource, evidence.levelSource, `${r.id}: origen del nivel`);
    assert.equal(r.duration, evidence.duration, `${r.id}: duración`);
    assert.deepEqual([...r.languages], [...evidence.languages]);
    assert.equal(r.free.account, evidence.account);
    assert.ok(r.free.conditions.toLowerCase().includes("gratuit"), "el costo debe constar como gratuito");
    assert.equal(r.free.paidExtras, undefined, "no se declara lo que la revisión no confirmó");
    assert.equal(r.verification.checkedOn, "2026-11-23");
    assert.ok(/externa/i.test(r.verification.method), "el método debe decir que es una revisión externa");
    assert.ok(
      !/(inscri|complet|certificado|acceso con cuenta)/i.test(r.verification.method.replace(/No se registra [^.]*\./, "")),
      `${r.id}: no se atribuye inscripción, curso completado, certificado ni acceso con cuenta`,
    );
    assert.match(r.verification.method, /No se registra inscripción/);
  }
});

test("Santander es el único pendiente y sigue oculto; el nivel de HubSpot se declara editorial", () => {
  const pending = pendingResources();
  assert.deepEqual(pending.map((r) => r.institutionId), ["santander-open-academy"]);
  assert.equal(pending[0].publicEntry, false);
  assert.deepEqual(publicPendingResources(), []);
  const hubspot = COMMUNITY_RESOURCES.find((r) => r.id === "hubspot-academy-digital-marketing");
  assert.equal(hubspot?.status === "verified" && hubspot.levelSource, "editorial");
  for (const r of COMMUNITY_RESOURCES)
    if (r.status === "verified" && r.id !== "hubspot-academy-digital-marketing")
      assert.equal(r.levelSource, undefined, `${r.id}: su nivel consta en la revisión, no es editorial`);
});

test("los dominios oficiales autorizados son exactamente los confirmados", () => {
  assert.deepEqual(COMMUNITY_INSTITUTIONS["meta-blueprint"].officialHosts, ["www.facebookblueprint.com"]);
  assert.deepEqual(COMMUNITY_INSTITUTIONS["google-skillshop"].officialHosts, ["skillshop.exceedlms.com"]);
  assert.deepEqual(COMMUNITY_INSTITUTIONS["hubspot-academy"].officialHosts, ["academy.hubspot.com"]);
  assert.deepEqual(COMMUNITY_INSTITUTIONS["microsoft-learn"].officialHosts, ["learn.microsoft.com"]);
});
