import AxeBuilder from '@axe-core/playwright';
import {writeFile} from 'node:fs/promises';
import {launch,stories,open,out} from './browser.mjs';
const browser=await launch();const results=[];const entries=await stories();
const jobs=['light','dark'].flatMap(theme=>entries.map(story=>({theme,story})));
async function worker(){for(let job;job=jobs.shift();){const {theme,story}=job;let opened;try{opened=await open(browser,story,theme);const {page,errors,rendered}=opened;const axe=await new AxeBuilder({page}).analyze();results.push({id:story.id,title:story.title,theme,rendered,errors,...axe});console.log(story.id,theme,axe.violations.length);}catch(e){results.push({id:story.id,theme,error:e.message});}finally{await opened?.context.close()}}}
try{await Promise.all(Array.from({length:4},worker))}finally{results.sort((a,b)=>(a.theme+a.id).localeCompare(b.theme+b.id));await writeFile(`${out}/a11y.json`,JSON.stringify(results,null,2));await browser.close();}
process.exitCode=results.some(x=>x.error||!x.rendered||x.errors?.length||x.violations?.length)?1:0;
