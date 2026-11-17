/** sRGB channels from 0 to 255, alpha from 0 to 1. */
export type Rgba = { r: number; g: number; b: number; a: number };
/** OKLCH: lightness 0–1, chroma 0–0.4, hue in degrees. */
export type Oklch = { l: number; c: number; h: number };

const hexPattern = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const rgbPattern = /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/i;
/** Every colour a CodeImage theme writes: hex, and the `rgb()` forms of its gradients. */
export const colorToken = /#[\da-f]{3,8}\b|rgba?\([^)]*\)/gi;

export const isHex = (text: string) => hexPattern.test(text.trim());

export function parseColor(text: string | undefined): Rgba | null {
	const value = text?.trim() ?? "";
	if (hexPattern.test(value)) {
		const digits = value.slice(1);
		const full = digits.length < 6 ? [...digits].map(digit => digit + digit).join("") : digits;
		const channel = (at: number) => parseInt(full.slice(at, at + 2), 16);
		return { r: channel(0), g: channel(2), b: channel(4), a: full.length === 8 ? channel(6) / 255 : 1 };
	}
	const rgb = rgbPattern.exec(value);
	if (!rgb) return null;
	const alpha = rgb[4] === undefined ? 1 : rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4]);
	return { r: clamp(+rgb[1], 0, 255), g: clamp(+rgb[2], 0, 255), b: clamp(+rgb[3], 0, 255), a: clamp(alpha, 0, 1) };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const pair = (value: number) => Math.round(clamp(value, 0, 255)).toString(16).padStart(2, "0");

/** `#rrggbb`, or `#rrggbbaa` when the colour is not opaque. */
export function toHex(color: Rgba) {
	const alpha = Math.round(color.a * 255);
	return `#${pair(color.r)}${pair(color.g)}${pair(color.b)}${alpha < 255 ? pair(alpha) : ""}`;
}

/** The hex of any colour the app can read, or the text itself when it cannot. */
export const hexOf = (text: string) => {
	const color = parseColor(text);
	return color ? toHex(color) : text;
};

/** `top` painted over an opaque `bottom`. */
export function composite(top: Rgba, bottom: Rgba): Rgba {
	const mix = (a: number, b: number) => a * top.a + b * (1 - top.a);
	return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a: 1 };
}

const toLinear = (channel: number) => {
	const value = channel / 255;
	return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};
const fromLinear = (value: number) => 255 * (value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055);

const luminance = (color: Rgba) => 0.2126 * toLinear(color.r) + 0.7152 * toLinear(color.g) + 0.0722 * toLinear(color.b);

/** The WCAG 2 contrast ratio, from 1 to 21. A translucent `text` is painted over `background` first. */
export function contrast(text: Rgba, background: Rgba) {
	const a = luminance(text.a < 1 ? composite(text, background) : text);
	const b = luminance(background);
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// OKLab, by Björn Ottosson: https://bottosson.github.io/posts/oklab/
export function toOklch(color: Rgba): Oklch {
	const r = toLinear(color.r);
	const g = toLinear(color.g);
	const b = toLinear(color.b);
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
	const hue = (Math.atan2(B, A) * 180) / Math.PI;
	return { l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, c: Math.hypot(A, B), h: (hue + 360) % 360 };
}

function oklchToLinear({ l, c, h }: Oklch) {
	const A = c * Math.cos((h * Math.PI) / 180);
	const B = c * Math.sin((h * Math.PI) / 180);
	const L = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3;
	const M = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3;
	const S = (l - 0.0894841775 * A - 1.291485548 * B) ** 3;
	return [4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S, -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S, -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S];
}

const inGamut = (channels: number[]) => channels.every(value => value >= -0.0005 && value <= 1.0005);

/** OKLCH to sRGB. A colour outside sRGB keeps its lightness and hue and loses chroma until it fits. */
export function fromOklch(color: Oklch, alpha = 1): Rgba {
	let channels = oklchToLinear(color);
	if (!inGamut(channels)) {
		let low = 0;
		let high = color.c;
		for (let step = 0; step < 16; step++) {
			const middle = (low + high) / 2;
			if (inGamut(oklchToLinear({ ...color, c: middle }))) low = middle;
			else high = middle;
		}
		channels = oklchToLinear({ ...color, c: low });
	}
	const [r, g, b] = channels.map(value => fromLinear(clamp(value, 0, 1)));
	return { r, g, b, a: alpha };
}

/** Black or white, whichever reads better on `background`. */
export const readableOn = (background: Rgba) => (luminance(background) > 0.4 ? "#000000" : "#ffffff");
