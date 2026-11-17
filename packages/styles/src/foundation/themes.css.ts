import { createThemeContract } from "@vanilla-extract/css";
import { tokens as cui } from "./cui.css";
import { globalStyle } from "./layer.css";
import { tokens as legacyValues } from "./tokens";

const nullLeaves = <T extends Record<string, string>>(group: T) =>
	Object.fromEntries(Object.keys(group).map(key => [key, null])) as {
		[Key in keyof T]: null;
	};

const {
	normal: _normal,
	medium: _medium,
	semibold: _semibold,
	...legacyFontWeight
} = legacyValues.fontWeight;
const { default: _sm, md: _md, none: _none, ...legacyBoxShadow } = legacyValues.boxShadow;

const legacyGroups = {
	colors: legacyValues.colors,
	fontWeight: legacyFontWeight,
	boxShadow: legacyBoxShadow,
	zIndex: legacyValues.zIndex,
};

const legacy = createThemeContract({
	colors: nullLeaves(legacyGroups.colors),
	fontWeight: nullLeaves(legacyGroups.fontWeight),
	boxShadow: nullLeaves(legacyGroups.boxShadow),
	zIndex: nullLeaves(legacyGroups.zIndex),
});

globalStyle(":root", {
	vars: Object.fromEntries(
		Object.entries(legacyGroups).flatMap(([group, values]) =>
			Object.entries(values).map(([key, value]) => [
				(legacy as Record<string, Record<string, string>>)[group][key],
				value,
			]),
		),
	),
});

/**
 * @deprecated Use `tokens`. Spacing, radii, font sizes and the shared weights
 * and shadows point at `--cui-*` variables; the rest keep their old values.
 */
export const themeTokens = {
	colors: legacy.colors,
	fontSize: {
		xs: cui.font.size.xs,
		sm: cui.font.size.sm,
		md: cui.font.size.md,
		lg: cui.font.size.lg,
		xl: cui.font.size.xl,
	},
	fontWeight: {
		hairline: legacy.fontWeight.hairline,
		thin: legacy.fontWeight.thin,
		light: legacy.fontWeight.light,
		normal: cui.font.weight.normal,
		medium: cui.font.weight.medium,
		semibold: cui.font.weight.semibold,
		bold: legacy.fontWeight.bold,
		extrabold: legacy.fontWeight.extrabold,
		black: legacy.fontWeight.black,
	},
	spacing: {
		auto: cui.space.auto,
		px: cui.space.px,
		0: cui.space["0"],
		1: cui.space["1"],
		2: cui.space["2"],
		3: cui.space["3"],
		4: cui.space["4"],
		5: cui.space["5"],
		6: cui.space["6"],
		8: cui.space["8"],
		10: cui.space["10"],
		12: cui.space["12"],
		16: cui.space["16"],
		20: cui.space["20"],
		24: cui.space["24"],
		32: cui.space["32"],
		40: cui.space["40"],
		48: cui.space["48"],
		56: cui.space["56"],
		64: cui.space["64"],
	},
	radii: {
		none: cui.radius.none,
		xs: cui.radius.xs,
		sm: cui.radius.sm,
		default: cui.radius.lg,
		md: cui.radius.md,
		lg: cui.radius.lg,
		xl: cui.radius.xl,
		full: cui.radius.full,
	},
	boxShadow: {
		default: cui.shadow.sm,
		md: cui.shadow.md,
		lg: legacy.boxShadow.lg,
		xl: legacy.boxShadow.xl,
		"2xl": legacy.boxShadow["2xl"],
		inner: legacy.boxShadow.inner,
		outline: legacy.boxShadow.outline,
		none: cui.shadow.none,
	},
	zIndex: legacy.zIndex,
} as const;
