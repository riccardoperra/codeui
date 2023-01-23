import { createTheme, style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";
import { tokens } from "../../foundation/contract.css";

export const [popoverTheme, popoverThemeVars] = createTheme({
	contentBackground: tokens.dropdownBackground,
	contentBoxShadow: tokens.dropdownBoxShadow,
	contentMaxWidth: "276px",
	contentRadius: themeTokens.radii.lg,
	contentPadding: themeTokens.spacing["4"],
	contentFontSize: themeTokens.fontSize.md,
	titleColor: tokens.foreground,
	descriptionColor: tokens.foreground,
});

// TODO: common popover/dropdown style
export const content = style([
	popoverTheme,
	{
		boxShadow: popoverThemeVars.contentBoxShadow,
		backgroundColor: popoverThemeVars.contentBackground,
		borderRadius: popoverThemeVars.contentRadius,
		padding: popoverThemeVars.contentPadding,
		maxWidth: popoverThemeVars.contentMaxWidth,
		overflow: "hidden",
		zIndex: "40",
		listStyleType: "none",
		display: "flex",
		flexDirection: "column",
		rowGap: themeTokens.spacing["2"],
		outline: "none",
	},
]);

export const title = style([
	{
		color: popoverThemeVars.titleColor,
		display: "flex",
		alignItems: "center",
		fontSize: themeTokens.fontSize.lg,
		fontWeight: themeTokens.fontWeight.medium,
		justifyContent: "space-between",
	},
]);

export const description = style([
	{
		color: popoverThemeVars.descriptionColor,
		fontSize: popoverThemeVars.contentFontSize,
	},
]);
