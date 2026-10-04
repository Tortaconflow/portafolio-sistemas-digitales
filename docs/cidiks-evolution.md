# CÍDIKS: auditoría y decisiones · 4 de octubre de 2026

## 1. Auditoría antes de intervenir

Base: `9e417da`, rama main limpia. React 19, TypeScript, Vite, sitio estático en Hostinger. Se revisaron App, contenido, diagnóstico, ASTRA, educación, los dos casos editoriales, CSS, SEO, analítica, formulario, workflow y cabeceras HTTP del dominio. La pestaña abierta conservaba una versión antigua: tras recargar coincidió con el copy actual. No se interpreta una captura en caché como estado del despliegue.

| Severidad | Hecho observado | Decisión |
| --- | --- | --- |
| Crítico | No se detectó un bloqueo crítico en el alcance revisado. | Esto no equivale a una certificación de seguridad. |
| Alto | Opportunity, ASTRA e Engineering se montan sin condición de ruta: aparecen antes de ALTITUD y otros destinos. | Montar sólo en la vista que corresponde. |
| Alto | `contact_submitted` se dispara al preparar un mensaje; no existe backend ni confirmación de recepción. | Preparación, apertura de canal y recepción son estados distintos. |
| Alto | Engineering publica LCP <1.2s, INP <80ms y CLS 0 sin una medición trazable; el artículo textil se llama caso real sin evidencia. | Retirar cifras y convertir el ejemplo en supuesto explícito. |
| Alto | La home abre con catálogo de tecnologías y contiene tres caminos de diagnóstico, sin el método de cuatro pasos. | Hero claro, método, problemas, demo, evidencia y una acción principal. |
| Medio | Formulario con 12 controles y 9 requeridos. | Nombre, negocio y problema requeridos; contexto adicional opcional. |
| Medio | Artículos expandidos sólo por JS y hashes: sitemap con una única URL. | Publicar HTML editorial por URL, metadata propia y enlaces rastreables. |
| Medio | Gradiente morado de premium sigue en el titular pese a la paleta editorial; ASTRA usa cara con referencia escultórica mesoamericana. | Texto verde sólido y marca estructural existente; retirar imitación cultural. |
| Medio | CSS acumulado en siete archivos; App monolítico; componentes lazy montados anticipadamente. | Extraer recorrido de home, casos y páginas editoriales; conservar módulos útiles. |
| Medio | JSON-LD atribuye el título “Ingeniero de Software” no confirmado en el brief. | Usar actividad pública, sin atribuir un título académico. |
| Bajo | Navegación marca Perfil y Contacto a la vez como página actual. | Un destino actual por enlace. |

Se preservan: paleta papel/verde/terracota, fuentes locales, logo, precios existentes, enlaces, fotografías autorizadas, WebP adaptable de ALTITUD, galerías, filtros, diagnóstico por reglas, GSC, canonical y publicación estática. `npm audit --omit=dev`: cero vulnerabilidades reportadas; no prueba ausencia de todas las vulnerabilidades. HTTPS válido y cabeceras nosniff/referrer presentes. No hay backend, secretos en la configuración pública ni plataforma externa de analítica instalada.

## 2. Posicionamiento e información

**CÍDIKS ayuda a negocios a entender qué frena su presencia, atención u operación y construir la solución digital adecuada.** Web, identidad, contenido, automatización e IA son intervenciones posibles después del diagnóstico.

Home: hero → fricción → Observar/Comprender/Diagnosticar/Resolver → soluciones por problema → demo ilustrativa → casos → capacidad del cliente y guías → origen → acción. Profundidad en Método, Sobre CÍDIKS, diagnóstico opcional y Conocimiento. Proyectos conservan sus enlaces existentes.

Hero: “Entendemos primero. Construimos después.” Subtexto: diseño y desarrollo de soluciones digitales para negocios que necesitan claridad antes de invertir. CTA “Quiero un diagnóstico”. Final “Cuéntame qué quieres resolver”. Alcance: conversación inicial, sin prometer auditoría completa ni resultados comerciales.

El origen tabasqueño y la investigación relacionada con raíz provienen del relato del fundador. La frase de marca es interpretación contemporánea. No se publica una traducción literal ni atribución ancestral; referencia lingüística exacta pendiente de adjuntar fuente primaria. Ciencias de la Educación es formación relacionada declarada por el fundador, sin inventar grado ni certificación. La herramienta de color se describe como experiencia relatada, sin atribuir métricas o publicar datos de la clienta.

## 3. Mapa de decisiones

| Problema / evidencia | Cambio | Impacto esperado (hipótesis) | Cómo medir |
| --- | --- | --- | --- |
| Catálogo en hero + tres diagnósticos | Método y una CTA; diagnóstico en destino propio | Comprensión en 10 segundos | Prueba de recuerdo con 5 visitantes nuevos; hero_cta_click |
| 9 campos obligatorios | 3 requeridos, extras desplegables | Menos abandono | contact_start → mensaje preparado → contact_submit con etapa explícita |
| Faltan alternativas visibles | Demo antes/después marcada ilustrativa | Comprensión del criterio de diseño | demo_view y conversación posterior |
| Fichas enfocadas en piezas | Contexto, problema, diagnóstico, decisión, solución, evidencia y aprendizaje | Confianza basada en hechos | case_view + contactos atribuibles; sin asumir causalidad |
| Guías no tienen URLs propias | HTML editorial + sitemap + fuentes | Descubrimiento orgánico | Impresiones/clics GSC por URL; indexación no garantizada |
| Métricas y ejemplos sin soporte | Objetivos/prácticas vs evidencia separados | Mejor credibilidad | Revisión editorial y objeciones de visitantes |

## 4. Prioridad técnica

Primero: rutas, copy, semántica de contacto, afirmaciones y foco visual (impacto alto, esfuerzo bajo/medio, riesgo bajo, evidencia directa). Después: recorrido modular, demo y casos, HTML editorial, SEO y contrato de eventos (impacto alto, esfuerzo medio, riesgo medio, evidencia directa sobre problemas e hipótesis sobre negocio). Después del despliegue: pruebas de usuarios, recepción real del canal y medición comercial. La valoración usa evidencia y relación impacto/esfuerzo/riesgo; no inventa puntuaciones cuantitativas.

Referencias técnicas: [Google: JavaScript y SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Web Vitals](https://web.dev/articles/vitals). Se conservan hashes para compatibilidad; no se consideran páginas SEO independientes. Conocimiento usa archivos HTML con rutas reales.

## 5. Validación y continuidad

Los resultados de compilación, comprobación de publicación, responsive y navegación se documentan en `cidiks-validation.md`. El esquema de eventos, aprendizaje y comparación de automatizaciones está en `cidiks-learning.md`. Esos documentos distinguen verificaciones realizadas de validaciones pendientes.
