# Medición, aprendizaje y automatización

## Lo que existe hoy

Sitio estático, diagnóstico local por reglas, formulario que prepara un mensaje, eventos agregados y buffer de 100 eventos en memoria. No hay CRM conectado, backend de recepción, cookies de analítica ni nuevo proveedor instalado. El brief del fundador describe Prospector y otros módulos internos; este repositorio no permite verificar su estado operativo.

`src/learning-contract.ts` define un contrato futuro de aprendizaje. No contiene registros de clientes ni conecta servicios. Mantener datos comerciales, costos y contacto en almacenamiento privado; no incorporarlos al repositorio público, HTML, URLs o buffer de analítica.

## Eventos y significado

| Evento | Momento | Datos mínimos | Interpretación |
| --- | --- | --- | --- |
| hero_cta_click | Click en CTA o proyectos del hero | target | Intención |
| methodology_view | Método entra en viewport (15%) | location: home/method | Exposición, no lectura completa |
| demo_view | Sección de demo visible | demo_id, kind: illustration | Exposición |
| demo_select | Cambio de escenario | demo_id | Interacción |
| case_view | Registro del caso visible | case_id | Exposición a evidencia |
| contact_start | Primer foco del formulario o canal directo | origin, channel opcional | Inicio |
| form_prepare | Mensaje validado y preparado | channel_selected, has_interest | Preparación local |
| contact_submit | Abrir canal con mensaje preparado | channel, stage: channel_opened | Handoff; no confirma envío/recepción |
| contact_submit futuro | Confirmación real de backend | channel, stage: received | No implementado en esta entrega |
| education_view | Artículo HTML abierto | article_id, category | Consulta editorial |

Se reutiliza `track`; mantiene eventos anteriores necesarios para diagnóstico y enlaces. `form_submit` y `contact_submitted` no se disparan al preparar un mensaje. No sumar eventos antiguos y nuevos como si fueran personas distintas. La exposición se registra una vez por montaje; volver al destino puede generar otra exposición. No hay deduplicación de visitantes ni atribución entre dispositivos.

Si hay `gtag` o `dataLayer` del propietario, se usa ese transporte. En su ausencia se conserva sólo el buffer temporal, que se pierde al recargar. **Preparado para medir no significa que ya exista un histórico de medición.** Si se incorpora un proveedor, definir antes consentimiento, retención y acceso según los datos que se recojan.

## Métrica principal y guardas

Clientes cerrados por mes = proyectos aceptados en el periodo, con criterio de cierre y fecha registrados en el CRM. Un clic nunca se cuenta como cliente. Registrar importe acordado, costos directos y horas para calcular margen de contribución (ingreso menos costos directos; declarar si incluye trabajo del fundador), horas humanas/proyecto, días de entrega y horas de retrabajo. Satisfacción: pregunta y escala fija después de entrega, con tasa de respuesta.

Conversión por etapa = avances / oportunidades elegibles de una cohorte y periodo explícitos. Registrar denominador, tamaño de muestra y cambios de canal. Separar apertura de canal, mensaje recibido, diagnóstico, propuesta, demo, seguimiento y cierre. La señal buscada es más cierres sin aumento proporcional de horas humanas; todavía no está validada.

## Comparación de automatizaciones: evidencia insuficiente para elegir

| Criterio | A: identidad / Brand Intelligence | B: diagnóstico → propuesta → demo | Evidencia necesaria |
| --- | --- | --- | --- |
| Frecuencia | Desconocida; depende de solicitudes de identidad | Desconocida; depende de prospectos calificados | Conteo semanal de tareas en ambos flujos |
| Tiempo ahorrado | Hipótesis: investigación y entregables iniciales reutilizables | Hipótesis: menos preparación repetida de propuestas | Cronometrar ejecución y revisión humana |
| Conversión | Hipótesis: mejor consistencia de propuesta visual | Hipótesis: más cercano al cierre por estar en el proceso comercial | Avances y cierres por cohorte; sin asumir causalidad |
| Producción | Hipótesis: alto reuso en web, flyers y contenido | Hipótesis: reuso en diagnóstico, alcance y demo | Horas por entrega y porcentaje reutilizable |
| Riesgo | Errores culturales, estrategia sin evidencia, activos inconsistentes | Propuestas incorrectas, datos de prospectos, compromisos de alcance | Clasificación de errores y costo de corrección |
| Facilidad técnica | No evaluada; depende de entradas, fuentes y generadores existentes | No evaluada; brief reporta piezas de Prospector, integración sin verificar | Inventario de módulos, interfaces y ejecución reproducible |
| Reutilización | Potencial transversal; requiere criterios visuales claros | Potencial entre sectores; requiere etapas comparables | Repeticiones reales con salidas comparables |
| Calidad de datos | Fuentes y derechos de activos por validar | Auditorías, objeciones y cierres por estructurar | Completitud, procedencia y permisos de registros |

Decisión actual: **no elegir un motor por intuición**. Realizar un piloto manual de ambos sobre tareas autorizadas durante dos semanas. Registrar frecuencia, minutos de preparación/revisión/corrección, utilidad de la salida, avance comercial y errores. Si no hay suficientes tareas, ampliar la observación; no forzar una puntuación. Comparar ahorro neto = tiempo manual base − tiempo con asistencia − revisión − corrección, junto con costo y riesgo. Seleccionar primero una parte repetible de bajo riesgo, con aprobación humana de estrategia, cotización, envío y publicación.

## Backlog priorizado

| Prioridad | Trabajo | Condición / aceptación |
| --- | --- | --- |
| P0 · esta entrega | Rutas, copy, método, contacto, afirmaciones, demo, casos, HTML editorial | Build, enlaces y pruebas documentadas |
| P1 | Validar home con 5 visitantes nuevos (Facebook, negocio local, móvil) | Explican qué resuelve CÍDIKS y encuentran diagnóstico en 10 segundos; registrar errores, no declarar éxito por muestra pequeña |
| P1 | Verificar recepción de WhatsApp/correo con el propietario | Un envío real completado por el usuario, recibido y registrado; falta esa evidencia |
| P1 | Recoger línea base y datos manuales del CRM | 2 semanas de consultas y etapas; ningún dato personal en repo público |
| P1 | Comprobar Search Console y páginas editoriales | Sitemap accesible; URL inspeccionada e indexación observada, no prometida |
| P1 | Adjuntar referencia lingüística primaria | Autor, edición, página y forma investigada; revisión antes de ampliar etimología |
| P2 | Pilotos A/B de automatización de procesos | Datos de frecuencia, ahorro neto, riesgo y utilidad; revisión humana |
| P2 | URLs HTML independientes para casos | Mantener hashes antiguos, HTML de casos y canonical propio; no depende de esta home |
| P2 | Consolidar CSS anterior | Inventario de selectores y regresión visual antes de retirar premium/styles |
| P2 | Medición de campo y teléfonos físicos | Condiciones, muestras y p75 por dispositivo; no sustituir por una captura del emulador |
| P3 | Adaptador privado para aprendizaje y cotizaciones | Accesos mínimos, retención y respaldo definidos; contrato revisado |

## Hipótesis que deben probar personas reales

1. El hero permite entender oferta, proceso y acción en 10 segundos. Prueba de recuerdo sin explicaciones previas.
2. Tres datos obligatorios facilitan iniciar contacto. Revisar abandono y calidad de consultas; no comparar clic con cierre.
3. La demo explica el valor del diagnóstico. Pedir a visitantes que describan qué cambiarían y por qué.
4. Evidencia y límites de los casos aumentan confianza. Registrar objeciones durante conversaciones.
5. Guías y explicación de entrega aumentan autonomía. Pedir al cliente realizar una tarea sin ayuda tras la capacitación.
6. El aprendizaje disminuye retrabajo por proyecto. Comparar horas y tipo de error entre trabajos comparables antes de afirmar escalabilidad.
