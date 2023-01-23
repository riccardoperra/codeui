import { style } from "@vanilla-extract/css";
import { mapFontSizeValue, mapSizeValue } from "../../foundation/sizes.css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import {
	FieldSizes,
	fontSize,
	inputHeight,
	textFieldVars,
} from "../TextField/TextField.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";

export const baseField = style({
	appearance: "none",
});

export const baseFieldVariants = recipe({
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

export type BaseFieldVariants = RecipeVariants<typeof baseFieldVariants>;
