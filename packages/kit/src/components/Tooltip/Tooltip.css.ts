import { createTheme, recipe, style } from "../../foundation/layer.css";
import { keyframes } from "@vanilla-extract/css";
import { RecipeVariants } from "@vanilla-extract/recipes";
import { tokens } from "../../foundation/cui.css";
import { presenceAnimation } from "../../foundation/motion.css";

export const [tooltipTheme, tooltipVars] = createTheme({
	fontSize: tokens.font.size.sm,
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

const contentShow = keyframes({
	from: {
		opacity: 0,
		transform: "scale(0.95)",
	},
	to: {
		opacity: 1,
		transform: "scale(1)",
	},
});

const contentHide = keyframes({
	from: {
		opacity: 1,
		transform: "scale(1)",
	},
	to: {
		opacity: 0,
		transform: "scale(0.95)",
	},
});

export const tooltipContent = recipe({
	base: [
		tooltipTheme,
		{
			margin: 0,
			width: "auto",
			zIndex: tooltipVars.zIndex,
			fontSize: tooltipVars.fontSize,
			padding: tooltipVars.padding,
			borderRadius: tooltipVars.borderRadius,
			color: tooltipVars.color,
			backgroundColor: tooltipVars.backgroundColor,
			boxShadow: tokens.shadow.md,
			transformOrigin: "var(--kb-tooltip-content-transform-origin)",
		},
		presenceAnimation({ enter: contentShow, exit: contentHide, fillMode: "forwards" }),
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
