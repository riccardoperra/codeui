import { createTheme, recipe } from "../../foundation/layer.css";
import { createVar, fallbackVar } from "@vanilla-extract/css";
import { mapFontSizeValue, mapSizeValue } from "../../foundation/sizes";
import { RecipeVariants } from "@vanilla-extract/recipes";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { tokens } from "../../foundation/cui.css";
import { transition } from "../../foundation/motion.css";

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
	borderColor: tokens.border.input,
	background: tokens.surface.input,
	color: tokens.text.input,
	inputHeight: inputHeight,
	fontSize: fontSize,
	descriptionColor: tokens.text.hint,
	disabledBackground: tokens.surface.dialog,
});

export const baseFieldVariants = recipe({
	base: [
		{
			appearance: "none",
			border: `${tokens.border.width} solid ${baseFieldVars.borderColor}`,
			backgroundColor: baseFieldVars.background,
			borderRadius: tokens.radius.md,
			width: "100%",
			minWidth: "0px",
			fontSize: baseFieldVars.fontSize,
			height: fallbackVar(baseFieldVars.inputHeight, "100%"),
			color: baseFieldVars.color,
			transition: transition(["border-color"]),
			"::placeholder": {
				color: tokens.text.hint,
				opacity: 1,
			},
		},
		{
			":focus": {
				borderColor: tokens.focus.color,
			},
		},
		componentStateStyles({
			invalid: {
				borderColor: tokens.text.danger,
				color: tokens.text.danger,
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
				borderRadius: tokens.radius.xs,
			},
			[FieldSizes.sm]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("sm"),
					[baseFieldVars.fontSize]: mapFontSizeValue("sm"),
				},
				borderRadius: tokens.radius.sm,
			},
			[FieldSizes.md]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("md"),
					[baseFieldVars.fontSize]: mapFontSizeValue("md"),
				},
				borderRadius: tokens.radius.md,
			},
			[FieldSizes.lg]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("lg"),
					[baseFieldVars.fontSize]: mapFontSizeValue("md"),
				},
				borderRadius: tokens.radius.lg,
			},
			[FieldSizes.xl]: {
				vars: {
					[baseFieldVars.inputHeight]: mapSizeValue("xl"),
					[baseFieldVars.fontSize]: mapFontSizeValue("lg"),
				},
				borderRadius: tokens.radius.xl,
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
					borderBottom: `${tokens.border.widthStrong} solid ${baseFieldVars.background}`,
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
