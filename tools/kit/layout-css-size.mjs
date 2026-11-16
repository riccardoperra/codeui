import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { launch, open } from '../baseline/browser.mjs';
const base = path.resolve('tools/baseline/storybook-static');
const server = createServer(async (req, res) => {
 try {
  const file = path.resolve(base, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(base + path.sep)) throw Error('path');
  const bytes = await readFile(file);
  res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(file)] || 'application/octet-stream');
  res.end(bytes);
 } catch { res.statusCode = 404; res.end(); }
});
await new Promise(resolve => server.listen(6106, '127.0.0.1', resolve));
const browser = await launch();
try {
 for (const name of ['stack', 'text']) {
  const opened = await open(browser, {id:`designsystem-${name}--variants`,type:'story'}, 'light');
  try {
   const result = await opened.page.evaluate(name => {
    const element = document.querySelector(`[data-cui="${name}-root"]`);
    if (!element) throw Error('Missing component');
    const classes = [...element.classList];
    function css() {
     const found = [];
     function visit(rules) {
      for (const rule of rules) {
       if (rule.selectorText && classes.some(c => rule.selectorText.includes(`.${c}`))) found.push(rule.cssText);
       else if (rule.cssRules) visit(rule.cssRules);
      }
     }
     for (const sheet of document.styleSheets) visit(sheet.cssRules);
     return found.join('\n');
    }
    const before = css();
    if (name === 'stack') {
     element.style.setProperty('--cui-space-future-gap', '37px');
     element.style.setProperty('--cui-stack-gap', 'var(--cui-space-future-gap)');
     element.setAttribute('data-gap', 'future-gap');
    }
    return {before,after:css(),gap:getComputedStyle(element).gap};
   }, name);
   assert(result.before.length > 0);
   assert.equal(result.before, result.after);
   if (name === 'stack') assert.equal(result.gap, '37px');
   console.log(`${name}: ${Buffer.byteLength(result.before)} bytes of emitted CSS rules (CSSOM serialization, UTF-8, uncompressed). Future gap adds 0 bytes.`);
  } finally { await opened.context.close(); }
 }
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
