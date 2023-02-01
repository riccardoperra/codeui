import { createTheme, keyframes, style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { tokens } from "../../foundation/contract.css";
import { selectThemeVars } from "../Select/Select.css";

export const [dropdownMenuTheme, dropdownMenuThemeVars] = createTheme({
	contentBackground: tokens.dropdownBackground,
	contentRadius: themeTokens.radii.lg,
	contentBoxShadow: tokens.dropdownBoxShadow,
	contentPadding: themeTokens.spacing["2"],
	separator: tokens.separator,
	itemTextColor: tokens.dropdownItemTextColor,
	itemHoverBackground: tokens.dropdownItemHoverBackground,
	itemHoverTextColor: tokens.dropdownItemHoverTextColor,
	itemDisabledOpacity: ".4",
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
	dropdownMenuTheme,
	{
		boxShadow: dropdownMenuThemeVars.contentBoxShadow,
		backgroundColor: dropdownMenuThemeVars.contentBackground,
		borderRadius: dropdownMenuThemeVars.contentRadius,
		padding: dropdownMenuThemeVars.contentPadding,
		overflow: "hidden",
		zIndex: 40,
		listStyleType: "none",
		display: "flex",
		flexDirection: "column",
		rowGap: themeTokens.spacing["1"],
		outline: "none",
		animation: `${contentHide} 250ms ease-in-out`,
	},
	componentStateStyles({
		expanded: {
			animation: `${contentShow} 250ms ease-in-out`,
		},
	}),
]);

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
		borderTop: `1px solid ${dropdownMenuThemeVars.separator}`,
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
		color: dropdownMenuThemeVars.itemTextColor,
		userSelect: "none",
		display: "flex",
		alignItems: "center",
		outline: "none",
		fontWeight: themeTokens.fontWeight.normal,
		transition: "opacity .2s, background-color .2s, transform .2s",
		gap: themeTokens.spacing["2"],
	},
	{
		":focus": {
			boxShadow: "none",
			outline: "none",
			backgroundColor: dropdownMenuThemeVars.itemHoverBackground,
			color: selectThemeVars.itemHoverTextColor,
		},
		":hover": {
			backgroundColor: dropdownMenuThemeVars.itemHoverBackground,
			color: dropdownMenuThemeVars.itemHoverTextColor,
		},
		":disabled": {
			opacity: selectThemeVars.itemDisabledOpacity,
		},
		":focus-visible": {
			backgroundColor: dropdownMenuThemeVars.itemHoverBackground,
			color: dropdownMenuThemeVars.itemHoverTextColor,
		},
	},
	componentStateStyles({
		highlighted: {
			boxShadow: "none",
			outline: "none",
			backgroundColor: dropdownMenuThemeVars.itemHoverBackground,
			color: selectThemeVars.itemHoverTextColor,
		},
		disabled: {
			opacity: selectThemeVars.itemDisabledOpacity,
		},
	}),
]);

export const rightSlot = style([
	{
		paddingLeft: themeTokens.spacing["8"],
		marginLeft: "auto",
		color: tokens.accent9,
		selectors: {
			[`${item}[data-hover] &`]: {
				color: tokens.foreground,
			},
			[`${item}[data-focus] &`]: {
				color: tokens.foreground,
			},
			[`${item}[data-highlighted] &`]: {
				color: tokens.foreground,
			},
		},
	},
]);
