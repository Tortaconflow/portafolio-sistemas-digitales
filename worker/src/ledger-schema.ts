/** SQL data schema, independent of Wrangler's Durable Object class lifecycle. */
export const LEDGER_SCHEMA_VERSION=1;
const migration='ledger-v1-reservation-session-scope';
const tables:Record<string,Record<string,string>>={
 days:{day:'TEXT PRIMARY KEY',reserved:'INTEGER NOT NULL'},
 sessions:{id:'TEXT PRIMARY KEY',expires:'INTEGER NOT NULL',attempts:'INTEGER NOT NULL DEFAULT 0',busy:'INTEGER NOT NULL DEFAULT 0',campaign:'TEXT'},
 requests:{id:'TEXT PRIMARY KEY',session:'TEXT NOT NULL',hash:'TEXT NOT NULL',status:'TEXT NOT NULL',day:'TEXT NOT NULL',status_checks:'INTEGER NOT NULL DEFAULT 0',campaign:'TEXT',reservation:'INTEGER'},
 campaigns:{id:'TEXT PRIMARY KEY',status:'TEXT NOT NULL',expires:'INTEGER NOT NULL',attempts:'INTEGER NOT NULL DEFAULT 0',reserved:'INTEGER NOT NULL DEFAULT 0'},
 operator_nonces:{id:'TEXT PRIMARY KEY',expires:'INTEGER NOT NULL'},
 challenges:{id:'TEXT PRIMARY KEY'},bootstraps:{bucket:'TEXT PRIMARY KEY',count:'INTEGER NOT NULL'},
};
const metadata={id:'INTEGER PRIMARY KEY',version:'INTEGER NOT NULL',migration:'TEXT NOT NULL'};
const additive=new Set(['requests.campaign','requests.reservation','sessions.campaign']);
type Row=Record<string,string|number|null>;
type Storage=Pick<DurableObjectStorage,'sql'|'transactionSync'>;
export function migrateLedgerSchema(storage:Storage):void{
 storage.transactionSync(()=>{
  const rows=(sql:string,...bindings:(string|number|null)[])=>storage.sql.exec<Row>(sql,...bindings).toArray();
  const present=new Set(rows("SELECT name FROM sqlite_master WHERE type='table'").map(r=>String(r.name)));
  const columns=(table:string)=>rows(`PRAGMA table_info(${table})`);
  const validate=(table:string,spec:Record<string,string>,legacy=false)=>{
   const actual=columns(table);
   for(const col of actual){
    const definition=spec[String(col.name)];
    if(!definition||col.type!==definition.split(' ')[0]||col.notnull!==(definition.includes('NOT NULL')?1:0)||col.pk!==(definition.includes('PRIMARY KEY')?1:0)||String(col.dflt_value??'')!==(definition.includes('DEFAULT 0')?'0':''))throw Error('ledger_schema_inconsistent');
   }
   for(const name of Object.keys(spec))if(!actual.some(c=>c.name===name)&&!(legacy&&additive.has(table+'.'+name)))throw Error('ledger_schema_inconsistent');
  };
  const marked=present.has('ledger_schema');
  if(marked){
   validate('ledger_schema',metadata);
   const versions=rows('SELECT id,version,migration FROM ledger_schema');
   if(versions.length!==1||versions[0].id!==1||!Number.isSafeInteger(versions[0].version))throw Error('ledger_schema_metadata');
   if(Number(versions[0].version)>LEDGER_SCHEMA_VERSION)throw Error('ledger_schema_future');
   if(versions[0].version!==LEDGER_SCHEMA_VERSION||versions[0].migration!==migration)throw Error('ledger_schema_unknown');
  }
  const count=Object.keys(tables).filter(name=>present.has(name)).length;
  if(count!==0&&count!==Object.keys(tables).length)throw Error('ledger_schema_incomplete');
  if(marked&&count===0)throw Error('ledger_schema_inconsistent');
  if(count){for(const [name,spec] of Object.entries(tables))validate(name,spec,!marked);}
  if(!marked){
   if(!count){for(const [name,spec] of Object.entries(tables))rows(`CREATE TABLE ${name} (${Object.entries(spec).map(([column,definition])=>column+' '+definition).join(',')})`);}
   else for(const field of additive){const [table,column]=field.split('.');if(!columns(table).some(c=>c.name===column))rows(`ALTER TABLE ${table} ADD COLUMN ${column} ${tables[table][column]}`);}
   rows('CREATE INDEX IF NOT EXISTS requests_session ON requests(session)');
   for(const [name,spec] of Object.entries(tables))validate(name,spec);
  }
  const index=rows('PRAGMA index_info(requests_session)');
  if(index.length!==1||index[0].name!=='session')throw Error('ledger_schema_index');
  if(!marked){
   rows('CREATE TABLE ledger_schema (id INTEGER PRIMARY KEY CHECK(id=1),version INTEGER NOT NULL,migration TEXT NOT NULL)');
   rows('INSERT INTO ledger_schema(id,version,migration) VALUES (1,?,?)',LEDGER_SCHEMA_VERSION,migration);
  }
 });
}
