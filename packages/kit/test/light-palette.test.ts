/** Verify the shared Gosfuig greys and contrast in the light theme. */
import { palette } from "../../inkstone/tokens/palette.tokens.json";
import { themeValues } from "../src/foundation/theme-values";
import { blend, contrast, normalizeHex, oklch } from "./color";

const RAMP = Object.values(palette.gray).flatMap(token =>
	typeof token === "string" ? [] : [token.$value.hex],
);

type Leaf = string | { dark: string; light: string };
const at = (path: string): Leaf =>
	path
		.split(".")
		.reduce<unknown>(
			(node, key) => (node as Record<string, unknown>)?.[key],
			themeValues,
		) as Leaf;
const light = (path: string): string => {
	const value = at(path);
	if (value === undefined) throw new Error(`No token ${path}`);
	return normalizeHex(typeof value === "string" ? value : value.light);
};

/** Tokens in the neutral groups that are not neutral greys. */
const NOT_NEUTRAL = new Set([
	"surface.scrim", // translucent black over content
	"text.danger", // status colour
	"border.input", // transparent
	"border.width",
	"border.widthStrong",
]);
const NEUTRAL_GROUPS = ["surface", "text", "action.neutral", "border"];

function leafPaths(path: string): string[] {
	const value = at(path);
	if (typeof value === "string" || "dark" in value) return [path];
	return Object.keys(value).flatMap(key => leafPaths(`${path}.${key}`));
}
const neutralTokens = NEUTRAL_GROUPS.flatMap(leafPaths).filter(
	path => !NOT_NEUTRAL.has(path),
);

describe("the shared grey ramp", () => {
	it("gets darker at every step", () => {
		const lightness = RAMP.map(hex => oklch(hex).L);
		lightness.slice(1).forEach((L, i) => expect(L).toBeLessThan(lightness[i]!));
	});

	it.each(RAMP)("keeps %s achromatic", hex => {
		expect(oklch(hex).C).toBeLessThan(0.000001);
	});
});

describe("light neutral tokens", () => {
	it("cover every neutral group", () => {
		expect(neutralTokens.length).toBeGreaterThan(30);
	});

	it("are all steps of the ramp", () => {
		const outside = neutralTokens
			.map(path => ({ path, value: light(path) }))
			.filter(({ value }) => !RAMP.includes(value));
		expect(outside).toEqual([]);
	});
});

/** The surfaces text and controls sit on (DESIGN.md §2.1). */
const SURFACES = {
	page: "surface.panel",
	island: "surface.canvas",
	field: "surface.input",
	"selected row": "surface.menuHover",
	"selected card": "surface.fieldHover",
} as const;
type Surface = keyof typeof SURFACES;
const ALL_SURFACES = Object.keys(SURFACES) as Surface[];

const PRIMARY = [
	"text.default",
	"text.dialog",
	"text.dialogTitle",
	"text.label",
	"text.menu",
	"text.input",
	"text.toast",
	"text.panel",
	"action.neutral.text",
];
const SECONDARY = ["text.muted", "text.toolbar", "text.hint", "text.panelMuted"];

interface Pair {
	fg: string;
	on: Surface[];
	min: number;
}
const pairs: Record<string, Pair> = {};
for (const fg of PRIMARY) pairs[fg] = { fg, on: ALL_SURFACES, min: 4.5 };
for (const fg of SECONDARY) pairs[fg] = { fg, on: ALL_SURFACES, min: 4.5 };
// Tertiary text is reserved for the page, island, field and row (§2.2).
pairs["text.tertiary"] = {
	fg: "text.tertiary",
	on: ["page", "island", "field", "selected row"],
	min: 4.5,
};
// Focus ring and the selected-card ring (§10: 3:1 for rings and edges).
pairs["accent.focus"] = { fg: "accent.focus", on: ALL_SURFACES, min: 3 };
// The edge of an unchecked checkbox and radio.
pairs["control edge (text.hint)"] = {
	fg: "text.hint",
	on: ["page", "island", "field"],
	min: 3,
};
// The off track uses gray.550. Thumb position also indicates the switch state (§10).
pairs["surface.track (switch off, exception)"] = {
	fg: "surface.track",
	on: ["page", "island", "field"],
	min: 2.25,
};
// Links and brand-soft labels.
pairs["action.brandSoft.text"] = {
	fg: "action.brandSoft.text",
	on: ["page", "island", "field"],
	min: 4.5,
};

const lightOrMissing = (path: string) => {
	try {
		return light(path);
	} catch {
		return undefined;
	}
};

describe("light contrast", () => {
	it("meets every target", () => {
		const misses = Object.entries(pairs).flatMap(([name, pair]) => {
			const fg = lightOrMissing(pair.fg);
			return pair.on.flatMap(surface => {
				const bg = lightOrMissing(SURFACES[surface]);
				const ratio =
					fg && bg ? Math.round(contrast(fg, bg) * 100) / 100 : "missing token";
				return typeof ratio === "number" && ratio >= pair.min
					? []
					: [{ pair: name, on: surface, ratio, min: pair.min }];
			});
		});
		expect(misses).toEqual([]);
	});

	it("keeps accent text at 4.5:1 on the 15% brand wash", () => {
		const wash = blend(light("action.brandSoft.base"), light("surface.panel"));
		expect(contrast(light("action.brandSoft.text"), wash)).toBeGreaterThanOrEqual(4.5);
	});

	it("keeps primary, secondary, tertiary and disabled text in order (§2.2)", () => {
		const page = light("surface.panel");
		const tone = (path: string) => contrast(light(path), page);
		expect(tone("text.default")).toBeGreaterThan(tone("text.muted"));
		expect(tone("text.default")).toBeGreaterThan(tone("text.hint"));
		expect(tone("text.muted")).toBeGreaterThan(tone("text.tertiary"));
		expect(tone("text.tertiary")).toBeGreaterThan(tone("text.disabled"));
	});

	it("separates a field from its island by at least ΔL 0.025", () => {
		const island = oklch(light("surface.canvas")).L;
		const field = oklch(light("surface.input")).L;
		expect(island - field).toBeGreaterThanOrEqual(0.025);
	});
});
