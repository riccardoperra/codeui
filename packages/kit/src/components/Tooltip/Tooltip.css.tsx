import { createTheme, keyframes } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { tokens } from "../../foundation/contract.css";

export const [tooltipTheme, tooltipVars] = createTheme({
	fontSize: "",
	background: "",
	backgroundColor: tokens.neutral,
	hoverBackground: "",
	activeBackground: "",
	color: themeTokens.colors.gray12,
	borderColor: "",
	padding: "",
	borderRadius: themeTokens.radii.md,
	boxShadow: "",
});

const TooltipThemes = {
	primary: "primary",
	secondary: "secondary",
} as const;
const contentShow = keyframes({
	from: {
		opacity: "0",
		transform: "scale(0.96)",
	},
	to: {
		opacity: "1",
		transform: "scale(1)",
	},
});
const contentHide = keyframes({
	from: {
		opacity: "1",
		transform: "scale(1)",
	},
	to: {
		opacity: "0",
		transform: "scale(0.96)",
	},
});
export const tooltipContent = recipe({
	base: [
		tooltipTheme,
		{
			zIndex: 50,
			marginTop: themeTokens.spacing["1"],
			width: "auto",
			padding: themeTokens.spacing["2"],
			borderRadius: themeTokens.radii.xl,
			color: tooltipVars.color,
			backgroundColor: tooltipVars.backgroundColor,
			boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);",
			// animation: `${contentHide} 250ms ease-in forwards`,
			transformOrigin: "var(--kb-tooltip-content-transform-origin)",
		},
		{
			selectors: {
				"[data-expanded] &": {
					animation: `${contentShow} 250ms ease-out;`,
				},
			},
		},
	],
	variants: {
		theme: {
			[TooltipThemes.primary]: {
				vars: {
					[tooltipVars.color]: "#fff",
					[tooltipVars.backgroundColor]: "#3565CA",
				},
			},
			[TooltipThemes.secondary]: {
				vars: {
					[tooltipVars.color]: "#fff",
					[tooltipVars.backgroundColor]: "#7928CA",
				},
			},
		},
	},
});
export type TooltipVariants = RecipeVariants<typeof tooltipContent>;
