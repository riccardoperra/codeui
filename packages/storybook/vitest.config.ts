import { fileURLToPath } from "node:url";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

export default defineConfig({
	test: {
		projects: [
			{
				extends: "./vite.config.ts",
				resolve: {
					alias: [
						{
							find: "@codeui/kit/tokens",
							replacement: fileURLToPath(
								new URL("../kit/src/tokens.ts", import.meta.url),
							),
						},
						{
							find: /^@codeui\/kit\/([^/]+)\/parts$/,
							replacement: fileURLToPath(new URL("../kit/src/parts/$1", import.meta.url)),
						},
					],
				},
				plugins: [
					// storybook-solidjs-vite adds the Solid 1 `vite-plugin-solid` when the
					// config it receives has no plugin named "solid". Under Vitest it never
					// sees vite.config.ts, so drop it and keep @solidjs/vite-plugin from there.
					storybookTest({
						configDir: fileURLToPath(new URL(".storybook", import.meta.url)),
					}).then((plugins) => plugins.filter((plugin) => plugin?.name !== "solid")),
				],
				test: {
					name: "stories",
					browser: {
						enabled: true,
						provider: playwright(),
						headless: true,
						instances: [{ browser: "chromium" }],
					},
				},
			},
		],
	},
});
