import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [tsconfigPaths(), solidPlugin()],
	ssr: {
		noExternal: [
			"@kobalte/core",
			"@internationalized/message",
			"@formatjs/**",
			"@tanstack/solid-virtual",
		],
	},
});
