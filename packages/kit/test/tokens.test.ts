import { tokens } from "../src";
import { themeValues } from "../src/foundation/theme-values";

import design from "../../../docs/kit-2026/design/k5-token-map.json";
import tokenPage from "../../../apps/docs/content/docs/(kit)/foundations/tokens.mdx?raw";

const segments = (token: string) =>
	token.startsWith("space.") ? ["space", token.slice("space.".length)] : token.split(".");

const at = (tree: unknown, keys: string[]) =>
	keys.reduce<unknown>(
		(node, key) => (node as Record<string, unknown> | undefined)?.[key],
		tree,
	);

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

it("lists every token with its values in the docs static tables", () => {
	const page = tokenPage;
	const rows = new Map(
		[...page.matchAll(/^\| `([^`]+)` \| `(--cui-[^`]+)` \| (.*) \|$/gm)].map(match => [
			match[1],
			[match[2], ...match[3]!.split(" | ").map(cell => cell.replace(/^`|`$/g, ""))].join(
				" | ",
			),
		]),
	);
	const missing = design.tokens
		.map(token => {
			const value = at(themeValues, segments(token.token)) as
				| string
				| { dark: string; light: string };
			// A value shared by both modes is one column in the size tables and two in the colour tables.
			const accepted =
				typeof value === "string"
					? [`${token.css} | ${value}`, `${token.css} | ${value} | ${value}`]
					: [`${token.css} | ${value.dark} | ${value.light}`];
			return {
				token: token.token,
				expected: accepted[0],
				actual: rows.get(token.token),
				accepted,
			};
		})
		.filter(({ actual, accepted }) => !accepted.includes(actual ?? ""))
		.map(({ accepted: _, ...miss }) => miss);
	expect(missing).toEqual([]);
	expect(page).toContain(`The kit defines ${design.tokens.length} of them.`);
});
