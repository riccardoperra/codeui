import { createTheme, style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { tokens } from "../../foundation/contract.css";
import { baseFieldTheme } from "../Field/Field.css";

export const [selectTheme, selectThemeVars] = createTheme({
	contentBackground: tokens.dropdownBackground,
	contentRadius: themeTokens.radii.lg,
	contentBoxShadow: tokens.dropdownBoxShadow,
	contentPadding: themeTokens.spacing["2"],
	contentMaxHeight: "400px",
	separator: tokens.separator,
	itemTextColor: tokens.dropdownItemTextColor,
	itemHoverBackground: tokens.dropdownItemHoverBackground,
	itemHoverTextColor: tokens.dropdownItemHoverTextColor,
	itemDisabledOpacity: ".4",
});

// TODO: common popover/dropdown style
export const content = style([
	selectTheme,
	{
		boxShadow: selectThemeVars.contentBoxShadow,
		backgroundColor: selectThemeVars.contentBackground,
		borderRadius: selectThemeVars.contentRadius,
		padding: selectThemeVars.contentPadding,
		overflow: "auto",
		zIndex: "40",
		listStyleType: "none",
		display: "flex",
		flexDirection: "column",
		rowGap: themeTokens.spacing["1"],
		outline: "none",
		maxHeight: selectThemeVars.contentMaxHeight,
	},
]);

export const separator = style([
	{
		height: "1px",
		margin: "6px",
		borderTop: `1px solid ${selectThemeVars.separator}`,
	},
]);

export const input = style([
	{
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
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
		color: selectThemeVars.itemTextColor,
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
			backgroundColor: selectThemeVars.itemHoverBackground,
			color: selectThemeVars.itemHoverTextColor,
		},
		hover: {
			backgroundColor: selectThemeVars.itemHoverBackground,
			color: selectThemeVars.itemHoverTextColor,
		},
		disabled: {
			opacity: selectThemeVars.itemDisabledOpacity,
		},
		"focus-visible": {
			backgroundColor: selectThemeVars.itemHoverBackground,
			color: selectThemeVars.itemHoverTextColor,
		},
	}),
]);

export const field = style([
	baseFieldTheme,
	{
		display: "flex",
		flexDirection: "column",
		gap: themeTokens.spacing["3"],
		flex: 1,
		height: "100%",
	},
]);

export const selectField = style([
	{
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "space-between",
		paddingRight: themeTokens.spacing["3"],
		paddingLeft: themeTokens.spacing["3"],
		paddingTop: 0,
		paddingBottom: 0,
		outline: "none",
		width: "100%",
	},
]);
