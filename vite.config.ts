import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { fileURLToPath } from "node:url";
import { KnowledgePage, StaticHome } from "./src/KnowledgePage.tsx";
import { EDUCATION_ARTICLES } from "./src/education.ts";
import { content, isWebUrl, releaseIssues } from "./src/content.ts";
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
      buildStart() {
        this.emitFile({
          type: "chunk",
          id: fileURLToPath(
            new URL("./src/editorial-entry.ts", import.meta.url),
          ),
          name: "editorial",
        });
      },
      transformIndexHtml(html) {
        const domain = isWebUrl(content.links.domain)
          ? new URL(content.links.domain).origin
          : "";
        const title = content.seo.title;
        const schema = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${domain}/#website`,
              url: domain,
              name: title,
              description: content.seo.description,
              inLanguage: "es-MX",
              publisher: {
                "@id": `${domain}/#organization`,
              },
            },
            {
              "@type": ["ProfessionalService", "LocalBusiness"],
              "@id": `${domain}/#organization`,
              name: "Cídiks · Reily Castro",
              url: domain,
              logo: `${domain}${content.brand.symbol}`,
              image: `${domain}${content.seo.image}`,
              description: content.seo.description,
              telephone: "+529541621210",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Oaxaca",
                addressRegion: "OAX",
                addressCountry: "MX",
              },
              founder: {
                "@type": "Person",
                name: "Reily Castro",
                jobTitle: "Diseño y desarrollo de soluciones digitales",
                url: domain,
                sameAs: [
                  "https://github.com/Tortaconflow",
                  "https://wa.me/529541621210",
                ],
              },
              knowsAbout: [
                "Desarrollo web",
                "Diseño web responsive",
                "Automatización de procesos",
                "Inteligencia artificial para negocios",
                "Integración de sistemas y APIs",
              ],
              areaServed: [
                { "@type": "AdministrativeArea", name: "Oaxaca" },
                { "@type": "Country", name: "México" },
              ],
            },
          ],
        };
        const verification = content.seo.googleSiteVerification
          ? `\n      <meta name="google-site-verification" content="${escapeHtml(content.seo.googleSiteVerification)}" />`
          : "";
        const tags = `<title>${escapeHtml(title)}</title>${verification}
      <meta name="description" content="${escapeHtml(content.seo.description)}" />
      <meta name="robots" content="${content.seo.allowIndexing && !releaseIssues().length ? "index, follow" : "noindex, nofollow"}" />
      <meta property="og:title" content="${escapeHtml(title)}" />
      <meta property="og:description" content="${escapeHtml(content.seo.description)}" />
      <meta property="og:type" content="website" /><meta property="og:locale" content="es_MX" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${escapeHtml(title)}" />
      <meta name="twitter:description" content="${escapeHtml(content.seo.description)}" />
      <meta name="twitter:image:alt" content="Cídiks · Reily Castro · Diseño web, automatización e IA aplicada" />
      <meta property="og:image:alt" content="Cídiks · Reily Castro · Diseño web, automatización e IA aplicada" />
      ${domain ? `<meta name="twitter:image" content="${escapeHtml(domain + content.seo.image)}" />` : ""}
      ${domain ? `<link rel="canonical" href="${escapeHtml(domain)}/" /><meta property="og:url" content="${escapeHtml(domain)}/" /><meta property="og:image" content="${escapeHtml(domain + content.seo.image)}" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />` : ""}
      <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
        return html
          .replace("<!-- SEO_CONTENT -->", tags)
          .replace(
            '<div id="root"></div>',
            `<div id="root">${renderToStaticMarkup(createElement(StaticHome))}</div>`,
          );
      },
      generateBundle(_options, bundle) {
        const domain = isWebUrl(content.links.domain)
          ? new URL(content.links.domain).origin
          : "";
        const ready = content.seo.allowIndexing && !releaseIssues().length;
        const cssFiles = Object.values(bundle).filter(
          (item) => item.type === "asset" && item.fileName.endsWith(".css"),
        );
        const editorialScript = Object.values(bundle).find(
          (item) => item.type === "chunk" && item.name === "editorial",
        );
        if (!editorialScript || !cssFiles.length)
          throw new Error("Editorial assets missing");
        const pages = [
          { path: "/conocimiento/", article: undefined },
          ...EDUCATION_ARTICLES.map((article) => ({
            path: `/conocimiento/${article.slug}/`,
            article,
          })),
        ];
        const lastmod = "2026-10-04";
        for (const page of pages) {
          const title = page.article
            ? `${page.article.title} | CÍDIKS`
            : "Guías y Criterios sobre Soluciones Digitales | CÍDIKS";
          const description =
            page.article?.tagline ||
            "Guías sobre digitalización, desarrollo web, automatización, identidad y seguridad para tomar decisiones con criterio.";
          const url = domain + page.path;
          const breadcrumbs = page.article
            ? {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Inicio",
                    item: `${domain}/`,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Conocimiento",
                    item: `${domain}/conocimiento/`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: page.article.title,
                    item: url,
                  },
                ],
              }
            : {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Inicio",
                    item: `${domain}/`,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Conocimiento",
                    item: url,
                  },
                ],
              };
          const schema = page.article
            ? {
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Article",
                    "@id": `${url}#article`,
                    headline: page.article.title,
                    description,
                    url,
                    inLanguage: "es-MX",
                    datePublished: "2026-10-04T12:00:00Z",
                    dateModified: "2026-10-04T12:00:00Z",
                    image: domain + content.seo.image,
                    author: {
                      "@type": "Person",
                      name: content.owner.name,
                      url: domain + "/#sobre-mi",
                    },
                    publisher: {
                      "@type": "Organization",
                      name: "CÍDIKS",
                      url: domain,
                      logo: {
                        "@type": "ImageObject",
                        url: domain + content.brand.symbol,
                      },
                    },
                    mainEntityOfPage: url,
                  },
                  breadcrumbs,
                ],
              }
            : {
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "CollectionPage",
                    "@id": `${url}#collection`,
                    name: title,
                    description,
                    url,
                    inLanguage: "es-MX",
                  },
                  breadcrumbs,
                ],
              };
          this.emitFile({
            type: "asset",
            fileName: page.path.slice(1) + "index.html",
            source: `<!doctype html><html lang="es-MX"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#244C3B"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="${ready ? "index, follow" : "noindex, nofollow"}"><link rel="canonical" href="${escapeHtml(url)}"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" sizes="48x48" href="/brand/favicon/favicon-48.png"><link rel="icon" type="image/png" sizes="32x32" href="/brand/favicon/favicon-32.png"><link rel="apple-touch-icon" sizes="180x180" href="/brand/favicon/apple-touch-icon.png"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(url)}"><meta property="og:type" content="${page.article ? "article" : "website"}"><meta property="og:locale" content="es_MX"><meta property="og:image" content="${escapeHtml(domain + content.seo.image)}"><meta name="twitter:card" content="summary_large_image">${cssFiles.map((css) => `<link rel="stylesheet" href="/${css.fileName}">`).join("")}<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script><script type="module" src="/${editorialScript.fileName}"></script></head><body class="knowledge-page">${renderToStaticMarkup(createElement(KnowledgePage, { article: page.article }))}</body></html>`,
          });
        }
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: `User-agent: *\n${ready ? "Allow: /" : "Disallow: /"}\n${ready && domain ? `Sitemap: ${domain}/sitemap.xml\n` : ""}`,
        });
        if (ready && domain)
          this.emitFile({
            type: "asset",
            fileName: "sitemap.xml",
            source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["/", ...pages.map((page) => page.path)].map((path) => `<url><loc>${escapeHtml(domain + path)}</loc><lastmod>${lastmod}</lastmod></url>`).join("")}</urlset>`,
          });
      },
    },
  ],
  build: { sourcemap: false },
});
