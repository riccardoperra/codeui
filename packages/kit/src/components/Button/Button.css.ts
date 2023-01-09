import { createTheme } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { themeTokens } from "../../foundation/themes.css";

export const [buttonTheme, buttonVars] = createTheme({
	buttonHeight: "",
	fontSize: "",
});

export const enum ButtonSizes {
	xs = "xs",
	sm = "sm",
	md = "md",
	lg = "lg",
	xl = "xl",
}

export const button = recipe({
	base: [
		buttonTheme,
		{
			appearance: "none",
			position: "relative",
			display: "inline-flex",
			justifyContent: "center",
			alignItems: "center",
			flexShrink: 0,
			outline: "none",
			userSelect: "none",
			whiteSpace: "nowrap",
			verticalAlign: "middle",
		},
	],
	variants: {
		size: {
			[ButtonSizes.lg]: {
				vars: {
					[buttonVars.buttonHeight]: "48px",
					[buttonVars.fontSize]: themeTokens.fontSize.lg,
				},
				minWidth: "72px",
			},
			[ButtonSizes.md]: {
				vars: {
					[buttonVars.buttonHeight]: "42px",
					[buttonVars.fontSize]: themeTokens.fontSize.md,
				},
			},
			[ButtonSizes.sm]: {
				vars: {
					[buttonVars.buttonHeight]: "36px",
					[buttonVars.fontSize]: themeTokens.fontSize.sm,
				},
			},
			[ButtonSizes.xs]: {
				vars: {
					[buttonVars.buttonHeight]: "30px",
					[buttonVars.fontSize]: themeTokens.fontSize.xs,
				},
				padding: `0 ${themeTokens.spacing["2"]}`,
			},
		},
	},
});

export type ButtonVariants = RecipeVariants<typeof button>;
