import {readFile, writeFile} from 'node:fs/promises';
import {buildManifest} from './manifest-paths.mjs';
const template=JSON.parse(await readFile('public/manifest.json','utf8'));
const manifest=buildManifest(template,process.env.BASE_PATH||'/');
await writeFile('dist/manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Prepared Owlbear manifest: ${manifest.action.popover}`);
