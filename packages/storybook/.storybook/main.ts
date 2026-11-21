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
				// @codeui/kit resolves to JSX source under the "solid" condition, so
				// pre-bundle its plain JS dependencies instead of the kit itself.
				include: [
					"storybook-dark-mode",
					"@kobalte/utils",
					"@codeui/kit > clsx",
					"@codeui/kit > @maskito/core",
					"@codeui/kit > @maskito/kit",
					"@codeui/kit > @solid-primitives/controlled-signal",
					"@codeui/kit > @solid-primitives/pagination",
					"@codeui/kit > @solid-primitives/scheduled",
					"@codeui/kit > @solid-primitives/utils",
					"@codeui/kit > @tanstack/virtual-core",
				],
			},
		});
	},
};

export default config;
