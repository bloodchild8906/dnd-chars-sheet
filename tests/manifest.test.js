import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildManifest} from '../scripts/manifest-paths.mjs';
const template=JSON.parse(readFileSync(new URL('../public/manifest.json',import.meta.url),'utf8'));
test('GitHub Pages manifest URLs stay in the repository when resolved at the origin',()=>{
 const m=buildManifest(template,'/dnd-chars-sheet/');
 for(const [path,name] of [[m.icon,'icon.svg'],[m.action.icon,'icon.svg'],[m.action.popover,'index.html'],[m.background_url,'background.html']]) {
  assert.equal(path,`/dnd-chars-sheet/${name}`);
  assert.equal(new URL(path,'https://example.github.io/').pathname,`/dnd-chars-sheet/${name}`);
  assert.equal(new URL(path,'https://example.github.io/dnd-chars-sheet/manifest.json').pathname,`/dnd-chars-sheet/${name}`);
 }
});
test('local and root-hosted manifests have root paths',()=>{
 for(const base of ['/','./',undefined])assert.equal(buildManifest(template,base).action.popover,'/index.html');
 assert.throws(()=>buildManifest(template,'https://elsewhere.invalid/'));
});
