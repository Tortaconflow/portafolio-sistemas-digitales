/**
 * SQL fragments shared by the ledger and its unit tests (no Workers imports here).
 *
 * A request holds one of the global slots while it is pending or uncertain. Public
 * (non-campaign) rows stop holding it once their session expires: otherwise two
 * provider timeouts, or a Worker that dies between /reserve and /finish, would keep
 * both slots forever and every visitor would get `concurrency_limit`.
 * Campaign rows keep the stricter behaviour on purpose (operator-run pilots).
 *
 * Takes one binding: the current time in milliseconds.
 */
export const OPEN_REQUEST =
  "status IN ('pending','uncertain') AND (campaign IS NOT NULL OR EXISTS (SELECT 1 FROM sessions s WHERE s.id=requests.session AND s.expires>?))";

type Binding = string | number | null;

/**
 * Charges what Workers AI reported (`usage.neurons`) instead of the reservation, so
 * the daily cap counts real spend. Ignores missing or absurd values (keeps the
 * reservation, the conservative choice). Returns the neurons charged, or null.
 */
export function reconcileReservation(rows: Rows, id: string, neurons: unknown): number | null {
  if (typeof neurons !== 'number' || !Number.isFinite(neurons) || neurons < 0 || neurons > 1000) return null;
  const row = rows('SELECT day, reservation FROM requests WHERE id=?', id)[0];
  if (!row || row.reservation === null || row.reservation === undefined) return null;
  const used = Math.ceil(neurons);
  const delta = used - Number(row.reservation);
  if (delta !== 0) {
    rows('UPDATE days SET reserved=MAX(0,reserved+?) WHERE day=?', delta, String(row.day));
    rows('UPDATE requests SET reservation=? WHERE id=?', used, id);
  }
  return used;
}
export type Rows = (sql: string, ...bindings: Binding[]) => Record<string, unknown>[];

const DAY_MS = 24 * 60 * 60 * 1000;
/** Closed public requests are kept this long; afterwards only the daily totals remain. */
export const REQUEST_RETENTION_DAYS = 30;

export interface LedgerHealth {
  /** Rows holding a global slot right now (alarm if it stays at 2). */
  openSlots: number;
  /** Pending/uncertain public rows whose session expired: no longer block anyone. */
  staleRows: number;
  reservedToday: number;
  activeSessions: number;
  deletedSessions: number;
  deletedRequests: number;
}

const count = (rows: Rows, sql: string, ...bindings: Binding[]) => Number(rows(sql, ...bindings)[0]?.n ?? 0);

/**
 * Hourly check run by the Worker's cron: four counters for the logs plus
 * housekeeping so the tables do not grow forever. Only control metadata lives
 * here (no message, reply or IP), so nothing personal is read or logged.
 */
export function ledgerHealth(rows: Rows, now: number): LedgerHealth {
  const today = new Date(now).toISOString().slice(0, 10);
  const cutoffDay = new Date(now - REQUEST_RETENTION_DAYS * DAY_MS).toISOString().slice(0, 10);
  const health = {
    openSlots: count(rows, `SELECT COUNT(*) AS n FROM requests WHERE ${OPEN_REQUEST}`, now),
    staleRows: count(rows, `SELECT COUNT(*) AS n FROM requests WHERE campaign IS NULL AND status IN ('pending','uncertain') AND NOT (${OPEN_REQUEST})`, now),
    reservedToday: count(rows, 'SELECT COALESCE(MAX(reserved),0) AS n FROM days WHERE day=?', today),
    activeSessions: count(rows, 'SELECT COUNT(*) AS n FROM sessions WHERE expires>?', now),
  };
  // Public requests closed (or stale) for more than the retention period.
  const oldRequests = `FROM requests WHERE campaign IS NULL AND day<? AND NOT (${OPEN_REQUEST})`;
  const deletedRequests = count(rows, `SELECT COUNT(*) AS n ${oldRequests}`, cutoffDay, now);
  if (deletedRequests) rows(`DELETE ${oldRequests}`, cutoffDay, now);
  // Public sessions expired more than a day ago.
  const oldSessions = 'FROM sessions WHERE campaign IS NULL AND expires<?';
  const deletedSessions = count(rows, `SELECT COUNT(*) AS n ${oldSessions}`, now - DAY_MS);
  if (deletedSessions) rows(`DELETE ${oldSessions}`, now - DAY_MS);
  return { ...health, deletedSessions, deletedRequests };
}
