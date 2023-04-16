import { createTheme, keyframes, style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";
import { tokens } from "../../foundation/contract.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { FieldSizes } from "../Field/Field.css";
import { recipe } from "@vanilla-extract/recipes";
import { mapFontSizeValue } from "../../foundation/sizes.css";

export const [radioTheme, radioVars] = createTheme({
	inputColor: tokens.formAccentBorder,
	inputBackground: tokens.brand,
	inputInvalidBackground: tokens.critical,
	inputText: tokens.foreground,
	inputSize: "",
	labelSize: "",
});

export const radioList = recipe({
	base: [
		radioTheme,
		{
			display: "flex",
			gap: "16px",
			lineHeight: "1.5",
			marginTop: themeTokens.spacing["1"],
		},
	],
	variants: {
		orientation: {
			horizontal: {
				flexDirection: "row",
			},
			vertical: {
				flexDirection: "column",
			},
		},
		size: {
			[FieldSizes.xs]: {
				vars: {
					[radioVars.inputSize]: "1rem",
					[radioVars.labelSize]: mapFontSizeValue("xs"),
				},
			},
			[FieldSizes.sm]: {
				vars: {
					[radioVars.inputSize]: "1rem",
					[radioVars.labelSize]: mapFontSizeValue("sm"),
				},
			},
			[FieldSizes.md]: {
				vars: {
					[radioVars.inputSize]: "1.25rem",
					[radioVars.labelSize]: mapFontSizeValue("md"),
				},
			},
			[FieldSizes.lg]: {
				vars: {
					[radioVars.inputSize]: "1.5rem",
					[radioVars.labelSize]: mapFontSizeValue("md"),
				},
			},
			[FieldSizes.xl]: {
				vars: {
					[radioVars.inputSize]: "1.5rem",
					[radioVars.labelSize]: mapFontSizeValue("md"),
				},
			},
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export const radioItem = style([
	{
		display: "flex",
		alignItems: "center",
		gap: themeTokens.spacing["3"],
		fontSize: radioVars.labelSize,
	},
]);

export const radio = style([
	{
		width: radioVars.inputSize,
		height: radioVars.inputSize,
		position: "relative",
		display: "block",
		flexShrink: 0,
		borderRadius: "100%",
		transition: "background 200ms ease-in-out",
		background: "transparent",
		color: "#fff",

		":after": {
			position: "absolute",
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			content: "",
			borderRadius: "inherit",
			border: `1px solid ${radioVars.inputColor}`,
			pointerEvents: "none",
			color: "transparent",
		},

		":hover": {
			background: tokens.formAccent,
		},

		selectors: {
			"&[data-checked]:after": {
				transform: "scale(1)",
				borderColor: radioVars.inputBackground,
			},
			"&[data-checked][data-invalid]": {
				vars: {
					[radioVars.inputBackground]: radioVars.inputInvalidBackground,
				},
			},
		},
	},
	componentStateStyles({
		checked: {
			background: radioVars.inputBackground,
		},
	}),
]);

const contentShow = keyframes({
	from: {
		opacity: 0,
		transform: "scale(0.5)",
	},
	to: {
		opacity: 1,
		transform: "scale(1)",
	},
});

export const indicator = style({
	margin: "25%",
	width: "50%",
	height: "50%",
	position: "absolute",
	backgroundColor: "currentColor",
	borderRadius: "100%",
	transition: "background 200ms ease-in-out",
	animation: `${contentShow} 250ms ease-in-out`,
});
