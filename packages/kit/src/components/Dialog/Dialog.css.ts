import { createTheme, recipe, style } from "../../foundation/layer.css";
import { keyframes } from "@vanilla-extract/css";
import { RecipeVariants } from "@vanilla-extract/recipes";
import { responsiveStyle } from "../../foundation/responsive";
import { ComponentSizes } from "../../foundation/sizes";
import { tokens } from "../../foundation/cui.css";
import { presenceAnimation } from "../../foundation/motion.css";

export const [dialogTheme, dialogThemeVars] = createTheme({
	contentBackground: tokens.surface.dialog,
	contentBoxShadow: tokens.shadow.dialog,
	contentTextColor: tokens.text.dialog,
	contentPadding: tokens.space["6"],
	titleHeight: tokens.control.height.xl,
	panelRadius: tokens.radius.lg,
	dividerColor: tokens.border.dialogTitle,
	titleFontSize: tokens.font.size.lg,
	overlayBackground: tokens.surface.scrim,
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
		zIndex: 40,
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
		overflow: "auto",
		selectors: {
			"[data-panel-size=full] &": {
				flex: 1,
			},
		},
	},
]);

export const panelFooter = style({
	padding: `${dialogThemeVars.contentPadding}`,
	selectors: {
		"[data-panel-size=full] &": {
			marginTop: "auto",
			marginBottom: "env(safe-area-inset-bottom, 20px)",
		},
	},
});

export const positioner = style({
	position: "fixed",
	inset: 0,
	zIndex: 40,
	backgroundColor: dialogThemeVars.overlayBackground,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	paddingTop: tokens.space["2"],
	paddingBottom: tokens.space["2"],
	selectors: { 
		'&[data-panel-size=full]': {
			padding: 0
		}
	}
});

export const title = style([
	{
		color: tokens.text.dialogTitle,
		height: dialogThemeVars.titleHeight,
		borderBottom: `${tokens.border.width} solid ${dialogThemeVars.dividerColor}`,
		padding: `0 ${dialogThemeVars.contentPadding}`,
		display: "flex",
		alignItems: "center",
		fontSize: dialogThemeVars.titleFontSize,
		fontWeight: tokens.font.weight.medium,
		justifyContent: "space-between",
		flexShrink: 0
	},
]);

export const panel = recipe({
	base: [
		{
			display: "inline-flex",
			flexDirection: "column",
			width: "100%",
			maxHeight: "100%",
			padding: 0,
			overflow: "hidden",
			textAlign: "left",
			alignItems: "stretch",
			color: dialogThemeVars.contentTextColor,
			boxShadow: dialogThemeVars.contentBoxShadow,
			borderRadius: dialogThemeVars.panelRadius,
			backgroundColor: dialogThemeVars.contentBackground,
			transform: "translate(0, 0)",

			":focus-visible": {
				outline: "none",
			},
		},
		presenceAnimation({
			enter: contentShow,
			exit: contentHide,
			enterDuration: tokens.motion.duration.panel,
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

export const description = style({
	color: dialogThemeVars.contentTextColor,
	padding: `${dialogThemeVars.contentPadding} ${dialogThemeVars.contentPadding} 0`,
});
