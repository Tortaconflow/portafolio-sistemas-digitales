type SqlRow = Record<string, string | number | null>;
type Query = (statement: string, ...values: (string | number | null)[]) => SqlRow[];

export const REQUEST_LEASE_MS = 60_000;
export const publicRequestStatus = (status: SqlRow[string]) => status === 'expired_uncertain' ? 'uncertain' : status;

export function recoverExpiredRequests(query: Query, now: number): void {
  // For older rows, the session expiry plus grace is an upper bound on the
  // deadline. Keep the original attempts and charges in the ledger.
  const expired = query(`
    UPDATE requests SET status = 'expired_uncertain'
    WHERE campaign IS NULL AND status IN ('pending', 'uncertain')
      AND COALESCE(
        (SELECT expires FROM request_leases WHERE id = requests.id),
        (SELECT expires FROM sessions WHERE id = requests.session) + ?,
        unixepoch(requests.day, '+1 day') * 1000 + ?
      ) <= ?
    RETURNING id, session
  `, REQUEST_LEASE_MS, REQUEST_LEASE_MS, now);

  for (const row of expired) {
    query('DELETE FROM request_leases WHERE id = ?', row.id);
    query(`
      UPDATE sessions SET busy = 0 WHERE id = ? AND campaign IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM requests WHERE session = sessions.id AND status IN ('pending', 'uncertain')
      )
    `, row.session);
  }
}
