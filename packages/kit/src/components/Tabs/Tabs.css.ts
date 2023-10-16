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

export const tabsList = style({
	display: "flex",
	position: "relative",
	borderBottom: `1px solid ${tabsVars.tabListIndicatorColor}`,

	selectors: {
		"&[data-orientation=vertical]": {
			alignItems: "stretch",
			flexDirection: "column",
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
