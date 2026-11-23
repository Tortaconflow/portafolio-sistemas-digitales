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
