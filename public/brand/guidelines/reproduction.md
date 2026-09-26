# Reproducir y editar la identidad

Todo se ejecuta desde la raíz del repositorio autorizado. No requiere servicios generativos ni subir archivos. Conservar el SVG maestro como fuente de verdad.

## Herramientas

- Python3.13; dependencias fijadas en scripts/brand/requirements.txt.
- Node22; sharp y Playwright para exportación/QA. Pueden resolverse desde node_modules local o la ruta de paquetes del runtime mediante CIDIKS_NODE_MODULES.
- PyMuPDF (fitz) para cajas de impresión y comprobación del PDF.
- Chromium o Edge; ruta opcional CIDIKS_BROWSER.
- Las fuentes institucionales ya son dependencias del proyecto. Licencias copiadas; no se modifica la fuente.

```powershell
python -m pip install --target node_modules/.cidiks-python -r scripts/brand/requirements.txt
python scripts/brand/build_vectors.py
node scripts/brand/render_assets.cjs
node scripts/brand/export_transparent.cjs
node scripts/brand/print_assets.cjs
python scripts/brand/print_qa.py
python scripts/brand/build_guide.py
python scripts/brand/check_assets.py
node scripts/brand/check_browser.cjs
node scripts/brand/verify_delivery.cjs
python scripts/brand/inventory.py
python scripts/brand/package_delivery.py
npm run check:release
npm run build
git diff --check
```

El chequeo de navegador espera Vite en http://127.0.0.1:8768; puede configurarse CIDIKS_PREVIEW_URL. Capturas técnicas en test-results/brand, ignoradas. Abrir /brand/guidelines/index.html para revisión de todos los assets.

Los generadores no sobrescriben un maestro ya existente; sí regeneran sus derivados. Actualizar geometry.json si se cambia el maestro para mantener consistente el registro de construcción.

La identidad B04-C1 está aprobada: no cambiar maestro ni reducido sin nueva autorización. verify_delivery.cjs verifica sus hashes congelados y renderiza todos los SVG en navegador. También guarda la inspección de transparencia que utiliza el inventario. package_delivery.py verifica archivos contra el inventario antes de crear el ZIP y registra cada entrada, incluida la documentación y los inventarios, con SHA-256.

Los SVG institucionales no necesitan las herramientas para verse o editarse. Los PNG y PDF están entregados, de modo que el uso cotidiano tampoco depende del generador. No se añade software de generación al bundle web.

## Formatos y decisiones

- SVG de curvas: producción autónoma y edición vectorial.
- SVG de texto: wordmark editable con Manrope instalada; archivo auxiliar explícito.
- PNG: redes, correo, favicon y tratamientos.
- PDF vectorial RGB: impresión de tarjetas y membrete. No se inventan equivalencias CMYK/Pantone ni certificación PDF/X.
- No AI/CDR propietarios: SVG es el maestro interoperable.
- No ICO adicional: favicon SVG + PNG16/32 cubren la integración actual solicitada; se entregan48 y otros tamaños para aplicaciones futuras.
- No manifest/service worker: no hay PWA en la arquitectura actual. Iconos192/512 y maskable preparados, sin introducir funciones de instalación.
- No escena3D: materiales son ilustraciones2D derivadas de paths con luz y relieve visuales. El archivo maestro nunca depende de ellas.

La firma PNG de 720 × 200 debe mostrarse a 480 px de ancho (o tamaño natural), conservando proporciones. Por debajo, usar una firma HTML de texto y símbolo pequeño para no perder lectura del descriptor. Al integrarla en correo, conservar contacto también como texto HTML accesible. No se modificó ninguna cuenta de correo.
