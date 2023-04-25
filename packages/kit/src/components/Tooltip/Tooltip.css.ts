import { createTheme, keyframes, style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { tokens } from "../../foundation/contract.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";

export const [tooltipTheme, tooltipVars] = createTheme({
	fontSize: themeTokens.fontSize.sm,
	backgroundColor: tokens.neutral,
	color: themeTokens.colors.gray12,
	padding: `${themeTokens.spacing["2"]} ${themeTokens.spacing["4"]}`,
	borderRadius: themeTokens.radii.md,
	zIndex: themeTokens.zIndex[50],
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
			borderRadius: themeTokens.radii.xl,
			color: tooltipVars.color,
			backgroundColor: tooltipVars.backgroundColor,
			boxShadow: themeTokens.boxShadow.md,
			animation: `${contentHide} 150ms ease-in forwards`,
			transformOrigin: "var(--kb-tooltip-content-transform-origin)",
		},
		componentStateStyles({
			expanded: {
				animation: `${contentShow} 250ms ease-out`,
			},
		}),
	],
	variants: {
		theme: {
			[TooltipThemes.primary]: {
				vars: {
					// TODO: add generic tokens `foreground` for colors (brand, neutral, negative etc) to use in all components
					[tooltipVars.color]: "#fff",
					[tooltipVars.backgroundColor]: tokens.brand,
				},
			},
			[TooltipThemes.secondary]: {
				vars: {
					[tooltipVars.color]: "#fff",
					[tooltipVars.backgroundColor]: tokens.neutral,
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
