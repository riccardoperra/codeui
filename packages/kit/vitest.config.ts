import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

const plugins = () => [
	solid({ solid: { hydratable: true } }),
	vanillaExtractPlugin({ unstable_mode: "transform" }),
];

export default defineConfig({
	test: {
		projects: [
			{
				plugins: plugins(),
				optimizeDeps: {
					include: [
						"solid-testing-library",
						"@vanilla-extract/css/fileScope",
						"@kobalte/vanilla-extract",
						"@vanilla-extract/css",
						"@vanilla-extract/recipes",
						"@radix-ui/colors",
					],
				},
				test: {
					name: "browser",
					globals: true,
					include: ["test/**/*.test.{ts,tsx}"],
					exclude: ["test/**/*.ssr.test.tsx", "test/**/*.hydration.test.tsx"],
					setupFiles: ["./test/setup.browser.ts"],
					browser: {
						enabled: true,
						provider: "playwright",
						headless: true,
						instances: [{ browser: "chromium" }],
					},
				},
			},
			{
				plugins: [
					solid({ ssr: true, solid: { hydratable: true } }),
					vanillaExtractPlugin({ unstable_mode: "transform" }),
				],
				resolve: { conditions: ["solid", "node"] },
				ssr: {
					resolve: { conditions: ["solid", "node"] },
					noExternal: [
						/@kobalte\//,
						/@solid-primitives\//,
						/solid-presence/,
						/solid-prevent-scroll/,
						/@corvu\//,
					],
				},
				test: {
					name: "ssr",
					globals: true,
					environment: "node",
					include: ["test/**/*.ssr.test.tsx"],
				},
			},
			{
				plugins: plugins(),
				optimizeDeps: {
					include: [
						"solid-testing-library",
						"@vanilla-extract/css/fileScope",
						"@kobalte/vanilla-extract",
						"@vanilla-extract/css",
						"@vanilla-extract/recipes",
						"@radix-ui/colors",
					],
				},
				test: {
					name: "hydration",
					globals: true,
					include: ["test/**/*.hydration.test.tsx"],
					setupFiles: ["./test/setup.browser.ts"],
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
