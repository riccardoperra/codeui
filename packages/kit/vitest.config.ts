import solid from "@solidjs/vite-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const browser = () => ({
	enabled: true,
	provider: playwright(),
	headless: true,
	instances: [{ browser: "chromium" as const }],
});

export default defineConfig({
	test: {
		projects: [
			{
				plugins: [solid()],
				test: {
					name: "browser",
					globals: true,
					include: ["test/**/*.test.{ts,tsx}"],
					exclude: ["test/**/*.ssr.test.tsx", "test/**/*.hydration.test.tsx"],
					setupFiles: ["./test/setup.browser.ts"],
					browser: browser(),
				},
			},
			{
				plugins: [solid({ solid: { hydratable: true } })],
				test: {
					name: "ssr",
					globals: true,
					environment: "node",
					include: ["test/**/*.ssr.test.tsx"],
				},
			},
			{
				plugins: [solid({ solid: { hydratable: true } })],
				test: {
					name: "hydration",
					globals: true,
					include: ["test/**/*.hydration.test.tsx"],
					setupFiles: ["./test/setup.browser.ts"],
					browser: browser(),
				},
			},
		],
	},
});
