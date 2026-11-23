# ESTADO · CÍDIKS Comunidad

Actualizar al cerrar cada tarea importante. Sin secretos ni datos personales. Plan completo en `PLAN_CIDIKS.md`.

## Fase actual

**Fase 1 (MVP `/comunidad/`) en curso: tareas 1 a 4 completadas.** La página existe, es indexable y se encuentra desde la home y Conocimiento. La biblioteca tiene **1 de 5 recursos verificado** (Microsoft Learn), 3 pendientes por datos sin confirmar y 1 pendiente oculto. Faltan completar esos datos, la medición y validar el contenido con emprendedores reales. Nada publicado.

## Última tarea completada

Fase 1, tarea 4 (cierre): integración de los recursos con la evidencia de la **revisión externa del 2026-11-23**. Solo se integró lo que el contrato de validación permite con datos confirmados; no se rellenó ningún dato por suposición.

## Rama y Git

- Rama de trabajo: `feat/cidiks-comunidad-mvp`, creada desde `main` (`6bc1f50`). Sin copia remota; el clon es de solo lectura.
- Commits locales: `cd7c52b` (documentos), `300ab97` (rutas), `157593f` (página), `bc1a296` (descubrimiento), `b6135d8` (estructura de la biblioteca), `0d6b0eb` (documentación) y el de esta tarea.
- Sin push, merge ni despliegue.

## Procedencia de la evidencia

Revisión **externa** de las páginas públicas oficiales, hecha por CÍDIKS el 2026-11-23 y aportada por el propietario. Este entorno no pudo consultar esos sitios (el proxy responde 403) y no hizo ninguna consulta; tampoco se registró inscripción, certificado ni acceso con cuenta. Así consta en `verification.method`, y `EXTERNAL_REVIEW_2026_11_23` en `tests/unit/comunidad-recursos.test.ts` fija la evidencia: un recurso solo puede estar `verified` si su fila está ahí con lo que esa revisión confirmó. Re-verificar antes del 2027-02-21 (90 días).

## Estado de los recursos

| Institución | Recurso revisado | Estado | Dato faltante o nota | ¿Se ve en la página? |
| --- | --- | --- | --- | --- |
| Microsoft Learn | Trabaje de forma más inteligente con IA (ruta "Organizar mi negocio") | **Verificado** | Ninguno. Cuenta: "no necesaria para leer el contenido". No se informó duración | Sí, tarjeta |
| HubSpot Academy | Marketing digital (ruta "Mejorar mi presencia digital") | Pendiente | **Nivel** | Sí, "en revisión" |
| Meta Blueprint | Usa WhatsApp para un negocio (ruta "Empezar a vender") | Pendiente | **Costo / condiciones de gratuidad** y **si hace falta cuenta**. Además, confirmar que `www.facebookblueprint.com` es dominio oficial para añadirlo | Sí, "en revisión" |
| Google Skillshop | Promociona una empresa con contenido (ruta "Mejorar mi presencia digital") | Pendiente | **Costo / condiciones de gratuidad** y **si hace falta cuenta**. Además, el enlace está en `skillshop.exceedlms.com`, no en un dominio de Google: confirmar que es el oficial para añadirlo | Sí, "en revisión" |
| Santander Open Academy | — | Pendiente, **oculto** | Sin curso vigente: el curso revisado (Transformación Digital) figura como finalizado en su ficha | No aparece en ningún lugar |

**Datos ya recibidos de los pendientes (no publicados, para completarlos rápido):**
- HubSpot: `https://academy.hubspot.com/es/courses/digital-marketing`; 5 h 45 min; español; costo gratuito; cuenta requerida.
- Meta: `https://www.facebookblueprint.com/student/path/211935-use-whatsapp-business`; 18 min; español; nivel principiante.
- Google: `https://skillshop.exceedlms.com/student/collection/711435-promote-with-content?locale=es`; 3 h; español; nivel principiante.

**Para pasar un pendiente a verificado:**
1. Aportar el dato faltante. Si la página oficial no lo indica, decirlo expresamente (valor `no-indicado` en la cuenta). La gratuidad y el nivel no admiten "no indicado": son obligatorios.
2. Reemplazar su entrada `pending` por una `verified` completa en `src/comunidad-recursos.ts` y añadir su fila en `EXTERNAL_REVIEW_2026_11_23`.
3. Si el dominio es nuevo, añadirlo a `COMMUNITY_INSTITUTIONS.officialHosts` solo tras confirmar que es oficial.
4. Ejecutar build, `check:evolution` y las pruebas de Comunidad.

Vocabulario por ampliar al integrarlos: HubSpot necesita un valor de cuenta "requerida" (la revisión dice "requerida", no "gratuita"; no se asume). La duración (HubSpot, Meta y Google la informaron) pide un campo opcional `duration` que aún no existe.

## Archivos de esta tarea

- Modificados: `src/comunidad-recursos.ts` (Microsoft Learn verificado; rutas y temas actualizados; `publicEntry` en pendientes; cuenta `no-para-leer`; `publicPendingResources()`), `src/ComunidadPage.tsx` (la sección de pendientes solo lista los públicos y usa un texto para visitantes), `tests/unit/comunidad-recursos.test.ts`, `scripts/check-evolution.ts`, `tests/comunidad.spec.ts`, `PLAN_CIDIKS.md` (sección 5), `ESTADO_CIDIKS.md`.
- Sin cambios en `src/education.ts`, `worker/`, `shared/`, `public/`, navegación, `SiteHeader`, backend ni despliegue. Las tres rutas y sus actividades quedan como estaban.

## Decisiones técnicas

- **No se rellenó nada:** HubSpot sin nivel y Meta y Google sin costo ni cuenta quedan pendientes. La evidencia de Microsoft se usó tal cual: nivel "principiante" → inicial, idioma español, costo gratuito, cuenta no necesaria para leer.
- **Textos del recurso verificado:** "qué aprenderás" se limita a lo que respaldan el título y el nivel ("ruta introductoria", con el temario en la página oficial). La actividad es editorial (propia de CÍDIKS), no contenido del curso; incluye no pegar datos de clientes en la herramienta de IA. No se afirma inscripción, certificado ni acceso autenticado.
- **Contrato ampliado, no relajado:** se añadió el valor de cuenta `no-para-leer` ("No hace falta una cuenta para leer el contenido") porque "no" afirmaba más de lo comprobado. La validación sigue exigiendo todos los campos.
- **`publicEntry` en los pendientes:** `false` los oculta de toda la página (Santander). Los demás se listan como "en revisión", sin enlace y sin la nota interna de lo que falta.
- **Sin JavaScript, sin seguimiento, sin dependencias:** el único `<script>` sigue siendo JSON-LD; la CSP no cambia. El único enlace externo es el de Microsoft Learn, con `target="_blank"` y `rel="noopener noreferrer"`.

## Pruebas (todas pasan)

- Unitarias de Comunidad (rutas y recursos): 21 de 21. Incluyen la evidencia de la revisión externa, que Santander sigue oculto y que HubSpot, Meta y Google siguen pendientes hasta que se registre su evidencia.
- `npm run build` (incluye `tsc --noEmit` y la validación de recursos) y `check:evolution`: un enlace externo, seguro y registrado; fecha visible; pendientes públicos sin enlaces; Santander ausente.
- Playwright `tests/comunidad.spec.ts` (móvil y escritorio): 22 de 22, ya con la tarjeta real (axe WCAG 2.1 A/AA, sin desborde a 320 px, CSP real de `.htaccess`, objetivos táctiles de 44 px). Revisión visual en 390 y 1440 px.
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
- La CSP de `public/.htaccess` es compatible con `/comunidad/`, incluido el enlace externo (solo navega; no carga nada): no requiere cambios.

**Requiere verificación del propietario**
- Si Hostinger tira automáticamente de `hostinger` o de `main` (configuración del panel).
- Si la publicación real es manual (ZIP en `public_html`) o por Git.
- El estado en vivo de `https://reilycastro.com` (el entorno de desarrollo no puede consultarlo).
- Si el subdominio temporal sigue activo (ya en `PENDIENTES.md`).

## Decisiones pendientes del propietario

1. **Datos faltantes de HubSpot, Meta y Google** (tabla de arriba), o dejarlos "en revisión" tal cual.
2. **Visibilidad de los pendientes:** hoy HubSpot, Meta y Google se listan como "en revisión". Si resultan confusos, basta poner `publicEntry: false`.
3. **Analítica:** incluir o no GA4 en `/comunidad/` (hoy no lo tiene). Si se incluye, reutilizar el script de `/conocimiento/` (su hash ya está autorizado en la CSP) y definir los eventos en `docs/cidiks-learning.md`.
4. **Contenido:** actividades y criterios son propuesta editorial sin probar con personas reales.
5. **Más visibilidad (opcional):** enlace en `SiteFooter` o en las páginas de cada guía.

## Problemas conocidos

- Los recursos externos pueden cambiar o retirarse: re-verificar como máximo cada 90 días (política en `PLAN_CIDIKS.md`, sección 5). No hay recordatorio automático.
- Preexistente: la home tiene avisos de `color-contrast` en axe (`.hero-note` 4,08:1 y `.stage-note` 3,32:1 en móvil; el botón final "Analicemos tu negocio" marcado con 1,12:1, posible falsa alarma por fondo con gradiente, sin verificar).
- Preexistente: `new AxeBuilder({ page })` no pasa `tsc` estricto por tipos de `playwright-core` duplicados en `node_modules`. Playwright no tipa al ejecutar, sin efecto en el CI.
- Preexistente: en móvil el `SiteHeader` apila los cinco enlaces y ocupa casi un tercio de la pantalla (igual en `/conocimiento/`).
- Preexistente: el `README.md` menciona "once URLs editoriales" en el sitemap; hoy hay 14.
- La ruta "Organizar" incluye la guía de seguridad en la entrega, la de encaje más débil.
- El presupuesto de IA es compartido entre el asesor comercial y cualquier uso educativo futuro (Fase 2).

## Próxima tarea sugerida (requiere autorización)

**Completar los pendientes** cuando el propietario aporte los datos faltantes (ver tabla). Después, **tarea 5**: medición (GA4 y eventos) y, si se decide, enlace adicional en el pie o en las páginas de las guías, más una prueba del contenido con 3 a 5 emprendedores antes de publicar.
