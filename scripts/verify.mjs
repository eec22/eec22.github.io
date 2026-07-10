import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root=resolve('dist'); const routes=JSON.parse(readFileSync('src/data/legacy-routes.json','utf8'));
const failures=[]; const preserved=['先寫，再改','Could not load host key','Default Domain Policy','此版本 Exchange 不支援此 [收件匣] 規則']; const fileFor=(route)=>route.endsWith('.html')?join(root,route):join(root,route,'index.html');
for(const route of ['/',...routes]) if(!existsSync(fileFor(route))) failures.push(`missing route ${route}`);
const html=[]; const walk=(dir)=>{for(const name of readdirSync(dir)){const file=join(dir,name);statSync(file).isDirectory()?walk(file):name.endsWith('.html')&&html.push(file)}}; walk(root);
for(const file of html){const body=readFileSync(file,'utf8');if(file.includes('google6cf41602fd3edef1.html'))continue;if(!/<meta name="description" content="[^"]+"/.test(body))failures.push(`missing description ${file}`);if(!/<link rel="canonical" href="https:\/\/kylechan\.tw\//.test(body))failures.push(`bad canonical ${file}`);for(const match of body.matchAll(/(?:href|src)="(\/[^"]+)"/g)){const url=match[1].split(/[?#]/)[0];if(url==='/'||url.startsWith('//')||url==='/rss.xml')continue;const target=url.endsWith('/')?join(root,url,'index.html'):join(root,url);if(!existsSync(target))failures.push(`broken ${url} in ${file}`)}}
if(!existsSync(join(root,'sitemap-index.xml')))failures.push('missing sitemap-index.xml');
const builtText=html.map(file=>readFileSync(file,'utf8')).join('\\n');for(const phrase of preserved)if(!builtText.includes(phrase))failures.push(`missing legacy content: ${phrase}`);
if(failures.length){console.error([...new Set(failures)].join('\n'));process.exit(1)}
console.log(`verified ${html.length} HTML files and ${routes.length} legacy routes`);
