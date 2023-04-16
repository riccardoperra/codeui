import { createTheme, keyframes, style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { tokens } from "../../foundation/contract.css";
import { baseFieldTheme, baseFieldVars } from "../Field/Field.css";
import { responsiveStyle } from "../../foundation/responsive";
import { dropdownMenuThemeVars } from "../Dropdown/Dropdown.css";

export const [selectTheme, selectThemeVars] = createTheme({
	contentBackground: tokens.dropdownBackground,
	contentRadius: themeTokens.radii.lg,
	contentBoxShadow: tokens.dropdownBoxShadow,
	contentPadding: themeTokens.spacing["2"],
	contentBorderColor: tokens.dropdownBorder,
	contentMaxHeight: "400px",
	contentMaxHeightXs: "270px",
	separator: tokens.dropdownBorder,
	itemTextColor: tokens.dropdownItemTextColor,
	itemHoverBackground: tokens.dropdownItemHoverBackground,
	itemHoverTextColor: tokens.dropdownItemHoverTextColor,
	itemDisabledOpacity: ".4",
	indicatorSize: "20px",
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
		animation: `${contentHide} 250ms ease-in-out`,
		border: `1px solid ${selectThemeVars.contentBorderColor}`,
	},
	responsiveStyle({
		xs: {
			vars: {
				[selectThemeVars.contentMaxHeight]: selectThemeVars.contentMaxHeightXs,
			},
		},
		sm: {
			vars: {
				[selectThemeVars.contentMaxHeight]: "400px",
			},
		},
	}),
	componentStateStyles({
		expanded: {
			animation: `${contentShow} 250ms ease-in-out`,
		},
	}),
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
		justifyContent: "space-between",
		border: 0,
		padding: `${themeTokens.spacing["2"]} ${themeTokens.spacing["3"]}`,
		borderRadius: themeTokens.radii.sm,
		background: "transparent",
		color: selectThemeVars.itemTextColor,
		userSelect: "none",
		display: "flex",
		alignItems: "center",
		outline: "none",
		fontWeight: themeTokens.fontWeight.normal,
		transition: "opacity .2s, background-color .2s, transform .2s",
		gap: themeTokens.spacing["2"],
		margin: `${themeTokens.spacing["1"]} 0`,
		minHeight: "2.60rem",
		selectors: {
			"&:first-child,&:last-child": {
				margin: 0,
			},
		},
	},
	{
		":disabled": {
			opacity: selectThemeVars.itemDisabledOpacity,
		},
		":focus": {
			boxShadow: "none",
			outline: "none",
			backgroundColor: selectThemeVars.itemHoverBackground,
			color: selectThemeVars.itemHoverTextColor,
		},
		":focus-visible": {
			backgroundColor: selectThemeVars.itemHoverBackground,
			color: selectThemeVars.itemHoverTextColor,
		},
	},
	componentStateStyles({
		highlighted: {
			boxShadow: "none",
			outline: "none",
			backgroundColor: selectThemeVars.itemHoverBackground,
			color: selectThemeVars.itemHoverTextColor,
		},
		selected: {
			not: {
				paddingRight: `calc(${themeTokens.spacing["3"]} + ${selectThemeVars.indicatorSize} + ${themeTokens.spacing["2"]})`,
			},
		},
		disabled: {
			opacity: selectThemeVars.itemDisabledOpacity,
			not: {
				":hover": {},
			},
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
		fontSize: baseFieldVars.fontSize,
	},
]);

export const itemIndicator = style({
	marginLeft: "auto",
	height: selectThemeVars.indicatorSize,
	width: selectThemeVars.indicatorSize,
});
