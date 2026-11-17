import { createTheme, style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";
import { baseFieldTheme, FieldSizes } from "../Field/Field.css";

export const [numberFieldTheme, numberFieldVars] = createTheme({
	controlSize: "",
});

export const baseFieldContainer = style([
	baseFieldTheme,
	{
		display: "flex",
		flexDirection: "column",
		gap: tokens.space["3"],
	},
]);

export const textField = style([
	{
		paddingRight: tokens.space["3"],
		paddingLeft: tokens.space["3"],
		paddingTop: 0,
		paddingBottom: 0,
		outline: "none",
	},
]);

export const numberFieldContainer = style({
	position: "relative",
});

export const controlsContainer = style({
	position: "absolute",
	right: tokens.space["2"],
	top: "50%",
	transform: `translateY(-50%)`,
	flexDirection: "column",
	flexWrap: "nowrap",
	gap: "0px",
	zIndex: 10,
	display: "none",
	backgroundColor: tokens.surface.inputAccent,
	color: tokens.text.input,
	borderRadius: tokens.radius.md,

	selectors: {
		[`${numberFieldContainer}:hover &`]: {
			display: "flex",
		},
		[`${numberFieldContainer}:has(${textField}:focus) &`]: {
			display: "flex",
		},
	},
});

export const controlButton = style({
	appearance: "none",
	border: "0",
	background: "transparent",
	color: "inherit",
	cursor: "pointer",
	width: numberFieldVars.controlSize,
	height: numberFieldVars.controlSize,
	padding: 0,

	selectors: {
		[`${baseFieldContainer}[data-field-size=${FieldSizes.xs}] &`]: {
			vars: {
				[numberFieldVars.controlSize]: "12px",
			},
		},
		[`${baseFieldContainer}[data-field-size=${FieldSizes.sm}] &`]: {
			vars: {
				[numberFieldVars.controlSize]: "14px",
			},
		},
		[`${baseFieldContainer}[data-field-size=${FieldSizes.md}] &`]: {
			vars: {
				[numberFieldVars.controlSize]: "16px",
			},
		},
		[`${baseFieldContainer}[data-field-size=${FieldSizes.lg}] &`]: {
			vars: {
				[numberFieldVars.controlSize]: "18px",
			},
		},
		[`${baseFieldContainer}[data-field-size=${FieldSizes.xl}] &`]: {
			vars: {
				[numberFieldVars.controlSize]: "20px",
			},
		},
	},
});

export const control = style({
	width: "inherit",
	height: "inherit",
});
