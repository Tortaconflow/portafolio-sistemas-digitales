import { test } from "node:test";
import assert from "node:assert/strict";
import { EDUCATION_ARTICLES } from "../../src/education.ts";
import { COMMUNITY_ROUTES, communityRouteIssues, guidesForRoute } from "../../src/comunidad.ts";

test("las tres rutas existen con los identificadores esperados", () => {
  assert.deepEqual(
    COMMUNITY_ROUTES.map((route) => route.id),
    ["empezar-a-vender", "organizar-mi-negocio", "mejorar-mi-presencia-digital"],
  );
});

test("todos los slugs asociados existen en EDUCATION_ARTICLES", () => {
  const known = new Set(EDUCATION_ARTICLES.map((article) => article.slug));
  for (const route of COMMUNITY_ROUTES)
    for (const slug of route.guideSlugs) assert.ok(known.has(slug), `${route.id}: ${slug}`);
});

test("ninguna guía está duplicada, ni dentro de una ruta ni entre rutas", () => {
  const all = COMMUNITY_ROUTES.flatMap((route) => route.guideSlugs);
  assert.equal(new Set(all).size, all.length);
});

test("las diez guías están representadas", () => {
  assert.equal(EDUCATION_ARTICLES.length, 10);
  const all = new Set(COMMUNITY_ROUTES.flatMap((route) => route.guideSlugs));
  assert.deepEqual([...all].sort(), EDUCATION_ARTICLES.map((article) => article.slug).sort());
});

test("cada ruta tiene público, objetivo, actividad con pasos y evidencia, y criterio de aprendizaje", () => {
  for (const route of COMMUNITY_ROUTES) {
    for (const text of [route.audience, route.learningGoal, route.learningCriterion, route.activity.evidence])
      assert.ok(text.trim().length > 20, `${route.id}: texto demasiado corto o vacío`);
    for (const text of [route.title, route.activity.title, route.activity.duration])
      assert.ok(text.trim().length > 0, `${route.id}: campo vacío`);
    assert.ok(route.activity.steps.length >= 3, `${route.id}: pasos`);
    assert.ok(route.activity.steps.every((step) => step.trim().length > 0), `${route.id}: paso vacío`);
  }
});

test("las actividades piden no escribir contraseñas al listar cuentas", () => {
  const text = COMMUNITY_ROUTES.flatMap((route) => route.activity.steps).join(" ").toLowerCase();
  assert.ok(text.includes("no escribas contraseñas"));
});

test("guidesForRoute devuelve las guías reales en el orden de la ruta", () => {
  for (const route of COMMUNITY_ROUTES) {
    const guides = guidesForRoute(route);
    assert.deepEqual(guides.map((guide) => guide.slug), route.guideSlugs);
    for (const guide of guides) assert.ok(EDUCATION_ARTICLES.includes(guide), "debe ser la misma guía, no una copia");
  }
});

test("communityRouteIssues no reporta problemas y detecta datos incoherentes", () => {
  assert.deepEqual(communityRouteIssues(), []);
  const [first, ...rest] = COMMUNITY_ROUTES;
  const stolen = rest[0].guideSlugs[0];
  const broken = [
    { ...first, guideSlugs: [...first.guideSlugs, "no-existe", stolen], learningCriterion: " " },
    ...rest,
  ];
  const issues = communityRouteIssues(broken);
  assert.ok(issues.some((issue) => issue.includes("no-existe")));
  assert.ok(issues.some((issue) => issue.includes(`"${stolen}" está en`)));
  assert.ok(issues.some((issue) => issue.includes("learningCriterion")));
  assert.ok(communityRouteIssues(COMMUNITY_ROUTES.slice(0, 2)).some((issue) => issue.includes("no pertenece a ninguna ruta")));
});
