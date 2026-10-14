import {test} from 'node:test';
import assert from 'node:assert/strict';
import {blank,validate,stats,rest} from '../src/model.js';
import {advance,classRows,parseCompendium,mergeCompendium,addCompendiumEntry,loadCompendium,plain} from '../src/compendium.js';
test('creation, leveling and multiclassing survive export and reload',()=>{
 const c=blank();advance(c,{name:'Fighter',source:'XPHB',hitDie:10,hpGain:12});
 assert.equal(c.level,1);assert.equal(c.maxHp,12);
 advance(c,{name:'Fighter',source:'XPHB',hitDie:10,hpGain:8});
 advance(c,{name:'Wizard',source:'XPHB',hitDie:6,hpGain:6});
 const out=validate(JSON.parse(JSON.stringify(c)));
 assert.equal(out.level,3);assert.equal(out.maxHp,26);assert.deepEqual(out.classes.map(r=>[r.name,r.level,r.hitDie]),[['Fighter',2,10],['Wizard',1,6]]);
 advance(out,{name:'Fighter',source:'XPHB',hitDie:10,hpGain:8});
 advance(out,{name:'Wizard',source:'XPHB',hitDie:6,hpGain:6});
 assert.equal(stats(out).pb,3);
});
test('class Hit Dice rest recovery preserves separate pools',()=>{
 const c=blank();c.classes=[{name:'Fighter',source:'XPHB',level:3,hitDie:10,spent:3},{name:'Wizard',source:'XPHB',level:2,hitDie:6,spent:2}];const out=validate(c);
 out.rules='2014';rest(out,'long');assert.equal(out.hitDiceSpent,3);assert.equal(out.classes[1].spent,2);
 out.rules='2024';rest(out,'long');assert.equal(out.hitDiceSpent,0);assert.ok(out.classes.every(r=>r.spent===0));
});
test('level cap and invalid HP never mutate a character',()=>{
 const c=blank();c.className='Fighter';c.level=20;const before=JSON.stringify(c);assert.throws(()=>advance(c,{name:'Wizard',hpGain:5}));assert.equal(JSON.stringify(c),before);
 const b=blank();assert.throws(()=>advance(b,{name:'Fighter',hpGain:NaN}));assert.equal(b.classes.length,0);
 const out=validate({...b,classes:Array.from({length:30},()=>({name:'Class',level:99,spent:99,hitDie:10}))});assert.equal(out.level,20);assert.equal(out.hitDiceSpent,20);
});
test('homebrew data import deduplicates entries and preserves sheet provenance',()=>{
 const entries=parseCompendium({spell:[{name:'Test spell',source:'BREW',level:1,entries:['A {@dice 1d6} effect.']}],class:[{name:'Warden',source:'BREW',hd:{faces:10}}]});
 assert.equal(mergeCompendium(entries,entries).length,2);
 const c=blank(),spell=entries.find(e=>e.kind==='spell');addCompendiumEntry(c,spell);assert.equal(c.spells[0].description,'A 1d6 effect.\nSource: BREW');
 assert.throws(()=>addCompendiumEntry(validate(c),spell));
 assert.throws(()=>parseCompendium({unsupported:[]}));assert.equal(plain({name:'Feature',entries:['Effect']}),'Feature: Effect');
});
test('class features only apply at the acquired class level',()=>{
 const entries=parseCompendium({classFeature:[{name:'First',source:'HB',className:'Warden',classSource:'HB',level:1,entries:['One']},{name:'Second',source:'HB',className:'Warden',classSource:'HB',level:2,entries:['Two']}]});
 const c=blank();advance(c,{name:'Warden',source:'HB',hitDie:10,hpGain:10,features:entries});assert.deepEqual(c.features.map(e=>e.name),['First']);
 advance(c,{name:'Wizard',source:'XPHB',hitDie:6,hpGain:4,features:entries});assert.equal(c.features.length,1);
 advance(c,{name:'Warden',source:'HB',hitDie:10,hpGain:6,features:entries});assert.equal(c.features[1].name,'Second');
});
test('default loader resolves class index and reports network failures',async()=>{
 const urls=[];const fetcher=async url=>{urls.push(String(url));return {ok:true,text:async()=>JSON.stringify(String(url).endsWith('index.json')?{warden:'class-warden.json'}:{class:[{name:'Warden',source:'HB'}]})};};
 const values=await loadCompendium('class',undefined,fetcher);assert.equal(values[0].name,'Warden');assert.match(urls[0],/5etools.*data\/class\/index.json/);
 await assert.rejects(loadCompendium('feat',undefined,async()=>({ok:false,status:503})),/503/);
 await assert.rejects(loadCompendium('class','http://example.com/'),/HTTPS/);
});
