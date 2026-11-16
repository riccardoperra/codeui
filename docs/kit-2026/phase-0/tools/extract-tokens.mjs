import {createRequire} from 'node:module';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const require=createRequire(path.join(process.env.PLAYWRIGHT_HOME||'/private/tmp/claude-501/kit-tokens','package.json'));
const {chromium}=require('playwright');
const out=fileURLToPath(new URL('../',import.meta.url));
const properties=['background-color','color','border-top-width','border-top-style','border-top-color','border-right-width','border-right-color','border-bottom-width','border-bottom-color','border-left-width','border-left-color','border-radius','box-shadow','padding','gap','height','font-family','font-size','font-weight','line-height','letter-spacing','outline','outline-offset','transition-duration','transition-timing-function'];
const result=process.argv.includes('--analyze-only')?JSON.parse(await readFile(path.join(out,'tokens.json'),'utf8')):{url:'https://codeimage-preview.pages.dev/',viewport:{width:1440,height:900},capturedAt:new Date().toISOString(),label:'measured',themes:{},gaps:[]};
await mkdir(path.join(out,'tokens-shots'),{recursive:true});
if(!process.argv.includes('--analyze-only')) {
const browser=await chromium.launch({headless:true});
try {
for(const theme of ['dark','light']) {
 const page=await browser.newPage({viewport:result.viewport,colorScheme:theme});
 await page.goto(result.url,{waitUntil:'networkidle'});
 const start=page.getByRole('button',{name:'Start creating',exact:true});if(await start.isVisible())await start.click();
 await page.evaluate(t=>{document.documentElement.setAttribute('data-codeimage-theme',t);document.documentElement.setAttribute('data-cui-theme',t)},theme);
 await page.waitForTimeout(500);
 const data=result.themes[theme]={surfaces:{}};
 async function capture(name){
 await page.waitForTimeout(350);
 const sample=await page.evaluate(props=>{
  const visible=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&s.visibility!=='hidden'&&s.display!=='none'};
  const style=e=>Object.fromEntries(props.map(k=>[k,getComputedStyle(e).getPropertyValue(k)]));
  const nodes=[...document.querySelectorAll('body *')].filter(e=>visible(e)&&!e.closest('.cm-editor')&&!['SVG','PATH','SCRIPT','STYLE'].includes(e.tagName.toUpperCase()));
  const elements=nodes.map(e=>({tag:e.tagName,role:e.getAttribute('role'),label:e.getAttribute('aria-label'),text:(e.textContent||'').trim().replace(/\s+/g,' ').slice(0,100),class:e.className,attributes:Object.fromEntries([...e.attributes].filter(a=>a.name.startsWith('data-')).map(a=>[a.name,a.value])),style:style(e)}));
  const names=new Set();for(const e of [document.documentElement,document.body])for(const k of getComputedStyle(e))if(k.startsWith('--'))names.add(k);
  const roots=Object.fromEntries(['html','body'].map(sel=>[sel,Object.fromEntries([...names].sort().map(k=>[k,getComputedStyle(document.querySelector(sel)).getPropertyValue(k).trim()]))]));
  return {elements,roots,htmlAttributes:Object.fromEntries([...document.documentElement.attributes].map(a=>[a.name,a.value]))};
 },properties);
 await page.screenshot({path:path.join(out,'tokens-shots',`${theme}-${name}.png`)});
 sample.focus=[];
 for(let i=0;i<8;i++){await page.keyboard.press('Tab');sample.focus.push(await page.evaluate(props=>{const e=document.activeElement;return {tag:e.tagName,text:e.textContent?.trim().slice(0,70),label:e.getAttribute('aria-label'),focusVisible:e.matches(':focus-visible'),style:Object.fromEntries(props.map(k=>[k,getComputedStyle(e).getPropertyValue(k)]))}},properties));}
 data.surfaces[name]=sample;
 }
 await capture('shell-themes-frame');
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:/^Frame/}).click();
 await capture('frame');
 await page.getByText('64',{exact:true}).last().dblclick();
 await capture('frame-number');await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Settings',exact:true}).click();
 await page.getByRole('button',{name:'Appearance',exact:true}).click();
 await capture('settings-appearance');
 await page.getByRole('button',{name:'Experiments',exact:true}).last().click();
 await capture('settings-experiments');
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'More ways to export',exact:true}).click();
 await capture('export');await page.keyboard.press('Escape');
 await page.keyboard.press('Meta+k');
 await capture('commands');await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Settings',exact:true}).hover();await page.waitForTimeout(1400);
 if(await page.getByRole('tooltip').count())await capture('tooltip');else result.gaps.push(`${theme}: no role=tooltip appeared after Settings hover; title/native tooltips cannot be read with getComputedStyle`);
 await page.close();
}
}finally{await browser.close()}
}
result.clusters={};
for(const [theme,data]of Object.entries(result.themes))for(const [surface,sample]of Object.entries(data.surfaces))for(const [index,e]of sample.elements.entries())for(const [property,value]of Object.entries(e.style)){
 const category=({'background-color':'surfaces','color':'text','border-radius':'radii','padding':'spacing','gap':'spacing','height':'heights','box-shadow':'shadows','outline':'focus','transition-duration':'durations','transition-timing-function':'easings'})[property]|| (property.startsWith('font')||property==='line-height'||property==='letter-spacing'?'typography':'borders');
 const group=result.clusters[category]??={};const token=group[`${property}=${value}`]??={property,value,label:'measured',themes:[],count:0,examples:[]};token.count++;if(!token.themes.includes(theme))token.themes.push(theme);if(token.examples.length<4)token.examples.push({theme,surface,index,text:e.text});
}
await writeFile(path.join(out,'tokens.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({surfaces:Object.fromEntries(Object.entries(result.themes).map(([k,v])=>[k,Object.keys(v.surfaces)])),gaps:result.gaps}));
const {default:vm}=await import('node:vm');
const polished=require('polished');
const kitRoot=path.resolve(out,'../../..');
const kitThemes={};
const isLight=x=>{const c=polished.parseToRgb(x);return (c.red*299+c.green*587+c.blue*114)/1000>=128};
const context={...polished,contract:{},tokens:{},getActiveColor:x=>polished.darken(isLight(x)?0.1:0.05,x),getHoverColor:x=>isLight(x)?polished.darken(0.05,x):polished.lighten(0.05,x),getLightVariant:x=>{const c=polished.parseToHsl(x),bright=polished.getLuminance(x)>0.6;return polished.toColorString({hue:c.hue,saturation:c.saturation*(bright?0.8:0.45),lightness:0.95-c.lightness*(bright?0.03:0.06)})},createGlobalTheme:(selector,...args)=>{if(selector!==':root')kitThemes[selector.includes('dark')?'dark':'light']=args.at(-1)}};
let code=await readFile(path.join(kitRoot,'packages/kit/src/foundation/themes.css.ts'),'utf8');
code=code.replace(/^import[\s\S]*?;\n/gm,'').replaceAll('export ','').replaceAll(' as const','');vm.runInNewContext(code,context);
result.sources={label:'read',codeimageRef:'origin/main',files:{}};
for(const file of ['DESIGN.md','docs/modernization/audit.md','packages/ui/src/lib/theme/theme.css.ts','packages/ui/src/lib/themes/dark-theme.css.ts','packages/ui/src/lib/themes/light-theme.css.ts','packages/ui/src/lib/tokens/createCodeImageTheme.ts','packages/ui/src/lib/theme/spacing.ts'])result.sources.files[file]=execFileSync('git',['-C',process.env.CODEIMAGE_REPO||'/Users/riccardoperra/WebstormProjects/codeimage','show',`origin/main:${file}`],{encoding:'utf8'});
result.kit={label:'read',themes:kitThemes,contract:await readFile(path.join(kitRoot,'packages/kit/src/foundation/contract.css.ts'),'utf8'),static:await readFile(path.join(kitRoot,'packages/kit/src/foundation/tokens.ts'),'utf8'),sizes:await readFile(path.join(kitRoot,'packages/kit/src/foundation/sizes.ts'),'utf8')};
const mapping={background:'background',foreground:'baseText',brand:'button-primary-backgroundColor',brandAccentHover:'button-primary-hoverColor',brandAccentActive:'button-primary-activeColor',brandSecondary:'button-base-backgroundColor',brandSecondaryAccentHover:'button-base-hoverColor',brandSecondaryAccentActive:'button-base-activeColor',brandSoft:'button-primaryAlt-backgroundColor',brandSoftAccentHover:'button-primaryAlt-hoverColor',critical:'button-danger-backgroundColor',criticalAccentHover:'button-danger-hoverColor',criticalAccentActive:'button-danger-activeColor',formAccent:'input-backgroundColor',formAccentBorder:'input-borderColor',separator:'divider',dropdownBackground:'listBox-panelBackground',dropdownItemTextColor:'listBox-textColor',dropdownItemHoverBackground:'listBox-hoverBackgroundColor',dialogBackground:'dialog-panelBackgroundColor',dialogBoxShadow:'dialog-panelShadow',dialogTextColor:'dialog-panelTextColor',dialogOverlayBackground:'dialog-overlayBackgroundColor'};
const root=t=>result.themes[t].surfaces['shell-themes-frame'].roots.html;
const ciNames=Object.keys(root('dark')).filter(k=>k.includes('__1608oq')).map(k=>k.slice(2).split('__')[0]);
const value=(theme,name)=>Object.entries(root(theme)).find(([k])=>k.startsWith(`--${name}__1608oq`))?.[1];
const normBrowser=await chromium.launch();const np=await normBrowser.newPage();
async function normalize(v){return np.evaluate(v=>{const e=document.createElement('div');document.body.append(e);e.style.color=v;if(e.style.color){const c=getComputedStyle(e).color;e.remove();return c}e.remove();return v.replace(/\s/g,'')},v)}
result.diff=[];
for(const name of Object.keys(kitThemes.dark)){
 const ci=mapping[name];const row={token:name,previewToken:ci||null,label:'inferred',kitLabel:'read',previewLabel:'measured',dark:{kit:kitThemes.dark[name],preview:ci?value('dark',ci):null},light:{kit:kitThemes.light[name],preview:ci?value('light',ci):null}};
 row.status=ci?(await normalize(row.dark.kit)===await normalize(row.dark.preview)&&await normalize(row.light.kit)===await normalize(row.light.preview)?'same':'different'):'only-kit';result.diff.push(row);
}
for(const name of ciNames)if(!Object.values(mapping).includes(name))result.diff.push({token:name,status:'only-preview',label:'inferred',previewLabel:'measured',dark:{preview:value('dark',name)},light:{preview:value('light',name)}});
await normBrowser.close();
result.semanticTokens=ciNames.map(name=>({token:name,dark:value('dark',name),light:value('light',name),source:'html computed custom property',label:'measured'}));
result.counts=Object.fromEntries(['same','different','only-preview','only-kit'].map(s=>[s,result.diff.filter(r=>r.status===s).length]));
result.gaps=result.gaps.filter(g=>g.includes('no role=tooltip'));
result.gaps.push('Raw DOM sampling includes elements outside overflow-clipped accordion content. Use dedicated frame and frame-number views for Frame, and the named visible overlay for overlay interpretation. Ancestor containers and code-theme miniature colours remain in frequency clusters; those frequencies are observations, not proposed semantic tokens.','Keyboard Tab sampling covers eight successive focus stops per view, not every control. Range thumb and track pseudo-elements are not captured. Native tooltip contents, hover/pressed states, animation keyframes, and OS focus rendering are not exhaustively measured.','Theme attributes are switched directly. Appearance radio selection retains its initial app state. The screenshots prove CSS theme rendering, not persisted colour-mode preference.','The preview build has no verified source SHA. Source cross-check uses the existing origin/main ref without fetching. Semantic mapping between differently named contracts is inferred. Only-kit means no mapped CodeImage semantic role, not absence of that colour in the rendered application.');
const esc=x=>String(x??'—').replaceAll('|','\\|').replaceAll('\n',' ');
let md='# CodeImage token extraction\n\nPhase 0 raw material for making @codeui/kit cover CodeImage and reusable Solid UI. No product code changes.\n\n## Method\n\nPlaywright Chromium, 1440 × 900, dark and light at '+result.url+'. Captured '+result.capturedAt+'. Each view stores DOM samples, computed styles, eight keyboard Tab focus samples, and computed custom properties on html and body. CSS custom properties on :root are included through html. Values labelled measured come from getComputedStyle. Values labelled read come from source. Role mappings and scale interpretations are inferred.\n\nRerun with `npm install --prefix /private/tmp/claude-501/kit-tokens playwright polished`, then `node docs/kit-2026/phase-0/tools/extract-tokens.mjs`. PLAYWRIGHT_HOME can select another external install directory. No repo dependency changes are needed.\n\nThe JSON separates semanticTokens, clusters, raw themes, source text, and diff. Clusters group exact property values with counts and sample references. They include artwork and layout dimensions, so they are raw observations rather than a recommended public contract.\n\n## Source cross-check\n\nRead DESIGN.md spacing and size table declares 8px page inset and header gap, 36px desktop header, 36–40px control rows, and 12–16px island padding. Its motion rule declares cubic-bezier(0.23, 1, 0.32, 1), usually 120–260ms. Source label is read.\n\nRead UI-02 confirms two token systems. packages/ui/src/lib/tokens/createCodeImageTheme.ts targets data-codeimage-theme. Kit foundation/themes.css.ts targets data-cui-theme. Both attributes are measured on html. The checked-in CodeImage dark background is #1d1d1d and panel background #111111. Deployment measures #0f0f10 and #151516. Do not substitute source values for live measurements. Full source text is retained in JSON.\n\n## Semantic token table\n\n| Token | Dark | Light | Source | Label |\n| --- | --- | --- | --- | --- |\n';
for(const r of result.semanticTokens)md+=`| ${r.token} | ${esc(r.dark)} | ${esc(r.light)} | ${r.source} | ${r.label} |\n`;
md+='\n## Measured scales\n\nThese are exact observed value sets, separated by property. Inclusion in a shared scale is inferred. Transparent backgrounds and inherited border colours do not establish a semantic surface or hairline.\n\n| Token | Dark | Light | Source | Label |\n| --- | --- | --- | --- | --- |\n';
for(const property of ['border-radius','padding','gap','font-family','font-size','font-weight','line-height','letter-spacing','transition-duration','transition-timing-function','box-shadow']){
 const values=t=>[...new Set(Object.values(result.clusters).flatMap(g=>Object.values(g)).filter(r=>r.property===property&&r.themes.includes(t)).map(r=>r.value))].join('; ');
 md+=`| ${property} | ${esc(values('dark'))} | ${esc(values('light'))} | DOM clusters | measured |\n`;
}
md+='\n## Diff against kit semantic contract\n\nCounts apply to semantic role pairs, once across both modes. Same requires equal normalized colours in both modes. All mappings are inferred. Kit values are read locally. Preview values are measured custom properties. Only-preview and only-kit mean no mapping in this table. Static scale tokens are compared separately below.\n\n'+Object.entries(result.counts).map(([k,v])=>`${k} = ${v}`).join(', ')+'.\n\n| Kit token | Preview role | Dark preview / kit | Light preview / kit | Status |\n| --- | --- | --- | --- | --- |\n';
for(const r of result.diff)md+=`| ${r.token} | ${r.previewToken|| (r.status==='only-preview'?r.token:'none')} | ${esc(r.dark.preview)} / ${esc(r.dark.kit)} | ${esc(r.light.preview)} / ${esc(r.light.kit)} | ${r.status} |\n`;
md+='\n## Gaps\n\n'+result.gaps.map(g=>'- '+g).join('\n')+'\n';
await writeFile(path.join(out,'tokens.json'),JSON.stringify(result,null,2)+'\n');await writeFile(path.join(out,'tokens.md'),md);console.log(result.counts);
const controls=[['ghost','shell-themes-frame',e=>e.tag==='BUTTON'&&e.label==='Settings'],['export primary','shell-themes-frame',e=>e.tag==='BUTTON'&&e.text==='Export'],['split arrow','shell-themes-frame',e=>e.tag==='BUTTON'&&e.label==='More ways to export'],['theme card','shell-themes-frame',e=>e.attributes['data-theme-option']==='fleetDark'],['theme search','shell-themes-frame',e=>e.label==='Search themes'],['theme segmented item','shell-themes-frame',e=>e.role==='tab'&&e.text==='All'],['frame row','frame',e=>e.tag==='LABEL'&&e.text==='Padding'],['radius segmented','frame',e=>e.role==='tab'&&e.text==='8'],['slider','frame',e=>String(e.class).includes('RangeField_range__')],['select row','frame',e=>e.tag==='BUTTON'&&e.text.includes('Free size')],['settings dialog','settings-appearance',e=>e.role==='dialog'],['nav active','settings-appearance',e=>e.attributes['data-settings-section']==='appearance'],['nav idle','settings-appearance',e=>e.attributes['data-settings-section']==='general'],['selected option card','settings-appearance',e=>e.tag==='LABEL'&&e.text.startsWith('DarkDefault')],['idle option card','settings-appearance',e=>e.tag==='LABEL'&&e.text.startsWith('LightBright')],['default badge','settings-appearance',e=>e.text==='Default'],['settings search','settings-appearance',e=>e.label==='Search settings'],['export panel','export',e=>e.role==='dialog'],['command panel','commands',e=>e.role==='dialog']];
result.controlTokens=controls.map(([token,surface,test])=>({token,surface,label:'measured',dark:result.themes.dark.surfaces[surface].elements.find(test)?.style??null,light:result.themes.light.surfaces[surface].elements.find(test)?.style??null}));
let extra='\n## Control measurements\n\nEvery row below is measured. JSON controlTokens contains all requested CSS properties for each matched node. Missing nodes are null. Colour-mode selected and idle labels refer to retained radio state during direct CSS switching.\n\n| Token | Dark | Light | Source | Label |\n| --- | --- | --- | --- | --- |\n';
for(const r of result.controlTokens){const fmt=s=>s?`bg ${s['background-color']}; text ${s.color}; radius ${s['border-radius']}; height ${s.height}; padding ${s.padding}`:'not matched';extra+=`| ${r.token} | ${esc(fmt(r.dark))} | ${esc(fmt(r.light))} | ${r.surface} | measured |\n`;}
extra+='\n## Static scale diff\n\nThese comparisons are inferred from measured controls and read kit foundation/tokens.ts and sizes.ts. They are separate from the semantic colour-contract counts.\n\n| Role | Preview | Kit | Status |\n| --- | --- | --- | --- |\n| Header control height | 36px | sm 36px | same |\n| Header type | 14px | sm 0.875rem = 14px at 16px root | same |\n| Search radius | 9px | sm 9px | same |\n| Segmented item radius | 7px | xs 7px | same |\n| Theme card radius | 16px | no 16px radius, md 12px and lg 14px | only-preview |\n| Theme card type | 13px | xs 12.8px and sm 14px | only-preview |\n| Segmented item height | 28px | minimum xs 30px | different |\n| Spacing | observed 4, 8, 12, 16px | spacing 1, 2, 3, 4 | same |\n| Motion curve | cubic-bezier(0.23, 1, 0.32, 1) on new controls | no easing token | only-preview |\n| Motion duration | 0.12s on new controls, legacy lists include 0.2s and 0.15s | no duration token | only-preview |\n| Settings keyboard outline | 2px solid primary, offset in raw focus samples | boxShadow.outline is 3px rgba(66,153,225,.5) | different |\n\nThese are role comparisons, not a claim that every observed dimension is a reusable token. Control heights, typography, shadows, borders, and focus samples remain available in full in JSON.\n';
extra+='\n## Largest drifts\n\n1. Surface hierarchy is inferred to differ. Measured CodeImage background is #0f0f10 dark and #f7fafc light, against read kit #000 and #fff. The measured dark island token is #151516.\n2. Accent roles are inferred to differ. Measured CodeImage primary button token is #0099ff in both modes, against read kit brand #0072f5. The measured dark general primary token is a third colour, #63b3ed.\n3. Overlay depth is inferred to differ. Measured CodeImage dialog shadow uses a 30px dark blur plus inset edge, against the read kit 10px dark dropdown-style shadow. The light CodeImage shadow has two layers with 15px and 6px blur.\n';
await writeFile(path.join(out,'tokens.md'),md+extra);await writeFile(path.join(out,'tokens.json'),JSON.stringify(result,null,2)+'\n');
