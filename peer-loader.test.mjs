import {test} from "node:test";import assert from "node:assert/strict";import {inspectPeer} from "./peer-loader.mjs";
const url="https://peer.example/agent-manifest.json",origin="https://peer.example",manifest={networks:[{name:"demo",front_man:"entry",hocon:"demo.network.json"}]},network={tools:[{name:"entry"}]};
const fetcher=async (url,options)=>{assert.equal(options.credentials,"omit");assert.equal(options.redirect,"error");return new Response(JSON.stringify(url.endsWith("agent-manifest.json")?manifest:network));};
test("inspect never authorizes execution",async()=>assert.equal((await inspectPeer(url,{allowedOrigins:[origin],consent:true,fetcher})).executionAuthorized,false));
test("reject before fetch without consent",async()=>assert.rejects(inspectPeer(url,{allowedOrigins:[origin],fetcher:()=>assert.fail()}),/consent/));
test("reject wrong origin before fetch",async()=>assert.rejects(inspectPeer(url,{allowedOrigins:[],consent:true,fetcher:()=>assert.fail()}),/Origin/));
test("reject off-origin network definition",async()=>assert.rejects(inspectPeer(url,{allowedOrigins:[origin],consent:true,fetcher:async()=>new Response(JSON.stringify({networks:[{...manifest.networks[0],hocon:"https://evil.example/network.json"}]}))}),/outside/));
