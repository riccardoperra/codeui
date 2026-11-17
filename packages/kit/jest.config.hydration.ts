import config from "../../configs/jest.config";

const solid = "<rootDir>/../../node_modules/solid-js";

const presets = [
	"@babel/preset-env",
	["babel-preset-solid", { generate: "dom", hydratable: true }],
];

// Hydrates server HTML in jsdom. Solid's dev build throws on a hydration mismatch,
// so a component that builds a node the server did not render fails here.
export default {
	...config,
	testMatch: ["<rootDir>/test/**.hydration.test.tsx"],
	testPathIgnorePatterns: ["/node_modules/"],
	testEnvironmentOptions: { customExportConditions: ["solid", "browser", "development"] },
	moduleNameMapper: {
		"solid-js/web": `${solid}/web/dist/dev.cjs`,
		"solid-js/store": `${solid}/store/dist/dev.cjs`,
		"solid-js": `${solid}/dist/dev.cjs`,
	},
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{ tsconfig: "<rootDir>/tsconfig.json", babelConfig: { presets } },
		],
		"^.+\\.m?jsx?$": ["babel-jest", { presets }],
	},
	transformIgnorePatterns: [
		"node_modules/(?!\\.pnpm|@kobalte|@corvu|@solid-primitives|solid-presence|solid-prevent-scroll)",
	],
};
