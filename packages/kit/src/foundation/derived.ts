import { themeValues } from "./theme-values";

type Mode = "dark" | "light";
type ModeValues = { readonly dark: string; readonly light: string };

/**
 * Tokens computed from another token, so one override themes the rest.
 * Each formula reproduces the Inkstone value in `themeValues`, which stays
 * the fallback where a formula cannot run.
 */
const derivations = {
	/** Scaled by `--cui-radius-scale`. `none`, `full` and the scale keep their value. */
	radius: Object.keys(themeValues.radius).filter(
		(name): name is Exclude<keyof typeof themeValues.radius, "none" | "full" | "scale"> =>
			!["none", "full", "scale"].includes(name),
	),
	/** Relative colors: each target is computed from its source. */
	colors: [
		{
			source: "action.brand.base",
			targets: [
				"action.brand.hover",
				"action.brand.active",
				"action.brandSoft.base",
				"action.brandSoft.hover",
				"action.brandSoft.active",
				"action.brandSoft.text",
				"accent.selection",
				"accent.focus",
			],
		},
		{
			source: "action.danger.base",
			targets: ["action.danger.hover", "action.danger.active"],
		},
		{
			source: "action.caution.base",
			targets: ["action.caution.hover", "action.caution.active"],
		},
		{
			source: "action.success.base",
			targets: ["action.success.hover", "action.success.active"],
		},
	],
} as const;

export const relativeColorSupport = "(color: oklch(from red l c h))";

type Oklch = { l: number; c: number; h: number; alpha: number };

const toLinear = (channel: number) => {
	const c = channel / 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

function hexToOklch(hex: string): Oklch {
	const digits = hex.replace("#", "");
	const full = digits.length <= 4 ? [...digits].map(d => d + d).join("") : digits;
	const [r, g, b] = [0, 2, 4].map(i => toLinear(parseInt(full.slice(i, i + 2), 16)));
	const alpha = full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1;
	const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	const l = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
	const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
	const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
	return { l, c: Math.hypot(a, bb), h: (Math.atan2(bb, a) * 180) / Math.PI, alpha };
}

const offset = (channel: string, delta: number, digits: number) => {
	const rounded = Number(delta.toFixed(digits));
	if (rounded === 0) return channel;
	return `calc(${channel} ${rounded < 0 ? "-" : "+"} ${Math.abs(rounded)})`;
};

/** A relative color that turns `source` into `target` when `source` is the Inkstone value. */
function relativeColor(sourceVar: string, source: string, target: string): string {
	const from = hexToOklch(source);
	const to = hexToOklch(target);
	const hue = ((to.h - from.h + 540) % 360) - 180;
	const l = offset("l", to.l - from.l, 4);
	const c = offset("c", to.c - from.c, 4);
	const h = offset("h", hue, 2);
	const alpha = to.alpha < 1 ? ` / ${Number(to.alpha.toFixed(3))}` : "";
	if (l === "l" && c === "c" && h === "h" && !alpha) return sourceVar;
	return `oklch(from ${sourceVar} ${l} ${c} ${h}${alpha})`;
}

const at = (path: string): string | ModeValues =>
	path
		.split(".")
		.reduce<unknown>(
			(node, key) => (node as Record<string, unknown>)[key],
			themeValues,
		) as string | ModeValues;

const valueIn = (value: string | ModeValues, mode: Mode) =>
	typeof value === "string" ? value : value[mode];

/** `--cui-*` name → formula. */
export function derivedRadius(
	cssName: (path: string[]) => string,
): Record<string, string> {
	const scale = `var(--${cssName(["radius", "scale"])})`;
	return Object.fromEntries(
		derivations.radius.map(name => [
			`--${cssName(["radius", name])}`,
			`calc(${themeValues.radius[name]} * ${scale})`,
		]),
	);
}

/** `--cui-*` name → formula, for one mode. */
export function derivedColors(
	mode: Mode,
	cssName: (path: string[]) => string,
): Record<string, string> {
	return Object.fromEntries(
		derivations.colors.flatMap(({ source, targets }) => {
			const sourceValue = valueIn(at(source), mode);
			const sourceVar = `var(--${cssName(source.split("."))})`;
			return targets.map(path => [
				`--${cssName(path.split("."))}`,
				relativeColor(sourceVar, sourceValue, valueIn(at(path), mode)),
			]);
		}),
	);
}
