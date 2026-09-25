# Estado editorial y operativo

Revisión del código local tras la reorganización del portafolio. Este archivo distingue lo que el repositorio demuestra de lo que requiere comprobación externa.

| Área | Estado verificable en el repositorio | Pendiente externo |
| --- | --- | --- |
| Identidad y contacto | Nombre, correo, Messenger y WhatsApp configurados en `src/content.ts`; `check:release` pasa. | Probar recepción real de cada canal con el propietario. |
| Dominio | URL HTTPS temporal de Hostinger configurada como canonical. | Confirmar dominio definitivo y actualizarlo solo cuando esté activo. |
| Proyectos | Cuatro fichas con enlaces y recursos versionados; Paraíso Laguna tiene caso documentado. | Confirmar vigencia de estados y permisos de los otros casos con sus responsables. |
| Paraíso Laguna | Código y capturas de referencia, activos editoriales y límites de evidencia descritos en el caso. | Cotejar capturas públicas con copia local; confirmar permisos de piezas pendientes, publicaciones, operación y resultados. |
| Despliegue | GitHub Actions compila `main` y guarda `hostinger-dist`. | Confirmar en Hostinger qué repositorio, rama y método alimentan producción. El workflow no publica el sitio. |
| Perfil social | Facebook y GitHub configurados. | Añadir Instagram o LinkedIn solo con URLs de perfil verificadas; el enlace genérico a LinkedIn se retiró. |
| Oferta comercial | Precios y condiciones están definidos en `src/content.ts`. | Validar vigencia de precios, alcance y condiciones con el propietario antes de una campaña. |

No se usan métricas comerciales ni resultados de conversión sin respaldo. Las tareas externas no deben convertirse en afirmaciones públicas por el solo hecho de figurar aquí.
