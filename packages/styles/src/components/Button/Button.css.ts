// Compatibility metadata frozen from #126; declarations are authored in src/plain.
import type * as Contract from "./Button.css.contract";
import { recipe } from "../../plain/recipe";
export const button: typeof Contract.button = recipe(
	{
		base: "cui-button-a0zfdzf",
		variants: {
			size: {
				xl: "cui-button-button_size_xl",
				lg: "cui-button-button_size_lg",
				md: "cui-button-button_size_md",
				sm: "cui-button-button_size_sm",
				xs: "cui-button-button_size_xs",
			},
			theme: {
				primary: "cui-button-button_theme_primary",
				tertiary: "cui-button-button_theme_tertiary",
				secondary: "cui-button-button_theme_secondary",
				negative: "cui-button-button_theme_negative",
				caution: "cui-button-button_theme_caution",
			},
			variant: { ghost: "cui-button-button_variant_ghost" },
			block: { true: "cui-button-button_block_true" },
			pill: { true: "cui-button-button_pill_true" },
			loading: { true: "cui-button-button_loading_true" },
		},
	},
	{ size: "md" },
	"cui-button",
);
export const buttonDefaults: typeof Contract.buttonDefaults = { size: "md" };
export const buttonIcon: typeof Contract.buttonIcon = "cui-button-buttonIcon";
export const buttonPart: typeof Contract.buttonPart = "button";
export const buttonText: typeof Contract.buttonText = "cui-button-buttonText";
export const buttonTheme: typeof Contract.buttonTheme = "cui-button-buttonTheme";
export const buttonVars: typeof Contract.buttonVars = {
	buttonHeight: "var(--cui-buttonTheme-buttonHeight)",
	fontSize: "var(--cui-buttonTheme-fontSize)",
	background: "var(--cui-buttonTheme-background)",
	hoverBackground: "var(--cui-buttonTheme-hoverBackground)",
	activeBackground: "var(--cui-buttonTheme-activeBackground)",
	color: "var(--cui-buttonTheme-color)",
	borderColor: "var(--cui-buttonTheme-borderColor)",
	padding: "var(--cui-buttonTheme-padding)",
	borderRadius: "var(--cui-buttonTheme-borderRadius)",
};
export type ButtonVariants = Contract.ButtonVariants;
