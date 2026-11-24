# CÍDIKS IA v0.3 · Comportamiento del chat flotante

Estado: **propuesta pendiente de aprobación**. Producción no cambió: el Worker sigue usando `shared/chat-prompt.ts` (versión `chat-2026-11-23`).

## Alcance

- Solo el chat flotante (`/v2/chat`) y solo Gemma (`@cf/google/gemma-4-26b-a4b-it`). El respaldo Llama queda para después.
- Se cambia únicamente el texto del prompt y sus ejemplos. Siguen igual: el modelo, `max_tokens`, la temperatura, la guía local (`shared/floating-chat-guidance.ts`), el filtro de salida, el enmascarado de datos y el historial.
- No se agregan dependencias, RAG, fine-tuning, memoria ni machine learning adicional.

## Problema del historial (documentado, sin cambios)

Cómo funciona hoy:

- El navegador (`src/components/FloatingAssistant.tsx:110` y `src/advisor/ai-client.ts:251`) quita el saludo inicial y envía los últimos 6 turnos.
- El Worker (`worker/src/index.ts:209-213`) vuelve a cortar a 6, valida el rol, recorta cada turno a 600 caracteres y enmascara teléfonos y correos.
- Todo viaja como JSON dentro de un solo mensaje `user` (`shared/chat-guard.ts:11`), para que nadie pueda hacerse pasar por el asistente. Ese diseño se conserva.

Lo que falla:

1. **6 turnos son 3 mensajes de la persona.** Los otros 3 son respuestas del asistente. Desde el 5.º mensaje se pierde el primero, que suele traer lo más importante (qué vende, dónde, con qué limitaciones). Eso contradice la regla de no volver a preguntar lo que ya contó. Una sesión admite hasta 20 respuestas (`chatMaxAttempts`).
2. **Las respuestas del asistente ocupan cerca de la mitad del historial.** Cada una tiene hasta 80 palabras, son la parte menos informativa y el navegador puede falsificarlas. Las respuestas de «Seguir con la guía» también entran y son largas.
3. **La caché se aprovecha menos.** Después de 6 turnos, el inicio del historial cambia en cada envío, así que Workers AI solo reutiliza las instrucciones fijas, no la conversación.
4. **Una indicación se repite.** La nota sobre el JSON aparece en el prompt y en el encabezado del mensaje (unos 60 tokens).

La conversación de prueba C5 lo muestra: en su turno 5, el dato «solo uso datos que recargo» del turno 1 ya no llega al modelo. El reporte lo marca.

Opciones para evaluar más adelante (no implementadas):

- Priorizar los mensajes de la persona sobre las respuestas del asistente.
- Recortar las respuestas antiguas del asistente y conservar completa solo la última, que lleva la pregunta en curso.

Cualquiera de las dos obliga a revisar el aviso de privacidad («tus últimos 6 mensajes»), la huella de idempotencia (que incluye el historial) y el reparto de la caché.

## Prompt propuesto

Archivo candidato: `scripts/chat-eval/prompt-propuesto.ts`. Solo lo lee el script de comparación.

| Cambio | Antes | Propuesta |
|---|---|---|
| Ubicación | «el asistente de Reily Castro en Oaxaca» | Reily trabaja desde Oaxaca; quien escribe puede estar en cualquier lugar |
| Lo que cuenta la persona | «Usa lo que ya contó» | Declaración (su versión, sin darla por comprobada), información verificable frente a verificada (la asistente no verifica nada: no dice «confirmado») y suposición (dicha como condición o preguntada) |
| Afirmaciones equivocadas | No había regla | Si tiene fundamento, corrige con respeto y explica por qué; si solo es dudoso, dice de qué depende; no da la razón por quedar bien |
| Escucha | Siempre da un paso | Si falta un dato que cambia el consejo, primero pregunta; si ya preguntó, da un paso como condición |
| Recursos | «de preferencia gratis» | Ajusta el paso a dinero, tiempo, señal, celular y manejo de la tecnología, y explica por qué sirve |
| Página web | Implícito en un ejemplo | Solo si sus clientes necesitan consultar mucho antes de escribir, la buscan fuera de redes o su canal ya no alcanza |
| Servicios | No se describían | Servicios reales de `src/content.ts` y diagnóstico gratuito de 15 minutos, con reglas de cuándo mencionarlos |
| Cultura | Solo género | Tampoco supone lengua, costumbres ni situación económica |
| Ejemplos | Ropa de manta, precio, tamales | Escuchar primero (nuevo), pan con poca señal (sustituye a ropa de manta), precio con diagnóstico, tamales (igual) |

Tamaño: las reglas pasan de 3,925 a 4,006 caracteres (+2 %) y el total con ejemplos sube un 6.3 % (de unos 1,216 a unos 1,292 tokens estimados): el ejemplo nuevo de escuchar primero y las reglas de verificado/verificable y de corregir con fundamento. Las instrucciones fijas se cobran a precio de caché. Los tokens reales salen de la comparación.

El prompt conserva las frases que el filtro de salida usa para detectar fugas («Eres CÍDIKS IA», «Formato obligatorio», «Ejemplos del estilo esperado»).

## Cómo ejecutar la comparación desde tu computadora

Requisitos: Node.js 22.19 o posterior y `npm ci` hecho en el repositorio. No se instala nada nuevo.

1. En el panel de Cloudflare, abre **Workers AI → Use REST API**. Ahí elige **Create a Workers AI API Token** y copia el **Account ID**. Si creas el token a mano, necesita `Workers AI - Read` y `Workers AI - Edit`.
2. Copia `scripts/chat-eval/.env.example` como `scripts/chat-eval/.env` y llena los dos valores. Git ignora ese archivo.
3. Opcional, sin red ni token: `npm run eval:chat -- --simular`. Revisa el armado, las reglas fijas y la ventana de historial.
4. Comparación real: `npm run eval:chat`. Son 34 llamadas: 17 turnos por 2 versiones.
5. Para ver la variación: `npm run eval:chat -- --repeticiones 3`.

Costo: con lo medido en producción (de 7.7 a 13 neurons por respuesta), una pasada cuesta unos 260–450 neurons. Las llamadas se cobran a la misma cuenta de Workers AI que usa producción. No pasan por el ledger del Worker ni afectan sus cupos.

Resultado: `scripts/chat-eval/resultados/<fecha>-gemma.md` (lectura) y `.json` (datos). El reporte trae:

- Un resumen de tokens de entrada, caché y salida; latencia p50 y p95; respuestas de más de 6 s (en producción habrían caído al respaldo); bloqueos del filtro; y señales automáticas.
- Las respuestas de cada versión, lado a lado.
- Una tabla de revisión humana de 0 a 2.

Las conversaciones son sintéticas y no tienen datos personales, así que puedes subir el reporte al repositorio o pegarlo en la conversación.

## Después de la aprobación (no hecho todavía)

1. Pasar el texto y los ejemplos de `prompt-propuesto.ts` a `shared/chat-prompt.ts` y cambiar `CHAT_PROMPT_VERSION`. Eso renueva las llaves de caché: las primeras respuestas costarán un poco más.
2. Ajustar las pruebas unitarias del prompt y ejecutar `npm run check:hybrid` y `npm run build`.
3. Conservar una copia del prompt anterior para que la comparación siga siendo reproducible.
4. Desplegar solo cuando lo indique el propietario. Este trabajo no despliega.
