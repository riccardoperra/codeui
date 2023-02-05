import { createTheme, style } from "@vanilla-extract/css";
import { tokens } from "../../foundation/contract.css";
import { baseFieldTheme, baseFieldVars } from "../Field/Field.css";
import { themeTokens } from "../../foundation/themes.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";

export const [segmentedFieldTheme, segmentedFieldVars] = createTheme({
	activeSegmentedWidth: "0px",
	activeSegmentedOffset: "0%",
	activeSegmentedBackgroundColor: tokens.segmentedControlActiveBackground,
	segmentedTextColor: tokens.foreground,
	activeSegmentedTextColor: tokens.foreground,
});

export const segmentedGroup = style([
	segmentedFieldTheme,
	baseFieldTheme,
	{
		alignItems: "stretch",
		width: "100%",
		position: "relative",
	},
	{
		display: "flex",
		overflow: "visible",
		borderRadius: themeTokens.radii.md,
		cursor: "default",
		textAlign: "center",
		userSelect: "none",
	},
]);

export const segment = style([
	{
		width: "1px",
		height: "100%",
		position: "relative",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexGrow: 1,
		padding: `0 ${themeTokens.spacing["2"]}`,
		color: segmentedFieldVars.segmentedTextColor,
		opacity: 0.65,
		fontWeight: themeTokens.fontWeight.medium,
		selectors: {
			"&:not(:disabled)": {
				cursor: "pointer",
			},
		},
	},
	componentStateStyles({
		checked: {
			fontWeight: themeTokens.fontWeight.semibold,
			opacity: 1,
			color: segmentedFieldVars.activeSegmentedTextColor,
		},
	}),
]);

export const indicator = style([
	{
		position: "absolute",
		height: "100%",
		left: segmentedFieldVars.activeSegmentedOffset,
		width: segmentedFieldVars.activeSegmentedWidth,
		transition: "left .2s cubic-bezier(.2, 0, 0, 1)",
		"::after": {
			position: "absolute",
			inset: "2px",
			backgroundColor: segmentedFieldVars.activeSegmentedBackgroundColor,
			content: "",
			top: 1,
			boxShadow: themeTokens.boxShadow.lg,
			borderRadius: themeTokens.radii.default,
		},
	},
]);
