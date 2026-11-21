import remapping from "@ampproject/remapping";
import { transform } from "@solidjs/compiler";
import ts from "typescript";
import path from "node:path";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";

const manifest = JSON.parse(
	readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);
const entries = Object.values(manifest.exports)
	.filter(entry => typeof entry === "object")
	.map(entry =>
		entry.solid.default.replace("./dist/source/", "src/").replace(/\.js(x?)$/, ".ts$1"),
	);

rmSync("dist", { recursive: true, force: true });

function tsTypes() {
	return {
		name: "ts",
		buildEnd() {
			const program = ts.createProgram(entries, {
				target: ts.ScriptTarget.ESNext,
				module: ts.ModuleKind.ESNext,
				moduleResolution: ts.ModuleResolutionKind.Bundler,
				jsx: ts.JsxEmit.Preserve,
				jsxImportSource: "@solidjs/web",
				allowSyntheticDefaultImports: true,
				esModuleInterop: true,
				outDir: `dist/source`,
				declarationDir: `dist/types`,
				declaration: true,
				allowJs: true,
				strict: true,
			});

			for (const commonjs of [false, true])
				program.emit(
					undefined,
					(file, text) => {
						if (commonjs) {
							if (!file.endsWith(".d.ts")) return;
							file = file
								.replace("dist/types/", "dist/types-cjs/")
								.replace(/\.d\.ts$/, ".d.cts");
						}
						mkdirSync(path.dirname(file), { recursive: true });
						writeFileSync(file, text);
					},
					undefined,
					undefined,
					{
						afterDeclarations: [
							context => source => {
								const visit = node => {
									if (
										ts.isImportDeclaration(node) &&
										!node.importClause &&
										ts.isStringLiteral(node.moduleSpecifier) &&
										node.moduleSpecifier.text.endsWith(".css")
									)
										return undefined;
									if (ts.isStringLiteral(node) && node.text.startsWith(".")) {
										const resolved = ts.resolveModuleName(
											node.text,
											source.fileName,
											program.getCompilerOptions(),
											ts.sys,
										).resolvedModule;
										if (resolved) {
											let relative = path
												.relative(
													path.dirname(source.fileName),
													resolved.resolvedFileName,
												)
												.replaceAll(path.sep, "/");
											relative = relative.replace(
												/\.(tsx?|jsx?)$/,
												commonjs ? ".cjs" : ".js",
											);
											return context.factory.createStringLiteral(
												relative.startsWith(".") ? relative : `./${relative}`,
											);
										}
									}
									return ts.visitEachChild(node, visit, context);
								};
								return ts.visitNode(source, visit);
							},
						],
					},
				);
		},
	};
}

const compilerOptions = {
	target: ts.ScriptTarget.ESNext,
	module: ts.ModuleKind.ESNext,
	verbatimModuleSyntax: false,
	sourceMap: true,
};

export default {
	input: entries,
	external: id => !id.startsWith(".") && !path.isAbsolute(id),
	plugins: [
		{
			name: "solid-library",
			resolveId(id, importer) {
				if (!importer || !id.startsWith(".")) return null;
				return (
					ts.resolveModuleName(
						id,
						importer,
						{
							moduleResolution: ts.ModuleResolutionKind.Bundler,
						},
						ts.sys,
					).resolvedModule?.resolvedFileName ?? null
				);
			},
			transform(code, id) {
				if (!/\.tsx?$/.test(id)) return null;
				const source = id.endsWith(".tsx")
					? transform(code, {
							filename: id,
							generate: "dom",
							hydratable: true,
							sourceMap: true,
						})
					: { code, map: undefined };
				const result = ts.transpileModule(source.code, { fileName: id, compilerOptions });
				const maps = [result.sourceMapText, source.map]
					.filter(Boolean)
					.map(map => JSON.parse(map));
				// The JSX transform keeps TypeScript syntax. Rollup needs the combined map.
				return {
					code: result.outputText,
					map: maps.length > 1 ? remapping(maps, () => null) : maps[0],
				};
			},
		},
		tsTypes(),
	],
	output: [
		{ format: "esm", preserveModules: true, preserveModulesRoot: "src", dir: "dist/esm" },
		{
			format: "cjs",
			preserveModules: true,
			preserveModulesRoot: "src",
			dir: "dist/cjs",
			entryFileNames: "[name].cjs",
		},
	],
};
