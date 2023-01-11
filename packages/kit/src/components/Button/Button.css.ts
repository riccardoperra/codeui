import { createTheme, keyframes } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { themeTokens } from "../../foundation/themes.css";

export const [buttonTheme, buttonVars] = createTheme({
	buttonHeight: "",
	fontSize: "",
	background: "",
	hoverBackground: "",
	activeBackground: "",
	color: themeTokens.colors.gray12,
	borderColor: "",
	padding: "",
});

const ButtonSizes = {
	xs: "xs",
	sm: "sm",
	md: "md",
	lg: "lg",
	xl: "xl",
} as const;

const ButtonThemes = {
	primary: "primary",
	secondary: "secondary",
	tertiary: "tertiary",
} as const;

const buttonPopKf = keyframes({
	"0%": {
		transform: "scale(var(--btn-focus-scale, 0.95))",
	},
	"40%": {
		transform: "scale(1.02)",
	},
	"100%": {
		transform: "scale(1)",
	},
});

export const button = recipe({
	base: [
		buttonTheme,
		{
			appearance: "none",
			fontFamily: "inherit",
			position: "relative",
			display: "inline-flex",
			justifyContent: "center",
			alignItems: "center",
			flexShrink: 0,
			outline: "none",
			whiteSpace: "nowrap",
			verticalAlign: "middle",
			height: buttonVars.buttonHeight,
			color: buttonVars.color,
			background: buttonVars.background,
			borderRadius: themeTokens.radii.md,
			padding: `0 ${buttonVars.padding}`,
			fontWeight: themeTokens.fontWeight.medium,
			animation: `${buttonPopKf} .25s ease-out`,
			fontSize: buttonVars.fontSize,
			border: `1px solid ${buttonVars.borderColor}`,
			transition: "opacity .2s, background-color .2s, transform .2s",

			vars: {
				[buttonVars.borderColor]: buttonVars.background,
			},

			":disabled": {
				vars: {
					[buttonVars.background]: themeTokens.colors.gray2,
					[buttonVars.color]: themeTokens.colors.gray8,
				},
			},

			selectors: {
				"&[data-hover]": {
					background: buttonVars.hoverBackground,
				},
				"&[data-active]": {
					background: buttonVars.activeBackground,
					animation: "none",
					transform: "scale(0.95)",
				},
			},
		},
	],
	variants: {
		size: {
			[ButtonSizes.xl]: {
				vars: {
					[buttonVars.buttonHeight]: "56px",
					[buttonVars.fontSize]: themeTokens.fontSize.xl,
					[buttonVars.padding]: themeTokens.spacing["6"],
				},
			},
			[ButtonSizes.lg]: {
				vars: {
					[buttonVars.buttonHeight]: "48px",
					[buttonVars.fontSize]: themeTokens.fontSize.lg,
					[buttonVars.padding]: themeTokens.spacing["5"],
				},
			},
			[ButtonSizes.md]: {
				vars: {
					[buttonVars.buttonHeight]: "40px",
					[buttonVars.fontSize]: themeTokens.fontSize.md,
					[buttonVars.padding]: themeTokens.spacing["5"],
				},
			},
			[ButtonSizes.sm]: {
				vars: {
					[buttonVars.buttonHeight]: "36px",
					[buttonVars.fontSize]: themeTokens.fontSize.sm,
					[buttonVars.padding]: themeTokens.spacing["4"],
				},
			},
			[ButtonSizes.xs]: {
				vars: {
					[buttonVars.buttonHeight]: "30px",
					[buttonVars.fontSize]: themeTokens.fontSize.xs,
					[buttonVars.padding]: themeTokens.spacing["2"],
				},
			},
		},
		theme: {
			[ButtonThemes.primary]: {
				vars: {
					[buttonVars.background]: themeTokens.colors.blue9,
					[buttonVars.hoverBackground]: themeTokens.colors.blue10,
					[buttonVars.activeBackground]: themeTokens.colors.blue9,
					[buttonVars.color]: themeTokens.colors.gray12,
				},
			},
			[ButtonThemes.tertiary]: {
				vars: {
					[buttonVars.background]: themeTokens.colors.blue4,
					[buttonVars.hoverBackground]: themeTokens.colors.blue5,
					[buttonVars.activeBackground]: themeTokens.colors.blue6,
					[buttonVars.color]: themeTokens.colors.blue11,
				},
			},
			[ButtonThemes.secondary]: {
				vars: {
					[buttonVars.background]: themeTokens.colors.gray2,
					[buttonVars.hoverBackground]: themeTokens.colors.gray3,
					[buttonVars.activeBackground]: themeTokens.colors.gray4,
					[buttonVars.color]: themeTokens.colors.gray11,
					[buttonVars.borderColor]: themeTokens.colors.gray5,
				},
			},
		},
	} as const,
	defaultVariants: {
		size: "md",
	},
});

export type ButtonVariants = RecipeVariants<typeof button>;
