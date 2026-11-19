import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { content } from "../src/content.ts";
import { sanitizeAdvisorPayload, track } from "../src/analytics.ts";
import { buildWhatsAppUrl, getWhatsAppDestination } from "../src/contact-utils.ts";

const html = readFileSync("dist/asesor-ia/index.html", "utf8");
assert.ok(html.includes(content.advisor.title));
assert.ok(html.includes(`href="${content.links.domain}${content.advisor.path}"`));
assert.ok(html.includes("Sin IA conectada"));
assert.ok(html.includes("memoria de esta pestaña"));
assert.ok(html.includes("no envía respuestas a proveedores"));
assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
assert.ok(html.includes('id="advisor-root"'));
assert.ok(html.includes('href="/#contacto"'));
for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]+)"/g)) {
  const resource = match[1];
  assert.ok(existsSync(`dist${resource}${resource.endsWith("/") ? "index.html" : ""}`), resource);
}
assert.ok(readFileSync("dist/sitemap.xml", "utf8").includes(content.links.domain + content.advisor.path));
assert.ok(readFileSync("dist/index.html", "utf8").includes('href="/asesor-ia/"'));
const home = readFileSync("dist/index.html", "utf8");
const editorial = readFileSync("dist/conocimiento/index.html", "utf8");
const stylesheetPaths = (source: string) => [...source.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((match) => match[1]);
const advisorStyles = stylesheetPaths(html);
assert.equal(advisorStyles.length, 2);
assert.equal(advisorStyles[0], stylesheetPaths(home)[0]);
assert.deepEqual(stylesheetPaths(editorial), stylesheetPaths(home));
assert.ok(advisorStyles[1].includes("advisor-"));
assert.ok(!home.includes('src="/assets/advisor-'));
assert.ok(!editorial.includes("/assets/advisor-"));
assert.equal(readFileSync("dist/.htaccess", "utf8"), readFileSync("public/.htaccess", "utf8"));

const privateData = {
  email: "visitor@example.test", text: "Llámame al 5512345678",
  url: "https://example.test/private?client=personal", nested: { name: "Private" },
};
assert.deepEqual(sanitizeAdvisorPayload("advisor_reference_added", {
  ...privateData, source: "visitor", count: 2,
}), { source: "visitor", count: 2 });
assert.deepEqual(sanitizeAdvisorPayload("advisor_brief_generated", {
  ...privateData, mode: "deterministic", area: "presencia", revision: 1,
}), { mode: "deterministic", area: "presencia", revision: 1 });
assert.deepEqual(sanitizeAdvisorPayload("advisor_brief_generated", {
  mode: "Llámame al 5512345678", area: "Private", revision: Infinity,
}), {});
for (const step of [-1, 0, 1.5, 6, NaN, "1"])
  assert.deepEqual(sanitizeAdvisorPayload("advisor_step_completed", { step }), {});
assert.deepEqual(sanitizeAdvisorPayload("advisor_contact_opened", {
  channel: "whatsapp", stage: "received", ...privateData,
}), { channel: "whatsapp" });

const message = "Necesito organizar consultas.\nPúblico: familias. ¿Podemos revisarlo? & = # 🌱";
const handoff = new URL(buildWhatsAppUrl(message));
assert.equal(handoff.origin + handoff.pathname, content.links.whatsapp);
assert.equal(handoff.searchParams.get("text"), message);
assert.equal(handoff.searchParams.getAll("text").length, 1);
assert.equal(buildWhatsAppUrl(""), "");
assert.equal(getWhatsAppDestination(), content.links.whatsapp);
assert.equal(getWhatsAppDestination("https://wa.me/529541621210?text=old#fragment"), content.links.whatsapp);
assert.equal(getWhatsAppDestination("https://wa.me.evil.example/529541621210"), "");
assert.equal(buildWhatsAppUrl(message, "javascript:alert(1)"), "");
assert.equal(buildWhatsAppUrl(message, "https://evil.example/529541621210"), "");
assert.equal(buildWhatsAppUrl(message, "https://username:password@wa.me/529541621210"), "");

const testWindow = { cidiksAnalyticsBuffer: [] as Array<{event: string; data: Record<string, unknown>}> };
Object.assign(globalThis, { window: testWindow });
track("advisor_contact_opened", { channel: "whatsapp", stage: "channel_opened" });
assert.deepEqual(testWindow.cidiksAnalyticsBuffer[0].data, {
  channel: "whatsapp", stage: "channel_opened",
});
assert.ok(!testWindow.cidiksAnalyticsBuffer.some(({event}) => ["form_submit", "contact_submitted"].includes(event)));
Reflect.deleteProperty(globalThis, "window");
console.log("OK: advisor static HTML/SEO/resources, isolated analytics privacy and voluntary WhatsApp handoff.");
