# ESTADO · CÍDIKS Comunidad

Actualizar al cerrar cada tarea importante. Sin secretos ni datos personales. Plan completo en `PLAN_CIDIKS.md`.

## Fase actual

**Fase 1 (MVP `/comunidad/`) en curso: tareas 1 a 4 completadas.** La página existe, es indexable y se encuentra desde la home y Conocimiento. La biblioteca tiene **4 de 5 recursos verificados** y Santander pendiente y oculto. Faltan la medición, validar el contenido con emprendedores reales y decidir la publicación. Nada publicado.

## Última tarea completada

Fase 1, tarea 4 (cierre): HubSpot Academy, Meta Blueprint y Google Skillshop pasan de pendientes a verificados con los datos que el propietario resolvió mediante consultas a fuentes oficiales. Microsoft Learn y Santander no se modificaron.

## Rama y Git

- Rama de trabajo: `feat/cidiks-comunidad-mvp`, creada desde `main` (`6bc1f50`). Sin copia remota; el clon es de solo lectura.
- Commits locales: `cd7c52b` (documentos), `300ab97` (rutas), `157593f` (página), `bc1a296` (descubrimiento), `b6135d8` (estructura de la biblioteca), `0d6b0eb` (documentación), `306a163` (Microsoft Learn) y el de esta tarea.
- Sin push, merge ni despliegue.

## Procedencia de la evidencia

Revisión **externa** de información pública oficial, hecha por CÍDIKS el 2026-11-23 y aportada por el propietario (los datos de cuenta, costo y nivel pendientes los resolvió después con fuentes oficiales). Este entorno no pudo consultar esos sitios (el proxy responde 403) y no hizo ninguna consulta. No se registra inscripción, curso completado, certificado ni acceso con cuenta; así consta en `verification.method`. `EXTERNAL_REVIEW_2026_11_23` en `tests/unit/comunidad-recursos.test.ts` fija la evidencia: un recurso solo puede estar `verified` si su fila está ahí. Re-verificar antes del 2027-02-21 (90 días).

## Estado de los recursos

| Institución | Recurso | Ruta | Estado | Nivel | Duración | Costo | Cuenta |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Meta Blueprint | Usa WhatsApp para un negocio | Empezar a vender | **Verificado** | Principiante (inicial) | 18 minutos | Gratuito | Iniciar sesión con Facebook para acceder a las lecciones |
| Microsoft Learn | Trabaje de forma más inteligente con IA | Organizar mi negocio | **Verificado** (sin cambios) | Principiante (inicial) | No informada | Gratuito | No necesaria para leer el contenido |
| HubSpot Academy | Marketing digital | Mejorar mi presencia digital | **Verificado** | Inicial, **clasificación editorial de CÍDIKS**, no declarada por HubSpot | 5 horas y 45 minutos | Gratuito | Requerida |
| Google Skillshop | Promociona una empresa con contenido | Mejorar mi presencia digital | **Verificado** | Principiante (inicial) | 3 horas | Gratuito | Iniciar sesión con Google para acceder a la formación |
| Santander Open Academy | — | Organizar mi negocio | Pendiente, **oculto** | — | — | — | — |

Santander sigue pendiente y sin entrada pública hasta identificar un curso vigente y verificarlo (el curso de Transformación Digital figura como finalizado en su ficha).

Dominios oficiales autorizados (`COMMUNITY_INSTITUTIONS.officialHosts`): `www.facebookblueprint.com` (Meta), `skillshop.exceedlms.com` (Google), `academy.hubspot.com`, `learn.microsoft.com`. Sustituyen a las suposiciones iniciales (`www.facebook.com`, `skillshop.withgoogle.com`).

**Para verificar Santander:** aportar un curso vigente con URL oficial, nivel, idioma (con español), costo, cuenta y duración; reemplazar su entrada `pending` por una `verified` completa en `src/comunidad-recursos.ts`, añadir su fila en `EXTERNAL_REVIEW_2026_11_23` y confirmar el dominio en `officialHosts`. Lo que la página oficial no indique se declara con `no-indicado` solo en la cuenta; gratuidad y nivel son obligatorios.

## Archivos de esta tarea

- Modificados: `src/comunidad-recursos.ts` (tres recursos verificados; valores de cuenta `requerida`, `sesion-facebook` y `sesion-google`; campos opcionales `levelSource` y `duration`; dominios autorizados; el validador solo admite el parámetro `locale`), `src/ComunidadPage.tsx` (fila de duración, nota de nivel editorial y dos ajustes de texto), `tests/unit/comunidad-recursos.test.ts`, `scripts/check-evolution.ts`, `tests/comunidad.spec.ts`, `PLAN_CIDIKS.md`, `ESTADO_CIDIKS.md`.
- Sin cambios en IA, Worker, backend, navegación, `SiteHeader`, `src/education.ts` ni despliegue. Las tres rutas y sus actividades quedan como estaban.

## Decisiones técnicas

- **Datos exactos, sin suposiciones:** el costo de los tres es "gratuito" y su texto lo dice así ("según la información pública de su página oficial"). La cuenta se muestra con las palabras de la revisión; por eso se añadieron tres valores en vez de reutilizar "gratuita".
- **Nivel de HubSpot:** `levelSource: "editorial"`. La tarjeta dice "Es una clasificación editorial de CÍDIKS, no un nivel declarado por HubSpot Academy". Los demás niveles constan en la revisión y no llevan nota.
- **Textos editoriales:** "qué aprenderás" se limita al título y al nivel ("curso introductorio" solo donde el nivel consta como principiante); la actividad es propia de CÍDIKS y no atribuye contenido al curso.
- **Enlace de Google:** conserva `?locale=es` (elige el idioma; no rastrea). El validador solo admite ese parámetro.
- **Textos de la página:** el aviso "no necesitas registrarte" ahora dice "en esta página", porque Meta, Google y HubSpot piden cuenta o inicio de sesión en su plataforma; la introducción de los recursos también lo advierte. Sin recursos pendientes públicos, la sección "Recursos en verificación" no se muestra.
- **Sin JavaScript, sin seguimiento, sin dependencias:** el único `<script>` sigue siendo JSON-LD; la CSP no cambia. Los cuatro enlaces externos llevan `target="_blank"` y `rel="noopener noreferrer"`.

## Pruebas (todas pasan)

- Unitarias de Comunidad (rutas y recursos): 22 de 22. Incluyen la evidencia de los cuatro verificados (título, URL, ruta, nivel y su origen, duración, idioma, cuenta, fecha y que el método no atribuye inscripción ni certificados), los dominios autorizados y que Santander es el único pendiente y sigue oculto.
- `npm run build` (incluye `tsc --noEmit` y la validación de recursos) y `check:evolution`: cuatro enlaces externos seguros y registrados; cuenta, duración y nota editorial visibles; Santander ausente.
- Playwright `tests/comunidad.spec.ts` (móvil y escritorio): 22 de 22, con las cuatro tarjetas reales (axe WCAG 2.1 A/AA, sin desborde a 320 px, CSP real de `.htaccess`, objetivos táctiles de 44 px). Revisión visual en móvil.
- No se ejecutaron `check:release`, `check:advisor` ni la suite completa: no se tocó nada ajeno a `/comunidad/`. No se hicieron consultas externas.

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

1. **Santander Open Academy:** identificar un curso vigente y verificarlo (hoy oculto).
2. **Analítica:** incluir o no GA4 en `/comunidad/` (hoy no lo tiene). Si se incluye, reutilizar el script de `/conocimiento/` (su hash ya está autorizado en la CSP) y definir los eventos en `docs/cidiks-learning.md`.
3. **Contenido:** actividades y criterios son propuesta editorial sin probar con personas reales.
4. **Más visibilidad (opcional):** enlace en `SiteFooter` o en las páginas de cada guía.
5. **Publicación:** subir la rama requiere permiso de escritura en el repositorio y autorización expresa.

## Problemas conocidos

- Los recursos externos pueden cambiar o retirarse: re-verificar como máximo cada 90 días (política en `PLAN_CIDIKS.md`, sección 5). No hay recordatorio automático.
- Tres de los cuatro cursos piden cuenta o inicio de sesión (Facebook o Google en dos casos): la tarjeta lo indica, pero conviene valorarlo antes de recomendarlos.
- Preexistente: la home tiene avisos de `color-contrast` en axe (`.hero-note` 4,08:1 y `.stage-note` 3,32:1 en móvil; el botón final "Analicemos tu negocio" marcado con 1,12:1, posible falsa alarma por fondo con gradiente, sin verificar).
- Preexistente: `new AxeBuilder({ page })` no pasa `tsc` estricto por tipos de `playwright-core` duplicados en `node_modules`. Playwright no tipa al ejecutar, sin efecto en el CI.
- Preexistente: en móvil el `SiteHeader` apila los cinco enlaces y ocupa casi un tercio de la pantalla (igual en `/conocimiento/`).
- Preexistente: el `README.md` menciona "once URLs editoriales" en el sitemap; hoy hay 14.
- La ruta "Organizar" incluye la guía de seguridad en la entrega, la de encaje más débil.
- El presupuesto de IA es compartido entre el asesor comercial y cualquier uso educativo futuro (Fase 2).

## Próxima tarea sugerida (requiere autorización)

**Tarea 5:** medición (GA4 y eventos) y, si se decide, enlace adicional en el pie o en las páginas de las guías; probar el contenido con 3 a 5 emprendedores antes de publicar. En paralelo, identificar el curso de Santander.
