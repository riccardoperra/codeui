import { createTheme, style } from "@vanilla-extract/css";
import { tokens } from "../../foundation/contract.css";
import { themeTokens, themeVars } from "../../foundation";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { LISTBOX_ITEM_SIZE } from "./sizes";
import { toPx } from "../../utils/css";

export const [listTheme, listThemeVars] = createTheme({
	contentBackground: tokens.dropdownBackground,
	contentRadius: themeTokens.radii.lg,
	contentBoxShadow: tokens.dropdownBoxShadow,
	contentPadding: themeTokens.spacing["2"],
	contentBorderColor: tokens.dropdownBorder,
	contentMaxHeight: "400px",
	contentMaxHeightXs: "270px",
	separator: tokens.dropdownBorder,
	itemMinHeight: "2.60rem",
	itemTextColor: tokens.dropdownItemTextColor,
	itemHoverBackground: tokens.dropdownItemHoverBackground,
	itemHoverTextColor: tokens.dropdownItemHoverTextColor,
	itemDisabledOpacity: ".4",
	indicatorSize: "20px",
});

const ButtonSizes = {
	xs: "xs",
	sm: "sm",
	md: "md",
	lg: "lg",
	xl: "xl",
} as const;

export const list = style([
	listTheme,
	{
		borderRadius: themeTokens.radii.sm,

		":focus-visible": {
			outline: "none",
		},

		selectors: {
			"&[data-bordered]": {
				outline: "none",
				padding: themeTokens.spacing["2"],
				border: `1px solid ${themeVars.separator}`,
			},
			"&[data-bordered]:focus-visible": {
				borderColor: themeVars.brand,
			},
			"&[data-theme=primary]": {
				vars: {
					[listThemeVars.itemTextColor]: tokens.dropdownItemTextColor,
					[listThemeVars.itemHoverBackground]: tokens.brandAccentHover,
					[listThemeVars.itemHoverTextColor]: tokens.dropdownItemHoverTextColor,
				},
			},
			"&[data-theme=neutral]": {
				vars: {
					[listThemeVars.itemTextColor]: tokens.dropdownItemTextColor,
					[listThemeVars.itemHoverBackground]: tokens.dropdownItemHoverBackground,
					[listThemeVars.itemHoverTextColor]: tokens.dropdownItemHoverTextColor,
				},
			},
		},
	},
]);

/**
 * TODO: same as select!
 */
export const item = style([
	{
		textAlign: "left",
		justifyContent: "space-between",
		border: 0,
		padding: `${themeTokens.spacing["2"]} ${themeTokens.spacing["3"]}`,
		borderRadius: themeTokens.radii.sm,
		background: "transparent",
		color: listThemeVars.itemTextColor,
		userSelect: "none",
		display: "flex",
		alignItems: "center",
		outline: "none",
		fontWeight: themeTokens.fontWeight.normal,
		transition: "opacity .2s, background-color .2s, transform .2s",
		gap: themeTokens.spacing["2"],
		margin: `${themeTokens.spacing["1"]} 0`,
		minHeight: listThemeVars.itemMinHeight,
		selectors: {
			"&:first-child,&:last-child": {
				margin: 0,
			},
		},
	},
	{
		selectors: {
			[`&[data-size=${ButtonSizes.xs}]`]: {
				height: toPx(LISTBOX_ITEM_SIZE.xs),
				fontSize: themeTokens.fontSize.sm,
				borderRadius: themeTokens.radii.xs,
				minHeight: 0,
			},
			[`&[data-size=${ButtonSizes.sm}]`]: {
				height: toPx(LISTBOX_ITEM_SIZE.sm),
				fontSize: themeTokens.fontSize.md,
				minHeight: 0,
			},
			[`&[data-size=${ButtonSizes.md}]`]: {
				height: toPx(LISTBOX_ITEM_SIZE.md),
				fontSize: themeTokens.fontSize.md,
			},
		},
	},
	{
		":disabled": {
			opacity: listThemeVars.itemDisabledOpacity,
		},
		":focus": {
			boxShadow: "none",
			outline: "none",
			backgroundColor: listThemeVars.itemHoverBackground,
			color: listThemeVars.itemHoverTextColor,
		},
		":focus-visible": {
			backgroundColor: listThemeVars.itemHoverBackground,
			color: listThemeVars.itemHoverTextColor,
		},
	},
	componentStateStyles({
		highlighted: {
			boxShadow: "none",
			outline: "none",
			backgroundColor: listThemeVars.itemHoverBackground,
			color: listThemeVars.itemHoverTextColor,
		},
		disabled: {
			opacity: listThemeVars.itemDisabledOpacity,
			not: {
				":hover": {},
			},
		},
	}),
]);

export const itemIndicator = style({
	marginLeft: "auto",
	height: listThemeVars.indicatorSize,
	width: listThemeVars.indicatorSize,
	strokeDashoffset: 32,
	selectors: {
		[`${item}[data-selected] &`]: {
			strokeDashoffset: 0,
		},
		[`&[data-size=${ButtonSizes.xs}]`]: {
			vars: {
				[listThemeVars.indicatorSize]: "14px",
			},
		},
		[`&[data-size=${ButtonSizes.sm}]`]: {
			vars: {
				[listThemeVars.indicatorSize]: "18px",
			},
		},
		[`&[data-size=${ButtonSizes.md}]`]: {
			vars: {
				[listThemeVars.indicatorSize]: "20px",
			},
		},
	},
});
