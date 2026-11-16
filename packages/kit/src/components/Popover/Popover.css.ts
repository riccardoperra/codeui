import { createTheme, recipe, style } from "../../foundation/layer.css";
import { keyframes } from "@vanilla-extract/css";
import { RecipeVariants } from "@vanilla-extract/recipes";
import { tokens } from "../../foundation/cui.css";
import { presenceAnimation } from "../../foundation/motion.css";

export const [popoverTheme, popoverThemeVars] = createTheme({
	contentBackground: tokens.surface.menu,
	contentBoxShadow: tokens.shadow.menu,
	contentMaxWidth: "276px",
	contentRadius: tokens.radius.lg,
	contentPadding: tokens.space["4"],
	contentFontSize: tokens.font.size.md,
	titleColor: tokens.text.menu,
	descriptionColor: tokens.text.menu,
	contentBorderColor: tokens.border.menu,
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
			overflow: "hidden",
			zIndex: 50,
			listStyleType: "none",
			display: "flex",
			flexDirection: "column",
			rowGap: tokens.space["2"],
			outline: "none",
		},
		presenceAnimation({ enter: contentShow, exit: contentHide }),
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
		fontSize: tokens.font.size.lg,
		fontWeight: tokens.font.weight.medium,
		justifyContent: "space-between",
	},
]);

export const description = style([
	{
		color: popoverThemeVars.descriptionColor,
		fontSize: popoverThemeVars.contentFontSize,
	},
]);

export type PopoverVariants = RecipeVariants<typeof content>;
