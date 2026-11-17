import { createTheme, style } from "../../foundation/layer.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { tokens } from "../../foundation/cui.css";
import { popAnimation } from "../../foundation/motion.css";

export const [dropdownMenuTheme, dropdownMenuThemeVars] = createTheme(
	{
		contentBackground: tokens.surface.dialog,
		contentRadius: tokens.radius.card,
		contentBoxShadow: tokens.shadow.dialog,
		contentPadding: tokens.space["1.5"],
		contentMinWidth: tokens.space["48"],
		contentBorderColor: tokens.border.menu,
		separator: tokens.border.menu,
		itemTextColor: tokens.text.menu,
		itemHoverBackground: tokens.surface.menuHover,
		itemHoverTextColor: tokens.text.menu,
		itemDisabledOpacity: ".4",
		itemMinHeight: tokens.control.height.sm,
		itemPadding: `${tokens.space["1.5"]} ${tokens.space["2.5"]}`,
		itemRadius: tokens.radius.nav,
		itemFontSize: tokens.font.size.sm,
		itemLineHeight: tokens.font.lineHeight.snug,
	},
	"dropdownMenuTheme",
);

export const content = style(
	[
		dropdownMenuTheme,
		{
			boxShadow: dropdownMenuThemeVars.contentBoxShadow,
			backgroundColor: dropdownMenuThemeVars.contentBackground,
			borderRadius: dropdownMenuThemeVars.contentRadius,
			padding: dropdownMenuThemeVars.contentPadding,
			minWidth: `max(${dropdownMenuThemeVars.contentMinWidth}, var(--cui-popper-anchor-width, 0px))`,
			color: dropdownMenuThemeVars.itemTextColor,
			fontSize: dropdownMenuThemeVars.itemFontSize,
			lineHeight: dropdownMenuThemeVars.itemLineHeight,
			overflow: "hidden",
			zIndex: 50,
			listStyleType: "none",
			display: "flex",
			flexDirection: "column",
			rowGap: tokens.space["0.5"],
			outline: "none",
		},
		popAnimation(),
	],
	"content",
);

export const subMenuContent = style(
	[
		content,
		{
			zIndex: 50,
		},
	],
	"subMenuContent",
);

export const separator = style(
	[
		{
			height: tokens.space.px,
			margin: tokens.space["1.5"],
			borderTop: `${tokens.border.width} solid ${dropdownMenuThemeVars.separator}`,
		},
	],
	"separator",
);

export const item = style(
	[
		{
			textAlign: "left",
			justifyContent: "flex-start",
			border: 0,
			margin: 0,
			padding: dropdownMenuThemeVars.itemPadding,
			borderRadius: dropdownMenuThemeVars.itemRadius,
			background: "transparent",
			color: dropdownMenuThemeVars.itemTextColor,
			userSelect: "none",
			display: "flex",
			alignItems: "center",
			outline: "none",
			fontFamily: "inherit",
			fontSize: dropdownMenuThemeVars.itemFontSize,
			lineHeight: dropdownMenuThemeVars.itemLineHeight,
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
	],
	"item",
);

export const rightSlot = style(
	[
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
	],
	"rightSlot",
);
