import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {
  content,
  isWebUrl,
  isConfigured,
  releaseIssues,
} from "./src/content.ts";
const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export default defineConfig({
  plugins: [
    react(),
    {
      name: "content-seo",
      transformIndexHtml(html) {
        const domain = isWebUrl(content.links.domain)
          ? new URL(content.links.domain).origin
          : "";
        const title = isConfigured(content.owner.name)
          ? `${content.owner.name} · ${content.seo.title}`
          : content.seo.title;
        const schema = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: title,
          description: content.seo.description,
          inLanguage: "es-MX",
          ...(domain ? { url: domain } : {}),
        };
        const tags = `<title>${escapeHtml(title)}</title>
      <meta name="description" content="${escapeHtml(content.seo.description)}" />
      <meta name="robots" content="${releaseIssues().length ? "noindex, nofollow" : "index, follow"}" />
      <meta property="og:title" content="${escapeHtml(title)}" />
      <meta property="og:description" content="${escapeHtml(content.seo.description)}" />
      <meta property="og:type" content="website" /><meta property="og:locale" content="es_MX" />
      <meta name="twitter:card" content="summary_large_image" />
      ${domain ? `<link rel="canonical" href="${escapeHtml(domain)}/" /><meta property="og:url" content="${escapeHtml(domain)}/" /><meta property="og:image" content="${escapeHtml(domain + content.seo.image)}" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />` : ""}
      <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
        return html.replace("<!-- SEO_CONTENT -->", tags);
      },
      generateBundle() {
        const domain = isWebUrl(content.links.domain)
          ? new URL(content.links.domain).origin
          : "";
        const ready = !releaseIssues().length;
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: `User-agent: *\n${ready ? "Allow: /" : "Disallow: /"}\n${ready && domain ? `Sitemap: ${domain}/sitemap.xml\n` : ""}`,
        });
        if (ready && domain)
          this.emitFile({
            type: "asset",
            fileName: "sitemap.xml",
            source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeHtml(domain)}/</loc></url></urlset>`,
          });
      },
    },
  ],
  build: { sourcemap: false },
});
