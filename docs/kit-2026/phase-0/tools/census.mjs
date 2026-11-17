#!/usr/bin/env node
// UI import census of CodeImage at a git ref, read through git only (no checkout, no writes).
// Usage: node census.mjs [--repo ~/WebstormProjects/codeimage] [--ref origin/main] [--kit <codeui>/packages/kit/src/index.tsx] > census.json

import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const repo = (args.repo ?? '~/WebstormProjects/codeimage').replace(/^~/, homedir());
const ref = args.ref ?? 'origin/main';
const kitIndex = args.kit ?? fileURLToPath(new URL('../../../../packages/kit/src/index.tsx', import.meta.url));

// Order matters: the first match wins.
const LIBRARIES = [
  ['@codeui/kit', (s) => s === '@codeui/kit' || s.startsWith('@codeui/kit/')],
  ['@codeimage/ui', (s) => s === '@codeimage/ui' || s.startsWith('@codeimage/ui/')],
  ['solid-headless', (s) => s === 'solid-headless' || s.startsWith('solid-headless/')],
  ['@kobalte/core', (s) => s === '@kobalte/core' || s.startsWith('@kobalte/core/')],
  ['@kobalte/utils', (s) => s.startsWith('@kobalte/utils')],
  ['@kobalte/vanilla-extract', (s) => s.startsWith('@kobalte/vanilla-extract')],
  ['solid-toast', (s) => s.startsWith('solid-toast')],
  ['@floating-ui', (s) => s.startsWith('@floating-ui/')],
  ['@thisbeyond/solid-dnd', (s) => s.startsWith('@thisbeyond/solid-dnd')],
  ['@solid-aria', (s) => s.startsWith('@solid-aria/')],
  ['@corvu', (s) => s.startsWith('@corvu/')],
  ['motion', (s) => s === 'motion' || s.startsWith('motion/') || s.startsWith('solid-motionone') || s.startsWith('@motionone/')],
];

// App-local component roots. Imports resolving here are counted per component folder/file.
const APP_SRC = 'apps/codeimage/src';
const LOCAL_ROOTS = [`${APP_SRC}/ui`, `${APP_SRC}/components`, `${APP_SRC}/pages/UnifiedEditor`];
// Aliases from apps/codeimage/tsconfig.json; apps/website maps `~/` elsewhere, so aliases apply to app files only.
const ALIASES = [['@ui/', `${APP_SRC}/ui/`], ['@core/', `${APP_SRC}/core/`]];

const git = (...a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', maxBuffer: 1 << 28 });

const commit = git('rev-parse', ref).trim();
const files = git('ls-tree', '-r', '--format=%(objectname) %(path)', commit, '--', 'apps', 'packages')
  .split('\n')
  .filter(Boolean)
  .map((l) => ({ oid: l.slice(0, 40), path: l.slice(41) }))
  .filter((f) => /\.(tsx?|mts)$/.test(f.path) && !f.path.includes('node_modules') && !f.path.endsWith('.d.ts'));

function readBlobs(list) {
  const out = execFileSync('git', ['-C', repo, 'cat-file', '--batch'], {
    input: list.map((f) => f.oid).join('\n') + '\n',
    maxBuffer: 1 << 30,
  });
  const blobs = new Map();
  let pos = 0;
  for (const f of list) {
    const nl = out.indexOf(10, pos);
    const size = Number(out.subarray(pos, nl).toString().split(' ')[2]);
    blobs.set(f.path, out.subarray(nl + 1, nl + 1 + size).toString('utf8'));
    pos = nl + 1 + size + 1;
  }
  return blobs;
}

// The clause excludes quotes and semicolons so a side-effect import cannot swallow the next statement.
const IMPORT_RE = /^\s*(import|export)\s+(type\s+)?([^;'"]*?)\s*from\s*['"]([^'"]+)['"]/gm;
const SIDE_EFFECT_RE = /^\s*import\s+['"]([^'"]+)['"]/gm;

function parseSpecifiers(clause) {
  const out = [];
  const named = clause.match(/\{([\s\S]*)\}/);
  const rest = clause.replace(/\{[\s\S]*\}/, '').replace(/,/g, ' ').trim();
  const ns = rest.match(/\*\s+as\s+(\w+)/);
  if (ns) out.push(`* as ${ns[1]}`);
  else if (rest === '*') out.push('*');
  const def = rest.replace(/\*\s+as\s+\w+/, '').trim();
  if (def) out.push('default');
  if (named) {
    for (const raw of named[1].split(',')) {
      const s = raw.replace(/\/\/.*$/gm, '').replace(/^\s*type\s+/, '').trim();
      if (s) out.push(s.split(/\s+as\s+/)[0].trim());
    }
  }
  return out;
}

function resolveLocal(from, spec) {
  let target = null;
  if (spec.startsWith('.')) target = path.posix.normalize(path.posix.join(path.posix.dirname(from), spec));
  else if (from.startsWith('apps/codeimage/')) for (const [a, p] of ALIASES) if (spec.startsWith(a)) target = p + spec.slice(a.length);
  if (!target) return null;
  const root = LOCAL_ROOTS.find((r) => target === r || target.startsWith(r + '/'));
  if (!root) return null;
  if (from.startsWith(root + '/') && root.endsWith('UnifiedEditor') === false) {
    const ownFolder = from.slice(root.length + 1).split('/')[0];
    if (target.slice(root.length + 1).split('/')[0] === ownFolder) return null;
  }
  return target.replace(/\.(tsx?|css\.ts)$/, '').replace(/\/index$/, '');
}

const blobs = readBlobs(files);
const libs = {};
const local = {};
const tsExpectErrors = [];

const bump = (bucket, key, sym, file) => {
  bucket[key] ??= { files: new Set(), symbols: {} };
  bucket[key].files.add(file);
  bucket[key].symbols[sym] ??= new Set();
  bucket[key].symbols[sym].add(file);
};

for (const [file, src] of blobs) {
  const seen = [];
  for (const m of src.matchAll(IMPORT_RE)) {
    seen.push({ spec: m[4], syms: parseSpecifiers(m[3]), reexport: m[1] === 'export' });
  }
  for (const m of src.matchAll(SIDE_EFFECT_RE)) seen.push({ spec: m[1], syms: ['(side effect)'] });
  for (const { spec, syms } of seen) {
    const lib = LIBRARIES.find(([, test]) => test(spec));
    if (lib) {
      const subpath = spec === lib[0] ? '' : spec.slice(lib[0].length).replace(/^\//, '');
      for (const s of syms) bump(libs, lib[0], subpath ? `${subpath}:${s}` : s, file);
      continue;
    }
    const target = resolveLocal(file, spec);
    if (target && !target.endsWith('.css')) {
      for (const s of syms.filter((x) => /^[A-Z]/.test(x) || x === 'default')) bump(local, target, s, file);
    }
  }
  if (seen.some((s) => s.spec.startsWith('@codeui/kit'))) {
    const lines = src.split('\n');
    lines.forEach((l, i) => {
      if (l.includes('@ts-expect-error') || l.includes('@ts-ignore'))
        tsExpectErrors.push({ file, line: i + 1, comment: l.trim(), next: (lines[i + 1] ?? '').trim() });
    });
  }
}

const zone = (f) =>
  f.startsWith(`${APP_SRC}/pages/UnifiedEditor/`) ? 'unifiedEditor'
  : f.startsWith('apps/codeimage/') ? 'appOther'
  : f.startsWith('packages/ui/') ? 'packagesUi'
  : 'other';

const serialize = (bucket) =>
  Object.fromEntries(
    Object.entries(bucket)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, { files: fs, symbols }]) => {
        const all = [...fs].sort();
        const byZone = {};
        for (const f of all) byZone[zone(f)] = (byZone[zone(f)] ?? 0) + 1;
        return [key, {
          importingFiles: all.length,
          byZone,
          symbols: Object.fromEntries(
            Object.entries(symbols)
              .sort(([, a], [, b]) => b.size - a.size)
              .map(([s, set]) => [s, { importingFiles: set.size, files: [...set].sort() }]),
          ),
        }];
      }),
  );

const kitExports = [...readFileSync(kitIndex, 'utf8').matchAll(/export\s+(?:type\s+)?(?:\*\s+as\s+(\w+)|\{([^}]*)\})/g)]
  .flatMap((m) => (m[1] ? [m[1]] : m[2].split(',').map((x) => x.replace(/^\s*type\s+/, '').trim().split(/\s+as\s+/).pop())))
  .filter(Boolean);
const usedKit = new Set(Object.keys(libs['@codeui/kit']?.symbols ?? {}));

process.stdout.write(JSON.stringify({
  repo: 'codeimage',
  ref,
  commit,
  scannedFiles: files.length,
  method: 'git ls-tree + git cat-file on apps/** and packages/** .ts/.tsx/.mts (no .d.ts); static import/export-from and side-effect imports',
  libraries: serialize(libs),
  localComponents: serialize(local),
  tsExpectErrorsInKitImporters: tsExpectErrors,
  kitExportsUnused: kitExports.filter((e) => !usedKit.has(e)),
}, null, 2) + '\n');
