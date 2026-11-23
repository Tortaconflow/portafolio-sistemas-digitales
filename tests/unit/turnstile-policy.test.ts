import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createErrorTracker,
  isFatalTurnstileError,
  TURNSTILE_POLICY,
  TurnstileError,
  turnstileFailureMessage,
  type TurnstileFailure,
} from '../../shared/turnstile-policy.ts';

test('los errores genéricos 600* y 300* son reintentables, no fatales', () => {
  for (const code of ['600010', '600000', '300030', '110600', '110620', '200500']) {
    assert.equal(isFatalTurnstileError(code), false, code);
  }
});

test('sitekey, dominio y reloj no se arreglan reintentando', () => {
  for (const code of ['110100', '110110', '110200', '200100', '400020', '400021', '400070']) {
    assert.equal(isFatalTurnstileError(code), true, code);
  }
  assert.equal(isFatalTurnstileError(undefined), false);
  assert.equal(isFatalTurnstileError(110200), true);
});

test('un error 600010 aislado no cancela el reintento automático', () => {
  const track = createErrorTracker();
  assert.equal(track('600010'), null);
  assert.equal(track('600010'), null);
});

test('tras agotar los errores reintentables se rinde con "blocked" y conserva el código', () => {
  const track = createErrorTracker(3);
  track('600010');
  track('600010');
  const failure = track('600010');
  assert.ok(failure instanceof TurnstileError);
  assert.equal(failure.failure, 'blocked');
  assert.equal(failure.code, '600010');
});

test('un error de configuración se rinde de inmediato', () => {
  const failure = createErrorTracker()('110200');
  assert.equal(failure?.failure, 'config');
});

test('cada falla tiene un mensaje distinto y ninguno es el genérico anterior', () => {
  const kinds: TurnstileFailure[] = ['load', 'config', 'blocked', 'timeout'];
  const messages = kinds.map(turnstileFailureMessage);
  assert.equal(new Set(messages).size, 4);
  for (const message of messages) assert.ok(!message.includes('No pude completar la verificación de seguridad.'), message);
});

test('los plazos nuevos son más holgados que los anteriores (8 s de carga, 15 s de espera)', () => {
  assert.ok(TURNSTILE_POLICY.scriptLoadMs > 8_000);
  assert.ok(TURNSTILE_POLICY.silentMs > 15_000);
  assert.ok(TURNSTILE_POLICY.interactiveMs >= 60_000);
});
