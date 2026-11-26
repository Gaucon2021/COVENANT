const validOrigin=s=>{try{const u=new URL(s);return u.protocol==="https:"&&u.origin===s}catch{return false}};
export function createGate({origins,capabilities}){
 const grants=new Map(),consumed=new Set();let counter=0;
 const allowedOrigins=new Set((origins??[]).filter(validOrigin));const allowedCaps=new Set(capabilities??[]);
 function issue(request,now,consented){
  if(!request||!allowedOrigins.has(request.origin)||!allowedCaps.has(request.capability)||typeof request.id!=="string"||!request.id||request.id.length>100||!Number.isFinite(now)||!Number.isFinite(request.expiresAt)||request.expiresAt<=now||request.expiresAt>now+60000||!Array.isArray(request.delegated)||request.delegated.some(c=>c!==request.capability))return {decision:"BLOCK_SCOPE"};
  if(consumed.has(request.id)||grants.has(request.id))return {decision:"BLOCK_REPLAY"};
  if(consented!==true)return {decision:"CONSENT_REQUIRED"};
  const binding={origin:request.origin,capability:request.capability,id:request.id,expiresAt:request.expiresAt,delegated:[...request.delegated]};
  const grant={...binding,serial:++counter};grants.set(binding.id,grant);return {decision:"ALLOW",grant:{...grant,delegated:[...grant.delegated]}};
 }
 function consume(request,now){
  const g=grants.get(request?.id);
  if(!g)return {decision:consumed.has(request?.id)?"BLOCK_REPLAY":"BLOCK_NO_GRANT"};
  if(!Number.isFinite(now)||now>=g.expiresAt){grants.delete(g.id);consumed.add(g.id);return {decision:"BLOCK_EXPIRED"}}
  if(request.origin!==g.origin||request.capability!==g.capability||request.serial!==g.serial||request.expiresAt!==g.expiresAt||!Array.isArray(request.delegated)||JSON.stringify(request.delegated)!==JSON.stringify(g.delegated))return {decision:"BLOCK_BINDING"};
  grants.delete(g.id);consumed.add(g.id);return {decision:"EXECUTED",id:g.id,capability:g.capability};
 }
 return {issue,consume};
}
