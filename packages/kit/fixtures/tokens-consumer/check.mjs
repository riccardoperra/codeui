import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const kit = fileURLToPath(new URL('../../', import.meta.url));
const rootEntry = process.argv.includes('--root');
const directory = await mkdtemp(path.join(kit, '.tokens-consumer-'));
try {
  const fixture = await readFile(new URL('./consumer.css.ts', import.meta.url), 'utf8');
  await writeFile(path.join(directory, 'consumer.css.ts'), rootEntry ? fixture.replace('@codeui/kit/tokens', '@codeui/kit') : fixture);
  const output = await build({
    configFile: false,
    root: directory,
    logLevel: 'silent',
    plugins: [vanillaExtractPlugin()],
    build: {
      write: false,
      minify: false,
      lib: { entry: path.join(directory, 'consumer.css.ts'), formats: ['es'] },
    },
  });
  const files = (Array.isArray(output) ? output : [output]).flatMap(result => result.output);
  const css = files.filter(file => file.type === 'asset' && file.fileName.endsWith('.css')).map(file => file.source).join('\n');
  assert.match(css, /color: var\(--cui-text-default\)/);
  assert.match(css, /background: var\(--cui-surface-canvas\)/);
  assert.match(css, /padding: var\(--cui-space-2\)/);
  console.log(`${rootEntry ? '@codeui/kit' : '@codeui/kit/tokens'} consumer build passed`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
