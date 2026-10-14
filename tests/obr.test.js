import {registerHooks} from 'node:module';
import {test} from 'node:test';
import assert from 'node:assert/strict';
registerHooks({resolve(specifier,context,next){if(specifier==='@owlbear-rodeo/sdk')return {url:new URL('./mock-sdk.js',import.meta.url).href,shortCircuit:true};return next(specifier,context);}});
const {state}=await import('./mock-sdk.js');
const {KEY,connect,inspectToken,saveToken,loadToken,shareRoll,receiveRoll}=await import('../src/obr.js');
const {vox}=await import('../src/preset.js');
test('Owlbear adapter: scope, selected token, ownership, metadata isolation, roll validation',async()=>{
 assert.deepEqual(await connect(),{room:'room-1',player:'player-1',name:'Player One'});
 assert.equal((await inspectToken()).id,'token-1');
 await saveToken(vox(),'token-1');assert.equal(state.items[0].metadata.unrelated,42);assert.equal((await loadToken()).name,'VOX');
 await assert.rejects(()=>saveToken(vox(),'wrong-id'),/Selection changed/);
 state.items[0].metadata[KEY].owner='other';await assert.rejects(()=>saveToken(vox(),'token-1'),/another player/);
 state.role='GM';await saveToken(vox(),'token-1');
 state.selection=[];await assert.rejects(inspectToken,/exactly one/);state.selection=['token-1'];
 state.ready=false;await assert.rejects(inspectToken,/Open a scene/);state.ready=true;
 let received=0;const stop=receiveRoll(()=>received++);state.listener({data:{total:'malformed'}});assert.equal(received,0);
 const roll={label:'Attack',character:'VOX',expression:'1d20+7',total:19,detail:'[12] +7'};state.listener({data:roll});assert.equal(received,1);await shareRoll(roll);assert.equal(state.sent[2].destination,'REMOTE');stop();assert.equal(state.listener,null);
});
