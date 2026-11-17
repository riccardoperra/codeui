import type { RecipeVariants } from "../../types";
import { recipe } from "../../recipe";
export const button = recipe({
	defaultClassName: "cui-button-button cui-button-buttonTheme",
	variantClassNames: {
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
	defaultVariants: { size: "md" },
});
export const buttonIcon: string = "cui-button-buttonIcon";
export const buttonText: string = "cui-button-buttonText";
export const buttonTheme: string = "cui-button-buttonTheme";
export const buttonVars = {
	buttonHeight: "var(--cui-buttonTheme-buttonHeight)" as `var(--${string})`,
	fontSize: "var(--cui-buttonTheme-fontSize)" as `var(--${string})`,
	background: "var(--cui-buttonTheme-background)" as `var(--${string})`,
	hoverBackground: "var(--cui-buttonTheme-hoverBackground)" as `var(--${string})`,
	activeBackground: "var(--cui-buttonTheme-activeBackground)" as `var(--${string})`,
	color: "var(--cui-buttonTheme-color)" as `var(--${string})`,
	borderColor: "var(--cui-buttonTheme-borderColor)" as `var(--${string})`,
	padding: "var(--cui-buttonTheme-padding)" as `var(--${string})`,
	borderRadius: "var(--cui-buttonTheme-borderRadius)" as `var(--${string})`,
};

export type ButtonVariants = RecipeVariants<typeof button>;
