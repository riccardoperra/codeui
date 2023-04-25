import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { vanillaExtractPlugin } from "@codeui/vanilla-extract";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [solidPlugin(), vanillaExtractPlugin(), tsconfigPaths()],
	base: "/",
	build: {
		target: "esnext",
		rollupOptions: {
			treeshake: false,
		},
		modulePreload: {
			polyfill: true,
		},
	},
});
