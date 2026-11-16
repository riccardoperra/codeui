import { createTheme, style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";
import { transition } from "../../foundation/motion.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";

export const [tabsTheme, tabsVars] = createTheme({
	tabListIndicatorColor: tokens.border.divider,
	tabHeaderHoverBackgroundColor: tokens.action.neutral.hover,
	tabHeaderColor: tokens.text.muted,
	tabHeaderHoverColor: tokens.text.default,
	tabHeaderSelectedColor: tokens.text.default,
	tabIndicatorColor: tokens.accent.selection,
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
			borderBottom: `${tokens.border.width} solid ${tabsVars.tabListIndicatorColor}`,
		},
		"&[data-orientation=vertical]": {
			alignItems: "stretch",
			flexDirection: "column",
			borderRight: `${tokens.border.width} solid ${tabsVars.tabListIndicatorColor}`,
		},
	},
});

export const tabsHeader = style([
	{
		display: "inline-block",
		position: "relative",
		outline: "none",
		padding: `${tokens.space["2"]} ${tokens.space["4"]}`,
		fontSize: tokens.font.size.sm,
		fontWeight: tokens.font.weight.semibold,
		color: tabsVars.tabHeaderColor,
		transition: transition(["color"]),
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
	padding: tokens.space["2"],
});

export const indicator = style({
	position: "absolute",
	transition: transition(["width", "height", "transform", "left", "top"], tokens.motion.duration.normal),
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
