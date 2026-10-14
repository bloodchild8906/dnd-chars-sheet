import {defineConfig} from 'vite';
import {resolve} from 'node:path';
export default defineConfig({base:process.env.BASE_PATH || './',server:{cors:true},build:{rollupOptions:{input:{main:resolve(import.meta.dirname,'index.html'),background:resolve(import.meta.dirname,'background.html')}}}});
