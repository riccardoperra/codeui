import { style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";

export const content = style({
	boxShadow: themeTokens.boxShadow.lg,
	// backgroundColor: themeVars.dynamicColors.listBox.panelBackground,
	backgroundColor: themeTokens.colors.gray4,
	overflow: "hidden",
	borderRadius: themeTokens.radii.md,
	zIndex: "40",
	listStyleType: "none",
	padding: themeTokens.spacing["4"],
	display: "flex",
	flexDirection: "column",
	rowGap: themeTokens.spacing["2"],
	outline: "none",
});

export const title = style([
	{
		color: themeTokens.colors.gray12,
		display: "flex",
		alignItems: "center",
		fontSize: themeTokens.fontSize.lg,
		fontWeight: themeTokens.fontWeight.medium,
		justifyContent: "space-between",
	},
]);

export const description = style([
	{
		color: themeTokens.colors.gray12,
		fontSize: themeTokens.fontSize.md,
	},
]);
