# ESTADO · CÍDIKS Comunidad

Actualizar al cerrar cada tarea importante. Sin secretos ni datos personales. Plan completo en `PLAN_CIDIKS.md`.

## Fase actual

**Fase 1 (MVP `/comunidad/`) en curso: tareas 1 a 4 completadas en estructura; 0 de 5 recursos externos verificados.** La página existe, es indexable y se encuentra desde la home y Conocimiento. Falta verificar los recursos externos (bloqueado por la red del entorno, ver abajo), la medición y validar el contenido con emprendedores reales. Nada publicado.

## Última tarea completada

Fase 1, tarea 4: biblioteca de recursos educativos externos. Estructura, validación, interfaz y pruebas listas; **los cinco candidatos quedan como pendientes porque no se pudo comprobar ninguno**. No se inventó ningún curso, condición ni fecha.

## Rama y Git

- Rama de trabajo: `feat/cidiks-comunidad-mvp`, creada desde `main` (`6bc1f50`). Sin copia remota; el clon es de solo lectura.
- Commits locales: `cd7c52b` (documentos), `300ab97` (rutas), `157593f` (página), `bc1a296` (descubrimiento), `b6135d8` (biblioteca) y el de cierre de la tarea 4.
- Sin push, merge ni despliegue.

## Estado de los recursos

| Institución | Estado | Ruta prevista | Motivo |
| --- | --- | --- | --- |
| Santander Open Academy | Pendiente | Organizar mi negocio | Sin curso elegido ni comprobado |
| HubSpot Academy | Pendiente | Empezar a vender | Sin curso elegido ni comprobado |
| Meta Blueprint | Pendiente | Mejorar mi presencia digital | Sin curso elegido ni comprobado |
| Microsoft Learn | Pendiente | Organizar mi negocio | Sin módulo elegido ni comprobado |
| Google Skillshop | Pendiente | Mejorar mi presencia digital | Sin curso elegido ni comprobado |

**Por qué no se verificó:** el proxy del entorno responde 403 (host no permitido) a los cinco sitios oficiales y no hay herramienta propia de lectura web. Se ofrecieron tres vías (agente `web-fetch`, permitir los hosts en la red del entorno, o dejarlos pendientes); la pregunta se denegó, así que no se usó ningún agente ni se cambió la red. Una búsqueda no sustituye abrir la página oficial, por eso no se registró nada como verificado.

**Cómo completarlo (cualquiera de estas vías):**
1. Autorizar el agente `web-fetch` (solo lectura, ~5 a 10 páginas públicas). Debe devolver citas textuales; solo se registra lo que respalden. La verificación sería por lectura automatizada, no por una persona abriendo el curso.
2. Permitir los dominios oficiales en la red del entorno (`update_environment`, con aprobación) y verificar con `curl`.
3. Que el propietario abra cada página oficial y comparta los datos.

**Qué comprobar de cada recurso** (y registrar tal cual, con la fecha real y cómo se hizo): URL final tras redirecciones y que sea del dominio oficial; título; disponibilidad hoy; gratuidad (qué es gratis y qué cuesta: exámenes, certificados); si pide cuenta; idiomas ofrecidos (debe haber español); nivel; qué se aprende. Lo no indicado se declara "no indicado".

**Cómo registrarlo:** reemplazar la entrada `pending` de `COMMUNITY_RESOURCES` por una `verified` con todos sus campos (ver el tipo `VerifiedCommunityResource` en `src/comunidad-recursos.ts`). El build y `tests/unit/comunidad-recursos.test.ts` fallan si falta algo (HTTPS, dominio oficial, sin rastreo, fecha válida, español, un recurso por institución, máximo cinco). Si el sitio oficial usa otro dominio, ajustar `COMMUNITY_INSTITUTIONS.officialHosts`.

## Archivos de la tarea 4

- Nuevos: `src/comunidad-recursos.ts` (tipos, instituciones, datos, validador, formato de fecha), `tests/unit/comunidad-recursos.test.ts` (10 pruebas).
- Modificados: `src/ComunidadPage.tsx` (tarjeta de recurso verificado por ruta y sección "Recursos en verificación"), `src/comunidad.css` (estilos de la tarjeta, solo para `/comunidad/`), `vite.config.ts` (el build falla si `communityResourceIssues()` reporta algo), `scripts/check-evolution.ts` y `tests/comunidad.spec.ts` (comprobaciones de enlaces externos y pendientes), `PLAN_CIDIKS.md` (sección 5), `ESTADO_CIDIKS.md`.
- Sin cambios en `src/education.ts`, `worker/`, `shared/`, `public/`, navegación ni `SiteHeader`.

## Decisiones técnicas

- **Tipos estrictos:** unión discriminada `verified | pending`. Un `pending` no puede tener `url`, `verification` ni datos del curso (lo impide el tipo y el validador), así que un recurso sin comprobar nunca se enlaza.
- **Interfaz:** verificados dentro de su ruta, en tarjetas con nombre, institución, tema, nivel, idiomas, gratuidad, cuenta, qué se aprende, actividad posterior y fecha y método de verificación. Los pendientes van aparte, sin enlaces, en "Recursos en verificación". Enlaces externos con `target="_blank"` y `rel="noopener noreferrer"` ("pestaña nueva" visible en el texto).
- **Sin JavaScript, sin seguimiento, sin dependencias:** el único `<script>` sigue siendo JSON-LD; no hay GA4 ni incrustados. CSP sin cambios.
- **Regla editorial:** un recurso por institución, máximo cinco, español obligatorio, URL a un recurso concreto (no a la portada) y sin parámetros de rastreo. `COMMUNITY_INSTITUTIONS.officialHosts` son dominios esperados que protegen de errores de captura; no sustituyen la verificación.
- **Aislamiento:** respecto a la tarea 3, el build solo cambia `comunidad/index.html` y su CSS propio; home, guías y asesor idénticos.

## Pruebas de la tarea 4 (todas pasan)

- `npm run build` (incluye `tsc --noEmit` y la validación de recursos), `check:release`, `check:evolution`, `check:advisor`, `check:hybrid` (69 de 69).
- Playwright `tests/comunidad.spec.ts` (móvil y escritorio): 22 de 22. Una prueba nueva recorre los recursos de los datos: con todos pendientes comprueba que no hay enlaces externos y que los cinco aparecen aparte sin enlace.
- Como hoy no hay verificados, la tarjeta se probó con un recurso de ejemplo **temporal** (ya retirado, sin rastro en código ni en `dist/`): 22 de 22 con axe WCAG 2.1 A/AA, sin desborde a 320 px, CSP real de `.htaccess` y atributos de los enlaces externos; revisión visual en 390 y 1440 px.
- Pruebas unitarias: esquema, rutas, duplicados, instituciones, enlaces (HTTPS, dominio oficial, sin rastreo, fragmento, portada, credenciales), fecha válida, español, pendientes sin enlace y más de cinco recursos. El validador también se prueba con casos defectuosos.
- No se hicieron consultas externas. No se ejecutó la suite Playwright completa: nada más cambió en el build.

## Cómo verla en local

```sh
npm ci
npm run build
npm run preview        # http://127.0.0.1:4173/comunidad/
```

`npm run dev` no sirve las páginas estáticas (`/comunidad/`, `/conocimiento/`, `/asesor-ia/`): solo existen tras el build.

Playwright en este entorno de la nube: la versión fijada (1.64) espera `chromium-1248` y solo hay `chromium-1243`. Se usó una configuración local temporal (no versionada) que extiende `playwright.config.ts` con `launchOptions.executablePath: "/opt/pw-browsers/chromium"`. En el CI no hace falta.

## Publicación en Hostinger: confirmado y por verificar

**Confirmado en los archivos del repositorio**
- `.github/workflows/build.yml` compila, ejecuta los `check:*` y Playwright, y sube el artefacto `hostinger-dist` (14 días). **No tiene pasos de despliegue** (ni FTP, SSH, rsync ni webhook).
- No hay otro archivo de despliegue. Existe una rama remota `hostinger`; el `README.md` la describe como el contenido de `dist/` preparado a mano para el Git clásico de Hostinger.
- El Worker se despliega aparte, con `wrangler`.
- La CSP de `public/.htaccess` es compatible con `/comunidad/`, incluidos los enlaces externos (solo navegan; no cargan nada): no requiere cambios.

**Requiere verificación del propietario**
- Si Hostinger tira automáticamente de `hostinger` o de `main` (configuración del panel).
- Si la publicación real es manual (ZIP en `public_html`) o por Git.
- El estado en vivo de `https://reilycastro.com` (el entorno de desarrollo no puede consultarlo).
- Si el subdominio temporal sigue activo (ya en `PENDIENTES.md`).

## Decisiones pendientes del propietario

1. **Verificación de los recursos:** elegir una de las tres vías de arriba. Sin ella, la biblioteca no aporta recursos.
2. **Antes de publicar:** mientras no haya al menos algunos verificados, la página solo muestra la sección "Recursos en verificación". Decidir si se publica así o si se oculta esa sección hasta verificar (hoy no hay interruptor; sería un cambio pequeño).
3. **Analítica:** incluir o no GA4 en `/comunidad/` (hoy no lo tiene). Si se incluye, reutilizar el script de `/conocimiento/` (su hash ya está autorizado en la CSP) y definir los eventos en `docs/cidiks-learning.md`.
4. **Contenido:** actividades y criterios son propuesta editorial sin probar con personas reales.
5. **Más visibilidad (opcional):** enlace en `SiteFooter` o en las páginas de cada guía.

## Problemas conocidos

- Los recursos externos pueden cambiar o retirarse: re-verificar cada 90 días como máximo (política en `PLAN_CIDIKS.md`, sección 5). No hay un recordatorio automático.
- Preexistente: la home tiene avisos de `color-contrast` en axe (`.hero-note` 4,08:1 y `.stage-note` 3,32:1 en móvil; el botón final "Analicemos tu negocio" marcado con 1,12:1, posible falsa alarma por fondo con gradiente, sin verificar).
- Preexistente: `new AxeBuilder({ page })` no pasa `tsc` estricto por tipos de `playwright-core` duplicados en `node_modules`. Playwright no tipa al ejecutar, sin efecto en el CI.
- Preexistente: en móvil el `SiteHeader` apila los cinco enlaces y ocupa casi un tercio de la pantalla (igual en `/conocimiento/`).
- Preexistente: el `README.md` menciona "once URLs editoriales" en el sitemap; hoy hay 14.
- La ruta "Organizar" incluye la guía de seguridad en la entrega, la de encaje más débil.
- El presupuesto de IA es compartido entre el asesor comercial y cualquier uso educativo futuro (Fase 2).

## Próxima tarea sugerida (requiere autorización)

**Tarea 4b: verificar y registrar los recursos** por la vía que elija el propietario. Después, **tarea 5**: medición (GA4 y eventos) y, si se decide, enlace adicional en el pie o en las páginas de las guías, más una prueba del contenido con 3 a 5 emprendedores antes de publicar.
