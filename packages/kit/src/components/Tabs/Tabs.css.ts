import { createTheme, style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation";
import { tokens } from "../../foundation/contract.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";

export const [tabsTheme, tabsVars] = createTheme({
	tabListIndicatorColor: tokens.accent5,
	tabHeaderHoverBackgroundColor: tokens.brandSecondaryAccentHover,
	tabHeaderHoverColor: tokens.accent7,
	tabHeaderSelectedColor: tokens.brandAccentActive,
	tabIndicatorColor: tokens.brandAccentActive,
});

export const tabsRoot = style([
	tabsTheme,
	{
		selectors: {
			"&[data-orientation=vertical]": {
				display: "flex",
				flex: 1,
				flexShrink: 0,
			},
		},
	},
]);

export const tabsList = style({
	display: "flex",
	position: "relative",

	selectors: {
		"&[data-orientation=horizontal]": {
			borderBottom: `1px solid ${tabsVars.tabListIndicatorColor}`,
		},
		"&[data-orientation=vertical]": {
			alignItems: "stretch",
			flexDirection: "column",
			borderRight: `1px solid ${tabsVars.tabListIndicatorColor}`,
		},
	},
});

export const tabsHeader = style([
	{
		display: "inline-block",
		position: "relative",
		outline: "none",
		padding: `${themeTokens.spacing["2"]} ${themeTokens.spacing["4"]}`,
		fontSize: themeTokens.fontSize.sm,
		fontWeight: themeTokens.fontWeight.semibold,
		transition: "color 250ms ease-in-out",
		":hover": {
			color: tabsVars.tabHeaderHoverColor,
		},
	},
	componentStateStyles({
		selected: {
			color: tabsVars.tabHeaderSelectedColor,
		},
	}),
]);

export const tabsContent = style({
	padding: themeTokens.spacing["2"],
});

export const indicator = style({
	position: "absolute",
	transition: "all .25s",
	backgroundColor: tabsVars.tabIndicatorColor,
	selectors: {
		"&[data-orientation=horizontal]": {
			bottom: "-2px",
			height: "3px",
		},
		"&[data-orientation=vertical]": {
			right: "-1px",
			width: "2px",
		},
	},
});
