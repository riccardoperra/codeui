import { createTheme, createVar, fallbackVar } from "@vanilla-extract/css";
import { mapFontSizeValue, mapSizeValue } from "../../foundation/sizes";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { themeTokens } from "../../foundation/themes.css";
import { tokens } from "../../foundation/contract.css";
import { themeVars } from "../../foundation";

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
	borderColor: tokens.formAccentBorder,
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
		{
			":focus": {
				borderColor: themeVars.brand,
			},
		},
		componentStateStyles({
			invalid: {
				borderColor: tokens.critical,
				color: tokens.critical,
			},
			disabled: {
				cursor: "not-allowed",
				opacity: 0.4,
			},
		}),
		componentStateStyles({
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
		size: {
			[FieldSizes.xs]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("xs"),
					[baseFieldVars.fontSize]: mapFontSizeValue("xs"),
				},
				borderRadius: themeTokens.radii.xs,
			},
			[FieldSizes.sm]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("sm"),
					[baseFieldVars.fontSize]: mapFontSizeValue("sm"),
				},
				borderRadius: themeTokens.radii.sm,
			},
			[FieldSizes.md]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("md"),
					[baseFieldVars.fontSize]: mapFontSizeValue("md"),
				},
				borderRadius: themeTokens.radii.md,
			},
			[FieldSizes.lg]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("lg"),
					[baseFieldVars.fontSize]: mapFontSizeValue("md"),
				},
				borderRadius: themeTokens.radii.lg,
			},
			[FieldSizes.xl]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("xl"),
					[baseFieldVars.fontSize]: mapFontSizeValue("lg"),
				},
				borderRadius: themeTokens.radii.xl,
			},
		},

		theme: {
			filled: {
				vars: {
					[baseFieldVars.borderColor]: "transparent",
				},
			},
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
	},
	defaultVariants: {
		theme: "filled",
		size: "md",
	},
});

export type BaseFieldVariants = RecipeVariants<typeof baseFieldVariants>;
