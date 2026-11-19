import { useRef, useState } from 'react';
import type { AdvisorSession, AdvisorEvent, FactField } from '../../shared/advisor-session-contract.ts';
import { FACT_FIELDS, FACT_LABELS } from '../../shared/advisor-session-contract.ts';
import { currentClaim } from '../../shared/advisor-session.ts';

export function UnderstandingPanel({ session, dispatch, disabled }: { session: AdvisorSession; dispatch: (event: AdvisorEvent) => void; disabled: boolean }) {
  const [editing, setEditing] = useState<FactField | null>(null);
  const [draft, setDraft] = useState('');
  const editButtons = useRef<Partial<Record<FactField, HTMLButtonElement | null>>>({});
  function finishEditing(field: FactField) { setEditing(null); requestAnimationFrame(() => editButtons.current[field]?.focus()); }
  return <section className="hybrid-understanding" aria-labelledby="understanding-title">
    <h3 id="understanding-title">Lo que hemos comprendido</h3>
    <p className="advisor-help">Confirma únicamente lo que te representa. Las interpretaciones son propuestas generadas por reglas guiadas.</p>
    <ul className="hybrid-facts">{FACT_FIELDS.map(field => {
      const current = currentClaim(session, field);
      const proposals = session.claims.filter(c => c.field === field && c.origin === 'simulated' && ['inferred', 'declared'].includes(c.status));
      return <li key={field}>
        <strong>{FACT_LABELS[field]}</strong>
        <p>{current?.value || 'Pendiente de conocer'}</p>
        {current ? <p className="advisor-help">{current.status === 'confirmed' ? 'Confirmado por ti' : 'Declarado por ti, aún sin confirmar'} · {current.origin === 'guided' ? 'Diagnóstico guiado' : current.origin === 'visitor' ? 'Corrección manual' : 'Extraído por reglas guiadas'}</p> : null}
        {current?.status === 'declared' ? <button type="button" className="advisor-text-button" disabled={disabled} onClick={() => dispatch({ version: 1, type: 'confirm', id: current.id })}>Confirmar {FACT_LABELS[field].toLowerCase()}</button> : null}
        {proposals.map(c => <div className="hybrid-proposal" key={c.id}>
          <p><strong>Interpretación por confirmar:</strong> {c.value}</p>
          {c.evidence ? <p className="advisor-help">Texto extraído literalmente de tu mensaje.</p> : <p className="advisor-help">Propuesta basada en reglas guiadas.</p>}
          {session.contradictions.some(x => !x.resolved && x.proposedId === c.id) ? <p role="status">Hay una contradicción. El dato confirmado se conserva hasta que elijas.</p> : null}
          <button type="button" className="button button-light" disabled={disabled} onClick={() => dispatch({ version: 1, type: 'confirm', id: c.id })}>Confirmar interpretación de {FACT_LABELS[field].toLowerCase()}</button>
          <button type="button" className="advisor-text-button" disabled={disabled} onClick={() => dispatch({ version: 1, type: 'reject', id: c.id })}>Descartar interpretación de {FACT_LABELS[field].toLowerCase()}</button>
        </div>)}
        {editing === field ? <form onSubmit={event => { event.preventDefault(); dispatch({ version: 1, type: 'correct', field, value: draft }); finishEditing(field); }}>
          <label htmlFor={`review-${field}`}>Corregir {FACT_LABELS[field].toLowerCase()}</label>
          <textarea id={`review-${field}`} value={draft} maxLength={field === 'activity' ? 250 : field === 'audience' ? 400 : field === 'resources' || field === 'preferences' ? 600 : field === 'constraints' ? 800 : 1000} onChange={event => setDraft(event.target.value)} autoFocus rows={3} />
          <button type="submit" className="button button-light" disabled={disabled}>Guardar corrección de {FACT_LABELS[field].toLowerCase()}</button>
          <button type="button" className="advisor-text-button" onClick={() => finishEditing(field)}>Cancelar corrección</button>
        </form> : <button type="button" ref={node => { editButtons.current[field] = node; }} className="advisor-text-button" disabled={disabled} onClick={() => { setEditing(field); setDraft(current?.value ?? proposals.at(-1)?.value ?? ''); }}>Corregir {FACT_LABELS[field].toLowerCase()}</button>}
      </li>;
    })}</ul>
    {session.recommendations.length ? <div><h4>Orientaciones por revisar</h4>{session.recommendations.slice(-3).map(r => <div key={r.id}><p>{r.text}</p><p className="advisor-help">Reglas guiadas · {r.stale ? 'Requiere nueva revisión porque cambió el contexto.' : r.accepted ? 'Aceptada para revisar; sigue siendo una sugerencia.' : 'Sugerencia pendiente de aceptación.'}</p>{!r.stale ? <button type="button" className="advisor-text-button" disabled={disabled} onClick={() => dispatch({ version: 1, type: 'recommendation', id: r.id, accepted: !r.accepted })}>{r.accepted ? 'Retirar del brief' : 'Incluir como sugerencia'}</button> : null}</div>)}</div> : null}
  </section>;
}
