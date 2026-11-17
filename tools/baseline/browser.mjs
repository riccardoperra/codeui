import {chromium} from 'playwright';
import {readdir,writeFile} from 'node:fs/promises';
import {homedir} from 'node:os';
import path from 'node:path';
export const out='docs/kit-2026/phase-0/baseline';
export const base=process.env.BASELINE_URL||`http://127.0.0.1:${process.env.BASELINE_PORT||6106}`;
export const backgrounds={light:'rgb(247, 250, 252)',dark:'rgb(15, 15, 16)'};
export async function launch(){
 const cache=path.join(homedir(),'Library/Caches/ms-playwright');
 const versions=(await readdir(cache)).filter(x=>/^chromium-\d+$/.test(x)).sort((a,b)=>Number(b.split('-')[1])-Number(a.split('-')[1]));
 for(const version of versions){try{return await chromium.launch({executablePath:path.join(cache,version,'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),headless:true,args:['--disable-gpu','--disable-skia-runtime-opts','--run-all-compositor-stages-before-draw','--disable-partial-raster']})}catch{}}
 return chromium.launch({args:['--disable-gpu','--disable-skia-runtime-opts','--run-all-compositor-stages-before-draw','--disable-partial-raster']});
}
export async function stories(){const index=await(await fetch(`${base}/index.json`)).json();await writeFile(`${out}/story-index.json`,JSON.stringify(index,null,2));return Object.values(index.entries);}
export async function open(browser,story,theme){
 const context=await browser.newContext({viewport:{width:1280,height:900},deviceScaleFactor:1,colorScheme:theme,reducedMotion:'reduce',locale:'en-US',timezoneId:'UTC'});
 await context.addInitScript(theme=>{
  localStorage.setItem('sb-addon-themes-3',JSON.stringify({current:theme}));
  const apply=()=>{if(!document.documentElement)return false;document.documentElement.setAttribute('data-cui-theme',theme);document.documentElement.style.colorScheme=theme;return true;};
  const observer=new MutationObserver(()=>{if(document.documentElement?.getAttribute('data-cui-theme')!==theme)apply()});
  observer.observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['data-cui-theme']});apply();
 },theme);
 await context.addInitScript(()=>{
  const events=window.__BASELINE_STORYBOOK_EVENTS__=[];let channel;
  Object.defineProperty(window,'__STORYBOOK_ADDONS_CHANNEL__',{configurable:true,get:()=>channel,set(value){channel=value;for(const name of ['storyFinished','docsRendered','storyErrored','storyThrewException','storyMissing'])value.on(name,payload=>events.push({name,payload:payload instanceof Error?payload.message:payload}));}});
 });
 await context.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.request().resourceType()==='stylesheet'?route.fulfill({status:200,contentType:'text/css',body:''}):route.abort());
 try {
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${base}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=${story.type==='docs'?'docs':'story'}`,{waitUntil:'networkidle',timeout:15000});
 const settled=await page.waitForFunction(({id,type})=>{const events=window.__BASELINE_STORYBOOK_EVENTS__;const failed=events.filter(e=>!['storyFinished','docsRendered'].includes(e.name));if(failed.length)return failed;return events.some(e=>type==='docs'?e.name==='docsRendered'&&e.payload===id:e.name==='storyFinished'&&e.payload?.storyId===id)&&[];},{id:story.id,type:story.type},{timeout:15000});
 for(const event of await settled.jsonValue())errors.push(`${event.name}: ${JSON.stringify(event.payload)}`);
 if(story.type==='docs'){
  await page.waitForFunction(()=>[...document.querySelectorAll('[id^="story--"][id$="-inner"]')].every(el=>el.children.length>0)&&window.__STORYBOOK_PREVIEW__.storyRenders.every(render=>render.phase==='finished'));
  await page.waitForLoadState('networkidle');
 }
 await page.evaluate(theme=>{
  window.__STORYBOOK_ADDONS_CHANNEL__.emit('DARK_MODE',theme==='dark');
  document.documentElement.setAttribute('data-cui-theme',theme);
 },theme);
 await page.addStyleTag({content:'*,*::before,*::after { animation:none!important;transition:none!important;caret-color:transparent!important; }'});
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
 await page.waitForFunction(({theme,background})=>document.documentElement.getAttribute('data-cui-theme')===theme&&getComputedStyle(document.body).backgroundColor===background,{theme,background:backgrounds[theme]});
 if(story.type==='docs')await page.waitForFunction(theme=>document.querySelector('.sbdocs-wrapper')&&getComputedStyle(document.querySelector('.sbdocs-wrapper')).backgroundColor===(theme==='dark'?'rgb(5, 5, 5)':'rgb(255, 255, 255)'),theme);
 const rendered=await page.evaluate(()=>[...document.querySelectorAll('#storybook-root, #storybook-docs')].some(e=>e.children.length&&e.getBoundingClientRect().height>0)||[...document.querySelectorAll('body > :not(#storybook-root):not(#storybook-docs) [data-cui]')].some(e=>e.getBoundingClientRect().height>0));
 const errorText=await page.locator('.sb-errordisplay').allTextContents();
 return {context,page,errors,rendered,errorText};
 }catch(e){await context.close();throw e}
}
