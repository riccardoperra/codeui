import { createTheme, globalStyle, recipe, style } from "../../foundation/layer.css";
import { keyframes } from "@vanilla-extract/css";
import { tokens } from "../../foundation/cui.css";
import { transition } from "../../foundation/motion.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { FieldSizes } from "../Field/Field.css";
import { mapFontSizeValue } from "../../foundation/sizes";

export const [radioTheme, radioVars] = createTheme(
	{
		inputColor: tokens.text.hint,
		inputBackground: tokens.action.brand.base,
		inputInvalidBackground: tokens.action.danger.base,
		inputText: tokens.action.brand.text,
		inputSize: "",
		labelSize: "",
		inputFill: "transparent",
	},
	"radioTheme",
);

export const radioList = recipe(
	{
		base: [
			radioTheme,
			{
				display: "flex",
				gap: tokens.space["4"],
				lineHeight: tokens.font.lineHeight.sm,
				marginTop: tokens.space["1"],
			},
		],
		variants: {
			// `filled` gives the circle the field fill and drops its outline;
			// `inline`, the default, draws the outline on the surface.
			theme: {
				filled: {
					vars: {
						[radioVars.inputColor]: "transparent",
						[radioVars.inputFill]: tokens.surface.input,
					},
				},
				inline: {},
			},
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
	},
	"radioList",
);

export const radioItem = style(
	[
		{
			display: "flex",
			alignItems: "center",
			gap: tokens.space["3"],
			fontSize: radioVars.labelSize,
			lineHeight: tokens.font.lineHeight.sm,
		},
	],
	"radioItem",
);

export const radio = style(
	[
		{
			width: radioVars.inputSize,
			height: radioVars.inputSize,
			position: "relative",
			display: "block",
			flexShrink: 0,
			borderRadius: tokens.radius.full,
			transition: transition(["background-color"]),
			background: radioVars.inputFill,
			color: radioVars.inputText,

			":after": {
				position: "absolute",
				left: 0,
				top: 0,
				right: 0,
				bottom: 0,
				content: "",
				borderRadius: "inherit",
				border: `${tokens.border.width} solid ${radioVars.inputColor}`,
				pointerEvents: "none",
				color: "transparent",
			},

			":hover": {
				background: tokens.surface.input,
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
	],
	"radio",
);

const contentShow = keyframes(
	{
		from: {
			opacity: 0,
			transform: "scale(0.5)",
		},
		to: {
			opacity: 1,
			transform: "scale(1)",
		},
	},
	"contentShow",
);

export const indicator = style(
	{
		margin: "25%",
		width: "50%",
		height: "50%",
		position: "absolute",
		backgroundColor: "currentColor",
		borderRadius: tokens.radius.full,
		animation: `${contentShow} ${tokens.motion.duration.normal} ${tokens.motion.ease.out}`,
		"@media": {
			"(prefers-reduced-motion: reduce)": { animation: "none" },
		},
	},
	"indicator",
);

// The input is visually hidden, so its keyboard focus rings the circle.
globalStyle(`[data-cui="radio-list-item"]:has(input:focus-visible) ${radio}`, {
	outline: `${tokens.focus.width} solid ${tokens.focus.color}`,
	outlineOffset: tokens.focus.offset,
});
