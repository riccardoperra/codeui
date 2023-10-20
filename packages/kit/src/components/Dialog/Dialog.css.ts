import { createTheme, keyframes, style } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { themeTokens } from "../../foundation/themes.css";
import { responsiveStyle } from "../../foundation/responsive";
import { ComponentSizes } from "../../foundation/sizes";
import { tokens } from "../../foundation/contract.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";

export const [dialogTheme, dialogThemeVars] = createTheme({
	contentBackground: tokens.dialogBackground,
	contentBoxShadow: tokens.dialogBoxShadow,
	contentTextColor: tokens.dialogTextColor,
	contentPadding: themeTokens.spacing["6"],
	panelRadius: themeTokens.radii.lg,
	dividerColor: tokens.separator,
	titleFontSize: themeTokens.fontSize.lg,
	overlayBackground: tokens.dialogOverlayBackground,
});

const contentShow = keyframes({
	from: {
		opacity: 0,
		transform: "scale(0.95) translateY(10px)",
	},
	to: {
		opacity: 1,
		transform: "scale(1) translateY(0px)",
	},
});

const contentHide = keyframes({
	from: {
		opacity: 1,
		transform: "scale(1) translateY(0px)",
	},
	to: {
		opacity: 0,
		transform: "scale(0.95) translateY(10px)",
	},
});

export const overlay = style([
	dialogTheme,
	{
		position: "fixed",
		zIndex: themeTokens.zIndex["40"],
		top: 0,
		inset: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
]);

export const panelContent = style([
	{
		padding: `${dialogThemeVars.contentPadding}`,
		selectors: {
			"[data-full-screen=true] &": {
				overflow: "auto",
				flex: 1,
			},
		},
	},
]);

export const panelFooter = style({
	padding: `${dialogThemeVars.contentPadding}`,
	selectors: {
		"[data-full-screen=true] &": {
			marginTop: "auto",
			marginBottom: "env(safe-area-inset-bottom, 20px)",
		},
	},
});

export const positioner = style({
	position: "fixed",
	inset: 0,
	zIndex: themeTokens.zIndex["40"],
	backgroundColor: dialogThemeVars.overlayBackground,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
});

export const title = style([
	{
		color: dialogThemeVars.contentTextColor,
		height: "52px",
		borderBottom: `1px solid ${dialogThemeVars.dividerColor}`,
		padding: `0 ${dialogThemeVars.contentPadding}`,
		display: "flex",
		alignItems: "center",
		fontSize: dialogThemeVars.titleFontSize,
		fontWeight: themeTokens.fontWeight.medium,
		justifyContent: "space-between",
	},
]);

export const panel = recipe({
	base: [
		{
			display: "inline-flex",
			flexDirection: "column",
			width: "100%",
			padding: 0,
			overflow: "hidden",
			textAlign: "left",
			alignItems: "stretch",
			color: dialogThemeVars.contentTextColor,
			boxShadow: dialogThemeVars.contentBoxShadow,
			borderRadius: dialogThemeVars.panelRadius,
			backgroundColor: dialogThemeVars.contentBackground,
			transform: "translate(0, 0)",
			animation: `${contentHide} 250ms ease-in-out`,

			":focus-visible": {
				outline: "none",
			},
		},
		componentStateStyles({
			expanded: {
				animation: `${contentShow} 250ms ease-in-out`,
			},
		}),
	],

	variants: {
		size: {
			[ComponentSizes.xs]: {
				width: "24rem",
			},
			[ComponentSizes.sm]: {
				width: "28rem",
			},
			[ComponentSizes.md]: {
				width: "32rem",
			},
			[ComponentSizes.lg]: responsiveStyle({
				md: {
					width: "48rem",
				},
			}),
			[ComponentSizes.xl]: responsiveStyle({
				md: {
					width: "48rem",
				},
				lg: {
					width: "64rem",
				},
			}),
			full: {
				padding: 0,
				margin: 0,
				minHeight: "100%",
				width: "100%",
				borderRadius: 0,
				height: "100%",
				":focus-visible": {
					boxShadow: "none",
					outline: "none",
				},
			},
		},
	},
});

export type DialogPanelVariants = RecipeVariants<typeof panel>;
