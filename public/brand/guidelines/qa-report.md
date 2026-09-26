# QA de identidad B04-C1

Fecha: 2026-09-26. Revisión técnica y visual local; no prueba con público ni certificación de imprenta.

## Vector y raster

- Maestro: tres paths cerrados; viewBox512; sin raster, filtros, gradientes ni dependencias externas.
- Versiones institucionales, iconos y favicon: XML parseable, sin raster ni filtros. Wordmark de producción en curvas; copia editable de texto identificada como auxiliar.
- Siete tratamientos conservan los paths exactos del maestro; filtros limitados a materiales. Inspección visual de la lámina y la galería.
- Dimensiones de25 exportaciones PNG comprobadas automáticamente, incluidas redes, iconos y materiales.
- Transparencia de exterior comprobada en símbolo, textura, firma y glass premium. Versiones con fondo identificado en nombre/carpeta.
- Zona maskable: todos los píxeles de la marca dentro del círculo seguro de diámetro80%.

## Reconocimiento y reducción

Comparación color, negro, blanco y favicon. Observación visual: la silueta y tres piezas permanecen; el canal negativo sigue abierto. La C es implícita, por lo que su lectura y memorabilidad necesitan evaluación humana.

16/24/32/48/64/128/256/512px probados en la lámina; 180 y192 también en la galería a tamaño nativo. Las columnas256 y512 de recognition-sizes.png se presentan a128 para comparación y lo indican; la galería sí las muestra a tamaño CSS nativo.

Favicon16: tres componentes de4 vecinos, con12,15 y30 píxeles de cobertura al umbral sumaRGB>500. Es un control de separación, no una métrica de reconocimiento humano.

Firma horizontal comparada a100/140/180/240px; con descriptor a240/360/460/570px. Se recomienda omitir descriptor antes de460px. Corregida la galería para que el tamaño real coincida con la etiqueta; el test comprueba esa correspondencia.

Fondos revisados: papel, blanco, bosque, negro, fotografía con velo bosque, textura y oscuro. En fotografía se utiliza una captura existente del proyecto de cliente, solo como superficie de prueba; no se altera su marca ni se atribuye su autoría fotográfica a Cídiks.

## Papelería

PDFs de tarjetas y membrete: una página cada uno;75 trazados vectoriales; cero imágenes raster. Pruebas renderizadas inspeccionadas sin recorte de datos ni solapamiento.

Cortes nominales85 ×55mm y55 ×85mm; sangrado3mm. El motor PDF produjo aproximadamente85.02 ×55.04mm y55.04 ×85.02mm en TrimBox. Membrete209.89 ×297.01mm, nominalA4. Confirmar tolerancia con el proveedor. RGB, sin PDF/X ni ICC de imprenta; prueba física pendiente.

## Integración y navegador

Edge/Chromium headless, tamaños320/390/768/1440px: carga de tres imágenes de marca; título con Reily Castro una sola vez; OG y Twitter/X apuntando al mismo PNG; sin errores JavaScript observados; menú abre/cierra; sin desbordamiento horizontal final. Galería comprobada a1280 y390px, imágenes cargadas.

Se detectaron conflictos anteriores de CSS que mantenían menú/CTA visibles en tamaños pequeños. Se restablecieron sus reglas responsivas en navigation.css. El arte inclinado existente se contiene con overflow:clip únicamente en móvil para evitar que ensanche la página. No se cambian contenidos, recorridos ni lógica del diagnóstico.

Capturas y resultados de navegador: test-results/brand (ignorados por Git); galería permanente: index.html. Los checks están en scripts/brand/check_assets.py y check_browser.cjs.

## Integración del portafolio · 2026-09-26

`npm run check:release`, `npm run build`, `python scripts/brand/check_assets.py` y `git diff --check` pasaron. Chromium/Edge verificó navegación, metadata, carga de los assets, menú móvil y ausencia de desbordamiento horizontal en 320/390/768/1440 px; no observó errores JavaScript. La guía y sus muestras de color, fotografía y tratamientos cargaron correctamente en escritorio y móvil.

Los índices CSV/JSON con rutas locales y las pruebas raster se guardan en `deliverables/`, fuera de `public/`. No hay manifiesto PWA en la arquitectura Vite/React; por eso los iconos 192/512 quedan disponibles sin añadirse al HTML.

## Release

`npm run check:release`, `npm run build` y `git diff --check`: comprobados en la entrega. El proyecto no tiene script npm test. Se ejecutan los checks específicos descritos, sin inventar una suite existente.

No se realizó deploy, commit, push, compra de dominio, envío de correo ni registro de marca. El dominio configurado sigue siendo el subdominio de Hostinger ya presente; debe actualizarse al dominio final cuando se elija.

## Entrega real posterior a la aprobación de B04-C1

72 archivos expresamente requeridos localizados y no vacíos. 63 SVG abiertos/renderizados en Chromium, sin imágenes raster incrustadas; escalas16/24/32/48/64/128/180/192/512 comprobadas. Transparencia exterior del logo, símbolo, wordmark y cinco avatares verificada por canal alfa. Los PNG de avatar originales tienen fondo bosque; los nuevos transparentes están identificados en su nombre.

SHA-256 del maestro conservado: `eeeec2e58c7e26fd9f14beaaa4304beec23e1b16f0a580300a4e957c1597dabb`.

SHA-256 del reducido conservado: `59e46ffe29cf36d66ecb1786fb81421c3bdc7c78ec5746287223115b1fd25b1f`.

No se realizó ninguna nueva exploración ni modificación de la silueta. Inventarios CSV/JSON/Markdown incluyen rutas exactas, formato, dimensiones, bytes, función, clasificación y transparencia. El manifiesto externo al ZIP incluye los hashes de los propios inventarios, evitando autorreferencia.
