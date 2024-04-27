import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		solidPlugin(),
		vanillaExtractPlugin({
			unstable_mode: 'transform'
		}),
	],
	ssr: {
		noExternal: [
			"@kobalte/core",
			"@internationalized/message",
			"@formatjs/**",
			"@tanstack/solid-virtual",
		],
	},
});
