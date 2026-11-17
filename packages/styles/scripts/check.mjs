import assert from "node:assert/strict";
import { readFile, readdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import ts from "typescript";
import { collectContracts } from "./contracts.mjs";
import { checkRenderers } from "./renderers.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist");
const require = createRequire(import.meta.url);
const registry = JSON.parse(await readFile(path.join(root, "entries.json"), "utf8"));
const manifest = JSON.parse(await readFile(path.join(out, "manifest.json"), "utf8"));
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
checkRenderers(root, registry, manifest);
const walk = async dir =>
	(
		await Promise.all(
			(await readdir(dir, { withFileTypes: true })).map(item =>
				item.isDirectory() ? walk(path.join(dir, item.name)) : path.join(dir, item.name),
			),
		)
	).flat();
assert.deepEqual(pkg.sideEffects, ["**/*.css"]);
assert.equal(pkg.peerDependencies, undefined);
assert.deepEqual(Object.keys(pkg.dependencies), ["csstype"]);
const bannedCalls = new Set([
	"style",
	"globalStyle",
	"globalLayer",
	"createTheme",
	"createThemeContract",
	"createGlobalThemeContract",
	"createVar",
	"keyframes",
	"injectStyles",
	"setFileScope",
]);
for (const file of await walk(out)) {
	const text = await readFile(file, "utf8");
	if (file.endsWith(".css")) {
		assert(!text.includes("--kb-"), `${file} leaks engine geometry`);
		assert(
			text.startsWith("@layer cui;\n@layer cui.base, cui.components, cui.overrides;\n"),
		);
	}
	if (/\.d\.(ts|cts)$/.test(file))
		assert(
			!/@vanilla-extract|@kobalte|solid-js/.test(text),
			`${file} leaks framework or authoring types`,
		);
	if (!/\.(js|cjs)$/.test(file)) continue;
	const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
	const visit = node => {
		if (
			(ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
			node.moduleSpecifier
		)
			assert(
				node.moduleSpecifier.text.startsWith("."),
				`${file} has an external runtime import ${node.moduleSpecifier.text}`,
			);
		if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
			assert(
				!bannedCalls.has(node.expression.text),
				`${file} evaluates style authoring ${node.expression.text}`,
			);
			if (node.expression.text === "require" && ts.isStringLiteral(node.arguments[0]))
				assert(
					node.arguments[0].text.startsWith("."),
					`${file} has external require ${node.arguments[0].text}`,
				);
		}
		ts.forEachChild(node, visit);
	};
	visit(ast);
}
for (const [name, entry] of Object.entries(registry)) {
	const esm = await import(pathToFileURL(path.join(out, "esm", `${name}.js`)).href);
	const cjs = require(path.join(out, "cjs", `${name}.cjs`));
	assert.deepEqual(
		Object.keys(esm).sort(),
		Object.keys(cjs).sort(),
		`${name} differs between ESM and CJS`,
	);
	for (const [symbol, value] of Object.entries(esm)) {
		if (typeof value === "string") assert.equal(value, cjs[symbol]);
		if (typeof value === "function" && value.classNames) {
			assert.deepEqual(value.classNames, cjs[symbol].classNames);
			for (const group of value.variants())
				for (const variant of Object.keys(value.classNames.variants[group])) {
					const option = {
						[group]: variant === "true" ? true : variant === "false" ? false : variant,
					};
					assert.equal(value(option), cjs[symbol](option));
				}
		}
	}
	const expectedComponents = new Set();
	const add = component => {
		if (expectedComponents.has(component)) return;
		expectedComponents.add(component);
		registry[component].dependencies.forEach(add);
	};
	add(name);
	assert.deepEqual(new Set(manifest.entries[name].components), expectedComponents);
	const css = await readFile(path.join(out, `${name}.css`), "utf8");
	const expectedScopes = new Set(
		[...expectedComponents].flatMap(component =>
			registry[component].modules.flatMap(id => manifest.modules[id]),
		),
	);
	if (name !== "theme")
		for (const scope of manifest.entries.theme.scopes) expectedScopes.delete(scope);
	assert.deepEqual(
		new Set(manifest.entries[name].scopes),
		expectedScopes,
		`${name} CSS scopes differ from its dependency closure`,
	);
	for (const component of Object.keys(registry)) {
		if (component === "theme" || expectedComponents.has(component)) continue;
		const ownScopes = registry[component].modules;
		if (ownScopes.some(scope => expectedScopes.has(scope))) continue;
		const raw = await import(
			pathToFileURL(path.join(out, "esm", `${component}.js`)).href
		);
		for (const value of Object.values(raw)) {
			const base =
				typeof value === "function" && value.classNames
					? value.classNames.base
					: typeof value === "string"
						? value
						: "";
			for (const className of base.split(" ").filter(value => value.startsWith("cui-"))) {
				if (className.includes("Theme")) continue;
				assert(
					!css.includes(`.${className} {`),
					`${name} includes unrelated component ${component}`,
				);
			}
		}
	}
	if (name !== "theme")
		assert(!css.includes(":root {"), `${name} includes theme defaults`);
}
assert(!manifest.entries.button.components.includes("switch"));
assert(!manifest.entries.button.components.includes("dialog"));
assert(!manifest.entries.theme.scopes.some(scope => scope.startsWith("components/")));
const actualContract = JSON.stringify(await collectContracts(out), null, 2) + "\n";
assert.equal(
	actualContract,
	await readFile(path.join(root, "contract.json"), "utf8"),
	"Public CSS contract drifted.",
);
const fixture = path.join(out, ".check-types.ts");
try {
	await writeFile(
		fixture,
		Object.keys(registry)
			.map((name, index) => `import * as entry${index} from './types/${name}';`)
			.join("\n") +
			`
import { button } from './types/button';
import { dialogStyles, dialogThemeVars } from './types/dialog';
import { switchStyles } from './types/switch';
import { responsiveStyle } from './types/tokens';
import type { StyleRule as AuthoringStyleRule } from '@vanilla-extract/css';
button({ theme: 'primary', size: 'md' });
dialogStyles.panel({ size: 'settings', chrome: 'inset' });
switchStyles.control({ size: 'sm' });
const responsive: AuthoringStyleRule = responsiveStyle({
  xs: { ':hover': { color: 'red' }, display: ['-webkit-box', 'flex'], cursor: 'var(--cursor)' },
  md: { '@scope': { '(.card)': { color: 'red' } }, '@starting-style': { opacity: 0 } },
});
// @ts-expect-error Unknown size is not part of the public variant contract.
button({ size: 'huge' });
`,
	);
	const program = ts.createProgram([fixture], {
		noEmit: true,
		strict: true,
		skipLibCheck: false,
		target: ts.ScriptTarget.ESNext,
		moduleResolution: ts.ModuleResolutionKind.NodeJs,
	});
	const diagnostics = ts.getPreEmitDiagnostics(program);
	assert.equal(
		diagnostics.length,
		0,
		ts.formatDiagnosticsWithColorAndContext(diagnostics, {
			getCurrentDirectory: () => root,
			getCanonicalFileName: value => value,
			getNewLine: () => "\n",
		}),
	);
} finally {
	await rm(fixture, { force: true });
}
const nodeFixtures = [".check-exports.mts", ".check-exports.cts"].map(name =>
	path.join(out, name),
);
try {
	for (const fixture of nodeFixtures)
		await writeFile(
			fixture,
			`
import { button } from '@codeui/styles/button';
import { dialogStyles, dialogThemeVars } from '@codeui/styles/dialog';
import { styleFieldMessage } from '@codeui/styles/internal/components/Field/fieldStyle';
button({ theme: 'primary', size: 'md' });
dialogStyles.panel({ size: 'settings' });
styleFieldMessage({ xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' });
`,
		);
	const program = ts.createProgram(nodeFixtures, {
		noEmit: true,
		strict: true,
		skipLibCheck: false,
		target: ts.ScriptTarget.ESNext,
		module: ts.ModuleKind.NodeNext,
		moduleResolution: ts.ModuleResolutionKind.NodeNext,
	});
	const diagnostics = ts.getPreEmitDiagnostics(program);
	assert.equal(
		diagnostics.length,
		0,
		ts.formatDiagnosticsWithColorAndContext(diagnostics, {
			getCurrentDirectory: () => root,
			getCanonicalFileName: value => value,
			getNewLine: () => "\n",
		}),
	);
} finally {
	for (const fixture of nodeFixtures) await rm(fixture, { force: true });
}
console.log(
	`Verified ${Object.keys(registry).length - 1} component closures, neutral ESM/CJS imports, public types, and stable CSS contracts.`,
);
