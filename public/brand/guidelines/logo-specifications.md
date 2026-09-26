# Especificación del maestro B04-C1

- Versión 1.0.0, 2026-09-26.
- Fuente de verdad: `../symbol/cidiks-symbol-master.svg`.
- ViewBox: `0 0 512 512`; unidades sin dimensión física. Colocar sin cambiar aspect ratio.
- Tres paths cúbicos cerrados: `upper-sweep`, `right-body`, `lower-return`.
- Rellenos planos: bosque, terracota, bosque. Sin strokes que modifiquen el contorno institucional.
- Composición asimétrica: barrido superior extendido, masa lateral derecha y retorno inferior. No tiene simetría rotacional ni partes intercambiables.
- Los cuerpos no se intersectan. El espacio negativo queda abierto; no hay un círculo central añadido. La frontera entre piezas es ausencia de tinta, no un trazo de color papel.
- La C es implícita y su reconocimiento como letra debe confirmarse con personas; no sustituir esa evaluación por una afirmación automática.

## Transformaciones documentadas

Horizontal: símbolo en (16,16), alto nominal 230; wordmark baseline (275,184), cuerpo160, Manrope700. Lienzo 810 × 268 sin descriptor. Principal/editorial: lienzo950 ×268, descriptor en (278,230), cuerpo25 Manrope400. El aire sobrante del lienzo es intencional y no autoriza estirar.

Vertical: símbolo (110,20), alto420; wordmark centrado en baseline594, cuerpo132; descriptor centrado baseline653, cuerpo24; lienzo640 ×730.

Wordmark: lienzo510 ×205, baseline(16,167), cuerpo160. Acento í y kerning de fuente conservados. Sin ajustes ópticos destructivos.

Reducido: no es el maestro a menor escala. `cidiks-symbol-reduced.svg` tiene curvas simplificadas, piezas algo menores y vacíos mayores. Favicon: micro a476 unidades, origen18/18, sobre bosque512 ×512. Icono maskable: micro332, origen90/90; todo el símbolo dentro del círculo seguro de radio204.8 centrado en256/256.

## Protección

x=48/512 de la altura nominal del símbolo, fuera del canvas asignado. Horizontal: x21.5625. Vertical: x39.375. Símbolo512: x48. Wordmark solo: equivalencia cuerpo160 ↔ símbolo230, x21.5625. Escalar uniformemente. `clear-space.svg` muestra aplicaciones; no usar la retícula como parte del logo.

## Edición y regeneración

Modificar el maestro en un editor SVG preservando tres paths cerrados. Actualizar el reducido por separado si cambia la silueta. `build_vectors.py` lee el maestro existente; geometry.json solo inicializa un maestro ausente y conserva el registro de construcción original. Al editar el maestro, actualizar también ese registro para que una reconstrucción desde cero sea coherente. `check_assets.py` detecta divergencia entre registro y maestro.

Los PNG nunca se trazan de vuelta para obtener el SVG. No se aceptan imágenes incrustadas ni vínculos a archivos externos en las versiones de producción. La copia de wordmark editable con texto es una fuente de edición y requiere la fuente; no sustituye el archivo de curvas autónomo.

## Impresión

SVG: unidades mm. Tarjetas: medios91 ×61 y61 ×91; cortes85 ×55 y55 ×85; 3mm de sangrado por lado. Elementos importantes a al menos5mm del corte. Membrete210 ×297mm. PDF vectorial RGB, tipografía en curvas. Pequeñas diferencias submilimétricas en MediaBox provienen del motor de exportación y están documentadas en QA. No son PDF/X ni llevan OutputIntent CMYK: confirmar requisitos del proveedor antes de producción masiva.
