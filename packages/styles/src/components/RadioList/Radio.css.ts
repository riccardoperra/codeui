import { recipe } from "../../recipe";
export const indicator: string = "cui-radio-indicator";
export const radio: string = "cui-radio-radio";
export const radioItem: string = "cui-radio-radioItem";
export const radioList = recipe({
	defaultClassName: "cui-radio-radioList cui-radio-radioTheme",
	variantClassNames: {
		theme: {
			filled: "cui-radio-radioList_theme_filled",
			inline: "cui-radio-radioList_theme_inline",
		},
		orientation: {
			horizontal: "cui-radio-radioList_orientation_horizontal",
			vertical: "cui-radio-radioList_orientation_vertical",
		},
		size: {
			xs: "cui-radio-radioList_size_xs",
			sm: "cui-radio-radioList_size_sm",
			md: "cui-radio-radioList_size_md",
			lg: "cui-radio-radioList_size_lg",
			xl: "cui-radio-radioList_size_xl",
		},
	},
	defaultVariants: { size: "md" },
});
export const radioTheme: string = "cui-radio-radioTheme";
export const radioVars = {
	inputColor: "var(--cui-radioTheme-inputColor)" as `var(--${string})`,
	inputBackground: "var(--cui-radioTheme-inputBackground)" as `var(--${string})`,
	inputInvalidBackground:
		"var(--cui-radioTheme-inputInvalidBackground)" as `var(--${string})`,
	inputText: "var(--cui-radioTheme-inputText)" as `var(--${string})`,
	inputSize: "var(--cui-radioTheme-inputSize)" as `var(--${string})`,
	labelSize: "var(--cui-radioTheme-labelSize)" as `var(--${string})`,
	inputFill: "var(--cui-radioTheme-inputFill)" as `var(--${string})`,
};
