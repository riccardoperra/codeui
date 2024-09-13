import withSolid from "rollup-preset-solid";
import ts from "typescript";

function tsTypes() {
	return {
		name: "ts",
		buildEnd() {
			const program = ts.createProgram(["./src/index.tsx"], {
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

			program.emit();
		},
	};
}

const config = withSolid({
	input: "src/index.tsx",
	targets: ["esm", "cjs"],
	output: [{ preserveModules: true, dir: "dist" }],
});

config.external = [...config.external,
	"solid-presence",
	"solid-prevent-scroll",
	/node_modules\/@kobalte/,
	/node_modules\/@floating-ui/,
	/node_modules\/@solid-primitives/,
	/node_modules\/@corvu/,

];

console.log(config);

if (Array.isArray(config.plugins)) {
	config.plugins = config.plugins.map(plugin => {
		if (plugin.name === "ts") {
			return tsTypes();
		}
		return plugin;
	});
}

export default config;
