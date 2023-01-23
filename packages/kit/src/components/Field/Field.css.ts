import { createTheme, createVar, fallbackVar } from "@vanilla-extract/css";
import { mapFontSizeValue, mapSizeValue } from "../../foundation/sizes.css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { themeTokens } from "../../foundation/themes.css";
import { tokens } from "../../foundation/contract.css";

export const FieldSizes = {
	xs: "xs",
	sm: "sm",
	md: "md",
	lg: "lg",
	xl: "xl",
} as const;

export const inputHeight = createVar();
export const fontSize = createVar();

export const [baseFieldTheme, baseFieldVars] = createTheme({
	borderColor: themeTokens.colors.gray7,
	background: tokens.formAccent,
	color: tokens.foreground,
	inputHeight: inputHeight,
	fontSize: fontSize,
	descriptionColor: themeTokens.colors.gray11,
	disabledBackground: themeTokens.colors.gray2,
});

export const baseFieldVariants = recipe({
	base: [
		{
			appearance: "none",
			border: `1px solid ${baseFieldVars.borderColor}`,
			backgroundColor: baseFieldVars.background,
			borderRadius: themeTokens.radii.md,
			width: "100%",
			minWidth: "0px",
			fontSize: baseFieldVars.fontSize,
			height: fallbackVar(baseFieldVars.inputHeight, "100%"),
			color: "currentcolor",
		},
		componentStateStyles({
			focus: {
				borderColor: themeTokens.colors.blue8,
			},
			"focus-visible": {
				borderColor: themeTokens.colors.blue9,
			},
			invalid: {
				borderColor: tokens.critical,
				color: tokens.critical,
			},
			disabled: {
				cursor: "not-allowed",
				opacity: 0.4,
			},
		}),
	],
	variants: {
		theme: {
			filled: {
				vars: {
					[baseFieldVars.borderColor]: "transparent",
				},
			},
			outline: {},
			inline: [
				{
					backgroundColor: "transparent",
					border: "none",
					borderBottom: `2px solid ${baseFieldVars.background}`,
					borderRadius: 0,
					paddingLeft: 0,
					paddingRight: 0,
				},
				componentStateStyles({ disabled: { backgroundColor: "transparent" } }),
			],
		},

		size: {
			[FieldSizes.xs]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("xs"),
					[baseFieldVars.fontSize]: mapFontSizeValue("xs"),
				},
			},
			[FieldSizes.sm]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("sm"),
					[baseFieldVars.fontSize]: mapFontSizeValue("sm"),
				},
			},
			[FieldSizes.md]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("md"),
					[baseFieldVars.fontSize]: mapFontSizeValue("md"),
				},
			},
			[FieldSizes.lg]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("lg"),
					[baseFieldVars.fontSize]: mapFontSizeValue("md"),
				},
			},
			[FieldSizes.xl]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("xl"),
					[baseFieldVars.fontSize]: mapFontSizeValue("lg"),
				},
			},
		},
	},
	defaultVariants: {
		theme: "filled",
		size: "md",
	},
});

export type BaseFieldVariants = RecipeVariants<typeof baseFieldVariants>;
