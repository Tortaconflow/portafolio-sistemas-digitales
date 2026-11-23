# ESTADO · CÍDIKS Comunidad

Actualizar al cerrar cada tarea importante. Sin secretos ni datos personales. Plan completo en `PLAN_CIDIKS.md`.

## Fase actual

**Fase 1 (MVP `/comunidad/`) en curso: tareas 1 y 2 completadas.** La página existe en el build; falta decidir su integración (navegación, medición, indexación) y validarla con emprendedores reales. Nada publicado.

## Última tarea completada

Fase 1, tarea 2: página estática `/comunidad/` generada en el build, con las tres rutas de `src/comunidad.ts` y las diez guías existentes.

## Rama y Git

- Rama de trabajo: `feat/cidiks-comunidad-mvp`, creada desde `main` (`6bc1f50`). Sin copia remota; el clon es de solo lectura.
- Commits locales: `cd7c52b` (documentos), `300ab97` (rutas) y el de la tarea 2.
- Sin push, merge ni despliegue.

## Archivos de la tarea 2

- Nuevos: `src/ComunidadPage.tsx`, `src/comunidad.css`, `src/comunidad-entry.ts`, `tests/comunidad.spec.ts`.
- Modificados: `src/comunidad.ts` (+`COMMUNITY_PAGE`: ruta, título, descripción, lastmod), `vite.config.ts` (solo adiciones y la línea del sitemap), `scripts/check-evolution.ts` (+comprobaciones de Comunidad y su URL en `pages`), `tests/unit/comunidad.test.ts` (+1 prueba), `ESTADO_CIDIKS.md`.
- Sin cambios en `src/education.ts`, `worker/`, `shared/`, `public/`, navegación ni `SiteHeader`.

## Decisiones técnicas

- **Sin JavaScript en `/comunidad/`:** el único `<script>` es JSON-LD. Enlaces, anclas y texto; sin formularios, cuentas ni datos.
- **Sin analítica por ahora:** a diferencia de `/conocimiento/`, la página no incluye el arranque de GA4. Es una decisión pendiente del propietario (ver abajo).
- **CSS aislado:** `comunidad.css` se empaqueta con una entrada de solo estilos (`comunidad-entry.ts`); el build descarta su chunk JS vacío. Así los CSS/JS de la home, el asesor y las guías quedan byte a byte idénticos.
- **Comparado contra el `dist/` previo:** solo hay 2 archivos nuevos (`comunidad/index.html`, `assets/comunidad-*.css`) y cambia únicamente `sitemap.xml` (14 URLs; +`/comunidad/`, lastmod 2026-11-23).
- Reutiliza `SiteHeader`, `SiteFooter`, los tokens de `visual-system.css` y clases existentes (`editorial-*`, `button`, `inline-link`, `mono`, `eyebrow`). Mobile-first (`min-width: 760px`).
- El build falla si `communityRouteIssues()` reporta algo (guía inexistente, repetida o sin ruta).
- Metadatos: canonical `https://reilycastro.com/comunidad/`, `robots: index, follow` (igual que el resto), Open Graph/Twitter y JSON-LD `CollectionPage` + `ItemList` + migas de pan.
- Estructura por ruta: para quién es, qué aprenderás, 1. Lee las guías (enlazadas, no copiadas), 2. Haz la actividad, 3. Comprueba que aprendiste. Cierre con CTA opcional y nota de alcance sin promesas.

## Pruebas de la tarea 2 (todas pasan)

- `npm run build` (incluye `tsc --noEmit`), `check:release`, `check:evolution` (12 páginas editoriales), `check:advisor`, `check:hybrid` (59 de 59).
- Playwright `tests/comunidad.spec.ts`, móvil 390 y escritorio 1440: 14 de 14. Cubre HTML sin JS, las diez guías sin copiar, enlaces internos y anclas (200), cero solicitudes externas o errores, **CSP real leída de `public/.htaccess`** (sin violaciones y con el CSS aplicado), axe WCAG 2.1 A/AA, sin desborde a 320/390/768/1440 px, objetivos táctiles de 44 px y foco visible.
- Humo de páginas existentes (`advisor.spec.ts` "ruta directa"): 2 de 2.
- Se comprobó que las pruebas detectan fallos: inyectando un `<script>`, un `<style>` y una imagen sin `alt` en el HTML construido, fallaron `check:evolution`, la prueba de CSP, la de terceros/JS y la de axe.
- No ejecutado: la suite Playwright completa (el resto de `dist/` es idéntico al previo, así que no hay superficie de regresión en otras páginas) ni `npm audit`.

## Cómo verla en local

```sh
npm ci
npm run build
npm run preview        # http://127.0.0.1:4173/comunidad/
```

`npm run dev` no la sirve: las páginas estáticas (`/comunidad/`, `/conocimiento/`, `/asesor-ia/`) solo existen tras el build.

Playwright en este entorno de la nube: la versión fijada (1.64) espera `chromium-1248` y solo hay `chromium-1243`. Se usó una configuración local temporal (no versionada) que extiende `playwright.config.ts` con `launchOptions.executablePath: "/opt/pw-browsers/chromium"`. En el CI no hace falta.

## Publicación en Hostinger: confirmado y por verificar

**Confirmado en los archivos del repositorio**
- `.github/workflows/build.yml` compila, ejecuta los `check:*` y Playwright, y sube el artefacto `hostinger-dist` (14 días). **No tiene pasos de despliegue** (ni FTP, SSH, rsync ni webhook).
- No hay otro archivo de despliegue. Existe una rama remota `hostinger`; el `README.md` la describe como el contenido de `dist/` preparado a mano para el Git clásico de Hostinger.
- El Worker se despliega aparte, con `wrangler`.
- La CSP de `public/.htaccess` ya es compatible con `/comunidad/` (sin scripts ni estilos en línea): no requiere cambios.

**Requiere verificación del propietario**
- Si Hostinger tira automáticamente de `hostinger` o de `main` (configuración del panel).
- Si la publicación real es manual (ZIP en `public_html`) o por Git.
- El estado en vivo de `https://reilycastro.com` (el entorno de desarrollo no puede consultarlo).
- Si el subdominio temporal sigue activo (ya en `PENDIENTES.md`).

## Decisiones pendientes del propietario

1. **Navegación:** `/comunidad/` no está enlazada desde ninguna página (la navegación no se tocó, por instrucción). Como está en el sitemap y es indexable, publicarla así la deja huérfana. Decidir cuándo enlazarla o si publicarla con `noindex` hasta entonces.
2. **Analítica:** incluir o no el arranque de GA4 en `/comunidad/`. Si se incluye, reutilizar exactamente el script de `/conocimiento/` (su hash ya está autorizado en la CSP) y definir eventos en `docs/cidiks-learning.md`.
3. **Contenido:** actividades y criterios son propuesta editorial sin probar con personas reales.

## Problemas conocidos

- Preexistente: `new AxeBuilder({ page })` no pasa `tsc` estricto por tipos de `playwright-core` duplicados en `node_modules`. Playwright no tipa al ejecutar, sin efecto en el CI.
- Preexistente: en móvil el `SiteHeader` apila los cinco enlaces y ocupa casi un tercio de la pantalla (igual en `/conocimiento/`).
- Preexistente: el `README.md` menciona "once URLs editoriales" en el sitemap; hoy hay 14.
- La ruta "Organizar" incluye la guía de seguridad en la entrega, la de encaje más débil.
- El presupuesto de IA es compartido entre el asesor comercial y cualquier uso educativo futuro (Fase 2).

## Próxima tarea sugerida (requiere autorización)

**Fase 1, tarea 3: integración y medición.** Según lo que decida el propietario: enlace "Comunidad" en `SiteHeader` y en la navegación de la home, estrategia de indexación, GA4/eventos y corrección del conteo de URLs en el `README.md`. Antes de publicar: probar las actividades con 3 a 5 emprendedores y confirmar el mecanismo de publicación en Hostinger.
