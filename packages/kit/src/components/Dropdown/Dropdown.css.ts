import { createTheme, style } from "../../foundation/layer.css";
import { keyframes } from "@vanilla-extract/css";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { tokens } from "../../foundation/cui.css";
import { presenceAnimation } from "../../foundation/motion.css";

export const [dropdownMenuTheme, dropdownMenuThemeVars] = createTheme({
	contentBackground: tokens.surface.menu,
	contentRadius: tokens.radius.lg,
	contentBoxShadow: tokens.shadow.menu,
	contentPadding: tokens.space["2"],
	contentBorderColor: tokens.border.menu,
	separator: tokens.border.menu,
	itemTextColor: tokens.text.menu,
	itemHoverBackground: tokens.surface.menuHover,
	itemHoverTextColor: tokens.text.menu,
	itemDisabledOpacity: ".4",
	itemMinHeight: tokens.control.height.md,
	itemPadding: `${tokens.space["2"]} ${tokens.space["3"]}`,
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
		zIndex: 50,
		listStyleType: "none",
		display: "flex",
		flexDirection: "column",
		rowGap: tokens.space["1"],
		outline: "none",
		border: `${tokens.border.width} solid ${dropdownMenuThemeVars.contentBorderColor}`,
	},
	presenceAnimation({ enter: contentShow, exit: contentHide }),
]);

export const subMenuContent = style([
	content,
	{
		boxShadow: tokens.shadow.menu,
		zIndex: 50,
	},
]);

export const separator = style([
	{
		height: tokens.space.px,
		margin: tokens.space["1.5"],
		borderTop: `${tokens.border.width} solid ${dropdownMenuThemeVars.separator}`,
	},
]);

export const item = style([
	{
		textAlign: "left",
		justifyContent: "flex-start",
		border: 0,
		margin: 0,
		padding: dropdownMenuThemeVars.itemPadding,
		borderRadius: tokens.radius.sm,
		background: "transparent",
		color: dropdownMenuThemeVars.itemTextColor,
		userSelect: "none",
		display: "flex",
		alignItems: "center",
		outline: "none",
		fontWeight: tokens.font.weight.normal,
		gap: tokens.space["2"],
		minHeight: dropdownMenuThemeVars.itemMinHeight,
	},
	{
		":focus": {
			boxShadow: "none",
			outline: "none",
		},
		":disabled": {
			opacity: dropdownMenuThemeVars.itemDisabledOpacity,
		},
		":focus-visible": {
			boxShadow: "none",
			outline: "none",
		},
	},
	componentStateStyles({
		highlighted: {
			boxShadow: "none",
			outline: "none",
			backgroundColor: dropdownMenuThemeVars.itemHoverBackground,
			color: dropdownMenuThemeVars.itemHoverTextColor,
		},
		disabled: {
			opacity: dropdownMenuThemeVars.itemDisabledOpacity,
		},
	}),
]);

export const rightSlot = style([
	{
		paddingLeft: tokens.space["8"],
		marginLeft: "auto",
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		color: tokens.text.muted,
		selectors: {
			[`${item}[data-hover] &`]: {
				color: dropdownMenuThemeVars.itemHoverTextColor,
			},
			[`${item}[data-focus] &`]: {
				color: dropdownMenuThemeVars.itemHoverTextColor,
			},
			[`${item}[data-highlighted] &`]: {
				color: dropdownMenuThemeVars.itemHoverTextColor,
			},
		},
	},
]);
