// Restrictive public-artifact inspection, not a full Neuro SAN execution runtime.
const LIMIT=128*1024;
function originOf(value){const u=new URL(value);if(u.protocol!=="https:"||u.username||u.password||u.hash)throw new Error("HTTPS public URL required");return u.origin;}
async function json(url,fetcher){const r=await fetcher(url,{credentials:"omit",redirect:"error",cache:"no-store",referrerPolicy:"no-referrer",signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error("HTTP "+r.status);const reader=r.body?.getReader();if(!reader)throw new Error("No response body");const decoder=new TextDecoder();let size=0,text="";try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>LIMIT)throw new Error("Artifact exceeds size limit");text+=decoder.decode(value,{stream:true});}text+=decoder.decode();return JSON.parse(text);}finally{await reader.cancel().catch(()=>{});}}
export async function inspectPeer(url,{allowedOrigins,consent=false,fetcher=fetch}={}){
 const u=new URL(url);const origin=originOf(url);
 if(!Array.isArray(allowedOrigins)||!allowedOrigins.includes(origin))throw new Error("Origin not allowed");
 if(consent!==true)throw new Error("Explicit consent required");
 if(u.search||!u.pathname.endsWith("/agent-manifest.json"))throw new Error("Manifest URL required");
 const manifest=await json(u.href,fetcher);
 if(!Array.isArray(manifest.networks)||!manifest.networks.length||manifest.networks.length>20)throw new Error("Invalid network list");
 const summaries=[];
 for(const n of manifest.networks){
  if(!n||typeof n.name!=="string"||typeof n.front_man!=="string"||typeof n.hocon!=="string")throw new Error("Invalid network entry");
  const resolved=new URL(n.hocon,u);if(originOf(resolved.href)!==origin||resolved.search||!resolved.pathname.endsWith(".json"))throw new Error("Network definition outside allowed origin or not JSON");
  const network=await json(resolved.href,fetcher);
  if(!Array.isArray(network.tools)||network.tools.length>100||!network.tools.some(t=>t?.name===n.front_man))throw new Error("Missing public entry agent");
  const names=network.tools.map(t=>t?.name);if(names.some(n=>typeof n!=="string"||!n)||new Set(names).size!==names.length)throw new Error("Invalid tool names");
  summaries.push({name:n.name,entry:n.front_man,agentNames:names,definition:resolved.href});
 }
 return {decision:"INSPECTED_ONLY",origin,networks:summaries,executionAuthorized:false,credentialsSent:false};
}
