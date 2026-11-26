export function accept(event,parentWindow,parentOrigin,seen,now){
 const r=event.data;
 if(event.source!==parentWindow||event.origin!==parentOrigin)return {status:"IGNORE_ORIGIN"};
 if(!r||r.protocol!=="covenant.read.v1"||typeof r.id!=="string"||!(/^[a-f0-9]{32}$/).test(r.id)||!Number.isSafeInteger(r.expiresAt)||r.expiresAt<=now||r.expiresAt>now+30000)return {status:"BLOCK_INVALID"};
 if(r.capability!=="read.public-profile"||r.consent!==true){if(typeof r.capability!=="string"||r.capability.length>100)return {status:"BLOCK_INVALID"};return {status:"BLOCK_SCOPE",response:{protocol:r.protocol,id:r.id,capability:r.capability,expiresAt:r.expiresAt,decision:"BLOCK_SCOPE"}};}
 if(seen.has(r.id)||seen.size>=1000)return {status:"BLOCK_REPLAY"};
 seen.add(r.id);return {status:"ACCEPT",response:{protocol:"covenant.read.v1",id:r.id,capability:r.capability,result:{peer:"COVENANT Public Registry",classification:"PUBLIC",service:"read-only profile",version:1},expiresAt:r.expiresAt}};
}
