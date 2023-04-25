import { componentStateStyles } from "@kobalte/vanilla-extract";
import { createTheme, style } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { tokens } from "../../foundation/contract.css";
import { mapSizeValue } from "../../foundation/sizes.css";
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
	borderRadius: themeTokens.radii.md,
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
	negative: "negative",
	caution: "caution",
} as const;

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
			whiteSpace: "nowrap",
			verticalAlign: "middle",
			height: buttonVars.buttonHeight,
			color: buttonVars.color,
			background: buttonVars.background,
			borderRadius: buttonVars.borderRadius,
			padding: `0 ${buttonVars.padding}`,
			fontWeight: themeTokens.fontWeight.medium,
			fontSize: buttonVars.fontSize,
			border: `1px solid ${buttonVars.borderColor}`,
			transition:
				"opacity .2s, background-color .2s, transform .2s, outline-color 150ms ease-in-out, outline-offset 150ms ease-in",
			gap: themeTokens.spacing["2"],
			outlineColor: `transparent`,
			outlineOffset: "0px",
			vars: {
				[buttonVars.borderColor]: buttonVars.background,
			},
		},
		{
			selectors: {
				"&:not([data-disabled]):hover": {
					background: buttonVars.hoverBackground,
				},
				"&:not([data-disabled]):active": {
					background: buttonVars.activeBackground,
					animation: "none",
					transform: "scale(0.97)",
				},
				"&:focus-visible": {
					outlineOffset: "2px",
					outline: `2px solid ${buttonVars.background}`,
				},
			},
		},
		componentStateStyles({
			disabled: {
				vars: {
					[buttonVars.background]: themeTokens.colors.gray2,
					[buttonVars.color]: themeTokens.colors.gray8,
				},
			},
		}),
	],
	variants: {
		size: {
			[ButtonSizes.xl]: {
				vars: {
					[buttonVars.buttonHeight]: mapSizeValue("xl"),
					[buttonVars.fontSize]: themeTokens.fontSize.xl,
					[buttonVars.padding]: themeTokens.spacing["6"],
					[buttonVars.borderRadius]: themeTokens.radii.xl,
				},
			},
			[ButtonSizes.lg]: {
				vars: {
					[buttonVars.buttonHeight]: mapSizeValue("lg"),
					[buttonVars.fontSize]: themeTokens.fontSize.lg,
					[buttonVars.padding]: themeTokens.spacing["5"],
					[buttonVars.borderRadius]: themeTokens.radii.lg,
				},
			},
			[ButtonSizes.md]: {
				vars: {
					[buttonVars.buttonHeight]: mapSizeValue("md"),
					[buttonVars.fontSize]: themeTokens.fontSize.md,
					[buttonVars.padding]: themeTokens.spacing["5"],
					[buttonVars.borderRadius]: themeTokens.radii.md,
				},
			},
			[ButtonSizes.sm]: {
				vars: {
					[buttonVars.buttonHeight]: mapSizeValue("sm"),
					[buttonVars.fontSize]: themeTokens.fontSize.sm,
					[buttonVars.padding]: themeTokens.spacing["4"],
					[buttonVars.borderRadius]: themeTokens.radii.sm,
				},
			},
			[ButtonSizes.xs]: {
				vars: {
					[buttonVars.buttonHeight]: mapSizeValue("xs"),
					[buttonVars.fontSize]: themeTokens.fontSize.xs,
					[buttonVars.padding]: themeTokens.spacing["2"],
					[buttonVars.borderRadius]: themeTokens.radii.xs,
				},
			},
		},
		theme: {
			[ButtonThemes.primary]: {
				vars: {
					[buttonVars.background]: tokens.brand,
					[buttonVars.hoverBackground]: tokens.brandAccentHover,
					[buttonVars.activeBackground]: tokens.brandAccentActive,
					[buttonVars.color]: themeTokens.colors.gray12,
				},
			},
			[ButtonThemes.tertiary]: {
				vars: {
					[buttonVars.background]: tokens.brandSoft,
					[buttonVars.hoverBackground]: tokens.brandSoftAccentHover,
					[buttonVars.activeBackground]: tokens.brandSoftAccentActive,
					[buttonVars.color]: tokens.brandLink,
				},
			},
			[ButtonThemes.secondary]: {
				vars: {
					[buttonVars.background]: tokens.brandSecondary,
					[buttonVars.hoverBackground]: tokens.brandSecondaryAccentHover,
					[buttonVars.activeBackground]: tokens.brandSecondaryAccentActive,
					[buttonVars.color]: tokens.foreground,
					[buttonVars.borderColor]: tokens.brandSecondary,
				},
			},
			[ButtonThemes.negative]: {
				vars: {
					[buttonVars.background]: tokens.critical,
					[buttonVars.hoverBackground]: tokens.criticalAccentHover,
					[buttonVars.activeBackground]: tokens.criticalAccentActive,
					// TODO: add custom colors
					[buttonVars.color]: tokens.foreground,
				},
			},
			[ButtonThemes.caution]: {
				vars: {
					[buttonVars.background]: tokens.caution,
					[buttonVars.hoverBackground]: tokens.cautionAccentHover,
					[buttonVars.activeBackground]: tokens.cautionAccentActive,
					[buttonVars.color]: tokens.foreground,
				},
			},
		},
		variant: {
			ghost: {
				background: "transparent",
				selectors: {
					"&:not(:hover)": {
						borderColor: "transparent",
					},
				},
			},
		},
		block: {
			true: {
				width: "100%",
				flex: 1,
			},
		},
		pill: {
			true: {
				vars: {
					[buttonVars.borderRadius]: themeTokens.radii.full,
				},
			},
		},
		loading: {
			true: {
				opacity: 0.8,
				pointerEvents: "none",
				overflow: "hidden",
			},
		},
	} as const,
	defaultVariants: {
		size: "md",
	},
	compoundVariants: [
		{
			style: {
				background: "transparent",
				selectors: {
					"&:not(:hover)": {
						borderColor: buttonVars.borderColor,
					},
				},
			},
			variants: {
				variant: "ghost",
				loading: true,
			},
		},
	],
});

export const buttonIcon = style({
	display: "inline-flex",
	alignSelf: "center",
	flexShrink: 0,
});

export const buttonText = style({
	transition: "opacity 100ms ease-in-out",
	display: "contents",
	selectors: {
		"[data-loading] &": {
			opacity: 0,
		},
	},
});

export type ButtonVariants = RecipeVariants<typeof button>;
