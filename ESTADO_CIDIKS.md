# ESTADO · CÍDIKS Comunidad

Actualizar al cerrar cada tarea importante. Sin secretos ni datos personales. Plan completo en `PLAN_CIDIKS.md`.

## Fase actual

**Fase 1 (MVP `/comunidad/`) en curso: tareas 1, 2 y 3 completadas.** La página existe, es indexable y ya se encuentra desde la home y desde Conocimiento. Falta la biblioteca de recursos externos (tarea 4), la medición y validar el contenido con emprendedores reales. Nada publicado.

## Última tarea completada

Fase 1, tarea 3: descubrimiento de `/comunidad/` desde el sitio existente, sin tocar el encabezado.

## Rama y Git

- Rama de trabajo: `feat/cidiks-comunidad-mvp`, creada desde `main` (`6bc1f50`). Sin copia remota; el clon es de solo lectura.
- Commits locales: `cd7c52b` (documentos), `300ab97` (rutas), `157593f` (página) y el de la tarea 3.
- Sin push, merge ni despliegue.

## Archivos de la tarea 3

- Modificados: `src/KnowledgePage.tsx` (+enlace bajo la introducción del índice de Conocimiento), `src/HomeJourney.tsx` (+enlace al final de la sección `#aprende`), `scripts/check-evolution.ts` (+comprobaciones de descubrimiento), `tests/comunidad.spec.ts` (+3 pruebas), `ESTADO_CIDIKS.md`.
- Sin CSS nuevo. Sin cambios en `SiteHeader`, `SiteFooter`, `content.ts` (navegación de la home), `worker/`, `shared/`, `public/` ni `vite.config.ts`.

## Decisiones técnicas

- **Ubicación (la más simple):** un enlace de texto, "¿Prefieres seguir un orden? Conoce las rutas gratuitas de CÍDIKS Comunidad ↗", en dos sitios donde ya se lee contenido educativo: (1) índice `/conocimiento/`, al que lleva el enlace "Conocimiento" del encabezado de cada página; (2) sección de guías `#aprende` de la home. `HomeJourney` alimenta tanto el HTML estático previo a JavaScript como la home en React, así que un solo cambio cubre ambos.
- **Encabezado intacto (5 enlaces):** en móvil `SiteHeader` apila sus enlaces y ocupa casi un tercio de la pantalla; un sexto elemento lo empeoraría. `check-evolution` falla si el encabezado de la home, el asesor, Conocimiento o Comunidad deja de tener 5 enlaces o enlaza `/comunidad/`; habrá que actualizarlo a propósito si algún día se añade.
- **Sin CSS nuevo, a propósito:** se reutilizan `inline-link` y `section-description` (esta última da el margen superior de 20 px en la home). Una regla nueva habría cambiado el hash del CSS principal (115 KB, 22,7 KB gzip), y con él el HTML de todas las páginas y la caché de quienes ya visitaron.
- **Indexable:** `/comunidad/` conserva `robots: index, follow`, canonical y su entrada en el sitemap; ya no queda huérfana.
- **Sin analítica nueva:** no se añadió GA4 ni eventos; el Worker no se tocó.

## Pruebas de la tarea 3 (todas pasan)

- `npm run build` (incluye `tsc --noEmit`), `check:release`, `check:evolution` (12 páginas), `check:advisor`, `check:hybrid` (59 de 59).
- Playwright, **suite completa** (móvil y escritorio): 88 de 88. Incluye las 3 pruebas nuevas: el enlace funciona con y sin JavaScript desde la home y desde Conocimiento, el encabezado sigue con 5 enlaces y axe WCAG 2.1 A/AA sin violaciones en las zonas modificadas.
- **Regresión de diseño:** se comparó la geometría del DOM de la home y de Conocimiento antes y después, en 390 y 1440 px. Cambia solo el bloque añadido: todo lo anterior queda idéntico y todo lo posterior se desplaza exactamente lo mismo (home +81,5 px en móvil y +58,75 px en escritorio; Conocimiento +85,5 y +62,75). Estructura del DOM idéntica salvo el enlace. (La comparación de píxeles no sirve aquí: el desplazamiento fraccional cambia el suavizado del texto.)
- **Accesibilidad de página completa (axe, con best-practice):** idéntica antes y después en la home y en Conocimiento.
- **Rendimiento:** CSS sin cambios (los cuatro archivos conservan su hash); cambian `index.html`, `conocimiento/index.html` e `index-*.js` (+~50 B gzip cada uno). LCP dentro del ruido (±8 ms en local), CLS igual (home 0,0095 móvil; 0,011 escritorio), mismas peticiones. Los chunks `AltitudCaseStudy` y `ParaisoCaseStudy` cambian de nombre porque dependen del hash de `index` (se vuelven a descargar una vez tras el despliegue).
- Se comprobó que `check-evolution` detecta la falta del enlace (mutación del HTML construido).
- No ejecutado: Lighthouse (no hay dependencia instalada ni autorizada) ni `npm audit`.

## Cómo verla en local

```sh
npm ci
npm run build
npm run preview        # http://127.0.0.1:4173/ , /conocimiento/ y /comunidad/
```

`npm run dev` no sirve las páginas estáticas (`/comunidad/`, `/conocimiento/`, `/asesor-ia/`): solo existen tras el build.

Playwright en este entorno de la nube: la versión fijada (1.64) espera `chromium-1248` y solo hay `chromium-1243`. Se usó una configuración local temporal (no versionada) que extiende `playwright.config.ts` con `launchOptions.executablePath: "/opt/pw-browsers/chromium"`. En el CI no hace falta.

## Publicación en Hostinger: confirmado y por verificar

**Confirmado en los archivos del repositorio**
- `.github/workflows/build.yml` compila, ejecuta los `check:*` y Playwright, y sube el artefacto `hostinger-dist` (14 días). **No tiene pasos de despliegue** (ni FTP, SSH, rsync ni webhook).
- No hay otro archivo de despliegue. Existe una rama remota `hostinger`; el `README.md` la describe como el contenido de `dist/` preparado a mano para el Git clásico de Hostinger.
- El Worker se despliega aparte, con `wrangler`.
- La CSP de `public/.htaccess` es compatible con `/comunidad/` y con los enlaces nuevos (sin scripts ni estilos en línea): no requiere cambios.

**Requiere verificación del propietario**
- Si Hostinger tira automáticamente de `hostinger` o de `main` (configuración del panel).
- Si la publicación real es manual (ZIP en `public_html`) o por Git.
- El estado en vivo de `https://reilycastro.com` (el entorno de desarrollo no puede consultarlo).
- Si el subdominio temporal sigue activo (ya en `PENDIENTES.md`).

## Decisiones pendientes del propietario

1. **Analítica:** incluir o no GA4 en `/comunidad/` (hoy no lo tiene). Si se incluye, reutilizar el script de `/conocimiento/` (su hash ya está autorizado en la CSP) y definir los eventos en `docs/cidiks-learning.md`.
2. **Contenido:** actividades y criterios son propuesta editorial sin probar con personas reales.
3. **Más visibilidad (opcional):** enlace en `SiteFooter` o en las páginas de cada guía ("esta guía forma parte de la ruta…"). No se hizo para mantener el cambio mínimo.

## Problemas conocidos

- Preexistente: la home tiene avisos de `color-contrast` en axe (`.hero-note` 4,08:1 y `.stage-note` 3,32:1 en móvil; el botón final "Analicemos tu negocio" marcado con 1,12:1, posible falsa alarma por fondo con gradiente, sin verificar). Idénticos antes y después de la tarea 3.
- Preexistente: `new AxeBuilder({ page })` no pasa `tsc` estricto por tipos de `playwright-core` duplicados en `node_modules`. Playwright no tipa al ejecutar, sin efecto en el CI.
- Preexistente: en móvil el `SiteHeader` apila los cinco enlaces y ocupa casi un tercio de la pantalla (igual en `/conocimiento/`).
- Preexistente: el `README.md` menciona "once URLs editoriales" en el sitemap; hoy hay 14.
- Preexistente: la home tiene un CLS pequeño (~0,01), sin relación con este trabajo.
- La ruta "Organizar" incluye la guía de seguridad en la entrega, la de encaje más débil.
- El presupuesto de IA es compartido entre el asesor comercial y cualquier uso educativo futuro (Fase 2).
- Para la tarea 4: el proxy de este entorno bloquea hosts externos (por ejemplo `reilycastro.com`), así que verificar en línea los enlaces oficiales puede no ser posible desde aquí. Se confirmará al empezar; si no hay red, el propietario verifica y se registra quién y cuándo.

## Próxima tarea sugerida (requiere autorización)

**Fase 1, tarea 4: biblioteca inicial de cinco recursos educativos gratuitos con enlaces oficiales y verificación editorial.** Propuesta mínima:
- `COMMUNITY_RESOURCES` en `src/comunidad.ts`: título, organización, URL oficial (HTTPS, dominio de la organización), ruta, costo declarado, idioma, nivel, qué se aprende, `verifiedOn` (fecha) y nota de verificación.
- Una sección por ruta en `/comunidad/` con enlaces externos (`rel="noreferrer"`, marcados como externos). Sin incrustar nada (la CSP no cambia).
- Protocolo de verificación: abrir la URL oficial, confirmar que el acceso es gratuito sin tarjeta, el idioma, la fecha y el alcance; registrar quién y cuándo. Prueba unitaria: cinco recursos, URL HTTPS válida, sin duplicados, con fecha y asignados a una ruta existente.
- El propietario aprueba la lista de los cinco recursos antes de integrarlos.
