/** Colour maths for the palette guard: sRGB hex → OKLCH, alpha blending, WCAG contrast. */

type Rgba = [r: number, g: number, b: number, a: number];

export function parseHex(hex: string): Rgba {
	let h = hex.replace("#", "");
	if (h.length === 3 || h.length === 4) h = [...h].map(c => c + c).join("");
	if (h.length !== 6 && h.length !== 8) throw new Error(`Not a hex colour: ${hex}`);
	const channel = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
	return [channel(0), channel(2), channel(4), h.length === 8 ? channel(6) : 1];
}

/** `#fff` and `#FFFFFF` both become `#ffffff`. */
export const normalizeHex = (hex: string) => {
	const [r, g, b, a] = parseHex(hex);
	const byte = (v: number) =>
		Math.round(v * 255)
			.toString(16)
			.padStart(2, "0");
	return `#${byte(r)}${byte(g)}${byte(b)}${a < 1 ? byte(a) : ""}`;
};

const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

/** OKLCH of an opaque hex colour. `H` is `undefined` for an achromatic grey. */
export function oklch(hex: string): {
	L: number;
	C: number;
	H: number | undefined;
	a: number;
	b: number;
} {
	const [r, g, b] = parseHex(hex).slice(0, 3).map(linear) as [number, number, number];
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
	const C = Math.hypot(A, B);
	const H = C > 0.002 ? ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 : undefined;
	return { L, C, H, a: A, b: B };
}

/**
 * Chroma off the axis of hue `hue`: the distance of the colour's (a, b) from
 * the line through the grey axis at that hue. 8-bit rounding of a ramp step
 * near grey moves its hue by up to 20°, but its off-axis chroma stays under 0.002.
 */
export function offAxisChroma(hex: string, hue: number): number {
	const { a, b } = oklch(hex);
	const rad = (hue * Math.PI) / 180;
	return Math.abs(a * Math.sin(rad) - b * Math.cos(rad));
}

/** `fg` composited over the opaque `bg`. */
export function blend(fg: string, bg: string): string {
	const [r, g, b, a] = parseHex(fg);
	const [R, G, B] = parseHex(bg);
	const mix = (x: number, y: number) =>
		Math.round((a * x + (1 - a) * y) * 255)
			.toString(16)
			.padStart(2, "0");
	return `#${mix(r, R)}${mix(g, G)}${mix(b, B)}`;
}

const luminance = (hex: string) => {
	const [r, g, b] = parseHex(hex).slice(0, 3).map(linear) as [number, number, number];
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG 2 contrast ratio. A translucent `fg` is composited over `bg` first. */
export function contrast(fg: string, bg: string): number {
	const solid = parseHex(fg)[3] < 1 ? blend(fg, bg) : fg;
	const [hi, lo] = [luminance(solid), luminance(bg)].sort((x, y) => y - x) as [
		number,
		number,
	];
	return (hi + 0.05) / (lo + 0.05);
}
