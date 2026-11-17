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

export const inputHeight = createVar("inputHeight");
export const fontSize = createVar("fontSize");

export const [baseFieldTheme, baseFieldVars] = createTheme(
	{
		borderColor: tokens.border.input,
		background: tokens.surface.input,
		color: tokens.text.input,
		inputHeight: inputHeight,
		fontSize: fontSize,
		descriptionColor: tokens.text.hint,
		disabledBackground: tokens.surface.dialog,
	},
	"baseFieldTheme",
);

export const baseFieldVariants = recipe(
	{
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
				lineHeight: tokens.font.lineHeight.sm,
				":focus": {
					borderColor: tokens.focus.color,
				},
				":focus-visible": {
					outline: `${tokens.focus.width} solid ${tokens.focus.color}`,
					outlineOffset: tokens.focus.offset,
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
				// Inkstone §6: 36px and Label text on desktop; 40px and 16px text
				// on a phone, so iOS does not zoom into the field.
				[FieldSizes.md]: {
					vars: {
						[baseFieldVars.inputHeight]: mapSizeValue("sm"),
						[baseFieldVars.fontSize]: mapFontSizeValue("sm"),
					},
					borderRadius: tokens.radius.md,
					"@media": {
						"(max-width: 768px)": {
							vars: {
								[baseFieldVars.inputHeight]: mapSizeValue("md"),
								[baseFieldVars.fontSize]: mapFontSizeValue("md"),
							},
						},
					},
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
	},
	"baseFieldVariants",
);

export type BaseFieldVariants = RecipeVariants<typeof baseFieldVariants>;
