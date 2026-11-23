import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OfflineGuide } from '../src/advisor/OfflineGuide.tsx';
import { OFFLINE_GUIDE_PATH } from '../shared/offline-guide.ts';

const hash = (source: string) => createHash('sha256').update(source).digest('hex').slice(0, 12);
const read = (name: string) => readFileSync(new URL(`../src/advisor/${name}`, import.meta.url), 'utf8');

export function offlineGuideAssets() {
  const css = read('offline-guide.css');
  const registration = read('offline-guide-register.js');
  const worker = read('offline-guide-worker.js');
  const cssPath = `${OFFLINE_GUIDE_PATH}guia-${hash(css)}.css`;
  const registrationPath = `${OFFLINE_GUIDE_PATH}registro-${hash(registration)}.js`;
  const html = `<!doctype html>
<html lang="es-MX"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Guía rápida para tu negocio · CÍDIKS</title>
<link rel="stylesheet" href="${cssPath}">
<script defer src="${registrationPath}"></script>
</head><body>${renderToStaticMarkup(createElement(OfflineGuide))}</body></html>`;
  const cacheName = 'cidiks-offline-guide-' + hash(html + worker);
  const files = JSON.stringify([OFFLINE_GUIDE_PATH, cssPath, registrationPath]);
  return [
    { fileName: `${OFFLINE_GUIDE_PATH.slice(1)}index.html`, source: html },
    { fileName: cssPath.slice(1), source: css },
    { fileName: registrationPath.slice(1), source: registration },
    { fileName: `${OFFLINE_GUIDE_PATH.slice(1)}offline.js`, source: `const cacheName = "${cacheName}";\nconst files = ${files};\n${worker}` },
  ];
}
