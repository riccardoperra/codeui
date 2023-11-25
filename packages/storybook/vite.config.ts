import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		solidPlugin(),
		vanillaExtractPlugin({
			esbuildOptions: {
				external: ["solid-js/web", "solid-js"],
			},
		}),
	],
});
