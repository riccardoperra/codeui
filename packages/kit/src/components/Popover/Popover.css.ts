import { createTheme, keyframes, style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";
import { tokens } from "../../foundation/contract.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";

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

const contentShow = keyframes({
	from: {
		opacity: 0,
		transform: "translateY(-10px)",
	},
	to: {
		opacity: 1,
		transform: "translateY(0px)",
	},
});

const contentHide = keyframes({
	from: {
		opacity: 1,
		transform: "translateY(0px)",
	},
	to: {
		opacity: 0,
		transform: "translateY(-10px)",
	},
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
		animation: `${contentHide} 250ms ease-in-out`,
	},
	componentStateStyles({
		expanded: {
			animation: `${contentShow} 250ms ease-in-out`,
		},
	}),
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
