import { recipe } from "../../recipe";
export const checkboxTheme: string = "cui-check-box-checkboxTheme";
export const checkboxVars = {
	size: "var(--cui-checkboxTheme-size)" as `var(--${string})`,
	fontSize: "var(--cui-checkboxTheme-fontSize)" as `var(--${string})`,
	borderColor: "var(--cui-checkboxTheme-borderColor)" as `var(--${string})`,
	background: "var(--cui-checkboxTheme-background)" as `var(--${string})`,
	activeHoverBackground:
		"var(--cui-checkboxTheme-activeHoverBackground)" as `var(--${string})`,
	nonActiveHoverBackground:
		"var(--cui-checkboxTheme-nonActiveHoverBackground)" as `var(--${string})`,
	color: "var(--cui-checkboxTheme-color)" as `var(--${string})`,
	radius: "var(--cui-checkboxTheme-radius)" as `var(--${string})`,
	fill: "var(--cui-checkboxTheme-fill)" as `var(--${string})`,
};
export const container: string =
	"cui-check-box-container cui-field-baseFieldTheme cui-check-box-checkboxTheme";
export const content: string = "cui-check-box-content";
export const control = recipe({
	defaultClassName: "cui-check-box-control",
	variantClassNames: {
		theme: {
			filled: "cui-check-box-control_theme_filled",
			inline: "cui-check-box-control_theme_inline",
		},
		size: {
			xs: "cui-check-box-control_size_xs",
			sm: "cui-check-box-control_size_sm",
			md: "cui-check-box-control_size_md",
			lg: "cui-check-box-control_size_lg",
			xl: "cui-check-box-control_size_xl",
		},
	},
	defaultVariants: { size: "md" },
});
export const icon: string = "cui-check-box-icon";
export const indicator: string = "cui-check-box-indicator";
export const input: string = "cui-check-box-input";
export const label: string = "cui-check-box-label";
