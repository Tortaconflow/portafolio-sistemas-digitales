import type { FactField, Proposal } from './advisor-session-contract.ts';
import type { ProviderResult, TurnRequest } from './cidikis-ai-contract.ts';

const questions: Record<FactField, string> = {
  activity: '¿Qué ofreces y a quién te gustaría ayudar?',
  objective: '¿Qué cambio te gustaría conseguir en tu negocio?',
  channels: '¿Cómo te encuentran y te contactan hoy las personas interesadas?',
  problem: '¿En qué momento se pierde una consulta o qué dificultad concreta ocurre hoy?',
  audience: '¿Qué personas atiendes principalmente?',
  constraints: '¿Hay límites de tiempo, capacidad o inversión que debamos tener en cuenta?',
  resources: '¿Con qué recursos o materiales cuentas para empezar?',
  priority: '¿Qué te gustaría resolver primero?',
  preferences: '¿Qué estilo o referencias te interesan y qué prefieres evitar?',
};
const order: FactField[] = ['activity', 'objective', 'channels', 'problem', 'audience', 'constraints', 'resources', 'priority', 'preferences'];

/** Development fixture, not language-model inference. Never requests a network resource. */
export function simulateTurn(request: TurnRequest): ProviderResult {
  const text = request.message.trim();
  if (/ignora.*instrucciones|system prompt|api.?key|contraseña|<script/i.test(text)) return { text: 'Evita credenciales y datos privados. Para comprender tu situación, cuéntame qué dificultad ocurre en tu negocio.', proposals: [], questionField: 'problem' };
  const proposals: Proposal[] = [];
  const initial = !request.context.questionField;
  if (initial && !request.context.profile.activity) {
    const activity = text.split(/[,.;]| y quiero| pero /i)[0].slice(0, 250);
    proposals.push({ field: 'activity', value: activity, quote: activity, kind: 'literal' });
    const objective = text.match(/(?:conseguir más clientes|recibir más reservas|organizar (?:las )?citas|mejorar (?:las )?consultas|vender más)/i)?.[0];
    if (objective) proposals.push({ field: 'objective', value: objective, quote: objective, kind: 'literal' });
  } else if (request.context.questionField && !/^(sí|si|ok|vale|no sé)[.! ]*$/i.test(text)) {
    proposals.push({ field: request.context.questionField, value: text, quote: text, kind: 'literal' });
  }
  // Explicit corrections are proposals too; never overwrite a confirmed fact.
  const correction = text.match(/(?:corrijo|corrección):\s*(actividad|problema|público|recursos|restricciones)\s*=\s*(.+)/i);
  if (correction) {
    const fields: Record<string, FactField> = { actividad: 'activity', problema: 'problem', público: 'audience', recursos: 'resources', restricciones: 'constraints' };
    proposals.length = 0;
    proposals.push({ field: fields[correction[1].toLowerCase()], value: correction[2], quote: correction[2], kind: 'literal' });
  }
  const available = new Set([...Object.keys(request.context.profile), ...proposals.map(p => p.field)]);
  const questionField = order.find(f => !available.has(f)) ?? null;
  const enough = ['activity', 'objective', 'channels', 'problem', 'constraints'].every(f => Boolean(request.context.profile[f as FactField]));
  return {
    text: `${proposals.length ? 'Revisa abajo lo que he recogido antes de confirmarlo.' : 'No voy a dar por confirmado lo que aún no está claro.'} ${questionField ? questions[questionField] : 'Ya puedes revisar lo comprendido y preparar un brief. Puedes corregir cualquier dato.'}`,
    proposals, questionField,
    ...(enough ? { recommendation: 'Revisar dónde se interrumpen las consultas y acordar una prioridad viable con los recursos disponibles, antes de decidir funcionalidades.' } : {}),
  };
}
