import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

mkdirSync('artifacts/screenshots',{recursive:true});
const server=spawn(process.execPath,['node_modules/astro/bin/astro.mjs','preview','--host','127.0.0.1'],{stdio:'ignore'});
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
for(let i=0;i<30;i++){try{if((await fetch('http://127.0.0.1:4321/')).ok)break}catch{}if(i===29)throw new Error('preview server did not start');await wait(500)}
let browser;
try{browser=await chromium.launch();const errors=[];for(const spec of [{name:'home-desktop',url:'/',width:1440,height:1000},{name:'home-mobile',url:'/',width:390,height:844},{name:'article-desktop',url:'/2021/09/15/%E6%9F%90%E4%BA%9B%E8%A6%8F%E5%89%87%E5%B7%B2%E5%81%9C%E7%94%A8%EF%BC%8C%E7%95%B6%E6%82%A8%E5%98%97%E8%A9%A6%E5%9C%A8-Outlook-%E4%B8%AD%E5%BB%BA%E7%AB%8B%E6%88%96%E5%95%9F%E7%94%A8%E8%A6%8F%E5%89%87%E6%99%82%EF%BC%8C%E6%9C%83%E6%94%B6%E5%88%B0%E9%8C%AF%E8%AA%A4%E8%A8%8A%E6%81%AF/',width:1280,height:900},{name:'archive-mobile',url:'/archives/',width:390,height:844}]){const page=await browser.newPage({viewport:{width:spec.width,height:spec.height}});page.on('console',m=>m.type()==='error'&&errors.push(`${spec.name}: ${m.text()}`));const response=await page.goto(`http://127.0.0.1:4321${spec.url}`,{waitUntil:'networkidle'});if(!response?.ok())errors.push(`${spec.name}: HTTP ${response?.status()}`);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);if(overflow)errors.push(`${spec.name}: horizontal overflow`);await page.screenshot({path:`artifacts/screenshots/${spec.name}.png`,fullPage:true});await page.close()}if(errors.length)throw new Error(errors.join('\n'));console.log('captured 4 responsive screenshots without browser errors or overflow')}finally{await browser?.close();server.kill()}
