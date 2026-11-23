# PLAN · CÍDIKS Comunidad

Documento de planeación. Solo cubre la evolución hacia CÍDIKS Comunidad. El estado vigente está en `ESTADO_CIDIKS.md`. No contiene secretos ni datos personales.

## 1. Visión

CÍDIKS evoluciona de portafolio de servicios a plataforma educativa y comercial para emprendedores:

- **Educativa:** formación gratuita y práctica, en español claro.
- **Biblioteca verificada:** cursos y recursos externos oficiales, con fecha de revisión.
- **Herramientas simples:** administración y marketing al alcance de un negocio pequeño.
- **Orientación con IA:** apoyo para decidir el siguiente paso.
- **Autonomía digital:** que la persona pueda hacerlo sola.
- **Servicios profesionales opcionales:** cuando el negocio crezca y los necesite.
- **Reciprocidad y comunidad:** quien aprende puede devolver a otros.

Principio editorial heredado del sitio: nada de métricas, garantías ni "casos reales" sin evidencia. Lo no verificado se dice como supuesto.

## 2. Restricciones permanentes

- Sitio estático (React 19 + Vite). Sin base de datos, cuentas de usuario ni dependencias nuevas en el MVP.
- Sin cambios al asesor IA, al Worker ni a sus presupuestos hasta una autorización propia (Fase 2).
- Repositorio público: ningún dato de usuarios ni credenciales.
- La CSP de `public/.htaccess` no admite estilos ni scripts en línea nuevos sin ajustar hashes.
- Sin push, merge ni despliegue sin aprobación explícita.

## 3. Fases

| Fase | Alcance | Estado |
| --- | --- | --- |
| 0 | Reconocimiento técnico | Completada |
| 1 | MVP: página estática `/comunidad/` | Pendiente de autorización |
| 2 | Orientación con IA en Comunidad (modo educativo, presupuesto propio, despliegue del Worker) | Futura, con aprobación propia |
| 3 | Herramientas simples de administración y marketing | Futura |
| 4 | Servicios profesionales como siguiente paso y mecanismos de reciprocidad | Futura |

## 4. MVP (Fase 1): `/comunidad/`

Página HTML generada en el build, igual que `/conocimiento/`: canonical, metadatos, JSON-LD, sitemap y analítica existentes. Funciona sin React en el navegador.

### Tres rutas prioritarias

Cada ruta ordena guías ya existentes en `src/education.ts` (no se reescriben) y, más adelante, recursos externos verificados.

| Ruta | Guías existentes asignadas (slug) |
| --- | --- |
| Empezar a vender | `whatsapp-y-seguimiento-de-clientes`, `caso-textil-por-que-los-likes-no-son-ventas`, `como-saber-si-una-herramienta-digital-esta-funcionando` |
| Organizar mi negocio | `cuando-vale-la-pena-automatizar-e-ia`, `aprender-de-cada-proyecto`, `seguridad-en-la-entrega-digital` |
| Mejorar mi presencia digital | `google-maps-perfil-de-negocio`, `necesito-realmente-una-pagina-web`, `diferencia-entre-presencia-digital-y-sistema-digital`, `elegir-colores-con-criterio` |

La asignación es provisional y cambia si el contenido de cada guía lo pide. Las diez guías quedan cubiertas, cada una en una sola ruta.

### Archivos previstos (no creados todavía)

- `src/comunidad.ts`: rutas y, después, recursos externos (título, organización, URL oficial, tema, nivel, costo, idioma, `verificadoEl`).
- `src/ComunidadPage.tsx`: página. Reutiliza `SiteHeader` y `SiteFooter` de `src/KnowledgePage.tsx`.
- `vite.config.ts`: una entrada nueva en el generador de páginas existente.
- `src/KnowledgePage.tsx`: enlace "Comunidad" en la navegación.
- `src/editorial-entry.ts`: evento de vista, con el esquema de `docs/cidiks-learning.md`.
- Pruebas: ajuste de expectativas de `check:*` (cantidad de URLs del sitemap) y un spec de Playwright con axe.

### Criterios de aceptación

1. `npm run build` y todos los `check:*` pasan.
2. `/comunidad/` sale en `dist/` con canonical, JSON-LD y entrada en el sitemap.
3. Las diez guías aparecen enlazadas, sin duplicados ni enlaces rotos.
4. Sin scripts ni estilos en línea nuevos (compatible con la CSP actual).
5. Pruebas de accesibilidad (axe) y de móvil (390 px) sin errores.
6. Ningún archivo de `worker/` ni `shared/` modificado.

## 5. Biblioteca de recursos externos

Implementada en `src/comunidad-recursos.ts` (`COMMUNITY_RESOURCES`, tipos estrictos). Reglas editoriales, validadas en pruebas y en cada build:

- Un recurso es `verified` solo si se leyó su página oficial y se registraron la fecha (AAAA-MM-DD) y el método reales. Si no, es `pending`: se muestra aparte, **sin enlace**, y no se recomienda.
- Cada recurso verificado declara: nombre, institución, enlace oficial directo (HTTPS, dominio de la institución, sin parámetros de rastreo), tema, ruta, nivel, idiomas (debe incluir español), condiciones de gratuidad (y lo que sí cuesta), si pide cuenta, qué se aprende y una actividad posterior.
- Un recurso por institución y cinco como máximo. Candidatos iniciales: Santander Open Academy, HubSpot Academy, Meta Blueprint, Microsoft Learn y Google Skillshop.
- Lo que la página oficial no indique se declara "no indicado"; no se asume.
- Los enlaces salen en pestaña nueva con `noopener noreferrer`; sin incrustados, JavaScript ni seguimiento.
- Re-verificar cada recurso al menos cada 90 días y retirarlo si deja de cumplirse. La fecha visible permite a cada persona juzgar su vigencia.

## 6. Riesgos y dependencias

- **Publicación en Hostinger:** mecanismo automático no confirmado (ver `ESTADO_CIDIKS.md`). Hasta aclararlo, nada se publica.
- **CSP:** cualquier recurso externo embebido (imágenes, scripts, iframes) exige actualizar `public/.htaccess`.
- **Pruebas del CI:** pueden fallar por conteos fijos de URLs al agregar la página.
- **Presupuesto de IA (Fase 2):** es compartido con el asesor comercial (8000 neurons/día); abrirlo a un público educativo puede agotarlo.
- **Verificación de recursos externos:** requiere un criterio explícito y mantenimiento continuo.
- **Producción:** no se pudo consultar desde el entorno de desarrollo; lo observado sobre el sitio publicado es provisional.
