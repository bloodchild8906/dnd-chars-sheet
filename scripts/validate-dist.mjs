import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
const root=resolve('dist');
const base=process.env.BASE_PATH||'/';
const site=new URL(process.env.SITE_URL||base,'https://extension.example');
const origin=site.origin;
const manifest=JSON.parse(await readFile(resolve(root,'manifest.json'),'utf8'));
assert.equal(manifest.manifest_version,1);
assert.ok(manifest.name.length>0&&manifest.name.length<=45);
assert.ok(manifest.description.length<=128);
async function check(ref,parent=site){
 const url=new URL(ref,parent);
 if(url.origin!==site.origin)return null;
 assert.ok(url.pathname.startsWith(site.pathname),'Escapes deployment base: '+ref);
 const relative=decodeURIComponent(url.pathname.slice(site.pathname.length));
 const file=resolve(root,relative||'index.html');
 assert.ok(file.startsWith(root+sep),'Escapes dist: '+ref);
 assert.ok((await stat(file)).isFile(),'Missing file: '+ref);
 return {file,url};
}
for(const ref of [manifest.icon,manifest.action.icon,manifest.action.popover,manifest.background_url]){
 assert.ok(ref.startsWith('/')||ref.startsWith('https://'),'Manifest paths must be explicit');
 if(process.env.SITE_URL)assert.ok(ref.startsWith(site.href),'Hosted manifest must use full deployment URLs');
 assert.ok(await check(ref,new URL(origin+'/')));
}
const versioned=JSON.parse(await readFile(resolve(root,'manifest-v'+manifest.version+'.json'),'utf8'));
assert.deepEqual(versioned,manifest);
for(const path of ['index.html','background.html']){
 const page=await check(path);const html=await readFile(page.file,'utf8');
 for(const m of html.matchAll(/(?:src|href)=["']([^"']+)["']/g))await check(m[1],page.url);
}
console.log('Valid Owlbear manifest, versioned installer and assets at '+site.href);
