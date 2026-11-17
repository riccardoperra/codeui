import {writeFile} from 'node:fs/promises';
import {launch,base,out} from './browser.mjs';

const appBackground='rgb(1, 2, 3)';
const browser=await launch();
const result={};
try{
 const page=await browser.newPage();
 await page.addInitScript(background=>{
  const style=document.createElement('style');
  style.id='app-css';
  style.textContent=`.app-override { background: ${background}; }`;
  const insert=()=>document.head&&!style.isConnected?(document.head.prepend(style),true):style.isConnected;
  if(!insert()){const observer=new MutationObserver(()=>{if(insert())observer.disconnect()});observer.observe(document,{childList:true,subtree:true})}
 },appBackground);
 await page.goto(`${base}/iframe.html?id=designsystem-button--primary&viewMode=story`,{waitUntil:'networkidle',timeout:15000});
 const button=page.locator('#storybook-root button').first();
 await button.waitFor();
 Object.assign(result,await button.evaluate(async el=>{
  const sheets=[...document.styleSheets];
  const walk=(rules,layers,found)=>{for(const rule of rules){
   const inner=rule.cssRules?[...rule.cssRules]:[];
   if(rule instanceof CSSLayerBlockRule)walk(inner,[...layers,rule.name],found);
   else if(rule instanceof CSSStyleRule){let matches=false;try{matches=el.matches(rule.selectorText)}catch{}if(matches)found.push({selector:rule.selectorText,layers});walk(inner,layers,found)}
   else walk(inner,layers,found);
  }return found};
  const matched=sheets.flatMap((sheet,index)=>walk([...sheet.cssRules],[],[]).map(rule=>({...rule,sheet:index,app:sheet.ownerNode?.id==='app-css'})));
  const appSheet=sheets.findIndex(sheet=>sheet.ownerNode?.id==='app-css');
  const kitSheets=matched.filter(rule=>rule.layers[0]==='cui').map(rule=>rule.sheet);
  const kitBackground=getComputedStyle(el).backgroundColor;
  el.classList.add('app-override');
  await Promise.all(el.getAnimations().map(animation=>animation.finished));
  return {
   appSheet,
   firstKitSheet:Math.min(...kitSheets),
   kitRules:kitSheets.length,
   unlayeredRules:matched.filter(rule=>!rule.layers.length&&!rule.app).map(rule=>rule.selector),
   kitBackground,
   overriddenBackground:getComputedStyle(el).backgroundColor,
  };
 }));
 result.checks={
  'app CSS loads before kit CSS':result.appSheet>=0&&result.appSheet<result.firstKitSheet,
  'kit styles the button':result.kitRules>0&&result.kitBackground!==appBackground,
  'every rule matching the button is layered':result.unlayeredRules.length===0,
  'unlayered app background wins':result.overriddenBackground===appBackground,
 };
}catch(e){result.error=e.message}
finally{await browser.close()}
await writeFile(`${out}/layer.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
process.exitCode=result.error||Object.values(result.checks).includes(false)?1:0;
