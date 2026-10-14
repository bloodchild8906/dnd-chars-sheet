import {readFile, writeFile} from 'node:fs/promises';
import {buildManifest} from './manifest-paths.mjs';
const template=JSON.parse(await readFile('public/manifest.json','utf8'));
const manifest=buildManifest(template,process.env.BASE_PATH||'/',process.env.SITE_URL||'');
const json=JSON.stringify(manifest,null,2)+'\n';
await writeFile('dist/manifest.json',json);
// Keep previously shared installer URLs alive after future releases.
await writeFile('dist/manifest-v1.0.2.json',json);
await writeFile('dist/manifest-v1.1.0.json',json);
await writeFile('dist/manifest-v'+manifest.version+'.json',json);
console.log('Prepared Owlbear manifest: '+manifest.action.popover);
