import { content, releaseIssues } from "../src/content.ts";
import { existsSync } from "node:fs";
const issues = releaseIssues();
for (const p of content.projects)
  if (p.image && !existsSync(`public${p.image}`))
    issues.push(`No existe public${p.image}`);
for (const p of content.projects)
  for (const media of p.gallery ?? [])
    if (!existsSync(`public${media.src}`))
      issues.push(`No existe public${media.src}`);
if (!existsSync(`public${content.seo.image}`)) issues.push("Imagen Open Graph");
for (const asset of [content.brand.symbol, content.brand.wordmark, "/favicon.svg", "/brand/favicon/apple-touch-icon.png", "/brand/favicon/favicon-16.png", "/brand/favicon/favicon-32.png", "/brand/favicon/favicon-48.png"])
  if (!existsSync(`public${asset}`)) issues.push(`No existe public${asset}`);
if (issues.length) {
  console.error(
    "Pendiente antes de publicar:\n" + issues.map((i) => `- ${i}`).join("\n"),
  );
  process.exitCode = 1;
} else console.log("Contenido listo para publicar. Ejecuta npm run build.");
