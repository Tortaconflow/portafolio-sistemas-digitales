import { DurableObject } from 'cloudflare:workers';
import { AI_POLICY } from '../../shared/cidikis-ai-policy.ts';
import type { Env } from './index.ts';
import { SINGLE_POLICY, isSingleCampaign } from './single-policy.ts';
import {migrateLedgerSchema} from './ledger-schema.ts';
import { OPEN_REQUEST, ledgerHealth } from './ledger-queries.ts';

type Row = Record<string, string | number | null>;
const reply = (data: unknown, status = 200) => Response.json(data, { status });
/** One global object atomically owns the session, concurrency and daily reservations.
 * SQL contains control metadata only. No message, profile, response or brief is stored.
 */
export class BudgetLedger extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    migrateLedgerSchema(ctx.storage);
  }
  rows(sql: string, ...bindings: (string | number | null)[]) { return this.ctx.storage.sql.exec<Row>(sql, ...bindings).toArray(); }
  async fetch(request: Request): Promise<Response> {
    if(new URL(request.url).pathname==='/admin/schema'&&request.method==='GET'){
      // Revalidate version and structure; marked v1 performs no DDL or row writes.
      migrateLedgerSchema(this.ctx.storage);
      const integrity=this.rows('PRAGMA quick_check');
      if(integrity.length!==1||Object.values(integrity[0])[0]!=='ok')return reply({code:'schema_unavailable'},503);
      return reply({schemaVersion:1,integrity:'ok'});
    }
    const data = await request.json() as Record<string, string | number>;
    const path = new URL(request.url).pathname;
    return this.ctx.storage.transactionSync(() => {
      const now = Date.now(); const day = new Date(now).toISOString().slice(0, 10);
      // Uncertain requests keep their global slot and reserve on subsequent UTC days,
      // but public (non-campaign) rows only while their session is alive. Without that
      // bound, two timeouts or a Worker crash between /reserve and /finish would hold
      // both global slots forever and every visitor would get concurrency_limit.
      const carried = Number(this.rows(`SELECT COALESCE(SUM(COALESCE(reservation,CASE WHEN campaign='v02-lab-no-ai-1' THEN 0 ELSE ? END)),0) AS n FROM requests WHERE ${OPEN_REQUEST}`,AI_POLICY.reservationNeurons,now)[0].n);
      this.rows('INSERT OR IGNORE INTO days(day,reserved) VALUES (?,?)', day, carried);
      if (path === '/operator/nonce') {
        // The authorized trial preserves every historical row, including nonce
        // metadata. Retaining expired nonces strengthens replay rejection.
        if(this.env.SINGLE_TRIAL_CASE!=='success'&&this.env.SINGLE_TRIAL_CASE!=='timeout')this.rows('DELETE FROM operator_nonces WHERE expires<?', now);
        if (this.rows('SELECT id FROM operator_nonces WHERE id=?', data.id).length) return reply({ code: 'operator_replay' }, 409);
        this.rows('INSERT INTO operator_nonces(id,expires) VALUES (?,?)', data.id, data.expires);
        return reply({ ok: true });
      }
      if (path === '/challenge/use') {
        if (this.rows('SELECT id FROM challenges WHERE id=?', data.id).length) return reply({ code: 'challenge_replay' }, 409);
        this.rows('INSERT INTO challenges(id) VALUES (?)', data.id);
        return reply({ ok: true });
      }
      if (path === '/pilot/init') {
        if ((!['v02-pilot-1','v02-lab-no-ai-1'].includes(String(data.campaign))&&!isSingleCampaign(data.campaign)) || !Number.isSafeInteger(data.ttlMs) || Number(data.ttlMs) <= 0 || Number(data.ttlMs) > 3600000) return reply({ code: 'campaign_config' }, 400);
        // Ledger owns expiry: no cross-runtime absolute-clock comparison and no renewal.
        this.rows("INSERT OR IGNORE INTO campaigns(id,status,expires) VALUES (?,'ready',?)", data.campaign, now + Number(data.ttlMs));
        return reply({ ok: true });
      }
      if (path === '/pilot/open' || path === '/pilot/close' || path === '/pilot/stop' || path === '/pilot/status') {
        const campaign = this.rows('SELECT * FROM campaigns WHERE id=?', data.campaign)[0];
        if (!campaign) return reply({ code: 'campaign_missing' }, 404);
        if (Number(campaign.expires) <= now && ['ready','active'].includes(String(campaign.status))) this.rows("UPDATE campaigns SET status='expired' WHERE id=?", data.campaign);
        if (path === '/pilot/open') {
          if (campaign.status !== 'ready' || Number(campaign.expires) <= now) return reply({ code: 'campaign_closed' }, 409);
          this.rows("UPDATE campaigns SET status='active' WHERE id=?", data.campaign);
        }
        if (path === '/pilot/close') this.rows("UPDATE campaigns SET status='closed' WHERE id=?", data.campaign);
        if (path === '/pilot/stop') this.rows("UPDATE campaigns SET status='uncertain' WHERE id=? AND status!='closed'", data.campaign);
        return reply({ campaign: this.rows('SELECT * FROM campaigns WHERE id=?', data.campaign)[0], requests: this.rows('SELECT id,status FROM requests WHERE campaign=?', data.campaign) });
      }
      if (path === '/bootstrap') {
        const count = Number(this.rows('SELECT count FROM bootstraps WHERE bucket=?', data.bucket)[0]?.count ?? 0);
        if (count >= 12) return reply({ code: 'bootstrap_limit' }, 429);
        this.rows('INSERT INTO bootstraps(bucket,count) VALUES (?,1) ON CONFLICT(bucket) DO UPDATE SET count=count+1', data.bucket);
        this.rows('INSERT INTO sessions(id,expires,campaign) VALUES (?,?,?)', data.session, data.expires,isSingleCampaign(data.campaign)?data.campaign:null);
        return reply({ ok: true });
      }
      if (path === '/reserve') {
        const campaign = data.campaign ? this.rows('SELECT * FROM campaigns WHERE id=?', data.campaign)[0] : undefined;
        const single=isSingleCampaign(data.campaign);
        // Public routes may ask for a smaller reservation (the chat measured ~12 neurons per call);
        // never more than the default and never for campaigns.
        const routeReservation=!data.campaign&&Number.isSafeInteger(data.reservation)&&Number(data.reservation)>=1&&Number(data.reservation)<=AI_POLICY.reservationNeurons?Number(data.reservation):AI_POLICY.reservationNeurons;
        const reservationNeurons=single?SINGLE_POLICY.reservation:data.campaign==='v02-lab-no-ai-1'?0:routeReservation;
        if (data.campaign && (!campaign || campaign.status !== 'active' || Number(campaign.expires) <= now)) return reply({ code: 'campaign_closed' }, 429);
        const session = this.rows('SELECT * FROM sessions WHERE id=?', data.session)[0];
        if (!session || Number(session.expires) <= now) return reply({ code: 'expired' }, 401);
        if ((isSingleCampaign(session.campaign)||single)&&session.campaign!==data.campaign) return reply({code:'campaign_session'},403);
        const previous = this.rows('SELECT * FROM requests WHERE id=?', data.id)[0];
        if (previous) return previous.session === data.session && previous.hash === data.hash ? reply({ code: 'duplicate', status: previous.status }, 409) : reply({ code: 'request_conflict' }, 409);
        if (Number(session.attempts) >= AI_POLICY.maxAttempts) return reply({ code: 'session_limit' }, 429);
        if (session.busy) return reply({ code: 'session_busy' }, 429);
        if (campaign && (Number(campaign.attempts) >= (single?SINGLE_POLICY.attempts:5) || Number(campaign.reserved) + reservationNeurons > (single?SINGLE_POLICY.reservation:950))) return reply({ code: 'campaign_limit' }, 429);
        if (campaign && this.rows("SELECT id FROM requests WHERE campaign=? AND status IN ('pending','uncertain')", data.campaign).length) return reply({ code: 'campaign_busy' }, 429);
        if (this.rows("SELECT id FROM requests WHERE session=? AND hash=? AND status='success'", data.session, data.hash).length) return reply({ code: 'unchanged_context' }, 409);
        if (Number(this.rows(`SELECT COUNT(*) AS n FROM requests WHERE ${OPEN_REQUEST}`, now)[0].n) >= AI_POLICY.globalConcurrency) return reply({ code: 'concurrency_limit' }, 429);
        const reserved = Number(this.rows('SELECT reserved FROM days WHERE day=?', day)[0].reserved);
        const dailyLimit = Math.min(AI_POLICY.dailyNeurons, Math.max(0, Number(this.env.LOCAL_DAILY_NEURONS ?? AI_POLICY.dailyNeurons)));
        if (!Number.isFinite(dailyLimit) || reserved + reservationNeurons > dailyLimit) return reply({ code: 'global_budget' }, 429);
        this.rows('UPDATE days SET reserved=reserved+? WHERE day=?', reservationNeurons, day);
        this.rows('UPDATE sessions SET attempts=attempts+1,busy=1 WHERE id=?', data.session);
        this.rows("INSERT INTO requests(id,session,hash,status,day,campaign,reservation) VALUES (?,?,?,'pending',?,?,?)", data.id, data.session, data.hash, day, data.campaign ?? null,reservationNeurons);
        if (campaign) this.rows('UPDATE campaigns SET attempts=attempts+1,reserved=reserved+? WHERE id=?', reservationNeurons, data.campaign);
        if(single&&this.env.LOCAL_LEDGER_RESERVE_FAULT==='invalid-ack')return reply({ok:false});
        return reply({ ok: true, remaining: single?SINGLE_POLICY.attempts-Number(campaign!.attempts)-1:AI_POLICY.maxAttempts - Number(session.attempts) - 1 });
      }
      if (path === '/finish') {
        if (this.env.LOCAL_LEDGER_FINISH_FAULT === 'true') return reply({ code: 'finish_fixture_failure' }, 503);
        if (this.env.LOCAL_LEDGER_FINISH_FAULT === 'invalid-ack') return reply({ok:false});
        const previous = this.rows('SELECT * FROM requests WHERE id=?', data.id)[0];
        if (!previous || previous.status !== 'pending' || !['success', 'failed', 'uncertain'].includes(String(data.status))) return reply({ code: 'state' }, 409);
        this.rows('UPDATE requests SET status=? WHERE id=?', data.status, data.id);
        if (isSingleCampaign(previous.campaign)) this.rows("UPDATE campaigns SET status=? WHERE id=? AND status!='closed'",data.status==='uncertain'?'uncertain':'closed',previous.campaign);
        if (previous.campaign && data.status === 'uncertain') this.rows("UPDATE campaigns SET status='uncertain' WHERE id=? AND status!='closed'", previous.campaign as string);
        if (data.status !== 'uncertain') this.rows('UPDATE sessions SET busy=0 WHERE id=?', previous.session as string);
        return reply({ ok: true });
      }
      if (path === '/status') {
        const row = this.rows('SELECT * FROM requests WHERE id=? AND session=?', data.id, data.session)[0];
        if (!row) return reply({ code: 'unknown' }, 404);
        if (Number(row.status_checks) >= 2) return reply({ code: 'status_limit' }, 429);
        this.rows('UPDATE requests SET status_checks=status_checks+1 WHERE id=?', data.id);
        return reply({ status: row.status });
      }
      // Only the Worker's cron calls this (see `scheduled` in index.ts); never routed publicly.
      if (path === '/health') return reply(ledgerHealth((sql, ...b) => this.rows(sql, ...b), now));
      // This internal path is never routed by the public Worker, including locally.
      if (path === '/metrics') return reply({ days: this.rows('SELECT * FROM days'), sessions: this.rows('SELECT * FROM sessions'), requests: this.rows('SELECT * FROM requests'), tables: this.rows("SELECT name FROM sqlite_master WHERE type='table'") });
      return reply({ code: 'route' }, 404);
    });
  }
}
