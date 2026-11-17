import { createTheme, recipe, style } from "../../foundation/layer.css";
import { RecipeVariants } from "@vanilla-extract/recipes";
import { tokens } from "../../foundation/cui.css";
import { popAnimation } from "../../foundation/motion.css";

export const [popoverTheme, popoverThemeVars] = createTheme({
	contentBackground: tokens.surface.dialog,
	contentBoxShadow: tokens.shadow.dialog,
	contentMaxWidth: `min(360px, calc(100vw - 2 * ${tokens.space["4"]}))`,
	contentRadius: tokens.radius.xl,
	contentPadding: tokens.space["4"],
	contentFontSize: tokens.font.size.sm,
	contentLineHeight: tokens.font.lineHeight.snug,
	titleColor: tokens.text.dialogTitle,
	titleFontSize: tokens.font.size.md,
	descriptionColor: tokens.text.dialog,
	contentBorderColor: tokens.border.menu,
});

export const content = recipe({
	base: [
		popoverTheme,
		{
			boxShadow: popoverThemeVars.contentBoxShadow,
			backgroundColor: popoverThemeVars.contentBackground,
			borderRadius: popoverThemeVars.contentRadius,
			padding: popoverThemeVars.contentPadding,
			maxWidth: popoverThemeVars.contentMaxWidth,
			color: popoverThemeVars.descriptionColor,
			fontSize: popoverThemeVars.contentFontSize,
			lineHeight: popoverThemeVars.contentLineHeight,
			overflow: "hidden",
			zIndex: 50,
			listStyleType: "none",
			display: "flex",
			flexDirection: "column",
			rowGap: tokens.space["2"],
			outline: "none",
		},
		popAnimation(),
	],
	variants: {
		variant: {
			bordered: {
				border: `${tokens.border.width} solid ${popoverThemeVars.contentBorderColor}`,
			},
		},
	},
});

export const title = style([
	{
		color: popoverThemeVars.titleColor,
		display: "flex",
		alignItems: "center",
		fontSize: popoverThemeVars.titleFontSize,
		lineHeight: popoverThemeVars.contentLineHeight,
		fontWeight: tokens.font.weight.semibold,
		justifyContent: "space-between",
	},
]);

export const description = style([
	{
		color: popoverThemeVars.descriptionColor,
		fontSize: popoverThemeVars.contentFontSize,
		lineHeight: popoverThemeVars.contentLineHeight,
	},
]);

export type PopoverVariants = RecipeVariants<typeof content>;
