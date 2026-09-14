# Verificación de la primera versión

Revisión local del build de producción el 12 de septiembre de 2026. Navegador Chromium de Google Chrome, sin extensiones y con movimiento reducido para las capturas automatizadas.

| Vista      | Desbordamiento horizontal | Errores JS | Axe WCAG A/AA               | Menú / casos / precios / formulario |
| ---------- | ------------------------- | ---------- | --------------------------- | ----------------------------------- |
| 390 × 844  | Ninguno                   | Ninguno    | Sin infracciones detectadas | Correctos                           |
| 768 × 1024 | Ninguno                   | Ninguno    | Sin infracciones detectadas | Correctos                           |
| 1440 × 900 | Ninguno                   | Ninguno    | Sin infracciones detectadas | Correctos                           |

Se revisaron visualmente las capturas de inicio de móvil, tableta y escritorio. Se generaron además capturas de página completa.

Comprobaciones funcionales: apertura de caso, cierre con Escape y retorno del foco al botón; cambio de precios con clic y flechas del teclado; selección del plan transmitida al mensaje; campos del formulario y codificación de acentos y `&` en el enlace de correo; menú móvil y cierre al navegar. No se envió correo ni se contactó a terceros.

Paraíso Laguna: las 16 piezas optimizadas cargaron correctamente en 390 × 844 y 1440 × 900. La galería no presentó desbordamiento horizontal, errores de JavaScript ni infracciones automáticas WCAG A/AA. Cada pieza conserva acceso a la imagen completa y texto alternativo descriptivo.

Lighthouse móvil local: rendimiento **99/100**, accesibilidad **100/100**, buenas prácticas **100/100**. FCP y LCP: **1.7 s**, bloqueo total: **10 ms**, CLS: **0.033**. Son mediciones de laboratorio, no garantías sobre el alojamiento o dispositivos reales.

SEO: **66/100** en esta vista previa porque la indexación está bloqueada deliberadamente hasta completar el contenido. Los metadatos están presentes en el HTML inicial; canonical, URL e imagen social absolutos y sitemap esperan el dominio real. `npm run check:release` detecta los datos faltantes y devuelve código 1 deliberadamente; el build técnico sí pasa.

Limitaciones: faltan capturas auténticas de BRISA, Señor Gallo VIP y Laboratorio de Diseño Educativo con IA, además de confirmación editorial, Messenger, dominio y verificación del despliegue en Hostinger. La composición de capturas del hero se activa cuando se configuran las tres primeras imágenes reales. No hay métricas comerciales, testimonios ni teléfonos inventados. Las pruebas automatizadas no reemplazan una revisión con tecnologías de asistencia y un envío manual desde un dispositivo real.
