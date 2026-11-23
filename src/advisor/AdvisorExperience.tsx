import { useReducer, useRef, useState } from 'react';
import { AdvisorWizard } from './AdvisorWizard.tsx';
import { QuickDiagnostic } from './QuickDiagnostic.tsx';
import { UnderstandingPanel } from './UnderstandingPanel.tsx';
import { advisorReducer, createAdvisorSession, projectHybridBrief, semanticSignature } from '../../shared/advisor-session.ts';
import type { AdvisorSession, DisplayBrief, FactField } from '../../shared/advisor-session-contract.ts';
import { buildTurnContext, type TurnRequest } from '../../shared/cidikis-ai-contract.ts';
import { AI_POLICY, safeText, utf8Size } from '../../shared/cidikis-ai-policy.ts';
import { bootstrapLocalSession, requestLocalTurn, requestLocalStatus, localWorkerEndpoint } from './ai-client.ts';
import type { AdvisorAnswers, BriefEdits } from './contract.ts';

export function AdvisorExperience() {
  const [session, dispatch] = useReducer(advisorReducer, undefined, createAdvisorSession);
  const [brief, setBrief] = useState<DisplayBrief | null>(null);
  const [openBriefVersion, setOpenBriefVersion] = useState(0);
  const [showBrief, setShowBrief] = useState(false);
  const [pendingEdits, setPendingEdits] = useState(false);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [remaining, setRemaining] = useState<number>(AI_POLICY.maxAttempts);
  const [replaceConfirm, setReplaceConfirm] = useState(false);
  const [retryRequest, setRetryRequest] = useState<TurnRequest | null>(null);
  const [statusChecks, setStatusChecks] = useState(0);
  const token = useRef<string | null>(null);
  const questionField = useRef<FactField | null>(null);
  const sessionRef = useRef<AdvisorSession>(session); sessionRef.current = session;
  const heading = useRef<HTMLHeadingElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const inFlight = useRef(false);
  const briefSession = useRef<AdvisorSession | null>(null);

  function switchMode(mode: 'guided' | 'chat') {
    if (pendingEdits) { setNotice('Guarda o descarta las ediciones del brief antes de cambiar de modo.'); return; }
    dispatch({ version: 1, type: 'mode', mode }); setShowBrief(false);
    setNotice('Conservamos tus respuestas, los datos confirmados y el único brief de esta sesión.');
    requestAnimationFrame(() => heading.current?.focus());
  }
  function makeBrief(answers: AdvisorAnswers, edits: BriefEdits, revision: number, purpose: 'generate' | 'edit') {
    if (purpose === 'edit' && briefSession.current) return projectHybridBrief(briefSession.current, edits, revision);
    const confirmed = advisorReducer(sessionRef.current, { version: 1, type: 'guided', answers, confirm: true });
    const document = projectHybridBrief(confirmed, edits, revision);
    briefSession.current = confirmed;
    dispatch({ version: 1, type: 'guided', answers, confirm: true });
    return document;
  }
  function generateChatBrief(replace = false) {
    if (brief && !replace) { setReplaceConfirm(true); return; }
    const document = projectHybridBrief(session, {}, (brief?.revision ?? 0) + 1);
    briefSession.current = session;
    setBrief(document); setShowBrief(true); setReplaceConfirm(false); setOpenBriefVersion(v => v + 1);
  }
  async function send(retry = false) {
    if (inFlight.current || remaining <= 0) return;
    const text = retry ? retryRequest?.message ?? '' : draft.trim();
    if (!text || !safeText(text, AI_POLICY.maxMessageChars) || utf8Size(text) > AI_POLICY.maxMessageBytes) { setError('Escribe entre 1 y 1000 caracteres, con un máximo de 2000 bytes.'); input.current?.focus(); return; }
    inFlight.current = true; setLoading(true); setError(''); setRemaining(v => Math.max(0, v - 1)); dispatch({ version: 1, type: 'attempt' });
    setStatusChecks(0);
    const snapshot = sessionRef.current;
    const messageId = retry ? retryRequest!.messageId : crypto.randomUUID();
    const request: TurnRequest = { version: '2.0', requestId: crypto.randomUUID(), sessionToken: '', messageId, contextRevision: snapshot.revision, message: text, purpose: retry ? 'manual_retry' : snapshot.mode === 'guided' ? 'guided_guidance' : 'conversation', context: buildTurnContext(snapshot, questionField.current) };
    if (!retry) { dispatch({ version: 1, type: 'message', message: { id: messageId, role: 'user', text, simulated: false } }); setDraft(''); }
    try {
      if (localWorkerEndpoint()) token.current ??= await bootstrapLocalSession();
      request.sessionToken = token.current ?? '';
      const result = await requestLocalTurn(request, remaining - 1);
      // A late response cannot overwrite data corrected since it was requested.
      if (sessionRef.current.revision !== request.contextRevision) throw new Error('Cambió el contexto. Conservamos tus correcciones; esta respuesta no se aplicó.');
      dispatch({ version: 1, type: 'message', message: { id: `reply-${result.requestId}`, role: 'assistant', text: result.text, simulated: true } });
      dispatch({ version: 1, type: 'proposals', proposals: result.proposals, messageId, baseRevision: request.contextRevision, recommendation: result.recommendation });
      questionField.current = result.questionField; setRemaining(v => Math.min(v, result.remaining)); setRetryRequest(null);
    } catch (caught) { setRetryRequest(request); setError(caught instanceof Error ? caught.message : 'No pudimos procesar tu mensaje. Conservamos tus datos.'); }
    finally { inFlight.current = false; setLoading(false); input.current?.focus(); }
  }
  async function checkStatus() {
    if (!retryRequest || loading || statusChecks >= 2) return;
    setStatusChecks(v => v + 1); setLoading(true);
    try {
      const status = await requestLocalStatus(retryRequest);
      const labels: Record<string, string> = { success: 'El turno terminó, pero su respuesta no se conserva en el servidor. Puedes continuar con las preguntas guiadas.', failed: 'El turno falló. Puedes reintentar manualmente; contará como otro intento.', pending: 'El turno sigue pendiente. Conservamos tus datos y la reserva de presupuesto.', uncertain: 'No podemos confirmar el resultado. Se conserva la reserva; continúa con las preguntas guiadas.', unknown: 'No pudimos comprobar el estado. Conservamos tus datos; el diagnóstico guiado está disponible.' };
      setError(labels[status]);
    } catch { setError('No pudimos comprobar el estado. Conservamos tus datos.'); }
    finally { setLoading(false); }
  }
  return <div className="hybrid-experience">
    <div className="hybrid-simulation"><strong>Asesor guiado · Sin IA generativa</strong><p>Este recorrido utiliza reglas guiadas en tu navegador. No se envía información a un proveedor de IA externo. Tus mensajes se borran al recargar.</p></div>
    {session.mode === null ? <QuickDiagnostic onDeepen={() => switchMode('guided')} onChat={() => switchMode('chat')} /> : <>
      <nav className="hybrid-mode-actions" aria-label="Modo de asesoría"><button type="button" className="button button-light" disabled={loading} aria-pressed={session.mode === 'guided' && !showBrief} onClick={() => switchMode('guided')}>Responder preguntas</button><button type="button" className="button button-light" disabled={loading} aria-pressed={session.mode === 'chat' && !showBrief} onClick={() => switchMode('chat')}>Conversar sobre mi idea</button>{brief ? <button type="button" className="advisor-text-button" disabled={loading || pendingEdits} onClick={() => { setShowBrief(true); setOpenBriefVersion(v => v + 1); }}>Ver mi brief guardado</button> : null}</nav>
      <h2 className="hybrid-mode-title" ref={heading} tabIndex={-1}>{showBrief ? 'Un único brief para revisar' : session.mode === 'chat' ? 'Cuéntanos tu idea' : 'Diagnóstico guiado'}</h2>
      <p role="status" className="advisor-status">{notice}</p>
    </>}
    {/* Keep form drafts and navigation in memory while changing entry mode. */}
    <div hidden={session.mode === null || session.mode === 'chat' && !showBrief}>
      <AdvisorWizard sharedAnswers={session.answers} onAnswersChange={answers => dispatch({ version: 1, type: 'guided', answers })} sharedBrief={brief} onBriefChange={setBrief} briefFactory={makeBrief} contextChanged={Boolean(brief && briefSession.current && semanticSignature(session) !== semanticSignature(briefSession.current))} openBriefVersion={openBriefVersion} onPendingEdits={setPendingEdits} onRestart={() => { dispatch({ version: 1, type: 'reset' }); briefSession.current = null; questionField.current = null; setDraft(''); setRetryRequest(null); setBrief(null); setShowBrief(false); setNotice('Se borraron las respuestas, los mensajes y el brief. El límite de conversación sigue vigente en esta pestaña.'); }} />
    </div>
    <section className="hybrid-chat" aria-labelledby="chat-title" hidden={session.mode !== 'chat' || showBrief}>
      <h3 id="chat-title">Primero, comprender tu situación</h3>
      <p>Por ejemplo: «Tengo una barbería y quiero conseguir más clientes, pero no sé qué necesito».</p>
      <div role="log" aria-label="Conversación guiada" aria-live="polite" aria-relevant="additions text" className="hybrid-transcript">{session.messages.map(m => <article className={`hybrid-message ${m.role}`} key={m.id}><p className="eyebrow">{m.role === 'user' ? 'TÚ' : 'CÍDIKS · GUÍA AUTOMÁTICA'}</p><p>{m.text}</p></article>)}</div>
      <form onSubmit={event => { event.preventDefault(); void send(); }} aria-busy={loading}>
        <label htmlFor="hybrid-message">Cuéntanos qué tienes en mente</label><p id="hybrid-message-help" className="advisor-help">Evita contraseñas, información de clientes y datos de contacto. {remaining} turnos disponibles en esta sesión.</p>
        <textarea id="hybrid-message" ref={input} value={draft} onChange={event => setDraft(event.target.value)} maxLength={1000} rows={4} aria-describedby="hybrid-message-help hybrid-chat-error" disabled={loading || remaining <= 0} />
        <p id="hybrid-chat-error" role="status" className="advisor-field-error">{error}</p><p role="status" className="advisor-status">{loading ? 'Preparando respuesta guiada…' : remaining <= 0 ? 'Se agotaron los turnos. Puedes continuar con el diagnóstico guiado y preparar tu brief.' : ''}</p>
        <div className="advisor-actions"><button type="submit" className="button" disabled={loading || remaining <= 0}>Enviar mensaje</button>{retryRequest ? <button type="button" className="button button-light" disabled={loading || remaining <= 0} onClick={() => void send(true)}>Reintentar manualmente</button> : null}{retryRequest?.sessionToken && localWorkerEndpoint() ? <button type="button" className="advisor-text-button" disabled={loading || statusChecks >= 2} onClick={() => void checkStatus()}>Comprobar estado del turno</button> : null}</div>
      </form>
      <UnderstandingPanel session={session} dispatch={dispatch} disabled={loading} />
      <div className="advisor-actions"><button type="button" className="button" disabled={loading || pendingEdits} onClick={() => generateChatBrief()}>Generar un brief con lo comprendido</button><button type="button" className="advisor-text-button" disabled={loading} onClick={() => switchMode('guided')}>Completar con preguntas guiadas</button></div>
      {replaceConfirm ? <div className="advisor-confirm" role="group" aria-label="Actualizar el único brief"><p>Ya hay un brief guardado. Reemplazarlo quitará sus ediciones manuales; puedes abrirlo y copiarlo primero.</p><button type="button" className="button" onClick={() => generateChatBrief(true)}>Reemplazar mi brief guardado</button><button type="button" className="advisor-text-button" onClick={() => setReplaceConfirm(false)}>Conservar mi brief guardado</button></div> : null}
    </section>
  </div>;
}
