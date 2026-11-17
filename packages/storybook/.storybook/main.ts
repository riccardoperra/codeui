import { createRequire } from "node:module";
import type { StorybookConfig } from "storybook-solidjs-vite";

import { dirname, join } from "path";
import { mergeConfig } from "vite";

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
	return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

	addons: [
		getAbsolutePath("@storybook/addon-links"),
		getAbsolutePath("@storybook/addon-docs"),
		getAbsolutePath("storybook-dark-mode"),
		getAbsolutePath("@storybook/addon-a11y"),
	],

	framework: {
		name: "storybook-solidjs-vite",
		options: { docgen: false },
	},

	async viteFinal(config) {
		// Merge custom configuration into the default config
		return mergeConfig(config, {
			// Add dependencies to pre-optimization
			optimizeDeps: {
				include: [
					"storybook-dark-mode",
					"@codeui/kit",
					"@kobalte/core",
					"@kobalte/utils",
					"@tanstack/solid-virtual",
				],
			},
		});
	},
};

export default config;
