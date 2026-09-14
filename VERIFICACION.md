# Verificación del rediseño · 13 de septiembre de 2026

Dirección «cristal editorial»: perla, azul hielo y lavanda; monograma RC, tipografía amplia y superficies translúcidas. La portada utiliza trabajo real de Paraíso Laguna. El caso destacado y sus 16 piezas conservan acceso a la web externa y a las imágenes completas. No se añadieron retratos, testimonios ni métricas comerciales inventadas.

Build de producción: `npm run build` correcto (TypeScript y Vite).

| Vista | Desbordamiento | Errores JS | Axe WCAG A/AA | Interacciones |
| --- | --- | --- | --- | --- |
| 390 × 844 | Ninguno | Ninguno | Sin infracciones detectadas | Correctas |
| 768 × 1024 | Ninguno | Ninguno | Sin infracciones detectadas | Correctas |
| 1440 × 900 | Ninguno | Ninguno | Sin infracciones detectadas | Correctas |

Comprobados apertura de caso, cierre con Escape y retorno del foco; precios por clic y teclado; plan seleccionado en el mensaje; formulario y codificación de acentos y ampersand en mailto; menú móvil y cierre al navegar. No se enviaron mensajes.

La galería cargó 16/16 imágenes en móvil y escritorio, sin desbordamiento, errores JS ni infracciones automáticas. Comprobación adicional de ancho a 320 px: sin desbordamiento. Revisión visual de portada y proyectos. Se respeta la preferencia de movimiento reducido.

Lighthouse móvil local después de optimizar las tres miniaturas de portada: rendimiento **96/100**, accesibilidad **100/100**, buenas prácticas **100/100**, SEO **69/100**. Miniaturas de portada: 92 KB en total, frente a 385 KB de sus imágenes de galería. Los originales se conservan. La auditoría es de laboratorio y no garantiza el comportamiento del alojamiento real.

Limitaciones: las pruebas automáticas no sustituyen una revisión con tecnologías de asistencia. Faltan las imágenes de tres proyectos y confirmación editorial. La indexación sigue bloqueada deliberadamente; el dominio temporal de Hostinger configurado previamente se conserva. Este informe valida el build local, no un despliegue remoto de Hostinger.
