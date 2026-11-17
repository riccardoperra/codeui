import { derivedColors } from "../src/foundation/derived";
import { themeValues } from "../src/foundation/theme-values";

type ModeValues = { dark: string; light: string };

const pathName = (path: string[]) => path.join(".");

const valueAt = (path: string, mode: "dark" | "light") => {
	const value = path
		.split(".")
		.reduce<unknown>(
			(node, key) => (node as Record<string, unknown>)[key],
			themeValues,
		) as string | ModeValues;
	return typeof value === "string" ? value : value[mode];
};

const rgba = (hex: string) => {
	const digits = hex.replace("#", "");
	const full = digits.length <= 4 ? [...digits].map(d => d + d).join("") : digits;
	const channels = [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16));
	return [...channels, full.length === 8 ? parseInt(full.slice(6, 8), 16) : 255];
};

const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gamma = (c: number) =>
	c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

function toOklch([r, g, b]: number[]) {
	const [lr, lg, lb] = [r, g, b].map(c => linear(c / 255));
	const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
	const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
	const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
	return { l: L, c: Math.hypot(a, bb), h: (Math.atan2(bb, a) * 180) / Math.PI };
}

function toRgb(l: number, c: number, h: number) {
	const a = c * Math.cos((h * Math.PI) / 180);
	const b = c * Math.sin((h * Math.PI) / 180);
	const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [
		4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
		-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
		-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
	].map(c => Math.min(255, Math.max(0, gamma(c) * 255)));
}

/** Evaluates `var(--path)` or `oklch(from var(--path) <l> <c> <h> [/ alpha])` against the Inkstone values. */
function evaluate(formula: string, mode: "dark" | "light"): number[] {
	const plain = formula.match(/^var\(--(.+)\)$/);
	if (plain) return rgba(valueAt(plain[1], mode));
	const parts = formula.match(/^oklch\(from var\(--([^)]+)\) (.+?)(?: \/ ([\d.]+))?\)$/);
	if (!parts) throw new Error(`Unexpected formula: ${formula}`);
	const [, source, channels, alpha] = parts;
	const base = toOklch(rgba(valueAt(source, mode)));
	const resolved = [...channels.matchAll(/calc\((\w) ([+-]) ([\d.]+)\)|(\w)/g)].map(
		([, name, sign, delta, bare]) => {
			const value = base[(name ?? bare) as "l" | "c" | "h"];
			return name ? value + (sign === "-" ? -1 : 1) * Number(delta) : value;
		},
	);
	const [l, c, h] = resolved;
	return [...toRgb(l, c, h), alpha === undefined ? 255 : Number(alpha) * 255];
}

describe.each(["dark", "light"] as const)("computed colors in %s mode", mode => {
	it.each(Object.entries(derivedColors(mode, pathName)))(
		"%s resolves to its Inkstone value",
		(name, formula) => {
			const want = rgba(valueAt(name.slice(2), mode));
			const got = evaluate(formula, mode);
			got.forEach((channel, i) =>
				expect(Math.abs(channel - want[i])).toBeLessThanOrEqual(1),
			);
		},
	);
});
