export const PEER_ORIGIN="https://covenant-public-registry.vercel.app";
function exactKeys(value,keys){return !!value&&typeof value==="object"&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&keys.every(k=>Object.hasOwn(value,k));}
export function validateResponse(event,peerWindow,pending,now){
 if(!event||!Number.isFinite(now)||!pending||pending.capability!=="read.public-profile"||event.source!==peerWindow||event.origin!==PEER_ORIGIN)return false;
 const r=event.data;
 return !!(exactKeys(r,["protocol","id","capability","expiresAt","result"])&&exactKeys(r.result,["peer","classification","service","version"])&&r.protocol==="covenant.read.v1"&&r.id===pending.id&&r.capability===pending.capability&&r.expiresAt===pending.expiresAt&&now<pending.expiresAt&&r.result&&r.result.peer==="COVENANT Public Registry"&&r.result.classification==="PUBLIC"&&r.result.service==="read-only profile"&&r.result.version===1);
}

export function validateDenial(event,peerWindow,pending,now){if(!event||!Number.isFinite(now)||!pending||event.source!==peerWindow||event.origin!==PEER_ORIGIN)return false;const r=event.data;return !!(exactKeys(r,["protocol","id","capability","expiresAt","decision"])&&pending.capability!=="read.public-profile"&&r.protocol==="covenant.read.v1"&&r.id===pending.id&&r.capability===pending.capability&&r.expiresAt===pending.expiresAt&&now<pending.expiresAt&&r.decision==="BLOCK_SCOPE"&&!Object.hasOwn(r,"result"));}
