# CÍDIKS IA v0.3 · Comportamiento del chat flotante

Estado: **incorporado en la rama de desarrollo `claude/cidiks-ia-evolucion-v03-bw2t8o`; no desplegado.** El Worker publicado sigue respondiendo con `chat-2026-11-23` hasta que el propietario autorice el despliegue, que es una decisión aparte.

Fase experimental cerrada el 24 de noviembre de 2026. El propietario aprobó la incorporación después de revisar a mano cuatro turnos y aceptó las limitaciones de abajo.

## Qué cambió

| | Antes (`chat-2026-11-23`) | v0.3 (`chat-2026-11-24`) |
|---|---|---|
| Archivo | `shared/chat-prompt.ts` | `shared/chat-prompt.ts` (copia del anterior en `scripts/chat-eval/prompt-anterior.ts`) |
| Ubicación | «el asistente de Reily Castro en Oaxaca» | Reily trabaja desde Oaxaca; quien escribe puede estar en cualquier lugar |
| Lo que cuenta la persona | «Usa lo que ya contó» | Declaración (su versión, sin darla por comprobada); verificable no es verificado (la asistente no comprueba nada y nunca dice «confirmado»); suposición (dicha como condición o preguntada) |
| Afirmaciones equivocadas | Sin regla | Si tiene fundamento, corrige con respeto y explica por qué; si solo es dudosa, dice de qué depende; no da la razón por quedar bien |
| Escucha | Siempre da un paso | Si falta un dato que cambia el consejo, pregunta una sola vez; en la respuesta siguiente da un paso, aunque sea como condición |
| Recursos | «de preferencia gratis» | Ajusta el paso a dinero, tiempo, señal, celular y manejo de la tecnología, y explica por qué sirve |
| Página web | Implícito en un ejemplo | Solo si sus clientes necesitan consultar mucho antes de escribir, la buscan fuera de redes o su canal ya no alcanza |
| Servicios y precio | No describía servicios; ante el precio: «depende» | Servicios reales de `src/content.ts`. Ante el precio: sin cifras, depende, diagnóstico gratuito de 15 minutos y botón de WhatsApp |
| Género y cultura | Solo género de la persona | Tampoco supone lengua, costumbres ni situación económica; evita «tú solo»; a Reily se refiere por su nombre |
| Ejemplos | Ropa de manta, precio, tamales | Escuchar primero (nuevo), pan con poca señal (sustituye a ropa de manta), precio con diagnóstico, tamales (igual) |

Sin cambios: modelo, `max_tokens`, temperatura, respaldo Llama, guía local, filtro de salida, enmascarado, historial, frontend y dependencias.

`CHAT_PROMPT_VERSION` cambió, así que al desplegar se renuevan las llaves de caché de Workers AI: las primeras respuestas después del despliegue no aprovecharán la caché.

## Resultados de la evaluación

Detalle en `scripts/chat-eval/resultados/`:
- `2026-11-24-23-02-gemma.md` y `.json`: 3 repeticiones, 102 llamadas, orden alternado entre versiones.
- `2026-11-24-23-02-analisis.md`: evaluación humana.
- `2026-11-24-22-58-gemma.*`: la primera iteración, antes de los ajustes finales.

| | Anterior | v0.3 |
|---|---|---|
| Errores | 0 | 0 |
| Tokens de entrada (promedio) | 1,430 | 1,538 (+7.6 %) |
| Tokens de salida | 64 | 63 |
| Neurons por respuesta | 10.4 | 11.9 (**+14 %**) |
| Latencia p50 / p95 | 1.82 s / 3.08 s | 1.88 s / 4.31 s |
| Calificación humana (máximo 50) | 31 | 42 |

Mejoras sostenidas en las 3 repeticiones:
- escucha antes de recomendar;
- deja de validar «con página voy a vender el doble»;
- describe los servicios reales;
- ofrece el diagnóstico gratuito ante el precio (6 de 6; antes, 0 de 6);
- deja de responder con la frase de fuera de tema cuando sí es un tema de negocio;
- reduce las suposiciones de género (1 de 51; antes, «tú solo» 3 de 3).

## Limitaciones conocidas (aceptadas, sin corregir en v0.3)

1. **Recomienda el catálogo cuando el problema es la disponibilidad o el seguimiento.** Ante «me preguntan si hay lugar» (estética) y «¿ya está mi carro?» (taller), v0.3 sugirió el catálogo de WhatsApp Business en 6 de 6 respuestas. El catálogo no resuelve esas preguntas. El prompt anterior acertó con una respuesta rápida con horarios libres o un aviso de avance. Afecta la pertinencia en negocios con citas o servicios en proceso.
2. **El filtro bloquea respuestas que cuestionan promesas comerciales.** En 1 de 3 respuestas a «con página voy a vender el doble», el filtro de promesas (`shared/chat-guard.ts`, sin cambios) bloqueó la respuesta del modelo, y la persona recibió el mensaje fijo «No puedo prometer resultados…». Lo más probable es una negación («no te aseguro») que `NEGATED_PROMISE` no reconoce. v0.3 aumenta ese riesgo porque invita a decir que algo no está asegurado.
3. **Pérdida de contexto por el límite del historial.** Ver la sección siguiente. En la conversación C5, ninguna versión recordó en el turno 5 un dato del turno 1.
4. **Aumento del 14 % en neurons.** De 10.4 a 11.9 por respuesta en promedio (por repetición: 10.3→10.4, 9.6→12.0, 11.3→13.4; la caché varía entre pasadas). Con el tope diario de 8,000 neurons (`AI_POLICY.dailyNeurons`), la capacidad pasa de unas 770 a unas 670 respuestas al día.
5. **Limitaciones metodológicas.**
   - Son 5 conversaciones sintéticas, no conversaciones reales de visitantes.
   - Hubo 3 repeticiones: suficiente para ver consistencia, no para estimar tasas con precisión.
   - Solo se evaluó Gemma. El respaldo Llama, que responde cuando Gemma tarda más de 6 s, recibe este prompt sin haber sido evaluado con él.
   - La calificación humana la hizo una sola persona evaluadora, que además redactó la propuesta, y la lectura no fue ciega. El propietario revisó cuatro turnos.
   - Las señales automáticas son por palabras clave: tuvieron falsos positivos y falsos negativos, que se corrigieron a mitad del experimento, y no sirven como calificación.
   - La latencia depende de la carga de Workers AI en el momento de la prueba.
   - Es probable que haya diferencias de comportamiento en producción que estas pruebas no captan.

## Problema del historial (documentado, sin cambios)

Cómo funciona hoy:

- El navegador (`src/components/FloatingAssistant.tsx:110` y `src/advisor/ai-client.ts:251`) quita el saludo inicial y envía los últimos 6 turnos.
- El Worker (`worker/src/index.ts:209-213`) vuelve a cortar a 6, valida el rol, recorta cada turno a 600 caracteres y enmascara teléfonos y correos.
- Todo viaja como JSON dentro de un solo mensaje `user` (`shared/chat-guard.ts:11`), para que nadie pueda hacerse pasar por el asistente.

Lo que falla:

1. **6 turnos son 3 mensajes de la persona.** Desde su 5.º mensaje se pierde el primero, que suele traer lo más importante (qué vende, dónde, con qué limitaciones). Eso contradice la regla de no volver a preguntar lo que ya contó. Una sesión admite hasta 20 respuestas (`chatMaxAttempts`).
2. **Las respuestas del asistente ocupan cerca de la mitad del historial.** Además, el navegador puede falsificarlas. Las respuestas de «Seguir con la guía» también entran y son largas.
3. **La caché se aprovecha menos.** Después de 6 turnos, el inicio del historial cambia en cada envío, así que Workers AI solo reutiliza las instrucciones fijas.
4. **Una indicación se repite.** La nota sobre el JSON aparece en el prompt y en el encabezado del mensaje.

Opciones para una versión futura (no implementadas):

- Priorizar los mensajes de la persona.
- Recortar las respuestas antiguas del asistente.

Cualquiera de las dos obliga a revisar el aviso de privacidad («tus últimos 6 mensajes»), la huella de idempotencia y la caché.

## Verificación hecha

- `npm run build`: correcto.
- `npm run check:hybrid`: 51 de 51 pruebas, incluida la nueva prueba del prompt v0.3 (versión, reglas aprobadas, frases de fuga y tope de 5,600 caracteres).
- `npm run check:release`, `npm run check:evolution` y `npm run check:advisor`: correctos.
- El texto incorporado tiene el mismo hash que la versión evaluada (sha `2f06e5746b2a`), y la copia anterior coincide con producción previa (sha `e2fb6d47fa2c`).
- El prompt solo lo usa el Worker: no está en `dist/` ni en las pruebas de navegador, así que no se ejecutaron estas últimas por este cambio.
- No fue posible ejecutar `tsc -p worker/tsconfig.json` porque falta `@cloudflare/workers-types`. Es una falta previa: no está en `package.json` y la CI no lo ejecuta.

### Cierre técnico (24 de noviembre de 2026)

- **Compatibilidad con `main`.** La rama parte de `6bc1f50`, que sigue siendo la punta de `main`: integración directa, sin conflictos.
- **Sitio.** Se compiló `main` y la rama, y los 217 archivos de `dist/` son idénticos byte a byte. El sitio de Hostinger no cambia; solo hay que desplegar el Worker.
- **Tipos del Worker.**
  - Con las dependencias existentes, se ejecutó `tsc` sobre `worker/` y `shared/` sin `@cloudflare/workers-types`.
  - Aparecen los mismos 18 errores en `main` y en la rama. Todos se deben a los tipos de Cloudflare que faltan (`DurableObject*`, `ScheduledController`, `cloudflare:workers`).
  - v0.3 no introduce ninguno, y `shared/chat-prompt.ts` no tiene errores.
- **Integración.** Se ejecutó el manejador real de `/v2/chat` en Node, simulando solo el modelo, el ledger y `cloudflare:workers`. Pasaron 5 de 5 pruebas:
  - envía el prompt v0.3 a Gemma con los mismos parámetros y la llave de caché `cidiks-chat-2026-11-24-N`;
  - el filtro bloquea URL, precio y promesa con su mensaje;
  - el historial se limita a 6 turnos, viaja como JSON en un solo mensaje y llega con teléfono y correo ocultos;
  - el atajo de la guía responde sin modelo ni presupuesto;
  - un origen ajeno recibe 403, una sesión inválida 401 y un cuerpo demasiado grande 400.
- **Seguridad con Gemma real.** Siete mensajes adversos, sin hallazgos críticos:
  - el intento de fuga directa y el historial falsificado no revelaron el prompt;
  - ante el precio exacto no dio cifras y sí el diagnóstico;
  - la tarea fuera de tema recibió la respuesta fija;
  - no prometió una garantía de ventas;
  - no confirmó una cita con fecha y remitió a WhatsApp;
  - la tarjeta se ocultó antes de enviarse.
- **Observaciones menores,** no corregidas por estar fuera de alcance:
  - la CURP no se oculta, porque el enmascarado solo cubre teléfonos y correos; el modelo no la repitió;
  - ante datos sensibles, la asistente no advierte que no deben compartirse;
  - dice que el diagnóstico sirve para «darte un presupuesto» y afirmó que «Reily no maneja una agenda abierta», que es una afirmación no verificada.
- **Interfaz.** Pasaron las 68 pruebas de navegador (móvil y escritorio), entre ellas:
  - el chat flotante, «Seguir con la guía» y la guía abierta al agotarse las respuestas;
  - el botón de WhatsApp y los límites del Worker;
  - el diagnóstico de 3 preguntas en `/asesor-ia/` y las plantillas de WhatsApp Business.
- **Reversión probada** en una copia temporal (ver abajo): restaura el prompt anterior (sha `e2fb6d47fa2c`), deja el código idéntico a `main` y pasan 50 de 50 pruebas.

## Reversión

Opción A, la más sencilla (probada). Devuelve el prompt y sus pruebas al estado de `6bc1f50`, el último commit con `chat-2026-11-23`. Funciona igual antes y después de integrar en `main`, y no depende de los commits de documentación:

```sh
git checkout 6bc1f50 -- shared/chat-prompt.ts tests/unit/chat-quality.test.ts
npm run check:hybrid && npm run build
git commit -m "revert(chat): volver al prompt chat-2026-11-23"
```

Este documento, los resultados y `scripts/chat-eval/` se conservan: el script sigue compilando y comparando. Un `git revert` de los commits de la incorporación también sirve, pero choca en este documento, que se editó después.

Opción B, a mano, conservando el resto:

1. En `shared/chat-prompt.ts`, reemplaza `CHAT_SYSTEM_PROMPT` y `CHAT_FEW_SHOTS` por `PREVIOUS_SYSTEM_PROMPT` y `PREVIOUS_FEW_SHOTS` de `scripts/chat-eval/prompt-anterior.ts`.
2. Vuelve a poner `CHAT_PROMPT_VERSION = 'chat-2026-11-23'`.
3. Quita la prueba «prompt v0.3» de `tests/unit/chat-quality.test.ts`.
4. Ejecuta `npm run check:hybrid` y `npm run build`.

Si v0.3 ya estuviera desplegado, después de revertir hay que volver a desplegar el Worker con la autorización del propietario. Ningún dato ni configuración depende de la versión del prompt: no hay migraciones.

Reversión inmediata en producción, sin tocar código: `npx wrangler rollback --name cidiks-ia-advisor` vuelve a la versión anterior del Worker (ver el procedimiento de despliegue).

## Procedimiento de despliegue (requiere la autorización final del propietario)

Integrar el PR en `main` no despliega el Worker. El build de GitHub Actions produce un `dist/` idéntico al actual, así que el sitio no cambia. El Worker se publica a mano con Wrangler, desde una computadora con sesión de Cloudflare.

1. **Integrar.** Con la aprobación, integrar el PR en `main`. Comprobar que el workflow «Verificar y empaquetar» termine en verde.
2. **Preparar.** Actualizar el repositorio local: `git checkout main && git pull && npm ci`.
3. **Revisar.**
   - `npx wrangler login` (si hace falta).
   - `npx wrangler deployments list --name cidiks-ia-advisor`: anota el ID de la versión vigente, que será la de la reversión.
4. **Ensayar.** `npx wrangler deploy --config worker/wrangler.prod.jsonc --dry-run`. Debe compilar sin errores y mostrar los bindings `AI` y `LEDGER`, sin migraciones nuevas (`v1-prod` ya existe).
5. **Desplegar.** `npx wrangler deploy --config worker/wrangler.prod.jsonc`. Los secretos (`SESSION_SECRET`, `TURNSTILE_SECRET`) ya están en el Worker y no se tocan.
6. **Verificar en producción** (unos 10 minutos):
   - En `https://reilycastro.com`, abrir el chat y escribir «cuanto cobras x una pagina». Debe responder sin cifras, con el diagnóstico gratuito de 15 minutos y el botón de WhatsApp.
   - Probar «Seguir con la guía» y el botón de WhatsApp.
   - `npx wrangler tail cidiks-ia-advisor`: las líneas `evt: chat` deben salir con `outcome: model_ok` y `neurons` cerca de 12. Las primeras respuestas tendrán `cached` en 0, porque la caché se renueva con la versión nueva.
   - En la hora siguiente, revisar la línea `ledger_health`: `openSlots` no debe quedarse en 2.
7. **Revertir si algo falla.** `npx wrangler rollback <ID anotado en el paso 3> --name cidiks-ia-advisor`. Después, revertir también el código (sección anterior) para que `main` coincida con lo publicado.

Durante la primera semana, conviene vigilar el consumo diario frente al tope de 8,000 neurons: unas 670 respuestas al día con v0.3.

## Repetir la comparación

Requisitos: Node.js 22.19 o posterior y `npm ci`.

1. Copia `scripts/chat-eval/.env.example` como `scripts/chat-eval/.env` con `CLOUDFLARE_ACCOUNT_ID` y `CLOUDFLARE_API_TOKEN` (plantilla «Workers AI»). Git ignora ese archivo.
2. Ejecuta `npm run eval:chat -- --repeticiones 3`. Así compara `prompt-anterior.ts` con el vigente.
3. Usa `--simular` para revisar el armado sin red ni token.

Detrás de un proxy, agrega `NODE_USE_ENV_PROXY=1` a la ejecución (Node 22.21 o posterior).

Costo aproximado: unos 11 neurons por llamada.
