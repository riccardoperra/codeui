import {readFile,readdir,writeFile,mkdtemp,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const pkg=process.argv[2];
async function files(dir){return(await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat()}
await symlink(path.resolve('packages/kit/node_modules'),path.join(pkg,'node_modules'),'dir').catch(e=>{if(e.code!=='EEXIST')throw e});
const all=await files(path.join(pkg,'dist'));
const css=all.filter(f=>f.endsWith('.css'));const cssTs=all.filter(f=>/\.css\.(ts|js|jsx)$/.test(f));
const manifest=JSON.parse(await readFile(path.join(pkg,'package.json'),'utf8'));
const config=path.resolve('tools/baseline/size.config.json');
await writeFile(config,JSON.stringify([{gzip:true,name:'ESM entry with reachable bundled modules, minified and gzipped',path:path.join(pkg,manifest.module)}]));
const result=spawnSync(path.resolve('tools/baseline/node_modules/.bin/size-limit'),['--config',config,'--json'],{encoding:'utf8',cwd:path.resolve('tools/baseline')});
const report={command:'size-limit --config tools/baseline/size.config.json --json',code:result.status,stdout:result.stdout,stderr:result.stderr,cssBytes:(await Promise.all(css.map(async f=>(await readFile(f)).length))).reduce((a,b)=>a+b,0),cssFiles:css.map(f=>path.relative(pkg,f)),cssModules:cssTs.map(f=>path.relative(pkg,f)),manifest,esmEntry:await readFile(path.join(pkg,manifest.module),'utf8'),sampleCssModule:cssTs.length?await readFile(cssTs[0],'utf8'):null};
await writeFile(`${process.env.BASELINE_OUT||'docs/kit-2026/phase-0/baseline'}/package.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({code:report.code,stdout:report.stdout,stderr:report.stderr,cssBytes:report.cssBytes}));process.exitCode=result.status;
