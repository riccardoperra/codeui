import { createTheme, recipe, style } from "../../foundation/layer.css";
import { StyleRule } from "@vanilla-extract/css";
import { mapFontSizeValue, mapSizeValue } from "../../foundation/sizes";
import { baseFieldTheme, FieldSizes } from "../Field/Field.css";
import { tokens } from "../../foundation/cui.css";
import { transition } from "../../foundation/motion.css";
import { styleFieldMessage } from "../Field/fieldStyle";

export const [checkboxTheme, checkboxVars] = createTheme({
	size: "",
	fontSize: "",
	borderColor: tokens.text.hint,
	background: tokens.action.brand.base,
	activeHoverBackground: tokens.action.brand.hover,
	nonActiveHoverBackground: tokens.surface.input,
	color: tokens.action.brand.text,
	radius: `calc(${tokens.radius.md} * .6)`,
	fill: "transparent",
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
		outline: `${tokens.focus.width} solid ${tokens.focus.color}`,
		outlineOffset: tokens.focus.offset,
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
				outline: `${tokens.focus.width} solid ${tokens.focus.color}`,
				outlineOffset: tokens.focus.offset,
			},
		},
		{
			selectors: {
				"&:hover::before": {
					backgroundColor: checkboxVars.nonActiveHoverBackground,
				},
				// The input is visually hidden, so its keyboard focus rings the box.
				[`${input}:focus-visible + &`]: {
					outline: `${tokens.focus.width} solid ${tokens.focus.color}`,
					outlineOffset: tokens.focus.offset,
				},
				"&:before": {
					content: "",
					background: checkboxVars.fill,
					border: `${tokens.border.widthStrong} solid ${checkboxVars.borderColor}`,
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
					transition: transition(["transform", "opacity"]),
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
		// `filled` gives the box the field fill and drops its outline;
		// `inline`, the default, draws the outline on the surface.
		theme: {
			filled: {
				vars: {
					[checkboxVars.borderColor]: "transparent",
					[checkboxVars.fill]: tokens.surface.input,
				},
			},
			inline: {},
		},
		size: {
			[FieldSizes.xs]: {
				vars: {
					[checkboxVars.size]: mapSizeValue("xs", sizesCss),
					[checkboxVars.fontSize]: mapFontSizeValue("xs"),
					[checkboxVars.radius]: `calc(${tokens.radius.md} * .5)`,
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
					[checkboxVars.radius]: `calc(${tokens.radius.md} * .7)`,
				},
			},
			[FieldSizes.xl]: {
				vars: {
					[checkboxVars.size]: mapSizeValue("xl", sizesCss),
					[checkboxVars.fontSize]: mapFontSizeValue("lg"),
					[checkboxVars.radius]: `calc(${tokens.radius.md} * .8)`,
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
	zIndex: 10,
	color: checkboxVars.color,
	opacity: 0,
	transition: transition(["transform", "opacity"]),
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
	marginLeft: tokens.space["2"],
});
