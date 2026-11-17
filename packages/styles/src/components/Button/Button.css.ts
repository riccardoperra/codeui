import { iconRule } from "../../icons/icon.css";
import { squareButtonRule } from "../Button/composition";
import { finish } from "../../foundation/public.css";
import { publicStylesRegistry as registry } from "../../registry";
import {
	globalStyle,
	createTheme,
	publicRecipe as recipe,
	style,
} from "../../foundation/public.css";
import { componentStateStyles } from "@kobalte/vanilla-extract";
import { fallbackVar } from "@vanilla-extract/css";
import { RecipeVariants } from "@vanilla-extract/recipes";
import { tokens } from "../../foundation/cui.css";
import { layoutBackgroundColor } from "../../foundation/layout.css";
import { mapSizeValue } from "../../foundation/sizes";
import { transition } from "../../foundation/motion.css";

export const [buttonTheme, buttonVars] = createTheme(
	{
		buttonHeight: "",
		fontSize: "",
		background: "",
		hoverBackground: "",
		activeBackground: "",
		color: tokens.action.neutral.text,
		borderColor: "",
		padding: "",
		borderRadius: tokens.radius.md,
	},
	"buttonTheme",
	registry.button.parts.button,
);

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

export const button = recipe(
	{
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
				fontWeight: tokens.font.weight.medium,
				fontSize: buttonVars.fontSize,
				border: `${tokens.border.width} solid ${buttonVars.borderColor}`,
				transition: transition(["opacity", "background-color", "transform"]),
				gap: tokens.space["2"],
				vars: {
					[buttonVars.borderColor]: buttonVars.background,
				},
			},
			{
				selectors: {
					"&:not(:is([data-disabled], :disabled)):hover": {
						background: buttonVars.hoverBackground,
					},
					"&:not(:is([data-disabled], :disabled)):active": {
						background: buttonVars.activeBackground,
						animation: "none",
						transform: "scale(0.97)",
					},
					"&:focus-visible": {
						outline: `${tokens.focus.width} solid ${tokens.focus.color}`,
						outlineOffset: tokens.focus.offset,
					},
				},
			},
			componentStateStyles({
				disabled: {
					vars: {
						[buttonVars.background]: tokens.action.neutral.base,
						[buttonVars.color]: tokens.action.neutral.text,
					},
					opacity: 0.5,
				},
			}),
		],
		variants: {
			size: {
				[ButtonSizes.xl]: {
					vars: {
						[buttonVars.buttonHeight]: mapSizeValue("xl"),
						[buttonVars.fontSize]: tokens.font.size.xl,
						[buttonVars.padding]: tokens.space["6"],
						[buttonVars.borderRadius]: tokens.radius.xl,
					},
				},
				[ButtonSizes.lg]: {
					vars: {
						[buttonVars.buttonHeight]: mapSizeValue("lg"),
						[buttonVars.fontSize]: tokens.font.size.lg,
						[buttonVars.padding]: tokens.space["5"],
						[buttonVars.borderRadius]: tokens.radius.lg,
					},
				},
				[ButtonSizes.md]: {
					vars: {
						[buttonVars.buttonHeight]: mapSizeValue("md"),
						[buttonVars.fontSize]: tokens.font.size.md,
						[buttonVars.padding]: tokens.space["5"],
						[buttonVars.borderRadius]: tokens.radius.md,
					},
				},
				[ButtonSizes.sm]: {
					vars: {
						[buttonVars.buttonHeight]: mapSizeValue("sm"),
						[buttonVars.fontSize]: tokens.font.size.sm,
						[buttonVars.padding]: tokens.space["4"],
						[buttonVars.borderRadius]: tokens.radius.sm,
					},
				},
				[ButtonSizes.xs]: {
					vars: {
						[buttonVars.buttonHeight]: mapSizeValue("xs"),
						[buttonVars.fontSize]: tokens.font.size.xs,
						[buttonVars.padding]: tokens.space["2"],
						[buttonVars.borderRadius]: tokens.radius.xs,
					},
				},
			},
			theme: {
				[ButtonThemes.primary]: {
					vars: {
						[buttonVars.background]: tokens.action.brand.base,
						[buttonVars.hoverBackground]: tokens.action.brand.hover,
						[buttonVars.activeBackground]: tokens.action.brand.active,
						[buttonVars.color]: tokens.action.brand.text,
					},
				},
				[ButtonThemes.tertiary]: {
					vars: {
						[buttonVars.background]: tokens.action.brandSoft.base,
						[buttonVars.hoverBackground]: tokens.action.brandSoft.hover,
						[buttonVars.activeBackground]: tokens.action.brandSoft.active,
						[buttonVars.color]: tokens.action.brandSoft.text,
					},
				},
				[ButtonThemes.secondary]: {
					vars: {
						[buttonVars.background]: tokens.action.neutral.base,
						[buttonVars.hoverBackground]: tokens.action.neutral.hover,
						[buttonVars.activeBackground]: tokens.action.neutral.active,
						[buttonVars.color]: tokens.action.neutral.text,
						[buttonVars.borderColor]: tokens.action.neutral.base,
					},
				},
				[ButtonThemes.negative]: {
					vars: {
						[buttonVars.background]: tokens.action.danger.base,
						[buttonVars.hoverBackground]: tokens.action.danger.hover,
						[buttonVars.activeBackground]: tokens.action.danger.active,
						[buttonVars.color]: tokens.action.danger.text,
					},
				},
				[ButtonThemes.caution]: {
					vars: {
						[buttonVars.background]: tokens.action.caution.base,
						[buttonVars.hoverBackground]: tokens.action.caution.hover,
						[buttonVars.activeBackground]: tokens.action.caution.active,
						[buttonVars.color]: tokens.action.caution.text,
					},
				},
			},
			variant: {
				ghost: {
					background: "transparent",
					selectors: {
						"&:not(:hover)": {
							borderColor: "transparent",
							color: tokens.text.default,
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
						[buttonVars.borderRadius]: tokens.radius.full,
					},
				},
			},
			loading: {
				true: {
					pointerEvents: "none",
					overflow: "hidden",
				},
			},
		} as const,
		defaultVariants: {
			size: registry.button.defaults.size,
		},
		compoundVariants: [
			{
				style: {
					background: fallbackVar(layoutBackgroundColor, buttonVars.background),
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
	},
	"button",
	registry.button.parts.button,
);

export const buttonIcon = style(
	{
		display: "inline-flex",
		alignSelf: "center",
		flexShrink: 0,
	},
	"buttonIcon",
);

export const buttonText = style(
	{
		transition: transition(["opacity"]),
		display: "contents",
		selectors: {
			"[data-loading] &": {
				opacity: 0,
			},
		},
	},
	"buttonText",
);

export type ButtonVariants = RecipeVariants<typeof button>;

globalStyle(
	":is(.cui-icon-button,.cui-dialog-close-button)",
	squareButtonRule(buttonVars.buttonHeight),
);
globalStyle(":is(.cui-icon-button,.cui-dialog-close-button) svg", iconRule);
finish();

export const buttonDefaults = registry.button.defaults;
