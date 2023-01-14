import { style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";

export const content = style({
	boxShadow: themeTokens.boxShadow.md,
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

		":focus": {
			boxShadow: "none",
			outline: "none",
		},

		":hover": {
			backgroundColor: themeTokens.colors.blue9,
		},
	},
]);
