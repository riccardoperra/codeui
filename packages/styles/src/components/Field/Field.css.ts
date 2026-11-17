import type { RecipeVariants } from "../../types";
import { recipe } from "../../recipe";
export const FieldSizes = { xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" } as const;
export const baseFieldTheme: string = "cui-field-baseFieldTheme";
export const baseFieldVariants = recipe({
	defaultClassName: "cui-field-baseFieldVariants",
	variantClassNames: {
		size: {
			xs: "cui-field-baseFieldVariants_size_xs",
			sm: "cui-field-baseFieldVariants_size_sm",
			md: "cui-field-baseFieldVariants_size_md",
			lg: "cui-field-baseFieldVariants_size_lg",
			xl: "cui-field-baseFieldVariants_size_xl",
		},
		theme: {
			filled: "cui-field-baseFieldVariants_theme_filled",
			inline: "cui-field-baseFieldVariants_theme_inline",
		},
	},
	defaultVariants: { theme: "filled", size: "md" },
});
export const baseFieldVars = {
	borderColor: "var(--cui-baseFieldTheme-borderColor)" as `var(--${string})`,
	background: "var(--cui-baseFieldTheme-background)" as `var(--${string})`,
	color: "var(--cui-baseFieldTheme-color)" as `var(--${string})`,
	inputHeight: "var(--cui-baseFieldTheme-inputHeight)" as `var(--${string})`,
	fontSize: "var(--cui-baseFieldTheme-fontSize)" as `var(--${string})`,
	descriptionColor: "var(--cui-baseFieldTheme-descriptionColor)" as `var(--${string})`,
	disabledBackground:
		"var(--cui-baseFieldTheme-disabledBackground)" as `var(--${string})`,
};
export const fontSize: `var(--${string})` = "var(--cui-field-fontSize)";
export const inputHeight: `var(--${string})` = "var(--cui-field-inputHeight)";

export type BaseFieldVariants = RecipeVariants<typeof baseFieldVariants>;
