import config from "../../configs/jest.config";
export default {
	...config,
	// test/*.hydration.test.tsx needs a hydratable build: jest.config.hydration.ts.
	testPathIgnorePatterns: [...(config.testPathIgnorePatterns ?? []), "hydration"],
	transform: {
		"\\.css\\.ts$": "@vanilla-extract/jest-transform",
		"^.+\\.tsx?$": "ts-jest",
		"^.+\\.m?jsx?$": ["babel-jest", { presets: ["@babel/preset-env"] }],
	},
	transformIgnorePatterns: [
		"node_modules/(?!\\.pnpm|@kobalte|@corvu|@solid-primitives|solid-presence|solid-prevent-scroll)",
	],
};
