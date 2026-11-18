import withSolid from "rollup-preset-solid";
import ts from "typescript";
import path from "node:path";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";

const manifest = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const entries = Object.values(manifest.exports)
	.filter(entry => typeof entry === "object")
	.map(entry => entry.solid.default.replace("./dist/source/", "src/").replace(/\.js(x?)$/, ".ts$1"));

rmSync("dist", { recursive: true, force: true });

function tsTypes() {
	return {
		name: "ts",
		buildEnd() {
			const program = ts.createProgram(entries, {
				target: ts.ScriptTarget.ESNext,
				module: ts.ModuleKind.ESNext,
				moduleResolution: ts.ModuleResolutionKind.NodeJs,
				jsx: ts.JsxEmit.Preserve,
				jsxImportSource: "solid-js",
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

const config = withSolid({
	input: entries[0],
	targets: ["esm"],
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
});

// rollup-preset-solid accepts one input; the subpath entries are added afterwards.
config.input = entries;

config.external = [
	...config.external,
	/^@codeui\/styles(?:\/|$)/,
	"solid-presence",
	"solid-prevent-scroll",
	/node_modules\/@kobalte/,
	/node_modules\/@floating-ui/,
	/node_modules\/@solid-primitives/,
	/node_modules\/@corvu/,
];

if (Array.isArray(config.plugins)) {
	config.plugins = config.plugins.map(plugin => {
		if (plugin.name === "ts") {
			return tsTypes();
		}
		return plugin;
	});
}

export default config;
