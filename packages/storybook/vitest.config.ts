import { fileURLToPath } from "node:url";
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
							find: /^@codeui\/kit\/(.+)$/,
							replacement: fileURLToPath(new URL("../kit/src/parts/$1", import.meta.url)),
						},
					],
				},
				optimizeDeps: {
					include: [
						"@codeui/kit > @tanstack/solid-virtual",
						"@vanilla-extract/css/fileScope",
						"@vanilla-extract/css",
						"@codeui/kit > @vanilla-extract/dynamic",
						"@codeui/kit > @kobalte/vanilla-extract",
						"@codeui/kit > @maskito/kit",
						"@codeui/kit > @solid-primitives/pagination",
						"@codeui/kit > @solid-primitives/scheduled",
						"@codeui/kit > @vanilla-extract/recipes",
						"@codeui/kit > @maskito/core",
						"@codeui/kit > @radix-ui/colors",
					],
				},
				plugins: [
					storybookTest({
						configDir: fileURLToPath(new URL(".storybook", import.meta.url)),
					}),
				],
				test: {
					name: "stories",
					browser: {
						enabled: true,
						provider: "playwright",
						headless: true,
						instances: [{ browser: "chromium" }],
					},
				},
			},
		],
	},
});
