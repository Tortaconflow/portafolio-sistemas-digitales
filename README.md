# Portafolio · Reily Jesus Castro Vicuña

Web en español de México, con React, TypeScript y Vite. Sitio estático sin backend, CMS ni credenciales en el navegador. Código en `Tortaconflow/portafolio-sistemas-digitales`, **público temporalmente por indicación del propietario**; web pública destinada a Hostinger con dominio propio. La preferencia inicial de privacidad queda pendiente de retomar cuando el propietario lo indique.

## Uso local

Requiere Node.js 22.19 o posterior compatible y npm.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

`dist/` contiene el build. `vite preview` sirve únicamente para revisar localmente, no es un servidor de producción.

## Editar el contenido

Todo el contenido está en `src/content.ts`: identidad, textos, precios, proyectos, estados, imágenes y enlaces. Cambia allí las variables y vuelve a compilar. Los metadatos se generan durante el build, para que los lean los buscadores y las vistas previas sin ejecutar JavaScript.

- `owner`: nombre público y nombre corto.
- `links`: correo, Messenger, WhatsApp opcional, dominio y redes. Usa URLs HTTPS completas. Los marcadores no generan enlaces rotos.
- `projects`: fichas de los casos, estado, componentes, URL pública opcional, captura y texto alternativo.
- `pricing`: los tres planes; la cotización a medida aparece por separado.
- `release.approved`: cambia a `true` después de validar contenido, estados y permisos.

El GitHub del pie de página queda vacío: no expongas el repositorio privado como caso técnico público. Puedes añadir posteriormente una URL a tu perfil o a proyectos seleccionados que decidas hacer públicos.

## Capturas auténticas

Todavía no se proporcionaron imágenes reales de los casos. Se muestran fichas tipográficas explícitamente marcadas como pendientes, sin simular interfaces ni resultados. El diagrama del hero explica el flujo comercial y tampoco se presenta como captura de un proyecto.

Guarda imágenes autorizadas, preferentemente WebP o AVIF, en `public/projects/`. Se recomienda 1200 × 750 px y menos de 200 KB cuando sea posible, preservando la legibilidad. Configura `image: '/projects/nombre.webp'` e `imageAlt` descriptivo. La galería usa carga diferida y dimensiones reservadas. Para añadir la composición de tres capturas al hero, utiliza esas mismas imágenes reales; no las sustituyas con material genérico.

## Contacto y privacidad

El formulario valida los campos, prepara un texto, permite revisarlo y copiarlo, y abre un `mailto:` con asunto y cuerpo codificados. El usuario debe completar el envío en su aplicación de correo. Messenger abre la URL configurada; se copia y pega el mensaje manualmente porque no todos los enlaces de Messenger aceptan texto precargado. No hay envíos automáticos ni base de datos. Los datos se mantienen en memoria hasta recargar o cerrar la página.

WhatsApp se activa al configurar una URL HTTPS real. No se inventó un número. No se instaló analítica sin un identificador del propietario; el servicio puede incluir su configuración una vez elegida la herramienta.

## Antes del lanzamiento

Consulta `PENDIENTES.md` y ejecuta:

```sh
npm run check:release
```

Este control debe fallar mientras falten el dominio, Messenger, capturas, estados confirmados o autorización editorial. El build de vista previa sí funciona. Mientras haya pendientes, incluye `noindex, nofollow` y una lista desplegable visible. Al completar todos los datos y aprobar la versión, el siguiente build habilita la indexación y genera canonical, Open Graph y sitemap con el dominio real. `noindex` no es privacidad: el sitio publicado sigue siendo accesible por URL.

## Publicación en Hostinger

El dominio se conecta en Hostinger y su DNS; la existencia de una rama de GitHub por sí sola no asigna un dominio. Hay dos rutas posibles según el plan y el tipo de sitio configurado:

### Integración que compila Vite desde GitHub

Si el panel ofrece importación de aplicaciones desde GitHub y compilación:

1. Conecta el repositorio privado y autoriza a Hostinger el acceso a ese repositorio.
2. Elige la rama `main`, directorio raíz `/`, Node.js 22 compatible, instalación `npm ci`, compilación `npm run build` y salida `dist` si esos campos están disponibles.
3. Comprueba que el tipo de despliegue sirva la salida estática. No uses `npm run dev` ni `vite preview` como servidor público.
4. Asigna el dominio real, configura el DNS indicado por Hostinger y comprueba HTTPS.

### Hosting web con Git o Administrador de archivos

La herramienta Git clásica puede clonar archivos sin compilar TypeScript. En ese caso necesita los **archivos compilados**, no `src/`.

- Si usas despliegue Git sin compilador, usa una rama `hostinger` que contenga únicamente el contenido de `dist/` en su raíz. El paquete de esta entrega incluye también un ZIP con esos archivos. No publiques `node_modules`, `.git`, el código fuente ni credenciales en `public_html`.
- Para subida manual: abre el Administrador de archivos del dominio, respalda cualquier sitio existente y extrae el contenido del ZIP de producción en `public_html`. `index.html` debe quedar directamente dentro de `public_html`, junto con `assets`, `.htaccess`, el favicon y los metadatos.
- Configura el dominio y HTTPS desde el panel. Comprueba navegación, correo y el sitio en un teléfono real.

No hay rutas de servidor ni navegación que requiera reglas SPA: las secciones usan anclas y los casos, diálogos accesibles. No cambies archivos de otro sitio existente sin revisar el destino.

Referencias: [despliegue estático de Vite](https://vite.dev/guide/static-deploy.html), [Administrador de archivos de Hostinger](https://www.hostinger.com/support/4548688-basic-actions-in-the-file-manager-in-hostinger/).

## Commits y respaldo

`main` conserva el código fuente y cada mejora debe tener un commit. `.github/workflows/build.yml` compila cada push a `main` y adjunta `hostinger-dist` como artefacto temporal; el historial de Git es el respaldo duradero del código.

```sh
git status
git add src public README.md
git commit -m "Describe la mejora concreta"
git push origin main
```

Comprueba el diff antes del commit. `git commit` conserva una versión local; `git push` la respalda en GitHub. No hay un servicio permanente guardando cambios sin ejecutar esos pasos.

Para el despliegue Git clásico, después de compilar puedes crear una carpeta temporal independiente, inicializar un repositorio en la rama `hostinger` y copiar **solo** el contenido de `dist`. Si la rama remota ya existe, clónala y actualiza sus archivos conservando el historial; no uses push forzado. Haz un commit de despliegue y súbelo. Conserva la versión anterior para volver atrás con un nuevo commit si hace falta.

## Portafolio técnico público

El propietario autorizó mantener este repositorio público temporalmente. Si posteriormente se vuelve privado, se pueden mostrar proyectos seleccionados mediante repositorios públicos separados con código propio autorizado, documentación y datos de demostración. Revisa también el historial antes de publicar. La web pública necesariamente entrega HTML, CSS y JavaScript compilados al navegador; un repositorio privado protege el acceso al código fuente y al historial en GitHub, no hace secreto el JavaScript servido al visitante.

## Verificación

`VERIFICACION.md` registra la revisión de 390 × 844, 768 × 1024 y 1440 × 900, el formulario, precios y diálogos. Las capturas de esta web son evidencias de su diseño; no son capturas de los proyectos descritos en el portafolio.
