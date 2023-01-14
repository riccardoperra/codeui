import { createTheme, style } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { themeTokens } from "../../foundation/themes.css";

export const [dialogTheme, dialogThemeVars] = createTheme({
	contentPadding: themeTokens.spacing["6"],
	panelRadius: themeTokens.radii.lg,
	titleTextColor: themeTokens.colors.gray12,
	panelTextColor: themeTokens.colors.gray12,
	dividerColor: themeTokens.colors.gray6,
	panelBackground: "#1d1d1d",
	titleFontSize: themeTokens.fontSize.lg,
	panelShadow: `0 10px 30px 0 rgba(0,0,0,.15), inset 0 0 0 1px ${themeTokens.colors.gray3}`,
});

export const overlay = style([
	dialogTheme,
	{
		position: "fixed",
		zIndex: "50",
		top: 0,
		inset: 0,
		left: 0,
		right: 0,
		bottom: 0,
		selectors: {
			["&[data-visible=false]"]: {
				visibility: "hidden",
			},
		},
	},
]);

export const panelContent = style({
	padding: `${dialogThemeVars.contentPadding}`,
	selectors: {
		"[data-full-screen=true] &": {
			overflow: "auto",
			flex: 1,
		},
	},
});

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
	zIndex: 50,
	backgroundColor: "rgba(0,0,0,.7)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	selectors: {
		["&[data-visible=false]"]: {
			visibility: "hidden",
		},
	},
});

export const title = style([
	{
		color: dialogThemeVars.titleTextColor,
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
	base: {
		display: "inline-flex",
		flexDirection: "column",
		width: "100%",
		padding: 0,
		overflow: "hidden",
		textAlign: "left",
		color: dialogThemeVars.panelTextColor,
		alignItems: "stretch",
		boxShadow: dialogThemeVars.panelShadow,
		borderRadius: dialogThemeVars.panelRadius,
		backgroundColor: dialogThemeVars.panelBackground,
		transform: "translate(0, 0)",

		":focus-visible": {
			outline: "none",
		},
	},

	// TODO: Add responsive breakpoints from @codeimage/website
	variants: {
		size: {
			xs: {
				"@media": {
					"screen and (min-width: 768px)": {
						width: "24rem",
					},
				},
			},
			sm: {
				"@media": {
					"screen and (min-width: 768px)": {
						width: "28rem",
					},
				},
			},
			md: {
				"@media": {
					"screen and (min-width: 768px)": {
						width: "32rem",
					},
				},
			},
			lg: {
				"@media": {
					"screen and (min-width: 768px)": {
						width: "48rem",
					},
				},
			},
			xl: {
				"@media": {
					"screen and (min-width: 768px)": {
						width: "64rem",
					},
				},
			},
			full: {
				padding: 0,
				margin: 0,
				minHeight: "100%",
				width: "100%",
				height: "100%",
				":focus-visible": {
					boxShadow: "none",
					outline: "none",
				},
			},
		},
	},
});

export const close = style({
	fontSize: "16px",
});

export type DialogPanelVariants = RecipeVariants<typeof panel>;
