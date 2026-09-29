# P1 · Preparación de salida

## SEO y migración futura

La única URL base del sitio se configura en `src/content.ts`, `content.links.domain`. Desde el 29 de septiembre de 2026 apunta a `https://reilycastro.com`. `vite.config.ts` deriva de ahí canonical, `og:url`, imágenes sociales absolutas, `WebSite.url` y sitemap. El dominio respondió por HTTPS; el build emitió `index, follow`, `robots.txt` con `Allow: /` y sitemap. La versión servida coincide con los hashes del build. `check:release` valida contenido y rutas, pero no verifica la indexación efectiva ni permisos externos.

Para completar la migración del dominio:

1. El propietario solicitó publicar en el dominio final. El HTTPS, el canonical, `robots.txt`, sitemap y los bundles coincidentes se verificaron después del despliegue.
2. Confirmar en Search Console la indexación del dominio, enviar el sitemap y revisar las vistas previas sociales.
3. La consulta al subdominio temporal de Hostinger se reinició durante la revisión, sin una respuesta HTTP verificable. Si sigue activo, configurar una redirección HTTP 301 por ruta al dominio final. Después, confirmar códigos 301/200 y que no existan cadenas o bucles.

Las referencias a subdominios en `content.projects[*].url` son **destinos de casos de clientes**, no la URL base del portafolio; no deben migrarse junto con ella. Las rutas de favicon, logo e imágenes de proyecto son relativas al origen del sitio. El subdominio temporal puede seguir apareciendo en documentación histórica y en el HTML de la build anterior hasta desplegar una nueva versión.

## Semántica y formulario

La SPA mantiene varias vistas en el código, pero las vistas inactivas están ocultas o desmontadas. En las siete rutas inspeccionadas se ve un solo H1 por vista; no se cambia la jerarquía por contar nodos H1 del archivo fuente. El formulario tiene 12 controles y 9 obligatorios. El diagnóstico preselecciona un interés cuando se llega al contacto, pero no rellena datos personales. Para la siguiente iteración, probar con usuarios una primera etapa de nombre, canal de respuesta, necesidad y consentimiento; solicitar datos de negocio, presupuesto y enlaces sólo después, cuando sean útiles para la conversación. Medir abandonos antes de modificar el formulario actual.

## Condiciones externas pendientes

- Opinión profesional sobre CÍDIKS/CIDICS (P0 externo).
- Evidencia de derechos y consentimientos por imagen: `docs/p1-visual-rights-inventory.md`.
- Dominio definitivo, despliegue e indexación según la secuencia anterior.
- Pruebas con personas reales y recepción efectiva de los canales de contacto.
