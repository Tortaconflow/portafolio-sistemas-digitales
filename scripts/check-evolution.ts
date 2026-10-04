import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { EDUCATION_ARTICLES } from "../src/education.ts";
import { HOME_GUIDES } from "../src/guide-previews.ts";
import { content } from "../src/content.ts";
import { track } from "../src/analytics.ts";

const html = readFileSync("dist/index.html", "utf8");
assert.ok(
  html.includes("Entendemos primero."),
  "Home should have readable HTML before JS",
);
assert.ok(html.includes("Construimos después."));
assert.ok(html.includes('name="google-site-verification"'));
assert.ok(!html.includes("Ingeniero de Software"));
assert.equal(
  new Set(EDUCATION_ARTICLES.map((a) => a.slug)).size,
  EDUCATION_ARTICLES.length,
  "Unique article slugs",
);
for (const guide of HOME_GUIDES) {
  const article = EDUCATION_ARTICLES.find((a) => a.id === guide.id);
  assert.ok(article);
  for (const field of ["slug", "title", "tagline", "category"] as const)
    assert.equal(guide[field], article[field], `Preview: ${guide.id}/${field}`);
}
const pages = [
  "/conocimiento/",
  ...EDUCATION_ARTICLES.map((a) => `/conocimiento/${a.slug}/`),
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
