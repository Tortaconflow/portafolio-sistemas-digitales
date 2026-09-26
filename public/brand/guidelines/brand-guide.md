# Cídiks — Guía de identidad 1.0

2026-09-26 · Variante B04-C1 · Identidad aprobada por el usuario; entrega de archivos de producción, sin cambio de geometría.

## 1. Esencia

Comprender necesidades, conectar herramientas y construir soluciones digitales utilizables. Firma: Cídiks · Reily Castro. Descriptor funcional: Diseño web, automatización e IA aplicada. Descriptor editorial: Sistemas digitales con fundamento.

## 2. Concepto y límites culturales

Tres cuerpos asimétricos se relacionan alrededor de un canal abierto. El barrido superior, la pieza lateral y el retorno inferior sugieren una C sin dibujar un carácter tipográfico literal. La lectura como C es una intención de diseño, no una conclusión de una prueba con usuarios.

La geometría es contemporánea. No se presenta como olmeca, ayapaneca, ancestral ni derivada de un glifo. Las microincisiones son dibujo propio y no reproducen iconografía arqueológica. El vínculo cultural del creador se expresa narrativamente; no se atribuye autoridad histórica al símbolo.

## 3. Construcción y fuente de verdad

`../symbol/cidiks-symbol-master.svg` es el maestro editable de producción. Tres paths cerrados con curvas Bézier cúbicas, viewBox 0 0 512 512. No contiene raster, texto, filtros, enlaces externos ni gradientes.

La referencia enviada por el usuario orientó el dibujo manual de coordenadas; no se vectorizó automáticamente el raster. Se simplificaron puntas, se separaron las piezas y se retiraron brillos y texturas de la identidad maestra. No se adoptaron la relación 1.618 ni las equivalencias Pantone de la lámina: no están sustentadas por una construcción o prueba cromática.

`construction.svg` documenta la retícula. `logo-specifications.md` detalla composición y límites. `scripts/brand/geometry.json`, fuera de public, conserva la construcción inicial; el generador lee el maestro existente y no lo sobrescribe.

## 4. Logo principal

Principal: `../logo/cidiks-logo-primary.svg`, símbolo y wordmark horizontal con descriptor funcional. Horizontal sin descriptor para navegación y espacios menores. Vertical con descriptor editorial para composiciones centradas. El sitio usa símbolo y wordmark separados dentro de un mismo enlace accesible, con Reily Castro como texto.

## 5. Versiones

Color, negra, blanca, negativa en papel, bosque, horizontal, vertical, editorial y reducida. Las piezas mantienen su posición. White y negative no son intercambiables: white usa #FFFFFF y negative #F4F1E8. Los archivos sin fondo son transparentes; los ejemplos con fondo están en `../logo/backgrounds/`.

## 6. Área de protección

Unidad x = 48/512 de la altura nominal del lienzo del símbolo. Reservar al menos x fuera de cada lienzo/lockup; el aire interno del SVG no sustituye ese margen exterior. En la firma horizontal, alto nominal del símbolo = 230 unidades, por lo que x = 21.5625. En wordmark solo, usar la equivalencia de la firma: para un cuerpo tipográfico de 160 unidades, x = 21.5625. Escalar proporcionalmente. Diagrama: `clear-space.svg`.

No colocar otras marcas, texto ni bordes en esa área. Sobre fotografía, usar superficie o velo que preserve el contorno completo.

## 7. Tamaños recomendados para esta versión

Se compararon ejemplos en navegador y exportaciones raster, no una encuesta de reconocimiento. Estos mínimos son recomendaciones de esta geometría y medio, no cifras universales:

| Aplicación | Recomendación inicial | Evidencia / límite |
|---|---|---|
| Símbolo institucional | 32 px; 24 px solo si el contexto es limpio | Tres piezas visibles; menos detalle al reducir. |
| Favicon | 16 px, geometría micro específica | Separaciones abiertas; prueba de tres componentes. |
| Firma horizontal sin descriptor | 140 px de ancho | Comparada con 100, 180 y 240 px. |
| Firma reducida | 112 px de ancho | Usa símbolo micro y nombre sin descriptor. |
| Wordmark solo | 96 px de ancho | Usado en navegación; acento visible. |
| Logo con descriptor | 460 px de ancho | A 240/360 px el descriptor resulta pequeño. |
| Avatar | 64 px mínimo entregado | Símbolo dentro de recorte circular seguro. |
| Impresión, símbolo | 8 mm inicial | Prueba digital; confirmar sobre papel real. |
| Impresión, horizontal | 30 mm inicial, sin descriptor | Prueba digital; confirmar sobre papel real. |
| Impresión, logo con descriptor | 120 mm de ancho inicial | Para piezas menores, separar descriptor como texto editorial. |

Las tarjetas usan el wordmark y texto de contacto como elementos independientes para sostener la lectura. Antes de tiraje, solicitar prueba física del proveedor.

## 8. Paleta oficial

Bosque #244C3B; terracota #994A33; papel #F4F1E8; superficie #FFFFFF; tinta #202925; secundario #57625B; superficie suave #DCE5DA. Negro #000000 se admite exclusivamente para la reproducción monocroma solicitada. Tonos aparentes intermedios de acabados resultan de transparencias y mezclas, no de nuevos colores institucionales.

No se fijan Pantone ni CMYK sin perfil de impresión. Los originales se entregan RGB; una conversión depende de tinta, papel y perfil ICC de la imprenta. No afirmar equivalencia histórica o cultural de estos códigos.

## 9. Tipografía

Manrope Variable, ya presente en el proyecto, licencia SIL OFL 1.1. Wordmark peso 700; títulos 600–700; cuerpo 400–500. IBM Plex Mono 400, también existente, para datos y captions técnicos. Licencias en `licenses/`.

El wordmark conserva el glifo í. Se aplicó el shaping y kerning de la fuente con HarfBuzz y se exportaron contornos con fontTools. Sin estiramiento, modificación de glifos ni tracking adicional; se añadió margen al lienzo. Archivo principal en curvas y copia de texto editable `../wordmark/cidiks-wordmark-editable.svg`, que requiere Manrope. No se eligió Plus Jakarta Sans de la imagen porque el texto del encargo pide auditar y mantener coherencia con el sitio.

## 10. Textura e iconografía

Texturas primaria y secundaria en SVG y PNG transparentes; patrón SVG repetible. Incisiones curvas deterministas con luces y sombras leves; sin glifos ni símbolos arqueológicos. Mantener baja densidad sobre superficies de lectura.

Cinco iconos: presencia, atención, automatización, diagnóstico y educación. Retícula 24 × 24, trazo 1.7, extremos redondos. Comparten suavidad y relación de partes; no se obliga al símbolo principal a convertirse en cada pictograma. Usar desde 24 px con etiquetas; no emplearlos como marcas sustitutas.

## 11. Identidad maestra frente a tratamientos visuales

**IDENTIDAD MAESTRA:** paths, posiciones, vacíos, wordmark, paleta y composiciones institucionales.

**TRATAMIENTOS VISUALES:** piedra, microrelieve, vidrio, vidrio + piedra, metal suave, glass/blur premium y dark premium. Son renders 2D de los mismos paths, con clips, gradientes, textura, sombras y reflejos. No se entregan escenas 3D ni se simula que estos archivos las contengan. SVG editable de cada acabado y PNG derivado de 1024 × 1024.

Glass usa transparencia de material; premium añade reflejo controlado; dark incorpora fondo tinta. Los PNG restantes conservan transparencia exterior. Usar preferentemente desde 256 px; para navegación, favicon o impresión pequeña usar la versión plana. No añadir filtros arbitrarios al logo institucional.

## 12. Favicon y futuros productos

Maestro reducido separado, `../symbol/cidiks-symbol-reduced.svg`. Ajusta canales y puntas sin perder los tres cuerpos. Favicon claro sobre bosque, optimizado específicamente, sin wordmark ni render. PNG de 16/24/32/48/64/180/192/512; apple-touch-icon 180. Iconos maskable 192 y 512 preparados con la marca dentro de un círculo central seguro.

No se añade manifest ni service worker: el proyecto actual es un portafolio Vite/React sin PWA configurada. Los iconos quedan disponibles para una futura decisión; no confundir disponibilidad de iconos con capacidad de instalación.

## 13. Usos incorrectos

No deformar, rotar, recolorear, separar piezas, alterar proporciones, añadir efectos institucionales, superponer sin contraste ni redibujar desde un PNG. Ejemplos visuales en `index.html`. Corregir el maestro y regenerar cuando sea necesaria una revisión; nunca mantener variantes divergentes sin versión.

## 14. Aplicaciones y control de entrega

OG 1200 × 630, cuadrado 1080, historia 1080 × 1920; avatares 1080/512/256/128/64; firma de correo PNG y SVG. En correo usar PNG con texto alternativo y datos en texto HTML cuando se integre: SVG no es universalmente compatible.

Papelería en SVG milimétrico y PDF vectorial: tarjeta horizontal 85 × 55 mm y vertical 55 × 85 mm, ambas con 3 mm de sangrado; membrete A4. PDFs con TrimBox y BleedBox en tarjetas. Sin dominio inventado ni teléfono añadido; correo y nombre proceden de src/content.ts.

La integración web incorpora favicon, navegación, footer, imagen OG/X y metadata. No rediseña la experiencia ni modifica casos de clientes. B04-C1 está aprobada para el portafolio; esta aprobación no afirma registro ni exclusividad de marca y no sustituye una prueba física de impresión.

## Versiones transparentes de producción

Logo principal PNG y SVG, símbolo PNG y SVG y wordmark SVG/PNG conservan exterior transparente. Se añadieron avatares `cidiks-avatar-transparent-{1080,512,256,128,64}.svg/.png`; mantienen el mismo símbolo y la zona segura circular, sin fondo bosque. Los avatares originales conservan su fondo opaco y siguen disponibles para redes. La transparencia exacta de cada archivo figura en el inventario. No se cambió el maestro ni el reducido.
