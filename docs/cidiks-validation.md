# Verificación de la evolución CÍDIKS

Fecha: 4 de octubre de 2026. Vista previa del build servido por Vite en `127.0.0.1:4173`; navegador integrado. Dimensiones configuradas: 390×844, 768×1024 y 1440×900. Las capturas y la inspección DOM se hicieron después de cargar cada vista; los módulos diferidos necesitan terminar de cargar antes de evaluarlos.

## Comprobaciones realizadas

| Área | Resultado |
| --- | --- |
| TypeScript y build Vite | Compilación correcta; sin librerías de producto nuevas |
| `check:release` | Contenido, imágenes y datos de publicación disponibles |
| `check:evolution` | Home con texto HTML previo a JS, 11 páginas editoriales, canonical, un h1 por guía, sitemap, recursos locales, previews y contrato de analítica |
| Home móvil/tablet/escritorio | Un h1 visible; sin desbordamiento horizontal en las dimensiones revisadas; CTA accesible en la entrada |
| Menú móvil | Abre y permite ir a Método; navegación marca un único destino actual |
| Método | Cuatro pasos y entregables; prácticas de desarrollo en sección propia |
| ALTITUD móvil / Paraíso tablet | Casos visibles con h1 propio; Opportunity, ASTRA y Engineering no aparecen en esos destinos |
| Guía de color móvil | HTML legible, fuente W3C enlazada, canonical propio y sin desbordamiento |
| Demo escritorio | Alterna información dispersa / seguimiento y cambia la comparación; escenarios etiquetados hipotéticos |
| Diagnóstico | Completa objetivo → contexto → prioridad → orientación; conservación de respuestas y CTA a contacto |
| Diálogo de caso | Abre desde índice del hero; CTA de contacto cierra el diálogo y navega al formulario |
| Formulario | Requiere nombre, negocio y problema; vacío bloqueado; mensaje con datos de prueba revisable y enlace WhatsApp codificado; enlace de correo también verificado; un URL inválido en contexto cerrado vuelve a abrir los campos para corregir; no se envió un mensaje externo |
| Instrumentación | Prueba de eventos, exclusión de nombre/email/mensaje, buffer acotado a 100; preparación no dispara envío; fallos del transporte no rompen `track` |
| Enlaces de proyectos | Paraíso, Gubidxa, Señor Gallo y repositorio del Consejo respondieron HTTP 200 por HEAD; no prueba su funcionamiento interno |
| Dependencias | `npm audit` y `npm audit --omit=dev`: cero vulnerabilidades reportadas en esa consulta |

Durante desarrollo una pestaña conservaba un build anterior después de recompilar. Al solicitar un módulo cuyo hash había cambiado se produjo un error de carga; recargar corrigió la referencia. Se añadió un límite de errores con acción explícita para recargar, para evitar una pantalla vacía ante un fallo similar. Ese error del build anterior no se presenta como una medición del sitio nuevo.

## Accesibilidad: alcance de esta revisión

Se revisaron jerarquía de encabezados, nombres de controles, etiquetas de formulario, estados de botones, menú móvil, texto alternativo, dimensiones de imágenes y rutas de contacto. Las opciones del diagnóstico son botones nativos; al avanzar se enfoca la pregunta siguiente o el resultado. El progreso tiene nombre accesible. La validación abre el contexto adicional si un campo oculto tiene un error. Se respeta movimiento reducido en los estilos nuevos. Esta revisión no es una auditoría de conformidad WCAG ni sustituye pruebas con lectores de pantalla y dispositivos físicos.

## Rendimiento y SEO

Build de referencia: JS principal aproximadamente 95.2 KB gzip, CSS compartido 22.7 KB gzip, HTML de entrada 6.1 KB gzip. Estos son tamaños de artefactos, **no el peso total de una navegación**: faltan imágenes, fuentes y otros recursos. El código editorial añade aproximadamente 0.85 KB gzip entre entrada y analítica. Diagnóstico y casos se cargan al visitar su vista; los módulos complementarios del diagnóstico al desplegarlos.

Home prerenderizada y guías HTML; canonical, descriptions, OG, esquema Article/CollectionPage, GSC conservado y sitemap con 12 URLs (home, índice y diez guías). Casos con hashes conservados: no se presentan como páginas independientes de buscador. La indexación efectiva debe comprobarse en Search Console.

No se publican cifras inventadas de LCP, INP o CLS. No se ejecutó una medición de campo con muestra suficiente ni una prueba de red limitada en teléfonos físicos. Registrar condiciones y fecha antes de comunicar resultados de velocidad; separar laboratorio de campo y móvil de escritorio.

## Validaciones pendientes con personas reales

Comprensión en 10 segundos, recepción real del canal, calidad del diagnóstico, autonomía tras entrega y cambios de conversión. Ver `cidiks-learning.md` para hipótesis, métricas, comparación A/B y prioridades. Estas tareas requieren usuarios o datos reales y no se declaran completadas por una revisión del navegador.

## Publicación

Publicación comprobada el 4 de octubre de 2026 en **https://reilycastro.com/**. Commit de implementación: `eeb0e293fa815d8708c5b71994caf5b71678c7d0`. El [despliegue de GitHub Actions](https://github.com/Tortaconflow/portafolio-sistemas-digitales/actions/runs/37225084583) terminó con estado `completed` y conclusión `success`.

- El HTML público referencia `index-C0WBELBw.js` y `index-GQom4xgz.css`, los mismos artefactos del build revisado.
- Se descargó el JS servido por el dominio y su SHA-256 coincide con el archivo local: `9A631B08D0BF67AF52DEC0B1B8D087EBDB931957FBF650A2E318F45F3C3A4393`.
- GET público de las 12 URLs: HTTP 200 y canonical correcto en home, índice y las diez guías.
- El sitemap público coincide con el generado. `robots.txt` permite el sitio y señala `https://reilycastro.com/sitemap.xml`.
- Navegador en producción: portada actualizada, ALTITUD con contenido propio e índice con diez guías. Sin errores ni advertencias capturados en la consola de esa revisión.
- Portada pública a 390×844: sin desbordamiento horizontal; captura guardada. También se guardó la portada de escritorio a 1440×900. Los demás recorridos responsive y funcionales se revisaron en la vista previa, según la tabla anterior.

Se comprobó el contenido que sirve Hostinger, además del resultado del workflow. La publicación no demuestra indexación, conversiones, recepción de mensajes ni velocidad de campo.
