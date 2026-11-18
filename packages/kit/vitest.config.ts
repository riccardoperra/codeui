import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

const plugins = () => [solid({ solid: { hydratable: true } })];

export default defineConfig({
	test: {
		projects: [
			{
				plugins: plugins(),
				optimizeDeps: {
					include: ["solid-testing-library"],
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
				plugins: [solid({ ssr: true, solid: { hydratable: true } })],
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
					include: ["solid-testing-library"],
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
