import { dirname } from "node:path";
import { createRequire } from "node:module";
import { defineConfig, normalizePath, type Plugin } from "vite";
import solid from "@solidjs/vite-plugin";

// The standalone inspector is compiled against Solid 1. Keep its runtime
// local to the inspector when the Solid 2 plugin deduplicates app imports.
function inspectorRuntime(): Plugin {
	const require = createRequire(import.meta.url);
	const inspectorRequire = createRequire(
		require.resolve("prosemirror-inspector/standalone/production"),
	);
	const entries = new Map([
		["solid-js", inspectorRequire.resolve("solid-js/dist/solid.js")],
		["solid-js/web", inspectorRequire.resolve("solid-js/web/dist/web.js")],
	]);
	const runtimeDir = normalizePath(
		dirname(inspectorRequire.resolve("solid-js/package.json")),
	);
	return {
		name: "inspector-solid-runtime",
		enforce: "pre",
		resolveId(id, importer) {
			if (
				importer &&
				(importer.startsWith(runtimeDir) ||
					/\/(prosemirror-inspector|@tanstack\/devtools-utils)\//.test(importer))
			)
				return entries.get(id);
		},
	};
}

/** One HTML page per example. Add the folder name here and to `src/shared/examples.ts`. */
const pages = ["finance", "dashboard", "theme-studio", "inspector"];

export default defineConfig({
	// Relative, so the same build runs at `/` and under `/examples/` on the docs site.
	base: "./",
	plugins: [inspectorRuntime(), solid()],
	optimizeDeps: { exclude: ["prosemirror-inspector/standalone/production"] },
	server: { port: 6160 },
	preview: { port: 6160 },
	build: {
		rollupOptions: {
			input: {
				index: "index.html",
				...Object.fromEntries(pages.map(page => [page, `${page}/index.html`])),
			},
		},
	},
});
