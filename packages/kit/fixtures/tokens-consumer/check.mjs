import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { build } from "vite";
import ts from "typescript";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

const kit = fileURLToPath(new URL("../../", import.meta.url));
for (const format of ["source", "esm"]) {
	const pending = [path.join(kit, "dist", format, "tokens.js")];
	const visited = new Set();
	while (pending.length) {
		const file = pending.pop();
		if (visited.has(file)) continue;
		visited.add(file);
		const source = await readFile(file, "utf8");
		for (const { fileName: specifier } of ts.preProcessFile(source).importedFiles) {
			assert.doesNotMatch(
				specifier,
				/solid-js|@solidjs\/web|@kobalte/,
				`${file} imports component code`,
			);
			if (specifier.startsWith(".")) {
				const resolved = ts.resolveModuleName(
					specifier,
					file,
					{
						allowJs: true,
						moduleResolution: ts.ModuleResolutionKind.NodeJs,
					},
					ts.sys,
				).resolvedModule;
				assert.ok(resolved, `Cannot resolve ${specifier} from ${file}`);
				pending.push(resolved.resolvedFileName);
			}
		}
	}
}
const solid = process.argv.includes("--solid");
const rootEntry = process.argv.includes("--root");
// Vanilla Extract evaluates styles in Node, including under the Solid condition.
const conditions = solid ? ["solid", "module", "node"] : ["module", "node"];
const directory = await mkdtemp(path.join(kit, ".tokens-consumer-"));
try {
	const fixture = await readFile(new URL("./consumer.css.ts", import.meta.url), "utf8");
	await writeFile(
		path.join(directory, "consumer.css.ts"),
		rootEntry ? fixture.replace("@codeui/kit/tokens", "@codeui/kit") : fixture,
	);
	const output = await build({
		configFile: false,
		root: directory,
		logLevel: "silent",
		resolve: { conditions },
		ssr: { resolve: { conditions } },
		plugins: [vanillaExtractPlugin()],
		build: {
			write: false,
			minify: false,
			lib: { entry: path.join(directory, "consumer.css.ts"), formats: ["es"] },
		},
	});
	const files = (Array.isArray(output) ? output : [output]).flatMap(
		result => result.output,
	);
	const css = files
		.filter(file => file.type === "asset" && file.fileName.endsWith(".css"))
		.map(file => file.source)
		.join("\n");
	assert.match(css, /color: var\(--cui-text-default\)/);
	assert.match(css, /background: var\(--cui-surface-canvas\)/);
	assert.match(css, /padding: var\(--cui-space-2\)/);
	console.log(
		`${rootEntry ? "@codeui/kit" : "@codeui/kit/tokens"} consumer build passed (${solid ? "solid" : "import"} condition)`,
	);
} finally {
	await rm(directory, { recursive: true, force: true });
}
