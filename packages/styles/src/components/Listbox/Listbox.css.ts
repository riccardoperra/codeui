import { createTheme, style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { LISTBOX_ITEM_SIZE } from "./sizes";
import { toPx } from "../../utils/css";

export const [listTheme, listThemeVars] = createTheme(
	{
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
	},
	"listTheme",
);

const ButtonSizes = {
	xs: "xs",
	sm: "sm",
	md: "md",
	lg: "lg",
	xl: "xl",
} as const;

export const list = style(
	[
		listTheme,
		{
			borderRadius: tokens.radius.sm,

			":focus-visible": {
				outline: "none",
			},

			selectors: {
				"&[data-bordered]": {
					outline: "none",
					padding: tokens.space["2"],
					border: `${tokens.border.width} solid ${tokens.border.divider}`,
				},
				"&[data-bordered]:focus-visible": {
					borderColor: tokens.focus.color,
				},
				// A highlighted row is neutral in both themes: field fill and primary
				// text, never an accent fill (Inkstone §2.3).
				"&:is([data-theme=primary], [data-theme=neutral])": {
					vars: {
						[listThemeVars.itemTextColor]: tokens.text.menu,
						[listThemeVars.itemHoverBackground]: tokens.surface.menuHover,
						[listThemeVars.itemHoverTextColor]: tokens.text.menu,
					},
				},
			},
		},
	],
	"list",
);

/**
 * TODO: same as select!
 */
export const item = style(
	[
		{
			textAlign: "left",
			justifyContent: "space-between",
			border: 0,
			padding: `${tokens.space["2"]} ${tokens.space["3"]}`,
			borderRadius: tokens.radius.sm,
			background: "transparent",
			color: listThemeVars.itemTextColor,
			userSelect: "none",
			display: "flex",
			alignItems: "center",
			outline: "none",
			fontWeight: tokens.font.weight.normal,
			gap: tokens.space["2"],
			margin: `${tokens.space["1"]} 0`,
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
					fontSize: tokens.font.size.sm,
					borderRadius: tokens.radius.xs,
					minHeight: 0,
				},
				[`&[data-size=${ButtonSizes.sm}]`]: {
					height: toPx(LISTBOX_ITEM_SIZE.sm),
					fontSize: tokens.font.size.md,
					minHeight: 0,
				},
				[`&[data-size=${ButtonSizes.md}]`]: {
					height: toPx(LISTBOX_ITEM_SIZE.md),
					fontSize: tokens.font.size.md,
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
	],
	"item",
);

export const itemIndicator = style(
	{
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
	},
	"itemIndicator",
);
