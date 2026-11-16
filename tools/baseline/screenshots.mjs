import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {launch,stories,open,out} from './browser.mjs';
const browser=await launch();const entries=await stories();const results=[];
const jobs=['light','dark'].flatMap(theme=>entries.map(story=>({theme,story})));
for(const theme of ['light','dark'])await mkdir(`${out}/shots/${theme}`,{recursive:true});
async function worker(){for(let job;job=jobs.shift();){const {theme,story}=job;const record={id:story.id,title:story.title,type:story.type,theme,hashes:[]};for(let pass=0;pass<2;pass++){let opened;try{opened=await open(browser,story,theme);const {page,errors,rendered,errorText}=opened;record.errors=errors;record.rendered=rendered;record.errorText=errorText;const bytes=await page.screenshot({path:pass?undefined:`${out}/shots/${theme}/${story.id}.png`,animations:'disabled',fullPage:true});record.hashes.push(createHash('sha256').update(bytes).digest('hex'));}catch(e){record.error=e.message;break;}finally{await opened?.context.close()}}record.identical=record.hashes.length===2&&record.hashes[0]===record.hashes[1];results.push(record);console.log(story.id,theme,record.identical,record.error||'');}}
try{await Promise.all(Array.from({length:4},worker))}finally{results.sort((a,b)=>(a.theme+a.id).localeCompare(b.theme+b.id));await writeFile(`${out}/screenshots.json`,JSON.stringify({browser:browser.version(),viewport:{width:1280,height:900},results},null,2));await browser.close();}
process.exitCode=results.some(x=>!x.rendered||x.error||x.errors?.length||!x.identical)?1:0;
