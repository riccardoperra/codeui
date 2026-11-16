import config from "../../configs/jest.config";
export default {
	...config,
	transform: {
		"\\.css\\.ts$": "@vanilla-extract/jest-transform",
		"^.+\\.tsx?$": "ts-jest",
		"^.+\\.m?jsx?$": ["babel-jest", { presets: ["@babel/preset-env"] }],
	},
	transformIgnorePatterns: [
		"node_modules/(?!\\.pnpm|@kobalte|@corvu|@solid-primitives|solid-presence|solid-prevent-scroll)",
	],
};
