import {advisorReducer,createAdvisorSession} from '../../shared/advisor-session.ts';
import type {AdvisorSession,FactField} from '../../shared/advisor-session-contract.ts';
export function qualityFixtures(): Record<string,AdvisorSession> {
  const correct=(s:AdvisorSession,field:FactField,value:string)=>advisorReducer(s,{version:1,type:'correct',field,value});
  let root=createAdvisorSession();
  for(const [field,value]of Object.entries({activity:'Barbería ficticia',problem:'Consultas perdidas por respuesta tardía',objective:'Atender mejor las consultas',audience:'Personas de la colonia',channels:'WhatsApp, Instagram y teléfono',resources:'Dos horas semanales',constraints:'Sin presupuesto para publicidad',preferences:'Información sencilla'}))root=correct(root,field as FactField,value);
  function proposal(s:AdvisorSession,text:string,recommendation?:string,field?:FactField,value?:string){s=advisorReducer(s,{version:1,type:'message',message:{id:'fixture-'+s.revision,role:'user',simulated:false,text}});return advisorReducer(s,{version:1,type:'proposals',messageId:'fixture-'+s.revision,baseRevision:s.revision,proposals:field&&value?[{field,value,quote:value,kind:'literal'}]:[],recommendation});}
  const proposed=proposal(root,'Revisemos las consultas','Con dos horas semanales, revisar cuáles consultas quedan sin respuesta antes de escoger herramientas.');
  const accepted=advisorReducer(proposed,{version:1,type:'recommendation',id:proposed.recommendations[0].id,accepted:true});
  const rejected=advisorReducer(proposed,{version:1,type:'recommendation',id:proposed.recommendations[0].id,accepted:false});
  const obsolete=correct(accepted,'resources','No tengo tiempo disponible');
  const incomplete=proposal(correct(createAdvisorSession(),'activity','Tengo una idea ficticia'),'No conozco el problema','Instalar una agenda automáticamente');
  const contradiction=proposal(root,'Ahora quiero vender más',undefined,'objective','vender más');
  let wrong=proposal(root,'Facebook es una referencia que no me gusta',undefined,'channels','Facebook');
  wrong=advisorReducer(wrong,{version:1,type:'reject',id:wrong.claims.at(-1)!.id});
  const exported=structuredClone(root);exported.answers.features=['seguimiento'];exported.answers.featureNotes='Solicito mostrar horarios';exported.answers.references=[{id:'quality-ref',url:'https://example.com/quality',likes:'Información clara',dislikes:'Animaciones'}];exported.answers.dislikes='Texto ilegible';
  return {sustentada_aceptada:accepted,rechazada:rejected,obsoleta:obsolete,informacion_insuficiente:incomplete,objetivos_contradictorios:contradiction,extraccion_incorrecta:wrong,exportacion_integra:exported};
}
