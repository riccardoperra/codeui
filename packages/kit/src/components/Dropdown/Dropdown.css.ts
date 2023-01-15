import { style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";

export const content = style({
	boxShadow: themeTokens.boxShadow.lg,
	// backgroundColor: themeVars.dynamicColors.listBox.panelBackground,
	backgroundColor: themeTokens.colors.gray4,
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

export const subMenuContent = style([
	content,
	{
		boxShadow: themeTokens.boxShadow.xl,
		zIndex: 50,
	},
]);

export const separator = style([
	{
		height: "1px",
		margin: "6px",
		borderTop: `1px solid #52525b`,
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

export const rightSlot = style([
	{
		paddingLeft: themeTokens.spacing["8"],
		marginLeft: "auto",
		color: themeTokens.colors.gray10,
		selectors: {
			[`${item}[data-hover] &`]: {
				color: themeTokens.colors.gray12,
			},
			[`${item}[data-focus] &`]: {
				color: themeTokens.colors.gray12,
			},
		},
	},
]);
