// The examples are Solid apps built by `@codeui/examples` into static pages. This copies that build
// into `public/examples`, so the site serves each one at `/examples/<slug>/` with no React around it.
// The build's own index is left out: `/examples` is the gallery route of this site.
import { cpSync, existsSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const source = path.join(root, 'node_modules/@codeui/examples');
const target = path.join(root, 'public/examples');
const examples = JSON.parse(readFileSync(path.join(source, 'examples.json'), 'utf8'));

const missing = examples.filter(({ slug }) => !existsSync(path.join(source, 'dist', slug, 'index.html')));
if (missing.length) {
  console.error(
    `copy-examples: no build for ${missing.map((e) => e.slug).join(', ')}. Run \`pnpm turbo run build --filter=@codeui/examples...\` first.`,
  );
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
cpSync(path.join(source, 'dist'), target, { recursive: true, filter: (file) => file !== path.join(source, 'dist/index.html') });
console.log(`copy-examples: ${examples.length} examples in public/examples`);
