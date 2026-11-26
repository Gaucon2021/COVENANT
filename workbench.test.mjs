import{test}from "node:test";import assert from "node:assert/strict";import{createGate}from "./workbench.mjs";
const origin="https://peer.example",r={origin,capability:"read",id:"1",expiresAt:200,delegated:[]};const gate=()=>createGate({origins:[origin],capabilities:["read"]});
test("consent must be explicit",()=>assert.equal(gate().issue(r,100,"true").decision,"CONSENT_REQUIRED"));
test("untrusted origin blocked",()=>assert.equal(gate().issue({...r,origin:"https://evil.example"},100,true).decision,"BLOCK_SCOPE"));
test("delegation escalation blocked",()=>assert.equal(gate().issue({...r,delegated:["pay"]},100,true).decision,"BLOCK_SCOPE"));
test("single use",()=>{const g=gate(),a=g.issue(r,100,true);assert.equal(g.consume(a.grant,101).decision,"EXECUTED");assert.equal(g.consume(a.grant,102).decision,"BLOCK_REPLAY")});
test("tampered capability blocked",()=>{const g=gate(),a=g.issue(r,100,true);assert.equal(g.consume({...a.grant,capability:"pay"},101).decision,"BLOCK_BINDING")});
test("expiry blocks",()=>{const g=gate(),a=g.issue(r,100,true);assert.equal(g.consume(a.grant,200).decision,"BLOCK_EXPIRED")});
