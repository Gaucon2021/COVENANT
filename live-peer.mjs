export const PEER_ORIGIN="https://covenant-public-registry.vercel.app";
export function validateResponse(event,peerWindow,pending,now){
 if(!pending||event.source!==peerWindow||event.origin!==PEER_ORIGIN)return false;
 const r=event.data;
 return !!(r&&r.protocol==="covenant.read.v1"&&r.id===pending.id&&r.capability===pending.capability&&r.expiresAt===pending.expiresAt&&now<pending.expiresAt&&r.result&&r.result.peer==="COVENANT Public Registry"&&r.result.classification==="PUBLIC"&&r.result.service==="read-only profile"&&r.result.version===1);
}
