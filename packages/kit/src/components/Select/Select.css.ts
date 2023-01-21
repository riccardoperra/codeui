import { style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import {
	baseField,
	FieldSizes,
	fontSize,
	inputHeight,
	textFieldTheme,
	textFieldVars,
} from "../TextField/TextField.css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { mapFontSizeValue, mapSizeValue } from "../../foundation/sizes.css";
import { tokens } from "../../foundation/contract.css";

export const content = style({
	boxShadow: themeTokens.boxShadow.lg,
	// backgroundColor: themeVars.dynamicColors.listBox.panelBackground,
	backgroundColor: tokens.formAccent,
	overflow: "hidden",
	borderRadius: themeTokens.radii.md,
	zIndex: "40",
	listStyleType: "none",
	padding: themeTokens.spacing["2"],
	display: "flex",
	flexDirection: "column",
	rowGap: themeTokens.spacing["1"],
	outline: "none",
});

export const separator = style([
	{
		height: "1px",
		margin: "6px",
		borderTop: `1px solid #52525b`,
	},
]);

export const input = style([
	baseField,
	{
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
]);

export const item = style([
	{
		textAlign: "left",
		justifyContent: "flex-start",
		border: 0,
		margin: 0,
		padding: themeTokens.spacing["2"],
		borderRadius: themeTokens.radii.md,
		background: "transparent",
		color: themeTokens.colors.gray12,
		userSelect: "none",
		display: "flex",
		alignItems: "center",
		outline: "none",
		fontWeight: themeTokens.fontWeight.normal,
		transition: "opacity .2s, background-color .2s, transform .2s",
		gap: themeTokens.spacing["2"],
	},
	componentStateStyles({
		focus: {
			boxShadow: "none",
			outline: "none",
			backgroundColor: themeTokens.colors.blue9,
		},
		hover: {
			backgroundColor: themeTokens.colors.blue9,
		},
		disabled: {
			color: themeTokens.colors.gray10,
		},
		"focus-visible": {
			backgroundColor: themeTokens.colors.blue9,
		},
	}),
]);

export const field = style([
	textFieldTheme,
	{
		display: "flex",
		flexDirection: "column",
		gap: themeTokens.spacing["3"],
		flex: 1,
		height: "100%",
	},
]);

export const selectField = recipe({
	base: [
		baseField,
		{
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "space-between",
			paddingRight: themeTokens.spacing["3"],
			paddingLeft: themeTokens.spacing["3"],
			paddingTop: 0,
			paddingBottom: 0,
			outline: "none",
			width: "100%",
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

export type SelectFieldVariants = RecipeVariants<typeof selectField>;

export { errorMessage, description, label } from "../TextField/TextField.css";
