import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "src/index.ts",
	format: "esm",
	platform: "neutral",
	target: "es2022",
	dts: true,
	banner: { js: '"use client";' },
	checks: { moduleLevelDirective: false },
	css: { fileName: "style.css", minify: true },
	deps: {
		alwaysBundle: [/^@codeui\/styles\/.*\.css$/],
	},
});
