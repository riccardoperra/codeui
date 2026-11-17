import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

/** One HTML page per example. Add the folder name here and to `src/shared/examples.ts`. */
const pages = ["finance", "dashboard", "theme-studio", "inspector"];

export default defineConfig({
	// Relative, so the same build runs at `/` and under `/examples/` on the docs site.
	base: "./",
	plugins: [solid()],
	server: { port: 6160 },
	preview: { port: 6160 },
	build: {
		rollupOptions: {
			input: { index: "index.html", ...Object.fromEntries(pages.map(page => [page, `${page}/index.html`])) },
		},
	},
});
