import { createTheme, style, StyleRule } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { mapFontSizeValue, mapSizeValue } from "../../foundation/sizes";
import { themeTokens } from "../../foundation/themes.css";
import { baseFieldTheme, FieldSizes } from "../Field/Field.css";
import { tokens } from "../../foundation/contract.css";
import { styleFieldMessage } from "../Field/fieldStyle";

export const [checkboxTheme, checkboxVars] = createTheme({
	size: "",
	fontSize: "",
	borderColor: tokens.formAccentBorder,
	background: tokens.brand,
	activeHoverBackground: tokens.brandAccentHover,
	nonActiveHoverBackground: tokens.formAccent,
	color: tokens.foreground,
	radius: `calc(${themeTokens.radii.md} * .6)`,
});

export const container = style([
	baseFieldTheme,
	checkboxTheme,
	{
		display: "inline-flex",
		alignItems: "flex-start",
	},
]);

export const input = style({
	border: 0,
	clip: "rect(0px, 0px, 0px, 0px)",
	clipPath: "inset(50%)",
	height: "1px",
	margin: "0px -1px -1px 0px",
	overflow: "hidden",
	padding: "0px",
	position: "absolute",
	width: "1px",
	whiteSpace: "nowrap",
	":focus-visible": {
		outline: `2px solid ${tokens.brand}`,
		outlineOffset: "2px",
		borderRadius: checkboxVars.radius,
	},
});

const sizesCss = {
	xs: "1rem",
	sm: "1.25rem",
	md: "1.5rem",
	lg: "1.75rem",
	xl: "2rem",
};

export const icon = style({
	width: checkboxVars.fontSize,
	height: checkboxVars.fontSize,
});

export const control = recipe({
	base: [
		{
			position: "relative",
			height: checkboxVars.size,
			width: checkboxVars.size,
			overflow: "hidden",
			borderRadius: checkboxVars.radius,
			":focus-visible": {
				outline: `2px solid ${checkboxVars.background}`,
			},
		},
		{
			selectors: {
				"&:hover::before": {
					backgroundColor: checkboxVars.nonActiveHoverBackground,
				},
				"&:before": {
					content: "",
					border: `2px solid ${checkboxVars.borderColor}`,
					borderRadius: checkboxVars.radius,
					position: "absolute",
					width: "100%",
					height: "100%",
					top: 0,
					left: 0,
				},
				"&:after": {
					content: "",
					position: "absolute",
					opacity: 0,
					background: checkboxVars.background,
					borderRadius: checkboxVars.radius,
					width: "100%",
					height: "100%",
					top: 0,
					left: 0,
					transitionProperty: "transform, opacity",
					transitionTimingFunction: "ease",
					transitionDuration: ".25s",
					transform: `scale(0.5)`,
					transformOrigin: "center",
				},
				"&:hover::after": {
					backgroundColor: checkboxVars.activeHoverBackground,
				},
				"[data-checked] &:after": {
					opacity: 1,
					transform: `scale(1)`,
				},
			},
		},
	],
	variants: {
		size: {
			[FieldSizes.xs]: {
				vars: {
					[checkboxVars.size]: mapSizeValue("xs", sizesCss),
					[checkboxVars.fontSize]: mapFontSizeValue("xs"),
					[checkboxVars.radius]: `calc(${themeTokens.radii.md} * .5)`,
				},
			},
			[FieldSizes.sm]: {
				vars: {
					[checkboxVars.size]: mapSizeValue("sm", sizesCss),
					[checkboxVars.fontSize]: mapFontSizeValue("sm"),
				},
			},
			[FieldSizes.md]: {
				vars: {
					[checkboxVars.size]: mapSizeValue("md", sizesCss),
					[checkboxVars.fontSize]: mapFontSizeValue("md"),
				},
			},
			[FieldSizes.lg]: {
				vars: {
					[checkboxVars.size]: mapSizeValue("lg", sizesCss),
					[checkboxVars.fontSize]: mapFontSizeValue("md"),
					[checkboxVars.radius]: `calc(${themeTokens.radii.md} * .7)`,
				},
			},
			[FieldSizes.xl]: {
				vars: {
					[checkboxVars.size]: mapSizeValue("xl", sizesCss),
					[checkboxVars.fontSize]: mapFontSizeValue("lg"),
					[checkboxVars.radius]: `calc(${themeTokens.radii.md} * .8)`,
				},
			},
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export const indicator = style({
	display: "flex",
	position: "relative",
	width: "100%",
	height: "100%",
	alignItems: "center",
	justifyContent: "center",
	zIndex: themeTokens.zIndex["10"],
	opacity: 0,
	transitionProperty: "transform, opacity",
	transitionTimingFunction: "ease",
	transitionDuration: ".25s",
	selectors: {
		"[data-checked] &": {
			opacity: 1,
		},
	},
});

export const label = style([
	{
		userSelect: "none",
		selectors: {
			...Object.entries(sizesCss).reduce((acc, [size, value]) => {
				acc[`[data-field-size=${size}] &`] = {
					height: value,
					lineHeight: value,
				};
				return acc;
			}, {} as NonNullable<StyleRule["selectors"]>),
		},
	},
	styleFieldMessage({
		xs: "xs",
		sm: "xs",
		md: "xs",
		lg: "md",
		xl: "md",
	}),
]);

export const content = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	marginLeft: themeTokens.spacing["2"],
});
