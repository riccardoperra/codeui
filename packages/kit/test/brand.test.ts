/**
 * Guard for the brand blue (Inkstone, DESIGN.md §2.3): one blue fills every
 * filled button and every selected or checked control, the same in both
 * themes. Accent text keeps 4.5:1 on every surface and on the 15% wash.
 */
import { themeValues } from "../src/foundation/theme-values";
import { blend, contrast, oklch } from "./color";

type Mode = "dark" | "light";
type Leaf = string | { dark: string; light: string };
const at = (path: string): Leaf =>
	path
		.split(".")
		.reduce<unknown>(
			(node, key) => (node as Record<string, unknown>)?.[key],
			themeValues,
		) as Leaf;
const value = (path: string, mode: Mode) => {
	const leaf = at(path);
	return typeof leaf === "string" ? leaf : leaf[mode];
};

const MODES: Mode[] = ["dark", "light"];
/** Surfaces accent text and the wash sit on (DESIGN.md §2.1), plus menus and toasts. */
const SURFACES = [
	"surface.panel",
	"surface.canvas",
	"surface.input",
	"surface.dialog",
	"surface.menu",
	"surface.toast",
];

describe("the brand blue", () => {
	it("is one value in both themes", () => {
		for (const step of ["base", "hover", "active"])
			expect(typeof at(`action.brand.${step}`)).toBe("string");
		expect(themeValues.action.brand.base).toBe("#0083e5");
	});

	it("keeps accent.selection, kept for compatibility, equal to the brand base", () => {
		for (const mode of MODES)
			expect(value("accent.selection", mode)).toBe(themeValues.action.brand.base);
	});

	it("gets darker from base to hover to active, with white text at 3.9:1 or more", () => {
		const { base, hover, active, text } = themeValues.action.brand;
		expect(oklch(hover).L).toBeLessThan(oklch(base).L);
		expect(oklch(active).L).toBeLessThan(oklch(hover).L);
		expect(Math.round(contrast(text, base) * 10) / 10).toBeGreaterThanOrEqual(3.9);
	});

	it("tints the soft wash with the brand hue", () => {
		const hue = oklch(themeValues.action.brand.base).H!;
		for (const step of ["base", "hover", "active"] as const) {
			const wash = themeValues.action.brandSoft[step];
			expect(Math.abs(oklch(wash.slice(0, 7)).H! - hue)).toBeLessThan(1);
		}
	});

	it.each(MODES)(
		"keeps %s accent text at 4.5:1 on every surface and on the wash",
		mode => {
			const text = value("action.brandSoft.text", mode);
			const check = (on: string[][]) =>
				on
					.map(([name, color]) => ({ name, ratio: contrast(text, color!) }))
					.filter(({ ratio }) => ratio < 4.5);
			const misses = SURFACES.flatMap(surface => {
				const bg = value(surface, mode);
				// A toast carries accent text (its action) but no wash.
				if (surface === "surface.toast") return check([[surface, bg]]);
				return check([
					[surface, bg],
					[`wash on ${surface}`, blend(value("action.brandSoft.base", mode), bg)],
					[`hover wash on ${surface}`, blend(value("action.brandSoft.hover", mode), bg)],
				]);
			});
			expect(misses).toEqual([]);
		},
	);
});
