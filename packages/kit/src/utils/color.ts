import {
	darken,
	getLuminance,
	lighten,
	parseToHsl,
	parseToRgb,
	toColorString,
} from "polished";

const calculateYiq = (color: string) => {
	// Convert RGB to YIQ to better take into account the
	// luminance of the separate color channels:
	//
	// Further reading:
	//   - YIQ:
	//     https://en.wikipedia.org/wiki/YIQ
	//   - Calculating contrast:
	//     https://24ways.org/2010/calculating-color-contrast/

	const { red, green, blue } = parseToRgb(color);

	return (red * 299 + green * 587 + blue * 114) / 1000;
};

export const isLight = (inputColor: string, foregroundColor: string = "#000") => {
	const colors = [inputColor];

	const foregroundYiq = calculateYiq(foregroundColor);

	return colors.some(color => {
		const yiq = calculateYiq(color);
		const midpoint = 256 / 2;
		const foregroundOffset = foregroundYiq / 2;

		// Colour is considered `light` if greater than the midpoint:
		// eg. 256 / 2 = 128.
		// We include a foreground offset to take into account
		// lighter text shades than pure black
		return yiq >= midpoint + foregroundOffset;
	});
};

export const getActiveColor = (x: string) =>
	isLight(x) ? darken(0.1, x) : darken(0.05, x);

export const getHoverColor = (x: string) =>
	isLight(x) ? darken(0.05, x) : lighten(0.05, x);

const smoothSaturation = (saturation: number, luminance: number) => {
	const isBright = luminance > 0.6;

	if (isBright) {
		return saturation * 0.8;
	}

	return saturation * 0.45;
};

const smoothLightness = (lightness: number, luminance: number) => {
	const isBright = luminance > 0.6;

	if (isBright) {
		return 0.95 - lightness * 0.03;
	}

	return 0.95 - lightness * 0.06;
};

export function getLightVariant(color: string) {
	const { hue, saturation, lightness } = parseToHsl(color);
	const luminance = getLuminance(color);

	return toColorString({
		hue,
		saturation: smoothSaturation(saturation, luminance),
		lightness: smoothLightness(lightness, luminance),
	});
}
