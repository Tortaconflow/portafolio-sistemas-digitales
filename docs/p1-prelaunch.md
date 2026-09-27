# P1 · Preparación de salida

## SEO y migración futura

La única URL base del sitio se configura en `src/content.ts`, `content.links.domain`. Hoy apunta al subdominio temporal de Hostinger. `vite.config.ts` deriva de ahí canonical, `og:url`, imágenes sociales absolutas, `WebSite.url` y, cuando corresponda, sitemap. `content.seo.allowIndexing` permanece en `false`: el build emite `noindex, nofollow`, `robots.txt` con `Disallow: /` y ningún sitemap XML. `check:release` valida contenido y rutas, pero no autoriza indexación ni comprueba permisos externos.

Cuando se decida y active el dominio definitivo:

1. Confirmar dominio, TLS, despliegue y consentimiento para publicar; cambiar **sólo** `content.links.domain` y después `content.seo.allowIndexing` a `true` para el build de producción.
2. Reconstruir y verificar en el dominio real `title`, descripción, canonical, robots, sitemap, OG, Twitter, JSON-LD y carga de la imagen social. Confirmar que el servidor/CDN no sobreescriba `robots.txt` ni agregue encabezados `X-Robots-Tag` contradictorios.
3. Si el subdominio temporal sigue accesible, configurar en el hosting una redirección HTTP 301 por ruta hacia el dominio final. Este repositorio no crea la redirección porque el dominio aún no existe. Verificar después códigos 301/200, ausencia de cadenas/bucles, canonical final y sitemap con URLs finales. Revisar Search Console y compartir una vista previa social.

Las referencias a subdominios en `content.projects[*].url` son **destinos de casos de clientes**, no la URL base del portafolio; no deben migrarse junto con ella. Las rutas de favicon, logo e imágenes de proyecto son relativas al origen del sitio. El subdominio temporal puede seguir apareciendo en documentación histórica y en el HTML de la build anterior hasta desplegar una nueva versión.

## Semántica y formulario

La SPA mantiene varias vistas en el código, pero las vistas inactivas están ocultas o desmontadas. En las siete rutas inspeccionadas se ve un solo H1 por vista; no se cambia la jerarquía por contar nodos H1 del archivo fuente. El formulario tiene 12 controles y 9 obligatorios. El diagnóstico preselecciona un interés cuando se llega al contacto, pero no rellena datos personales. Para la siguiente iteración, probar con usuarios una primera etapa de nombre, canal de respuesta, necesidad y consentimiento; solicitar datos de negocio, presupuesto y enlaces sólo después, cuando sean útiles para la conversación. Medir abandonos antes de modificar el formulario actual.

## Condiciones externas pendientes

- Opinión profesional sobre CÍDIKS/CIDICS (P0 externo).
- Evidencia de derechos y consentimientos por imagen: `docs/p1-visual-rights-inventory.md`.
- Dominio definitivo, despliegue e indexación según la secuencia anterior.
- Pruebas con personas reales y recepción efectiva de los canales de contacto.
