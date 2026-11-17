import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
export default defineConfig({
	plugins: [solid({ ssr: true })],
	ssr: { noExternal: ["@codeui/kit"], resolve: { conditions: ["solid", "node"] } },
	build: { ssr: "entry.jsx", rollupOptions: { output: { entryFileNames: "entry.mjs" } } },
});
