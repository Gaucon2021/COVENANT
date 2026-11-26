import {test} from "node:test";import assert from "node:assert/strict";import{validateResponse,validateDenial,PEER_ORIGIN}from "./live-peer.mjs";
const w={},p={id:"x",capability:"read.public-profile",expiresAt:200},e={source:w,origin:PEER_ORIGIN,data:{...p,protocol:"covenant.read.v1",result:{peer:"COVENANT Public Registry",classification:"PUBLIC",service:"read-only profile",version:1}}};
test("valid response",()=>assert.equal(validateResponse(e,w,p,100),true));
test("wrong source rejected",()=>assert.equal(validateResponse({...e,source:{}},w,p,100),false));
test("wrong origin rejected",()=>assert.equal(validateResponse({...e,origin:"https://evil.example"},w,p,100),false));
test("wrong id rejected",()=>assert.equal(validateResponse({...e,data:{...e.data,id:"other"}},w,p,100),false));
test("expired rejected",()=>assert.equal(validateResponse(e,w,p,200),false));
test("no pending request rejected",()=>assert.equal(validateResponse(e,w,null,100),false));

const denied={...p,capability:"pay"};const d={source:w,origin:PEER_ORIGIN,data:{...denied,protocol:"covenant.read.v1",decision:"BLOCK_SCOPE"}};test("bound denial",()=>assert.equal(validateDenial(d,w,denied,100),true));test("forged denial",()=>assert.equal(validateDenial({...d,origin:"https://evil.example"},w,denied,100),false));test("denial cannot authorize or include result",()=>{assert.equal(validateResponse(d,w,denied,100),false);assert.equal(validateDenial({...d,data:{...d.data,result:{}}},w,denied,100),false)});
