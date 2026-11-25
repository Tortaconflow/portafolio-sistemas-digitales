# ESTADO · CÍDIKS Comunidad

Actualizar al cerrar cada tarea importante. Sin secretos ni datos personales. Plan completo en `PLAN_CIDIKS.md` (prepublicación en la sección 7 y piloto en la 8).

## Fase actual

**Fase 1 (MVP `/comunidad/`) aceptada por el propietario hasta el commit local `cb09ae8`. Fase 1b, prepublicación y piloto, en curso.** Por ahora no se implementan funcionalidades ni se buscan más cursos. Prioridad: respaldo seguro del trabajo y piloto educativo. Nada publicado.

## Última tarea completada: evolución de la home (rama `feat/cidiks-home-evolution`, solo local)

La home pasó de portafolio comercial a puerta de entrada al ecosistema. Orden nuevo: hero ("Comprender antes de construir"; Aprender gratis, Consultar CÍDIKS IA, Explorar servicios) → selector "¿Qué necesitas hoy?" (Comunidad, CÍDIKS IA, Conocimiento: gratis; Servicios: con cotización) → sección Comunidad (`#aprende`: 3 rutas, 10 guías propias, 4 cursos externos con sus condiciones) → servicios por problema (`#soluciones`, mismos contenidos y rutas) → método → demo → proyectos (con leyenda trabajo documentado / proyecto conceptual y el índice de proyectos que estaba en el hero) → origen e identidad → cierre por intención (aprender / orientación / contratar). Encabezado: Comunidad primero (en la home: Comunidad, Conocimiento, Asesor IA, Servicios, Proyectos, CÍDIKS, Contacto; en las páginas estáticas Comunidad sustituye a Método, siguen siendo 5). Se retiró la franja decorativa de cinco palabras y `src/guide-previews.ts` (sustituido por `src/home-community.ts`, que `check:evolution` cruza con las guías, rutas y recursos verificados). Sin cambios en `worker/`, `shared/`, `public/`, SEO (título, descripción, canonical, JSON-LD) ni dependencias. Corregidos de paso dos avisos de contraste preexistentes (`.hero-note`, `.stage-note`) y el texto blanco sobre fondo claro del botón final. Pruebas: build, `check:*` y 100 de 100 en Playwright (móvil y escritorio, axe WCAG 2.1 A/AA). Pendiente de aprobación: revisión visual del propietario, merge y despliegue.

**Refinamiento final (misma rama):** la home solo orienta (tres rutas con cantidades; guías y cursos se desarrollan en `/comunidad/`); título y descripción SEO nuevos (educación gratuita, orientación, servicios, Oaxaca); "CÍDIKS IA" abre el chat flotante existente (evento `cidiks:open-chat`, sin tocar el Worker) y `/asesor-ia/` se llama "Diagnóstico guiado (sin IA)"; en móvil el collage del hero no se carga; CSS huérfano retirado (`.capabilities`, `.hero-index`, `.hero-discipline`). Pendiente: la imagen Open Graph aún dice "Diseño web, automatización e IA aplicada".

### Tarea anterior

Prepublicación: estado de Git, análisis de despliegue automático, vía para conectar con permisos de escritura, lista de verificaciones antes de publicar y guía del piloto con cinco emprendedores (todo en `PLAN_CIDIKS.md`, secciones 7 y 8). Solo documentación; sin cambios de código. Sin push, merge ni despliegue.

## Git

- Rama de trabajo: `feat/cidiks-comunidad-mvp`, desde `main` (`6bc1f50`). El clon es de solo lectura y la rama **no existe en el remoto**.
- Árbol verificado limpio el 2026-11-23 (0 cambios, 0 sin seguimiento, 0 stash). Commits locales: `cd7c52b`, `300ab97`, `157593f`, `bc1a296`, `b6135d8`, `0d6b0eb`, `306a163`, `cb09ae8` (aceptado) y el de esta documentación.
- `main` remoto sigue en `6bc1f50` (no avanzó); `hostinger` está en `60d72db`. La rama no toca `.github/`, `worker/`, `shared/`, `public/` ni `package*.json`.
- **El trabajo existe solo en este contenedor efímero.** Respaldo sin cambiar permisos: `git bundle`, que se puede generar y entregar como archivo.

## Despliegue y conexión de escritura (detalle en `PLAN_CIDIKS.md` §7)

- **Push de la rama:** no ejecuta ningún workflow (`build.yml` solo vigila `push` a `main`; no hay otro workflow y no tiene pasos de despliegue). Hostinger: sin confirmar; el propietario debe revisar la rama configurada y el despliegue automático antes del primer push.
- **Merge o push a `main`: probablemente publica** (README y `docs/cidiks-validation.md` registran que tras un push a `main` el dominio sirvió el build nuevo). No mergear sin aprobación expresa.
- **Permisos de escritura:** la conexión de GitHub ya figura con `can_push: true` en este repositorio; no hay que cambiar permisos. Pasos: `add_repo` con acceso `push` (tras autorización), clonar, traer la rama con `git fetch <ruta del clon actual> feat/cidiks-comunidad-mvp:feat/cidiks-comunidad-mvp` (ensayado: llega `cb09ae8` con el mismo árbol) y `git push -u origin feat/cidiks-comunidad-mvp`.
- No verificable desde aquí: webhooks de GitHub (la API no está habilitada en la sesión), Hostinger y Builds de Cloudflare Workers.

## Estado de los recursos

| Institución | Recurso | Ruta | Estado | Nivel | Duración | Costo | Cuenta |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Meta Blueprint | Usa WhatsApp para un negocio | Empezar a vender | Verificado | Principiante | 18 minutos | Gratuito | Iniciar sesión con Facebook para acceder a las lecciones |
| Microsoft Learn | Trabaje de forma más inteligente con IA | Organizar mi negocio | Verificado | Principiante | No informada | Gratuito | No necesaria para leer el contenido |
| HubSpot Academy | Marketing digital | Mejorar mi presencia digital | Verificado | Inicial, **clasificación editorial de CÍDIKS** (no declarada por HubSpot) | 5 horas y 45 minutos | Gratuito | Requerida |
| Google Skillshop | Promociona una empresa con contenido | Mejorar mi presencia digital | Verificado | Principiante | 3 horas | Gratuito | Iniciar sesión con Google para acceder a la formación |
| Santander Open Academy | — | Organizar mi negocio | Pendiente, **oculto** | — | — | — | — |

Santander sigue pendiente y sin entrada pública hasta identificar un curso vigente y verificarlo (el curso de Transformación Digital figura como finalizado). Dominios autorizados: `www.facebookblueprint.com`, `skillshop.exceedlms.com`, `academy.hubspot.com`, `learn.microsoft.com`.

**Procedencia de la evidencia:** revisión externa de información pública oficial, hecha por CÍDIKS el 2026-11-23 y aportada por el propietario. Este entorno no pudo consultar esos sitios (el proxy responde 403). No se registra inscripción, curso completado, certificado ni acceso con cuenta. `EXTERNAL_REVIEW_2026_11_23` en `tests/unit/comunidad-recursos.test.ts` fija la evidencia: un recurso solo puede estar `verified` si su fila está ahí. **Re-verificar antes del 2027-02-21** (90 días).

## Decisiones técnicas vigentes

- `/comunidad/` es HTML estático generado en el build, **sin JavaScript** (solo JSON-LD), sin seguimiento y sin dependencias nuevas; su CSS va aparte (`comunidad.css`), así que la home, las guías y el asesor no cambian por él. CSP de `public/.htaccess` sin cambios.
- Descubrimiento: enlace en el índice de Conocimiento y en la sección `#aprende` de la home. El encabezado conserva 5 enlaces (`check-evolution` lo exige). La página es indexable y está en el sitemap (14 URLs).
- Recursos (`src/comunidad-recursos.ts`): unión estricta `verified | pending`; un pendiente no puede llevar enlace. Un recurso por institución, máximo cinco, español obligatorio, URL oficial concreta y sin rastreo (solo se admite `locale`). `publicEntry: false` oculta un pendiente. El build falla si algo no cumple.
- Enlaces externos con `target="_blank"` y `rel="noopener noreferrer"`. La página dice que en ella no hace falta registrarse y que algunos cursos sí piden cuenta o inicio de sesión.
- Sin GA4 en `/comunidad/`.

## Pruebas vigentes

Última ejecución (tarea 4): unitarias de Comunidad 22 de 22 (72 de 72 en total), build con `tsc`, `check:evolution` y Playwright de Comunidad 22 de 22 (móvil y escritorio, axe WCAG 2.1 A/AA, CSP real). **La suite Playwright completa no se ha ejecutado después de la tarea 4** (la última fue de la tarea 3: 88 de 88); corre completa en el PR (verificación 5 del plan).

## Cómo verla en local

```sh
npm ci
npm run build
npm run preview        # http://127.0.0.1:4173/comunidad/
```

`npm run dev` no sirve las páginas estáticas (`/comunidad/`, `/conocimiento/`, `/asesor-ia/`): solo existen tras el build. Para el piloto en teléfonos: `npm run preview -- --host 0.0.0.0` y abrir la IP del portátil por Wi-Fi.

Playwright en este entorno de la nube: la versión fijada (1.64) espera `chromium-1248` y solo hay `chromium-1243`. Se usó una configuración local temporal (no versionada) que extiende `playwright.config.ts` con `launchOptions.executablePath: "/opt/pw-browsers/chromium"`. En el CI no hace falta.

## Publicación en Hostinger: confirmado y por verificar

**Confirmado en los archivos del repositorio**
- `.github/workflows/build.yml` compila, ejecuta los `check:*` y Playwright, y sube el artefacto `hostinger-dist` (14 días). No tiene pasos de despliegue.
- Existe una rama remota `hostinger`; el `README.md` la describe como el contenido de `dist/` preparado a mano para el Git clásico. El Worker se despliega aparte con `wrangler`.

**Requiere verificación del propietario**
- Qué rama tiene configurada Hostinger y si el despliegue es automático; si la publicación real es por compilación desde GitHub, por la rama `hostinger` o manual (ZIP).
- Webhooks de GitHub y si el Worker tiene una conexión Git en Cloudflare.
- El estado en vivo de `https://reilycastro.com` (el entorno no puede consultarlo) y si el subdominio temporal sigue activo (`PENDIENTES.md`).

## Decisiones pendientes del propietario

1. Autorizar el push de la rama (respaldo) y, aparte, un PR sin merge. Confirmar antes la configuración de Hostinger.
2. Cuándo y cómo hacer el piloto (sección 8 del plan) y con quiénes.
3. Santander: identificar un curso vigente y verificarlo (hoy oculto).
4. GA4 en `/comunidad/` (hoy no lleva) y si se publica indexable o tras el piloto.
5. Más visibilidad (opcional): enlace en `SiteFooter` o en las páginas de cada guía.

## Problemas conocidos

- Tres de los cuatro cursos piden cuenta o inicio de sesión (Facebook o Google en dos): la tarjeta lo indica; el piloto comprueba si se entiende.
- Los recursos externos pueden cambiar o retirarse; no hay recordatorio automático de la re-verificación.
- Actividades y criterios son propuesta editorial: el piloto los pone a prueba.
- Preexistente: avisos de `color-contrast` en la home (`.hero-note` 4,08:1, `.stage-note` 3,32:1 en móvil; el botón final marcado con 1,12:1, posible falsa alarma por gradiente, sin verificar).
- Preexistente: `new AxeBuilder({ page })` no pasa `tsc` estricto por tipos de `playwright-core` duplicados (sin efecto en el CI); el `SiteHeader` apila los cinco enlaces en móvil; el `README.md` dice "once URLs editoriales" en el sitemap y hoy hay 14.
- La guía de seguridad en la entrega encaja mal en la ruta "Organizar". El presupuesto de IA es compartido (Fase 2).

## Próxima tarea sugerida (requiere autorización)

Con autorización expresa: conectar con permisos de escritura y subir **solo** la rama como respaldo; abrir un PR sin merge para que corra la suite completa; preparar la sesión del piloto. No hacer merge a `main` ni publicar hasta cumplir las verificaciones de la sección 7.3 del plan.
