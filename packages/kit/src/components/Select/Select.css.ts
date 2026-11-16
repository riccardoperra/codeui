import { createTheme, style } from "../../foundation/layer.css";
import { keyframes } from "@vanilla-extract/css";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { tokens } from "../../foundation/cui.css";
import { presenceAnimation } from "../../foundation/motion.css";
import { baseFieldTheme, baseFieldVars } from "../Field/Field.css";
import { responsiveStyle } from "../../foundation/responsive";

export const [selectTheme, selectThemeVars] = createTheme({
	contentBackground: tokens.surface.menu,
	contentRadius: tokens.radius.lg,
	contentBoxShadow: tokens.shadow.menu,
	contentPadding: tokens.space["2"],
	contentBorderColor: tokens.border.menu,
	contentMaxHeight: "400px",
	contentMaxHeightXs: "270px",
	separator: tokens.border.menu,
	itemMinHeight: tokens.control.height.md,
	itemTextColor: tokens.text.menu,
	itemHoverBackground: tokens.surface.menuHover,
	itemHoverTextColor: tokens.text.menu,
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
		zIndex: 50,
		listStyleType: "none",
		display: "flex",
		flexDirection: "column",
		rowGap: tokens.space["1"],
		outline: "none",
		maxHeight: selectThemeVars.contentMaxHeight,
		border: `${tokens.border.width} solid ${selectThemeVars.contentBorderColor}`,
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
	presenceAnimation({ enter: contentShow, exit: contentHide }),
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
		padding: `${tokens.space["2"]} ${tokens.space["3"]}`,
		borderRadius: tokens.radius.sm,
		background: "transparent",
		color: selectThemeVars.itemTextColor,
		userSelect: "none",
		display: "flex",
		alignItems: "center",
		outline: "none",
		fontWeight: tokens.font.weight.normal,
		gap: tokens.space["2"],
		margin: `${tokens.space["1"]} 0`,
		minHeight: selectThemeVars.itemMinHeight,
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
				paddingRight: `calc(${tokens.space["3"]} + ${selectThemeVars.indicatorSize} + ${tokens.space["2"]})`,
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
		gap: tokens.space["3"],
		flex: 1,
		height: "100%",
	},
]);

export const selectField = style([
	{
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "space-between",
		paddingRight: tokens.space["3"],
		paddingLeft: tokens.space["3"],
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
