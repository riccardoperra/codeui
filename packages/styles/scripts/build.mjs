import { readFile, writeFile, mkdir, rm, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { build } from "esbuild";
import { compile, processVanillaFile } from "@vanilla-extract/integration";
import { transform } from "lightningcss";
import { lintPlain } from "./plain-lint.mjs";
import { collectContracts } from "./contracts.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");
const compatibility = JSON.parse(
	await readFile(path.join(root, "compatibility.json"), "utf8"),
);
const registrySource = ts.transpileModule(
	await readFile(path.join(src, "registry.ts"), "utf8"),
	{ compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } },
).outputText;
const { publicStylesRegistry } = await import(
	"data:text/javascript;base64," + Buffer.from(registrySource).toString("base64")
);
if (
	JSON.stringify(publicStylesRegistry) !==
	JSON.stringify(
		JSON.parse(await readFile(path.join(root, "public-registry.json"), "utf8")),
	)
)
	throw new Error("Review and update the public registry snapshot.");
const registry = JSON.parse(await readFile(path.join(root, "entries.json"), "utf8"));
const out = path.join(root, "dist");
const normalize = value => value.split(path.sep).join("/");
const files = async dir =>
	(
		await Promise.all(
			(await readdir(dir, { withFileTypes: true })).map(async item =>
				item.isDirectory() ? files(path.join(dir, item.name)) : path.join(dir, item.name),
			),
		)
	)
		.flat()
		.sort();
const sourceFiles = (await files(src)).filter(file => file.endsWith(".ts"));
const cssFiles = sourceFiles.filter(
	file => file.endsWith(".css.ts") && !/\/(layer|motion|public)\.css\.ts$/.test(file),
);
const moduleId = file => normalize(path.relative(src, file)).replace(/\.ts$/, "");
const authoredName = file =>
	normalize(file)
		.replace(/^.*?src\//, "")
		.replace(/\.css\.ts$/, "")
		.split("/")
		.filter((part, index, all) => index === all.length - 1)
		.join("-")
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.toLowerCase();
const identifiers = ({ debugId, filePath, hash }) => {
	if (!debugId && !/components\/(Button|IconButton|Switch|Dialog)\//.test(filePath))
		throw new Error(
			`Unnamed style identifier in ${filePath}. Give every style, recipe, variable, and keyframe an explicit name.`,
		);
	return `cui-${authoredName(filePath)}-${debugId ?? hash}`.replace(
		/[^a-zA-Z0-9_-]/g,
		"-",
	);
};
const cssByScope = new Map();
const scopesByModule = new Map();
const compiled = new Map();
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const plainComponents = {
	Button: "button",
	IconButton: "icon-button",
	Switch: "switch",
	Dialog: "dialog",
};
await lintPlain(root);
for (const file of cssFiles) {
	const component = /components\/(Button|IconButton|Switch|Dialog)\/[^/]+\.css\.ts$/.exec(
		file,
	)?.[1];
	if (component && path.basename(file) === component + ".css.ts") {
		const scope = normalize(path.relative(src, file));
		const css = await readFile(
			path.join(src, "plain", plainComponents[component] + ".css"),
		);
		cssByScope.set(
			scope,
			transform({
				filename: scope,
				code: css,
				minify: false,
				targets: { chrome: 120 << 16 },
			}).code.toString(),
		);
		scopesByModule.set(moduleId(file) + ".ts", new Set([scope]));
		compiled.set(
			file,
			ts.transpileModule(await readFile(file, "utf8"), {
				compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
			}).outputText,
		);
		continue;
	}
	const scopes = new Set();
	const { source } = await compile({
		filePath: file,
		cwd: root,
		identOption: identifiers,
	});
	const code = await processVanillaFile({
		source,
		filePath: file,
		identOption: identifiers,
		serializeVirtualCssPath: ({ fileScope, source: css }) => {
			const scope = normalize(fileScope.filePath).replace(/^src\//, "");
			if (cssByScope.has(scope) && cssByScope.get(scope) !== css)
				throw new Error(`Non-deterministic CSS scope ${scope}`);
			cssByScope.set(scope, css);
			scopes.add(scope);
			return "";
		},
	});
	compiled.set(file, code);
	scopesByModule.set(moduleId(file) + ".ts", scopes);
}
const themeScopes = new Set(
	registry.theme.modules.flatMap(id => [...scopesByModule.get(id)]),
);
const componentClosure = (name, seen = new Set()) => {
	if (!registry[name]) throw new Error(`Unknown component dependency ${name}`);
	if (seen.has(name)) return seen;
	seen.add(name);
	for (const dependency of registry[name].dependencies)
		componentClosure(dependency, seen);
	return seen;
};
const manifest = { version: 1, layer: "cui", entries: {}, modules: {} };
for (const [id, scopes] of scopesByModule) manifest.modules[id] = [...scopes].sort();
for (const [name, entry] of Object.entries(registry)) {
	const components = [...componentClosure(name)];
	const scopes = new Set(
		components.flatMap(component =>
			registry[component].modules.flatMap(id => [...scopesByModule.get(id)]),
		),
	);
	if (name !== "theme") for (const scope of themeScopes) scopes.delete(scope);
	const orderedScopes = [...scopes].sort();
	await writeFile(
		path.join(out, `${name}.css`),
		"@layer cui;\n@layer cui.tokens, cui.base, cui.components;\n" +
			orderedScopes.map(scope => cssByScope.get(scope)).join("\n"),
	);
	manifest.entries[name] = {
		css: `${name}.css`,
		dependencies: entry.dependencies,
		components,
		scopes: orderedScopes,
	};
}
await writeFile(
	path.join(out, "all.css"),
	"@layer cui;\n@layer cui.tokens, cui.base, cui.components;\n" +
		[...cssByScope]
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([, css]) => css)
			.join("\n"),
);
const helperExports = async (entry, prefix) => {
	if (!entry.helpers) return "";
	const code = await readFile(path.join(src, entry.helpers), "utf8");
	const names = [...code.matchAll(/^export (const|type|interface) (\w+)/gm)].map(
		([, kind, name]) => `${kind === "const" ? "" : "type "}${name}`,
	);
	return `\nexport { ${names.join(", ")} } from "${prefix}${entry.helpers.replace(/\.ts$/, ".js")}";`;
};
const generated = path.join(out, ".entries");
await mkdir(generated, { recursive: true });
for (const [name, entry] of Object.entries(registry)) {
	const helper = await helperExports(entry, "../../src/");
	const exports =
		name === "theme"
			? 'export * from "../../src/foundation/index.ts";\n'
			: entry.modules.map(id => `export * from "../../src/${id}";`).join("\n") +
				helper.replace(/\.js"/g, '.ts"');
	await writeFile(path.join(generated, `${name}.ts`), exports);
}
await writeFile(
	path.join(generated, "tokens.ts"),
	'export * from "../../src/foundation/index.ts";\n',
);
await writeFile(
	path.join(generated, "index.ts"),
	Object.keys(registry)
		.filter(name => name !== "theme")
		.map(
			name =>
				`export * as ${name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())} from "./${name}.ts";`,
		)
		.join("\n") + '\nexport * from "./tokens.ts";\n',
);
const entryPoints = Object.fromEntries([
	...compatibility.map(id => [`internal/${id}`, path.join(src, `${id}.ts`)]),
	...(await files(generated)).map(file => [path.basename(file, ".ts"), file]),
]);
const extraction = {
	name: "compiled-vanilla-extract",
	setup(builder) {
		builder.onLoad({ filter: /\.css\.ts$/ }, ({ path: file }) => {
			const contents = compiled.get(file);
			if (contents === undefined)
				throw new Error(`Authoring-only style module leaked into runtime ${file}`);
			return { contents, loader: "js", resolveDir: path.dirname(file) };
		});
	},
};
for (const format of ["esm", "cjs"])
	await build({
		entryPoints,
		outdir: path.join(out, format),
		format,
		platform: "neutral",
		mainFields: ["module", "main"],
		absWorkingDir: root,
		bundle: true,
		splitting: format === "esm",
		outExtension: { ".js": format === "cjs" ? ".cjs" : ".js" },
		target: "es2020",
		define: { "process.env.NODE_ENV": '"production"' },
		minify: true,
		minifySyntax: true,
		minifyWhitespace: true,
		plugins: [extraction],
		logLevel: "warning",
	});
const program = ts.createProgram(sourceFiles, {
	target: ts.ScriptTarget.ESNext,
	module: ts.ModuleKind.ESNext,
	moduleResolution: ts.ModuleResolutionKind.NodeJs,
	strict: true,
	skipLibCheck: true,
	esModuleInterop: true,
	declaration: true,
	emitDeclarationOnly: true,
	rootDir: src,
	outDir: path.join(out, "types/internal"),
});
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length)
	throw new Error(
		ts.formatDiagnosticsWithColorAndContext(diagnostics, {
			getCurrentDirectory: () => root,
			getCanonicalFileName: value => value,
			getNewLine: () => "\n",
		}),
	);
program.emit(undefined, undefined, undefined, undefined, {
	afterDeclarations: [
		context => source => {
			const visit = node => {
				if (ts.isStringLiteral(node) && node.text.startsWith(".")) {
					const resolved = ts.resolveModuleName(
						node.text,
						source.fileName,
						program.getCompilerOptions(),
						ts.sys,
					).resolvedModule;
					if (resolved) {
						let relative = normalize(
							path.relative(path.dirname(source.fileName), resolved.resolvedFileName),
						).replace(/\.tsx?$/, ".js");
						if (!relative.startsWith(".")) relative = `./${relative}`;
						return context.factory.createStringLiteral(relative);
					}
				}
				return ts.visitEachChild(node, visit, context);
			};
			return ts.visitNode(source, visit);
		},
	],
});
for (const file of await files(path.join(out, "types/internal"))) {
	if (/\/(layer|motion|public)\.css\.d\.ts$/.test(file)) {
		await rm(file);
		continue;
	}
	const neutral = normalize(
		path.relative(path.dirname(file), path.join(out, "types/internal/types.js")),
	);
	const specifier = neutral.startsWith(".") ? neutral : `./${neutral}`;
	const text = (await readFile(file, "utf8")).replace(
		/(["'])@vanilla-extract\/(?:css|recipes)\1/g,
		JSON.stringify(specifier),
	);
	await writeFile(file, text);
}
for (const [name, entry] of Object.entries(registry))
	await writeFile(
		path.join(out, "types", `${name}.d.ts`),
		name === "theme"
			? 'export * from "./internal/foundation/index.js";\n'
			: entry.modules
					.map(id => `export * from "./internal/${id.replace(/\.ts$/, ".js")}";`)
					.join("\n") + (await helperExports(entry, "./internal/")),
	);
await writeFile(
	path.join(out, "types/tokens.d.ts"),
	'export * from "./internal/foundation/index.js";\n',
);
await writeFile(
	path.join(out, "types/index.d.ts"),
	Object.keys(registry)
		.filter(name => name !== "theme")
		.map(
			name =>
				`export * as ${name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())} from "./${name}.js";`,
		)
		.join("\n") + '\nexport * from "./tokens.js";\n',
);
// Keep the published declaration graph byte-for-byte compatible with #126.
// The authored metadata types are checked above; their source location is private.
for (const component of Object.keys(plainComponents)) {
	const stem = path.join(out, "types/internal/components", component, component + ".css");
	await writeFile(stem + ".d.ts", await readFile(stem + ".contract.d.ts"));
	await rm(stem + ".contract.d.ts");
}
for (const file of await files(path.join(out, "types"))) {
	const target = file
		.replace(`${path.sep}types${path.sep}`, `${path.sep}types-cjs${path.sep}`)
		.replace(/\.d\.ts$/, ".d.cts");
	await mkdir(path.dirname(target), { recursive: true });
	await writeFile(
		target,
		(await readFile(file, "utf8")).replace(/(["'])(\.[^"']*)\.js\1/g, "$1$2.cjs$1"),
	);
}
await writeFile(
	path.join(out, "public-registry.json"),
	await readFile(path.join(root, "public-registry.json")),
);
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const jsExport = name => ({
	import: { types: `./dist/types/${name}.d.ts`, default: `./dist/esm/${name}.js` },
	require: { types: `./dist/types-cjs/${name}.d.cts`, default: `./dist/cjs/${name}.cjs` },
});
pkg.exports = {
	".": jsExport("index"),
	"./tokens": jsExport("tokens"),
	"./manifest.json": "./dist/manifest.json",
	"./public-registry.json": "./dist/public-registry.json",
	"./contract.json": "./dist/contract.json",
	"./package.json": "./package.json",
};
for (const name of [...Object.keys(registry), "all"]) {
	pkg.exports[`./${name}.css`] = `./dist/${name}.css`;
	if (name !== "all") pkg.exports[`./${name}`] = jsExport(name);
}
for (const name of Object.keys(entryPoints).filter(name => name.startsWith("internal/")))
	pkg.exports[`./${name}`] = jsExport(name);
pkg.typesVersions = {
	"*": Object.fromEntries(
		Object.keys(pkg.exports)
			.filter(key => typeof pkg.exports[key] !== "string" && key !== ".")
			.map(key => [key.slice(2), [pkg.exports[key].import.types.slice(2)]]),
	),
};
pkg.main = "./dist/cjs/index.cjs";
pkg.module = "./dist/esm/index.js";
pkg.types = "./dist/types/index.d.ts";
await writeFile(path.join(root, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
await writeFile(
	path.join(out, "manifest.json"),
	JSON.stringify(manifest, null, 2) + "\n",
);
const contract = JSON.stringify(await collectContracts(out), null, 2) + "\n";
if (process.argv.includes("--update-contract"))
	await writeFile(path.join(root, "contract.json"), contract);
else if (contract !== (await readFile(path.join(root, "contract.json"), "utf8")))
	throw new Error(
		"Public CSS contract changed. Review the diff and rebuild with --update-contract.",
	);
await writeFile(path.join(out, "contract.json"), contract);
await rm(generated, { recursive: true });
console.log(
	`Built ${Object.keys(registry).length - 1} component styles and framework-neutral ESM/CJS helpers.`,
);
