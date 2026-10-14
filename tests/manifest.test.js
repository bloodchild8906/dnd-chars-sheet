import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildManifest} from '../scripts/manifest-paths.mjs';
const template=JSON.parse(readFileSync(new URL('../public/manifest.json',import.meta.url),'utf8'));
test('GitHub Pages paths stay in the repository from either URL base',()=>{
 const m=buildManifest(template,'/dnd-chars-sheet/');
 for(const path of [m.icon,m.action.icon,m.action.popover,m.background_url]){
  assert.ok(path.startsWith('/dnd-chars-sheet/'));
  assert.equal(new URL(path,'https://example.github.io/').pathname,new URL(path,'https://example.github.io/dnd-chars-sheet/manifest.json').pathname);
 }
});
test('hosted manifests use absolute canonical URLs even from a trailing-dot host',()=>{
 const m=buildManifest(template,'/dnd-chars-sheet/','https://example.github.io/dnd-chars-sheet/');
 for(const path of [m.icon,m.action.icon,m.action.popover,m.background_url]){
  assert.ok(path.startsWith('https://example.github.io/dnd-chars-sheet/'));
  assert.equal(new URL(path,'https://example.github.io./').href,path);
 }
 assert.equal(m.action.icon,'https://example.github.io/dnd-chars-sheet/icon-v2.svg');
 assert.throws(()=>buildManifest(template,'/dnd-chars-sheet/','https://example.github.io/'));
});
test('local manifests retain root paths',()=>{
 for(const base of ['/','./',undefined])assert.equal(buildManifest(template,base).action.popover,'/index.html');
 assert.throws(()=>buildManifest(template,'https://elsewhere.invalid/'));
});
