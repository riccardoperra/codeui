import {openSync,closeSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {mkdir,writeFile,readFile,copyFile,mkdtemp,readdir,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
process.chdir(root);
const out=process.env.BASELINE_OUT||'docs/kit-2026/phase-0/baseline';
await mkdir(out,{recursive:true});
const results=[];
async function run(name,cmd,args,cwd=root){
 const start=performance.now();
 const jsonFd=name==='attw-json'?openSync(`${out}/attw.json`,'w'):null;
 const child=spawn(cmd,args,{cwd,env:{...process.env,CI:'true',STORYBOOK_DISABLE_TELEMETRY:'1'},stdio:['ignore',jsonFd??'pipe','pipe']});
 let log=''; child.stdout?.on('data',x=>log+=x);child.stderr.on('data',x=>log+=x);
 let code=await new Promise(resolve=>{child.on('error',e=>{log+=e.message;resolve(127)});child.on('close',resolve)});
 if(jsonFd!==null){closeSync(jsonFd);log=await readFile(`${out}/attw.json`,'utf8')+log}
 await writeFile(`${out}/${name}.log`,log);
 if(name==='attw-json')await writeFile(`${out}/attw.json`,log);
 if(name==='screenshots'){
  try{
   const report=JSON.parse(await readFile(`${out}/screenshots.json`,'utf8'));
   const {backgrounds}=await import('./browser.mjs');
   const invalid=report.results.filter(x=>x.hashes?.length!==2||x.hashes[0]!==x.hashes[1]||x.backgrounds?.length!==2||x.backgrounds.some(color=>color!==backgrounds[x.theme]));
   if(!report.results.length||invalid.length){code=1;log+=`\nScreenshot self-check failed: ${invalid.map(x=>`${x.id} ${x.theme}`).join(', ')||'no captures'}\n`;}
  }catch(error){code=1;log+=`\nScreenshot self-check failed: ${error.message}\n`;}
  await writeFile(`${out}/${name}.log`,log);
 }
 const command=[cmd,...args].join(' ');
 const result={name,command,code,seconds:Math.round((performance.now()-start)/10)/100,firstError:code?(log.replace(/\x1b\[[0-9;]*m/g,'').split('\n').filter(Boolean).filter(x=>!/^\s*throw /.test(x)).filter(x=>/error|ERR_|FAIL|Cannot|Error|specified in filter|  x Directory/.test(x)).slice(0,2).join(' ')||log.split('\n').filter(Boolean)[0]):''};
 if(name==='screenshots'&&code){const report=JSON.parse(await readFile(`${out}/screenshots.json`,'utf8'));const first=report.results.find(x=>!x.identical||!x.rendered||x.error||x.errors?.length);result.firstError=first?`${first.id} ${first.theme}: ${first.error||first.errors?.join('; ')||(!first.rendered?'No rendered content':'Hashes differ')}`:'Unknown screenshot failure'}
 if(name==='a11y'&&code){const report=JSON.parse(await readFile(`${out}/a11y.json`,'utf8'));const first=report.find(x=>x.error||!x.rendered||x.errors?.length||x.violations?.length);result.firstError=first?`${first.id} ${first.theme}: ${first.error||first.errors?.join('; ')||first.violations?.map(v=>v.id).join(', ')}`:'Unknown axe failure'}
 if(name==='layer'&&code){const report=JSON.parse(await readFile(`${out}/layer.json`,'utf8'));result.firstError=report.error||Object.entries(report.checks).filter(([,ok])=>!ok).map(([check])=>check).join('; ')}
 if(name==='attw-json'&&code){try{result.firstError=Object.keys(JSON.parse(log).problems||{}).join(', ')}catch{result.firstError='Invalid JSON output'}}
 if(name==='publint'&&code)result.firstError=log.split('\n').find(x=>/^1\./.test(x))||result.firstError;
 if(name.startsWith('consumer-'))result.command=result.command.replace("-e import('./packages/kit/dist/esm/index.js')",'-e "import(\'./packages/kit/dist/esm/index.js\')"');
 results.push(result);console.log(JSON.stringify(result));return result;
}
try{await access('tools/baseline/node_modules/playwright/package.json')}catch{await run('install-tools','npm',['ci','--prefix','tools/baseline','--workspaces=false'])}
await run('node','node',['--version']);await run('pnpm','pnpm',['--version']);
const lock=await readFile('pnpm-lock.yaml');
try{
 const install=await run('install','pnpm',['install','--frozen-lockfile']);
 if(install.code){await run('install-fallback','pnpm',['install','--no-frozen-lockfile']);await run('lockfile-diff','git',['diff','--','pnpm-lock.yaml']);}
}finally{await writeFile('pnpm-lock.yaml',lock)}
for(const cmd of ['build:kit','test','typecheck'])await run(cmd.replace(':','-'),'pnpm',[cmd]);
const temp=await mkdtemp(path.join(tmpdir(),'codeui-baseline-'));
await run('pack','pnpm',['--dir',path.join(root,'packages/kit'),'pack','--pack-destination',temp]);
const tar=(await readdir(temp)).find(x=>x.endsWith('.tgz'));
if(tar){
 await run('extract','tar',['-xzf',path.join(temp,tar),'-C',temp]);
 await copyFile(path.join(temp,tar),`${out}/kit.tgz`);
 const pkg=path.join(temp,'package');
 await run('publint',path.join(root,'tools/baseline/node_modules/.bin/publint'),[pkg]);
 await run('attw',path.join(root,'tools/baseline/node_modules/.bin/attw'),[path.join(temp,tar)]);
 await run('attw-json',path.join(root,'tools/baseline/node_modules/.bin/attw'),[path.join(temp,tar),'--format','json']);
 await run('consumer-import','node',['-e',"import('./packages/kit/dist/esm/index.js')"]);
 await run('consumer-browser-import','node',['--conditions=browser','-e',"import('./packages/kit/dist/esm/index.js')"]);
 await run('sizes','node',['tools/baseline/sizes.mjs',pkg]);
}
let build=await run('storybook-build','pnpm',['--filter','@codeui/storybook-playground','exec','storybook','build','--output-dir',path.resolve(process.env.BASELINE_BUILD||'tools/baseline/storybook-static'),'--disable-telemetry']);
if(!build.code){
 const {createServer}=await import('node:http');
 const base=path.resolve(process.env.BASELINE_BUILD||'tools/baseline/storybook-static');
 const server=createServer(async(req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(p.endsWith('/'))p+='index.html';const f=path.resolve(base,'.'+p);if(!f.startsWith(base+path.sep))throw Error('path');const b=await readFile(f);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');res.end(b)}catch{res.statusCode=404;res.end()}});
 const port=Number(process.env.BASELINE_PORT??0);
 if(!Number.isInteger(port)||port<0||port>65535)throw Error('BASELINE_PORT must be an integer from 0 to 65535');
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve)});
 process.env.BASELINE_URL=`http://127.0.0.1:${server.address().port}`;
 console.log(`Baseline server ${process.env.BASELINE_URL}`);
 try{await run('screenshots','node',['tools/baseline/screenshots.mjs']);await run('a11y','node',['tools/baseline/a11y.mjs']);await run('layer','node',['tools/baseline/layer.mjs']);await run('option-card','node',['tools/baseline/option-card.mjs']);await run('theme-overrides','node',['tools/baseline/theme-overrides.mjs']);}finally{await new Promise(resolve=>server.close(resolve))}
}
await writeFile(`${out}/commands.json`,JSON.stringify(results,null,2));
await import('./report.mjs');
process.exitCode=results.some(x=>x.code)?1:0;
