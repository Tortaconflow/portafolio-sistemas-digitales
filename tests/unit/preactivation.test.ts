import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advisorReducer,createAdvisorSession,currentClaim,projectHybridBrief,serializeDisplayBrief} from '../../shared/advisor-session.ts';
import {emptyAnswers} from '../../src/advisor/model.ts';
import type {FactField} from '../../shared/advisor-session-contract.ts';
import {qualityFixtures} from '../fixtures/diagnostic-quality.ts';
const correct=(s:ReturnType<typeof createAdvisorSession>,field:FactField,value:string)=>advisorReducer(s,{version:1,type:'correct',field,value});
function supported(){let s=createAdvisorSession();for(const [field,value]of Object.entries({activity:'Barbería',problem:'Consultas perdidas por respuesta tardía',objective:'Atender mejor consultas',channels:'WhatsApp, Instagram y teléfono',resources:'Dos horas semanales',constraints:'Sin presupuesto para publicidad',preferences:'Información sencilla'}))s=correct(s,field as FactField,value);return s;}
function recommend(s:ReturnType<typeof createAdvisorSession>){s=advisorReducer(s,{version:1,type:'message',message:{id:'fixture-recommend',role:'user',simulated:false,text:'Quiero revisar cómo respondemos consultas'}});return advisorReducer(s,{version:1,type:'proposals',messageId:'fixture-recommend',baseRevision:s.revision,proposals:[],recommendation:'Con dos horas semanales, revisar qué consultas quedan sin respuesta antes de escoger herramientas.'});}
test('whole partial brief exports channels, constraints, references, preferences and requested functions with provenance',()=>{
 let s=supported();s.answers={...emptyAnswers(),featureNotes:'Solicito información de horarios',references:[{id:'fixture-ref',url:'https://example.com/referencia',likes:'Claridad',dislikes:'Animaciones'}],dislikes:'Efectos rápidos'};
 const b=projectHybridBrief(s);const text=serializeDisplayBrief(b);assert.equal(Object.keys(b.fields).length,12);
 for(const value of ['WhatsApp','Instagram','teléfono','Dos horas semanales','Sin presupuesto para publicidad','Información sencilla','https://example.com/referencia','Claridad','Animaciones','Efectos rápidos','Solicito información de horarios'])assert.ok(text.includes(value),value);
 assert.match(b.provenance.confirmedNeeds.source,/canales confirmados.*origen visitor/);assert.equal(b.provenance.confirmedNeeds.status,'confirmed');
});
test('declared channels keep their status and an unconfirmed simulated extraction never enters the brief',()=>{
 let s=createAdvisorSession();s.claims.push({id:'visitor-declaration',field:'channels',value:'WhatsApp y correo',status:'declared',origin:'visitor',revision:0});
 assert.match(projectHybridBrief(s).fields.confirmedNeeds,/declarados, sin confirmar/);assert.equal(projectHybridBrief(s).provenance.confirmedNeeds.status,'inferred');
 s=advisorReducer(createAdvisorSession(),{version:1,type:'message',message:{id:'bad-extract',role:'user',simulated:false,text:'Instagram es una referencia que no me gusta'}});
 s=advisorReducer(s,{version:1,type:'proposals',messageId:'bad-extract',baseRevision:s.revision,proposals:[{field:'channels',value:'Instagram',quote:'Instagram',kind:'literal'}]});
 assert.equal(currentClaim(s,'channels'),undefined);assert.ok(!projectHybridBrief(s).fields.confirmedNeeds.includes('Instagram'));
 s=advisorReducer(s,{version:1,type:'reject',id:s.claims.at(-1)!.id});assert.equal(currentClaim(s,'channels'),undefined);
});
test('supported recommendation accepted is useful but remains a suggestion; rejection and correction remove it',()=>{
 const proposed=recommend(supported());const rec=proposed.recommendations.at(-1)!;assert.ok(rec.dependencies.length>=5);
 const accepted=advisorReducer(proposed,{version:1,type:'recommendation',id:rec.id,accepted:true});
 assert.match(projectHybridBrief(accepted).fields.suggestions,/Con dos horas semanales/);assert.equal(projectHybridBrief(accepted).provenance.suggestions.status,'suggested');
 assert.ok(!projectHybridBrief(accepted).fields.suggestions.includes('Pendiente de conocer.'));
 const rejected=advisorReducer(proposed,{version:1,type:'recommendation',id:rec.id,accepted:false});assert.ok(!projectHybridBrief(rejected).fields.suggestions.includes(rec.text));
 const corrected=correct(accepted,'resources','No tengo tiempo disponible');assert.ok(corrected.recommendations.every(r=>r.stale));assert.ok(!projectHybridBrief(corrected).fields.suggestions.includes(rec.text));
});
test('insufficient information stays pending and contradictory goals preserve the confirmed objective',()=>{
 let s=correct(createAdvisorSession(),'objective','Mejorar consultas actuales');assert.equal(projectHybridBrief(s).fields.requestedFeatures,'Pendiente de conocer.');
 const insufficient=recommend(s);assert.equal(insufficient.recommendations.length,0);assert.equal(projectHybridBrief(insufficient).fields.suggestions,'Pendiente de conocer.');
 s=advisorReducer(s,{version:1,type:'message',message:{id:'goal-conflict',role:'user',text:'Ahora quiero vender más',simulated:false}});
 s=advisorReducer(s,{version:1,type:'proposals',messageId:'goal-conflict',baseRevision:s.revision,proposals:[{field:'objective',value:'vender más',quote:'vender más',kind:'literal'}]});
 assert.equal(currentClaim(s,'objective')?.value,'Mejorar consultas actuales');assert.match(projectHybridBrief(s).fields.pendingQuestions,/Contradicción/);
 assert.equal(s.contradictions.filter(c=>!c.resolved).length,1);
});
test('seven reusable quality fixtures demonstrate utility, containment and complete confirmed exports',()=>{
 const fixtures=qualityFixtures();assert.equal(Object.keys(fixtures).length,7);
 const text=(name:string)=>serializeDisplayBrief(projectHybridBrief(fixtures[name]));
 assert.match(text('sustentada_aceptada'),/Con dos horas semanales/);
 for(const name of ['rechazada','obsoleta'])assert.ok(!text(name).includes('Con dos horas semanales, revisar'));
 assert.ok(!text('informacion_insuficiente').includes('Instalar una agenda automáticamente'));
 assert.match(text('objetivos_contradictorios'),/Contradicción/);assert.equal(currentClaim(fixtures.objetivos_contradictorios,'objective')?.value,'Atender mejor las consultas');
 assert.equal(currentClaim(fixtures.extraccion_incorrecta,'channels')?.value,'WhatsApp, Instagram y teléfono');
 for(const claim of fixtures.exportacion_integra.claims.filter(c=>c.status==='confirmed'))assert.ok(text('exportacion_integra').includes(claim.value),claim.field);
 assert.match(text('exportacion_integra'),/Solicito mostrar horarios/);assert.match(text('exportacion_integra'),/example.com\/quality/);
 assert.match(text('exportacion_integra'),/Ordenar el seguimiento de consultas/);
});
