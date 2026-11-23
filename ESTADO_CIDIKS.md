# ESTADO · CÍDIKS Comunidad

Actualizar al cerrar cada tarea importante. Sin secretos ni datos personales. Plan completo en `PLAN_CIDIKS.md`.

## Fase actual

**Fase 0 completada (reconocimiento técnico). Fase 1 (MVP `/comunidad/`) sin iniciar, pendiente de autorización.**

## Última tarea completada

Fase 0: diagnóstico técnico aceptado como base provisional, sujeto a los puntos sin verificar de abajo. Creación de `PLAN_CIDIKS.md` y `ESTADO_CIDIKS.md`.

## Rama y Git

- Rama de trabajo: `feat/cidiks-comunidad-mvp`, creada desde `main` (`6bc1f50`).
- Sin push, merge ni despliegue. No existe una copia remota de esta rama.
- El repositorio se clonó en modo lectura y poco profundo (un commit de historial).

## Archivos modificados

- Creados: `PLAN_CIDIKS.md`, `ESTADO_CIDIKS.md`.
- Ningún otro archivo tocado. `src/`, `worker/`, `shared/` y `public/` sin cambios.

## Decisiones técnicas

- MVP: página estática `/comunidad/` generada en el build, como `/conocimiento/`. Sin base de datos, cuentas ni dependencias.
- Tres rutas: empezar a vender, organizar mi negocio, mejorar mi presencia digital.
- Se reutilizan las diez guías de `src/education.ts` sin reescribirlas.
- Asesor IA, Worker y presupuestos de IA quedan fuera hasta la Fase 2.

## Publicación en Hostinger: confirmado y por verificar

**Confirmado en los archivos del repositorio**
- `.github/workflows/build.yml` compila (`npm ci`, `npm run build`, `check:*`, Playwright) y sube el artefacto `hostinger-dist`, con retención de 14 días. **No contiene pasos de despliegue** (ni FTP, SSH, rsync ni webhook).
- No hay otro archivo de despliegue en el repositorio (`package.json`, `vite.config.ts`, `wrangler*.jsonc` revisados por palabras clave).
- Existe una rama remota `hostinger`. El `README.md` la describe como la rama que contiene solo el contenido de `dist/` para el despliegue Git clásico de Hostinger, que se prepara a mano.
- El Worker se despliega aparte con `wrangler` (`worker/wrangler.prod.jsonc`), sin pasar por el CI.

**Requiere verificación del propietario (no se puede comprobar desde el repositorio)**
- Si Hostinger tiene configurado un Git o webhook que **tire automáticamente** de la rama `hostinger` o de `main`. Esa configuración vive en el panel de Hostinger.
- Si la publicación real es manual (ZIP en `public_html`) o por la rama `hostinger`.
- Si un push a `main` publica algo por sí mismo. Según los archivos, no.
- El estado en vivo de `https://reilycastro.com` (el entorno de desarrollo no puede consultarlo).
- Si el subdominio temporal sigue activo (ya listado en `PENDIENTES.md`).

## Problemas conocidos

- Las pruebas pueden depender de conteos fijos de URLs del sitemap; se confirmará al implementar.
- La CSP de `public/.htaccess` bloquea estilos y scripts en línea nuevos.
- El presupuesto de IA es compartido entre el asesor comercial y cualquier uso educativo futuro.

## Próxima tarea concreta

**Fase 1, tarea 1:** crear `src/comunidad.ts` con las tres rutas y la asignación de las diez guías por slug, más una prueba que verifique que cada slug existe en `EDUCATION_ARTICLES` y que ninguna guía queda duplicada o sin ruta. Sin tocar aún la página, el build ni la navegación.
