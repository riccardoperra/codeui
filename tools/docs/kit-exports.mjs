import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const kit = path.join(root, 'packages/kit');

/**
 * Every public export of @codeui/kit, read from the emitted declarations of each
 * package.json export entry. Requires `pnpm build:kit` first.
 *
 * @returns {{ entry: string, symbol: string, kind: 'value' | 'type' }[]}
 */
export function listKitExports() {
	const manifest = JSON.parse(readFileSync(path.join(kit, 'package.json'), 'utf8'));
	const entries = Object.entries(manifest.exports)
		.filter(([, target]) => typeof target === 'object')
		.map(([entry, target]) => ({ entry, file: path.join(kit, target.import.types) }));
	const program = ts.createProgram(
		entries.map(e => e.file),
		{ noEmit: true, skipLibCheck: true, moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.Preserve },
	);
	const checker = program.getTypeChecker();
	const out = [];
	for (const { entry, file } of entries) {
		const source = program.getSourceFile(file);
		if (!source) throw new Error(`Missing declarations for ${entry}: ${file}. Run pnpm build:kit.`);
		const moduleSymbol = checker.getSymbolAtLocation(source);
		for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
			const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
			const kind = target.flags & ts.SymbolFlags.Value ? 'value' : 'type';
			out.push({ entry: entry === '.' ? '@codeui/kit' : `@codeui/kit/${entry.slice(2)}`, symbol: symbol.name, kind });
		}
	}
	return out.sort((a, b) => a.entry.localeCompare(b.entry) || a.symbol.localeCompare(b.symbol));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	for (const e of listKitExports()) console.log(`${e.entry}\t${e.kind}\t${e.symbol}`);
}
