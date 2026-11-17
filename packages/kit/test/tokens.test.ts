import { readFileSync } from "node:fs";
import path from "node:path";
import { tokens } from "../src";
import { themeValues } from "../src/foundation/theme-values";

interface DesignToken {
	token: string;
	css: string;
	dark: string;
	light: string;
}

const design: { tokens: DesignToken[] } = JSON.parse(
	readFileSync(
		path.resolve(__dirname, "../../../docs/kit-2026/design/k5-token-map.json"),
		"utf8",
	),
);

const segments = (token: string) =>
	token.startsWith("space.") ? ["space", token.slice("space.".length)] : token.split(".");

const at = (tree: unknown, keys: string[]) =>
	keys.reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], tree);

function leaves(tree: object, prefix: string[] = []): string[][] {
	return Object.entries(tree).flatMap(([key, value]) =>
		typeof value === "string" || ("dark" in value && typeof value.dark === "string")
			? [[...prefix, key]]
			: leaves(value, [...prefix, key]),
	);
}

it.each(design.tokens.map(t => [t.token, t] as const))(
	"exposes %s under its design CSS name",
	(_, token) => {
		expect(at(tokens, segments(token.token))).toBe(`var(${token.css})`);
	},
);

it.each(design.tokens.map(t => [t.token, t] as const))(
	"gives %s its design dark and light values",
	(_, token) => {
		const value = at(themeValues, segments(token.token)) as
			| string
			| { dark: string; light: string };
		const modes = typeof value === "string" ? { dark: value, light: value } : value;
		expect(modes).toEqual({ dark: token.dark, light: token.light });
	},
);

it("has no token outside the design", () => {
	const designed = new Set(design.tokens.map(t => segments(t.token).join("/")));
	const extra = leaves(themeValues)
		.map(keys => keys.join("/"))
		.filter(key => !designed.has(key));
	expect(extra).toEqual([]);
	expect(new Set(design.tokens.map(t => t.css)).size).toBe(design.tokens.length);
});
