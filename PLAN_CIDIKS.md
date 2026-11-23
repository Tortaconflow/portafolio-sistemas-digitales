# PLAN · CÍDIKS Comunidad

Documento de planeación. Solo cubre la evolución hacia CÍDIKS Comunidad. El estado vigente está en `ESTADO_CIDIKS.md`. No contiene secretos ni datos personales.

## 1. Visión

CÍDIKS evoluciona de portafolio de servicios a plataforma educativa y comercial para emprendedores:

- **Educativa:** formación gratuita y práctica, en español claro.
- **Biblioteca verificada:** cursos y recursos externos oficiales, con fecha de revisión.
- **Herramientas simples:** administración y marketing al alcance de un negocio pequeño.
- **Orientación con IA:** apoyo para decidir el siguiente paso.
- **Autonomía digital:** que la persona pueda hacerlo sola.
- **Servicios profesionales opcionales:** cuando el negocio crezca y los necesite.
- **Reciprocidad y comunidad:** quien aprende puede devolver a otros.

Principio editorial heredado del sitio: nada de métricas, garantías ni "casos reales" sin evidencia. Lo no verificado se dice como supuesto.

## 2. Restricciones permanentes

- Sitio estático (React 19 + Vite). Sin base de datos, cuentas de usuario ni dependencias nuevas en el MVP.
- Sin cambios al asesor IA, al Worker ni a sus presupuestos hasta una autorización propia (Fase 2).
- Repositorio público: ningún dato de usuarios ni credenciales.
- La CSP de `public/.htaccess` no admite estilos ni scripts en línea nuevos sin ajustar hashes.
- Sin push, merge ni despliegue sin aprobación explícita.

## 3. Fases

| Fase | Alcance | Estado |
| --- | --- | --- |
| 0 | Reconocimiento técnico | Completada |
| 1 | MVP: página estática `/comunidad/` | Completada y aceptada hasta `cb09ae8` (solo local) |
| 1b | Prepublicación y piloto con cinco emprendedores | En curso (secciones 7 y 8) |
| 2 | Orientación con IA en Comunidad (modo educativo, presupuesto propio, despliegue del Worker) | Futura, con aprobación propia |
| 3 | Herramientas simples de administración y marketing | Futura |
| 4 | Servicios profesionales como siguiente paso y mecanismos de reciprocidad | Futura |

## 4. MVP (Fase 1): `/comunidad/`

Página HTML generada en el build, igual que `/conocimiento/`: canonical, metadatos, JSON-LD, sitemap y analítica existentes. Funciona sin React en el navegador.

### Tres rutas prioritarias

Cada ruta ordena guías ya existentes en `src/education.ts` (no se reescriben) y, más adelante, recursos externos verificados.

| Ruta | Guías existentes asignadas (slug) |
| --- | --- |
| Empezar a vender | `whatsapp-y-seguimiento-de-clientes`, `caso-textil-por-que-los-likes-no-son-ventas`, `como-saber-si-una-herramienta-digital-esta-funcionando` |
| Organizar mi negocio | `cuando-vale-la-pena-automatizar-e-ia`, `aprender-de-cada-proyecto`, `seguridad-en-la-entrega-digital` |
| Mejorar mi presencia digital | `google-maps-perfil-de-negocio`, `necesito-realmente-una-pagina-web`, `diferencia-entre-presencia-digital-y-sistema-digital`, `elegir-colores-con-criterio` |

La asignación es provisional y cambia si el contenido de cada guía lo pide. Las diez guías quedan cubiertas, cada una en una sola ruta.

### Archivos previstos (no creados todavía)

- `src/comunidad.ts`: rutas y, después, recursos externos (título, organización, URL oficial, tema, nivel, costo, idioma, `verificadoEl`).
- `src/ComunidadPage.tsx`: página. Reutiliza `SiteHeader` y `SiteFooter` de `src/KnowledgePage.tsx`.
- `vite.config.ts`: una entrada nueva en el generador de páginas existente.
- `src/KnowledgePage.tsx`: enlace "Comunidad" en la navegación.
- `src/editorial-entry.ts`: evento de vista, con el esquema de `docs/cidiks-learning.md`.
- Pruebas: ajuste de expectativas de `check:*` (cantidad de URLs del sitemap) y un spec de Playwright con axe.

### Criterios de aceptación

1. `npm run build` y todos los `check:*` pasan.
2. `/comunidad/` sale en `dist/` con canonical, JSON-LD y entrada en el sitemap.
3. Las diez guías aparecen enlazadas, sin duplicados ni enlaces rotos.
4. Sin scripts ni estilos en línea nuevos (compatible con la CSP actual).
5. Pruebas de accesibilidad (axe) y de móvil (390 px) sin errores.
6. Ningún archivo de `worker/` ni `shared/` modificado.

## 5. Biblioteca de recursos externos

Implementada en `src/comunidad-recursos.ts` (`COMMUNITY_RESOURCES`, tipos estrictos). Reglas editoriales, validadas en pruebas y en cada build:

- Un recurso es `verified` solo si se leyó su página oficial y se registraron la fecha (AAAA-MM-DD) y el método reales. Si no, es `pending`: se muestra aparte, **sin enlace**, y no se recomienda.
- Cada recurso verificado declara: nombre, institución, enlace oficial directo (HTTPS, dominio autorizado de la institución, sin parámetros de rastreo; solo se admite `locale`), tema, ruta, nivel, idiomas (debe incluir español), condiciones de gratuidad (y lo que sí cuesta), si pide cuenta, qué se aprende y una actividad posterior.
- Un recurso por institución y cinco como máximo. Candidatos iniciales: Santander Open Academy, HubSpot Academy, Meta Blueprint, Microsoft Learn y Google Skillshop.
- Lo que la página oficial no indique se declara "no indicado"; no se asume.
- Los enlaces salen en pestaña nueva con `noopener noreferrer`; sin incrustados, JavaScript ni seguimiento.
- **Procedencia de la evidencia:** puede ser una revisión externa de las páginas públicas oficiales hecha por CÍDIKS; así se registra en `verification.method`. No se atribuyen inscripciones, certificados ni accesos con cuenta que no se hayan realizado. Si un dato que exige el contrato no consta, el recurso sigue `pending` y se anota qué falta; no se rellena por suposición.
- Si el nivel lo clasifica CÍDIKS y la institución no lo declara, se marca `levelSource: "editorial"` y la tarjeta lo dice. La duración (`duration`) es opcional.
- Un `pending` puede ocultarse al público (`publicEntry: false`) si su entrada resultaría confusa para los visitantes.
- Re-verificar cada recurso al menos cada 90 días y retirarlo si deja de cumplirse. La fecha visible permite a cada persona juzgar su vigencia.

## 6. Riesgos y dependencias

- **Publicación en Hostinger:** mecanismo automático no confirmado (ver `ESTADO_CIDIKS.md`). Hasta aclararlo, nada se publica.
- **CSP:** cualquier recurso externo embebido (imágenes, scripts, iframes) exige actualizar `public/.htaccess`.
- **Pruebas del CI:** pueden fallar por conteos fijos de URLs al agregar la página.
- **Presupuesto de IA (Fase 2):** es compartido con el asesor comercial (8000 neurons/día); abrirlo a un público educativo puede agotarlo.
- **Verificación de recursos externos:** requiere un criterio explícito y mantenimiento continuo.
- **Producción:** no se pudo consultar desde el entorno de desarrollo; lo observado sobre el sitio publicado es provisional.

## 7. Prepublicación

### 7.1 Qué puede desplegar algo

Hechos comprobados el 2026-11-23 en el repositorio: la rama no toca `.github/`, `worker/`, `shared/`, `public/` ni `package*.json`; `main` remoto sigue en `6bc1f50` (no avanzó); la rama no existe en el remoto; el único workflow es `.github/workflows/build.yml`, que no tiene pasos de despliegue y declara `permissions: contents: read`.

| Acción | ¿Qué dispara? |
| --- | --- |
| Push de `feat/cidiks-comunidad-mvp` | No ejecuta `build.yml` (su `push` solo vigila `main`). Hostinger: depende de la rama que tenga configurada; **confirmarlo antes del primer push** |
| Abrir o actualizar un PR hacia `main` | Ejecuta `build.yml` (build, `check:*`, Playwright, artefacto `hostinger-dist`). No despliega |
| Merge o push a `main` | Ejecuta `build.yml` y, **probablemente, publica en `reilycastro.com`**: el README y `docs/cidiks-validation.md` registran que tras un push a `main` el dominio sirvió el build nuevo (compilación desde GitHub en Hostinger). No confirmado |
| Push a `hostinger` | Despliegue Git clásico (contiene `dist/`). No se toca |
| Worker (`worker/`, `shared/`) | Se despliega aparte con `wrangler`. Esta rama no los modifica |

No verificable desde el entorno de desarrollo: webhooks e integraciones de GitHub (la API no está habilitada en la sesión), la configuración de Hostinger y las Builds de Cloudflare Workers. Ver las verificaciones 2 y 3.

### 7.2 Conectar con permisos de escritura (sin cambiar permisos)

- El clon actual es de lectura anónima. La conexión de GitHub de la cuenta ya figura con `can_push: true` sobre `Tortaconflow/portafolio-sistemas-digitales`: **no hace falta cambiar permisos ni instalar nada**.
- Con autorización expresa: (1) `add_repo` con acceso `push` (adjunta el repositorio con credenciales; el clon queda en `/home/user/portafolio-sistemas-digitales`; si la sesión no lo permite, conectar GitHub en `https://claude.ai/connect-github` e iniciar una sesión nueva con el repositorio seleccionado); (2) clonar ahí; (3) traer la rama conservando los SHA: `git fetch /home/user/tortaconflow/portafolio-sistemas-digitales feat/cidiks-comunidad-mvp:feat/cidiks-comunidad-mvp`; (4) `git push -u origin feat/cidiks-comunidad-mvp`, solo esa rama y sin `--force`; (5) comprobar en GitHub que llega `cb09ae8` (o el último commit) y que no se lanzó ningún workflow.
- El paso 3 se ensayó el 2026-11-23 en un clon limpio de `main`: llega `cb09ae8`, 8 commits sobre `main`, árbol idéntico y `git fsck` sin errores.
- No se necesitan permisos de administrador, cambios en la protección de ramas ni PR (el PR es un paso aparte).
- Mientras tanto el trabajo existe solo en este contenedor, que es efímero: un respaldo sin tocar permisos es `git bundle` entregado como archivo.

### 7.3 Verificaciones antes de publicar

1. **Rama respaldada** en el remoto y `main` sin avanzar (`git ls-remote origin main` = `6bc1f50`). Si avanzó, integrar `main` y repetir las pruebas.
2. **Mecanismo de despliegue** confirmado por el propietario: Hostinger (hPanel, Git: repositorio, rama configurada y despliegue automático) y GitHub (Settings, Webhooks). Antes del primer push.
3. **Cloudflare:** que el Worker `cidiks-ia-advisor` no tenga una conexión Git (Builds) que reaccione a ramas.
4. **Respaldo del sitio actual** (copia de `public_html` o snapshot, incluido `.htaccess`) y plan de reversión: restaurar la copia, o revertir el merge y recompilar.
5. **PR hacia `main` sin mergear:** `build.yml` completo en verde (build, `check:release`, `check:evolution`, `check:advisor`, `check:hybrid`, Playwright móvil y escritorio). Es la suite completa, que no se ejecutó entera en las últimas tareas.
6. **Artefacto `hostinger-dist` del PR:** incluye `comunidad/index.html` y su CSS, el sitemap trae 14 URLs y no hay sourcemaps ni archivos ajenos.
7. **Los cuatro enlaces externos**, abiertos en un navegador el día de publicar: vigentes, gratuitos, en español y con el inicio de sesión descrito. La verificación vence el 2027-02-21. Santander sigue oculto.
8. **Decisiones del propietario:** GA4 en `/comunidad/` (hoy no lleva); si se publica ya indexable (hoy lo es y está en el sitemap) o tras el piloto; y los enlaces desde la home y Conocimiento.
9. **Piloto** (sección 8) sin hallazgos bloqueantes y con los cambios aplicados.
10. **Tras publicar** (lo ejecuta el propietario): `https://reilycastro.com/comunidad/` responde 200 con canonical y `robots` correctos; el sitemap público la incluye; sin errores CSP en consola; los enlaces externos abren en pestaña nueva; home, Conocimiento y el chat del asesor IA siguen funcionando; Search Console: enviar el sitemap e inspeccionar la URL (indexación observada, no prometida).

Orden recomendado: push de la rama (respaldo) → PR sin merge (CI) → piloto con compilación local → ajustes → verificaciones 1 a 9 → merge y despliegue solo con aprobación expresa.

## 8. Piloto con cinco emprendedores

**Objetivo.** Comprobar, con cinco personas con un negocio pequeño, si pueden encontrar `/comunidad/`, elegir una ruta, hacer su actividad práctica de forma autónoma y mostrar el criterio de aprendizaje, y si entienden las condiciones de los cursos externos (costo, cuenta, duración, nivel editorial). Es una prueba cualitativa para decidir ajustes: no mide ventas ni valida resultados comerciales. Pone a prueba la hipótesis 5 de `docs/cidiks-learning.md` (las guías aumentan la autonomía).

**Participantes y condiciones.**
- Cinco personas con negocio pequeño en Oaxaca (con y sin página web; WhatsApp o redes como canal; uso habitual del teléfono). Voluntarias, con consentimiento informado. Códigos P1 a P5; sin nombres ni datos del negocio en el repositorio público.
- Versión probada: un commit fijo, servido en local (`npm run build && npm run preview -- --host 0.0.0.0`; la persona abre desde su teléfono la IP del portátil por Wi-Fi; detener el servidor al terminar). Sin publicar. Anotar el commit.
- Rutas según su necesidad, cubriendo las tres (por ejemplo 2, 2 y 1).
- Nadie inicia sesión ni crea cuentas en plataformas externas durante la sesión: los cursos se leen en su tarjeta.
- Se puede combinar con la validación de la home (P1 de `docs/cidiks-learning.md`) para aprovechar a las mismas personas.

**Actividades** (sesión individual de unos 60 minutos y seguimiento a los 7 días).

| Momento | Tarea | Se observa |
| --- | --- | --- |
| Bienvenida (5 min) | Se explica que se prueba la página, no a la persona; pensar en voz alta; consentimiento | Disposición, dudas |
| Descubrimiento (5-10) | Desde la home: "busca dónde podrías aprender a mejorar tu negocio" | Camino, tiempo, vacilaciones |
| Elegir ruta (5) | Lee las tres rutas, elige una y explica para quién es y qué aprenderá | Comprensión con sus palabras |
| Guías (10) | Abre una guía de su ruta y lee unos 3 minutos | Qué entiende y qué haría |
| Actividad (20-25) | Empieza los pasos 1 a 3 de la actividad de su ruta, con papel o teléfono | Autonomía; ayudas dadas |
| Recurso externo (5) | Lee la tarjeta de un curso de su ruta, sin abrirlo: ¿cuánto cuesta?, ¿hace falta cuenta?, ¿cuánto dura?, ¿quién clasificó el nivel?, ¿lo tomarías? | Claridad de las condiciones |
| Cierre (5) | Claridad y utilidad (1 a 5), qué cambiaría; permiso de seguimiento | Percepción |
| Día 7 (15-20) | Muestra lo que registró; se aplica el criterio de aprendizaje de su ruta | Aprendizaje observable |

**Observaciones** (una hoja por persona, en almacenamiento privado). Commit probado, dispositivo y navegador, ruta. Por tarea: logrado sin ayuda, con ayuda o no logrado; tiempo; errores o desvíos; citas textuales; palabras que no entendió; ayudas dadas (qué y cuándo); problemas de lectura o accesibilidad; momento de abandono. Se anota lo ocurrido, sin interpretarlo.

**Indicadores educativos.** Los umbrales son hipótesis provisionales: con cinco personas sirven para decidir ajustes, no para declarar éxito.

| Indicador | Cómo se mide | Umbral provisional |
| --- | --- | --- |
| Descubrimiento | Llega a `/comunidad/` sin ayuda en 2 minutos o menos | 4 de 5 |
| Comprensión de la ruta | Rúbrica 0 a 2 al explicar para quién es y qué aprenderá | 4 de 5 con 1 o más |
| Autonomía en la actividad | Completa los pasos 1 a 3 sin ayuda del facilitador | 4 de 5 |
| Aprendizaje observable (día 7) | Cumple el criterio de aprendizaje de su ruta, con evidencia o con una tercera persona | 3 de 5 |
| Claridad de las condiciones | Acierta costo, cuenta y duración, y entiende que el nivel de HubSpot es editorial | 4 de 5 |
| Percepción | Claridad y utilidad (1 a 5) | Mediana de 4 o más |
| Tiempo real | Minutos reales frente a los que estima la página | Solo registro |

**Decisiones.** Clasificar los hallazgos (bloqueante, alto, medio, bajo); corregir primero los bloqueantes y altos y repetir con dos personas si cambia una actividad o un criterio. Se puede publicar cuando no queden bloqueantes. Los resultados agregados y anónimos se anotan en `docs/cidiks-validation.md` ("Validaciones pendientes con personas reales"); las notas por persona no entran al repositorio público (`docs/cidiks-learning.md`).

**Cuidados.** Consentimiento; no grabar sin permiso; sin incentivos condicionados; nadie comparte contraseñas ni crea cuentas durante la prueba; se puede parar cuando quiera.
