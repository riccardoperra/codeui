import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { vanillaExtractPlugin } from "@codeimage/vanilla-extract";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [solidPlugin(), vanillaExtractPlugin(), tsconfigPaths()],
	base: "/",
	build: {
		target: "esnext",
		modulePreload: {
			polyfill: true,
		},
	},
});
