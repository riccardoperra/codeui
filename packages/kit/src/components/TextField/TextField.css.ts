import { createTheme, createVar, fallbackVar, style } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { themeTokens } from "../../foundation/themes.css";
import { mapFontSizeValue, mapSizeValue } from "../../foundation/sizes.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { tokens } from "../../foundation/contract.css";

export const inputHeight = createVar();
export const fontSize = createVar();

export const [textFieldTheme, textFieldVars] = createTheme({
	borderColor: themeTokens.colors.gray7,
	background: tokens.formAccent,
	color: tokens.foreground,
	inputHeight: inputHeight,
	fontSize: fontSize,
	descriptionColor: themeTokens.colors.gray11,
	disabledBackground: themeTokens.colors.gray2,
});

export const FieldSizes = {
	xs: "xs",
	sm: "sm",
	md: "md",
	lg: "lg",
	xl: "xl",
} as const;

export const baseField = style([
	textFieldTheme,
	{
		appearance: "none",
		border: `1px solid ${textFieldVars.borderColor}`,
		backgroundColor: textFieldVars.background,
		borderRadius: themeTokens.radii.md,
		width: "100%",
		minWidth: "0px",
		fontSize: textFieldVars.fontSize,
		height: fallbackVar(textFieldVars.inputHeight, "100%"),
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
]);

export const baseFieldContainer = style([
	textFieldTheme,
	{
		display: "flex",
		flexDirection: "column",
		gap: themeTokens.spacing["3"],
	},
]);

export const textField = recipe({
	base: [
		baseField,
		{
			paddingRight: themeTokens.spacing["3"],
			paddingLeft: themeTokens.spacing["3"],
			paddingTop: 0,
			paddingBottom: 0,
			outline: "none",
		},
	],
	variants: {
		theme: {
			filled: {
				vars: {
					[textFieldVars.borderColor]: "transparent",
				},
			},
			outline: {},
			inline: [
				{
					backgroundColor: "transparent",
					border: "none",
					borderBottom: `2px solid ${textFieldVars.background}`,
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
					[inputHeight]: mapSizeValue("xs"),
					[fontSize]: mapFontSizeValue("xs"),
				},
			},
			[FieldSizes.sm]: {
				vars: {
					[inputHeight]: mapSizeValue("sm"),
					[fontSize]: mapFontSizeValue("sm"),
				},
			},
			[FieldSizes.md]: {
				vars: {
					[inputHeight]: mapSizeValue("md"),
					[fontSize]: mapFontSizeValue("md"),
				},
			},
			[FieldSizes.lg]: {
				vars: {
					[inputHeight]: mapSizeValue("lg"),
					[fontSize]: mapFontSizeValue("md"),
				},
			},
			[FieldSizes.xl]: {
				vars: {
					[inputHeight]: mapSizeValue("xl"),
					[fontSize]: mapFontSizeValue("lg"),
				},
			},
		},
	},
	defaultVariants: {
		theme: "filled",
		size: "md",
	},
});

export type TextFieldVariants = RecipeVariants<typeof textField>;
