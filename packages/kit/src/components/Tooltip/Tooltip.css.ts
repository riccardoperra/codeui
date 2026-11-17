import { createTheme, recipe, style } from "../../foundation/layer.css";
import { RecipeVariants } from "@vanilla-extract/recipes";
import { tokens } from "../../foundation/cui.css";
import { popAnimation } from "../../foundation/motion.css";

export const [tooltipTheme, tooltipVars] = createTheme({
	fontSize: tokens.font.size.sm,
	lineHeight: tokens.font.lineHeight.compact,
	backgroundColor: tokens.action.neutral.base,
	color: tokens.action.neutral.text,
	padding: `${tokens.space["2"]} ${tokens.space["4"]}`,
	borderRadius: tokens.radius.xl,
	zIndex: "50",
});

const TooltipThemes = {
	primary: "primary",
	secondary: "secondary",
} as const;

export const tooltipContent = recipe({
	base: [
		tooltipTheme,
		{
			margin: 0,
			width: "auto",
			zIndex: tooltipVars.zIndex,
			fontSize: tooltipVars.fontSize,
			lineHeight: tooltipVars.lineHeight,
			padding: tooltipVars.padding,
			borderRadius: tooltipVars.borderRadius,
			color: tooltipVars.color,
			backgroundColor: tooltipVars.backgroundColor,
			boxShadow: tokens.shadow.md,
		},
		popAnimation(),
	],
	variants: {
		theme: {
			[TooltipThemes.primary]: {
				vars: {
					[tooltipVars.color]: tokens.action.brand.text,
					[tooltipVars.backgroundColor]: tokens.action.brand.base,
				},
			},
			[TooltipThemes.secondary]: {
				vars: {
					[tooltipVars.color]: tokens.action.neutral.text,
					[tooltipVars.backgroundColor]: tokens.action.neutral.base,
				},
			},
		},
	},
	defaultVariants: {
		theme: TooltipThemes.primary,
	},
});

export const trigger = style({
	display: "inline-block",
	appearance: "none",
});

export type TooltipVariants = RecipeVariants<typeof tooltipContent>;
