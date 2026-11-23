# ESTADO · CÍDIKS Comunidad

Actualizar al cerrar cada tarea importante. Sin secretos ni datos personales. Plan completo en `PLAN_CIDIKS.md`.

## Fase actual

**Fase 1 (MVP `/comunidad/`) en curso: tarea 1 completada.** La página visual, la navegación y el build aún no se tocaron.

## Última tarea completada

Fase 1, tarea 1: `src/comunidad.ts` con las tres rutas educativas, que reutilizan las diez guías por slug. Pruebas propias: 8 de 8 pasan.

## Rama y Git

- Rama de trabajo: `feat/cidiks-comunidad-mvp`, creada desde `main` (`6bc1f50`).
- Commits locales: `cd7c52b` (documentos de la Fase 0) y el commit de esta tarea.
- Sin push, merge ni despliegue. No existe copia remota de la rama; el clon es de solo lectura.

## Archivos modificados

- Fase 0: `PLAN_CIDIKS.md`, `ESTADO_CIDIKS.md`.
- Tarea 1: `src/comunidad.ts` (nuevo), `tests/unit/comunidad.test.ts` (nuevo), `ESTADO_CIDIKS.md`.
- Sin cambios en `src/education.ts`, `worker/`, `shared/`, `public/`, `vite.config.ts` ni navegación.

## Decisiones técnicas

- MVP: página estática `/comunidad/` generada en el build, como `/conocimiento/`. Sin base de datos, cuentas ni dependencias.
- `src/comunidad.ts` solo guarda slugs de guías; no copia su contenido. Exporta `COMMUNITY_ROUTES`, `guidesForRoute()` y `communityRouteIssues()` (validación reutilizable por la futura página o el build).
- Cada ruta tiene: público, objetivo de aprendizaje, guías en orden de lectura, una actividad autónoma (pasos, duración, evidencia) y un criterio de aprendizaje observable.
- Reparto de guías: vender (3), organizar (3), presencia (4); las diez, sin duplicados.
- La prueba vive en `tests/unit/` y el CI la recoge sola con `npm run check:hybrid` (`tests/unit/*.test.ts`).

## Pruebas de la tarea 1

- `node --experimental-strip-types --test tests/unit/comunidad.test.ts`: 8 de 8.
- `tsc --strict` sobre `src/comunidad.ts` y `src/education.ts`: sin errores.
- No ejecutado: `npm run build`, los demás `check:*` y Playwright (no hay `node_modules`; no se instalaron dependencias). El archivo de prueba no se pudo tipar sin `@types/node`.

## Decisiones pedagógicas

- Cada actividad se hace con papel o una hoja de cálculo, es gratuita y se puede revisar con otra persona.
- Dos actividades incluyen una semana de registro para decidir con datos, no con intuición.
- La ruta "Organizar" pide listar cuentas y quién las controla, y dice explícitamente que no se escriban contraseñas.
- Los criterios se comprueban con terceros o con evidencia: una persona ajena, un registro, una tabla.

## Publicación en Hostinger: confirmado y por verificar

**Confirmado en los archivos del repositorio**
- `.github/workflows/build.yml` compila (`npm ci`, `npm run build`, `check:*`, Playwright) y sube el artefacto `hostinger-dist`, con retención de 14 días. **No contiene pasos de despliegue** (ni FTP, SSH, rsync ni webhook).
- No hay otro archivo de despliegue en el repositorio.
- Existe una rama remota `hostinger`. El `README.md` la describe como la rama con el contenido de `dist/`, preparada a mano, para el despliegue Git clásico.
- El Worker se despliega aparte, con `wrangler` (`worker/wrangler.prod.jsonc`), sin pasar por el CI.

**Requiere verificación del propietario**
- Si Hostinger tira automáticamente de `hostinger` o de `main` (configuración del panel).
- Si la publicación real es manual (ZIP en `public_html`) o por Git.
- El estado en vivo de `https://reilycastro.com` (el entorno de desarrollo no puede consultarlo).
- Si el subdominio temporal sigue activo (ya listado en `PENDIENTES.md`).

## Problemas conocidos

- Los `check:*` pueden depender de conteos fijos de URLs del sitemap; se confirmará al agregar la página.
- La CSP de `public/.htaccess` bloquea estilos y scripts en línea nuevos.
- El presupuesto de IA es compartido entre el asesor comercial y cualquier uso educativo futuro (Fase 2).
- Las actividades y criterios son una propuesta editorial: faltan por probar con emprendedores reales.
- La ruta "Organizar" incluye la guía de seguridad en la entrega, que es la de encaje más débil; revisar tras la primera prueba con usuarios.

## Próxima tarea concreta

**Fase 1, tarea 2:** crear `src/ComunidadPage.tsx` (página estática con las tres rutas, sus guías enlazadas a `/conocimiento/<slug>/`, actividad y criterio) y hacer que `vite.config.ts` genere `/comunidad/` con canonical, JSON-LD y sitemap. Sin tocar aún la navegación. Requiere ejecutar `npm ci` (autorización) para poder correr el build y los `check:*`.
