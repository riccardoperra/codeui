import { createTheme, style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";
import { baseFieldTheme, FieldSizes } from "../Field/Field.css";
import { themeVars } from "../../foundation";

export const [numberFieldTheme, numberFieldVars] = createTheme({
	controlSize: "",
});

export const baseFieldContainer = style([
	baseFieldTheme,
	{
		display: "flex",
		flexDirection: "column",
		gap: themeTokens.spacing["3"],
	},
]);

export const textField = style([
	{
		paddingRight: themeTokens.spacing["3"],
		paddingLeft: themeTokens.spacing["3"],
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
	right: "8px",
	top: "50%",
	transform: `translateY(-50%)`,
	flexDirection: "column",
	flexWrap: "nowrap",
	gap: "0px",
	zIndex: themeTokens.zIndex["10"],
	display: "none",
	backgroundColor: themeVars.formAccentBorder,
	borderRadius: themeTokens.radii.md,

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
