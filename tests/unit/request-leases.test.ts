import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { publicRequestStatus, recoverExpiredRequests, REQUEST_LEASE_MS } from '../../worker/src/request-leases.ts';

test('expired requests recover capacity while preserving spend, attempts and duplicate IDs', () => {
  const sql = new DatabaseSync(':memory:');
  try {
    sql.exec(`
      CREATE TABLE requests (id TEXT PRIMARY KEY, session TEXT, status TEXT, campaign TEXT, day TEXT, reservation INTEGER);
      CREATE TABLE sessions (id TEXT PRIMARY KEY, expires INTEGER, campaign TEXT, busy INTEGER, attempts INTEGER);
      CREATE TABLE request_leases (id TEXT PRIMARY KEY, expires INTEGER NOT NULL);
      INSERT INTO requests VALUES
        ('expired', 'first', 'uncertain', NULL, '2026-11-21', 190),
        ('old', 'second', 'pending', NULL, '2026-11-21', 190),
        ('live', 'first', 'pending', NULL, '2026-11-22', 190),
        ('campaign', 'trial', 'uncertain', 'trial', '2026-11-21', 400);
      INSERT INTO sessions VALUES ('first', 220000, NULL, 1, 2), ('second', 30000, NULL, 1, 1), ('trial', 30000, 'trial', 1, 1);
      INSERT INTO request_leases VALUES ('expired', 80000), ('live', 200000);
    `);
    const query = (statement: string, ...values: (string | number | null)[]) =>
      sql.prepare(statement).all(...values) as Record<string, string | number | null>[];
    const now = 30_000 + REQUEST_LEASE_MS;
    recoverExpiredRequests(query, now);
    recoverExpiredRequests(query, now);

    assert.deepEqual(query('SELECT status FROM requests ORDER BY id').map(row => row.status),
      ['uncertain', 'expired_uncertain', 'pending', 'expired_uncertain']);
    assert.equal(publicRequestStatus(query("SELECT status FROM requests WHERE id = 'expired'")[0].status), 'uncertain');
    assert.deepEqual(query('SELECT busy, attempts FROM sessions ORDER BY id').map(row => [row.busy, row.attempts]), [[1, 2], [0, 1], [1, 1]]);
    assert.equal(query('SELECT SUM(reservation) AS total FROM requests')[0].total, 970);
    assert.deepEqual(query('SELECT id FROM request_leases').map(row => row.id), ['live']);
  } finally {
    sql.close();
  }
});
