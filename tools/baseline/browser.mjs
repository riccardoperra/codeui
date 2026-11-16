import {chromium} from 'playwright';
import {readdir,mkdir,writeFile} from 'node:fs/promises';
import {homedir} from 'node:os';
import path from 'node:path';
export const out='docs/kit-2026/phase-0/baseline';
export const base=process.env.BASELINE_URL||'http://127.0.0.1:6106';
export async function launch(){
 const cache=path.join(homedir(),'Library/Caches/ms-playwright');
 const versions=(await readdir(cache)).filter(x=>/^chromium-\d+$/.test(x)).sort((a,b)=>Number(b.split('-')[1])-Number(a.split('-')[1]));
 for(const version of versions){try{return await chromium.launch({executablePath:path.join(cache,version,'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),headless:true})}catch{}}
 return chromium.launch();
}
export async function stories(){const index=await(await fetch(`${base}/index.json`)).json();await writeFile(`${out}/story-index.json`,JSON.stringify(index,null,2));return Object.values(index.entries);}
export async function open(browser,story,theme){
 const context=await browser.newContext({viewport:{width:1280,height:900},deviceScaleFactor:1,colorScheme:theme,reducedMotion:'reduce',locale:'en-US',timezoneId:'UTC'});
 await context.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.request().resourceType()==='stylesheet'?route.fulfill({status:200,contentType:'text/css',body:''}):route.abort());
 try {
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${base}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=${story.type==='docs'?'docs':'story'}`,{waitUntil:'networkidle',timeout:15000});
 await page.waitForFunction(()=>document.querySelector('#storybook-root')?.children.length||document.querySelector('#storybook-docs')?.children.length||document.querySelector('.sb-errordisplay'),null,{timeout:10000});
 await page.evaluate(theme=>{document.documentElement.setAttribute('data-cui-theme',theme);document.documentElement.style.colorScheme=theme;},theme);
 await page.addStyleTag({content:'*,*::before,*::after { animation:none!important;transition:none!important;caret-color:transparent!important; }'});
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
 const rendered=await page.locator('#storybook-root, #storybook-docs').evaluateAll(els=>els.some(e=>e.children.length&&e.getBoundingClientRect().height>0));
 const errorText=await page.locator('.sb-errordisplay').allTextContents();
 return {context,page,errors,rendered,errorText};
 }catch(e){await context.close();throw e}
}
