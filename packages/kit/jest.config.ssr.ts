import config from "../../configs/jest.config.ssr";
export default {
	...config,
	setupFilesAfterEnv: [],
	testEnvironmentOptions: { customExportConditions: ["solid", "node"] },
	transform: {
		"\\.css\\.ts$": "@vanilla-extract/jest-transform",
		"^.+\\.tsx?$": "ts-jest",
		"^.+\\.m?jsx?$": [
			"babel-jest",
			{
				presets: [
					"@babel/preset-env",
					["babel-preset-solid", { generate: "ssr", hydratable: true }],
				],
			},
		],
	},
	transformIgnorePatterns: [
		"node_modules/(?!\\.pnpm|@kobalte|@corvu|@solid-primitives|solid-presence|solid-prevent-scroll)",
	],
};
