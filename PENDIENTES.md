# Estado editorial y operativo

Revisión del código local tras la reorganización del portafolio. Este archivo distingue lo que el repositorio demuestra de lo que requiere comprobación externa.

| Área | Estado verificable en el repositorio | Pendiente externo |
| --- | --- | --- |
| Identidad y contacto | Nombre, correo, Messenger y WhatsApp configurados en `src/content.ts`; `check:release` pasa. | Probar recepción real de cada canal con el propietario. |
| Dominio | `https://reilycastro.com` es canonical; HTTPS responde y la versión compilada se verificó en producción. El build permite indexación y publica `robots.txt` y sitemap. | Verificar indexación en buscadores; confirmar si el subdominio temporal sigue activo y configurar 301 sólo si responde. |
| Proyectos | Cinco fichas; Paraíso Laguna tiene caso documentado y ALTITUD se presenta explícitamente como proyecto conceptual. Los siete originales ALTITUD se sirven desde `public/projects/altitud/`. | Confirmar vigencia de estados y derechos/consentimientos de los recursos de Paraíso Laguna con sus responsables. |
| Paraíso Laguna | Código y capturas de referencia, activos editoriales y límites de evidencia descritos en el caso. | Cotejar capturas públicas con copia local; confirmar permisos de piezas pendientes, publicaciones, operación y resultados. |
| Despliegue | El commit `2f0a07e` pasó el workflow de build; el dominio principal sirvió los mismos hashes CSS/JS y se verificaron `/#altitud` y sus imágenes. | Confirmar en Hostinger si el subdominio temporal continúa activo y verificar su redirección canónica si responde. |
| Perfil social | Facebook y GitHub configurados. | Añadir Instagram o LinkedIn solo con URLs de perfil verificadas; el enlace genérico a LinkedIn se retiró. |
| Oferta comercial | Precios y condiciones están definidos en `src/content.ts`. | Validar vigencia de precios, alcance y condiciones con el propietario antes de una campaña. |

No se usan métricas comerciales ni resultados de conversión sin respaldo. Las tareas externas no deben convertirse en afirmaciones públicas por el solo hecho de figurar aquí.
