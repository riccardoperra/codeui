import type { RecipeVariants } from "../../types";
import { recipe } from "../../recipe";
export const content = recipe({
	defaultClassName: "cui-popover-content cui-popover-popoverTheme",
	variantClassNames: { variant: { bordered: "cui-popover-content_variant_bordered" } },
	defaultVariants: {},
});
export const description: string = "cui-popover-description";
export const popoverTheme: string = "cui-popover-popoverTheme";
export const popoverThemeVars = {
	contentBackground: "var(--cui-popoverTheme-contentBackground)" as `var(--${string})`,
	contentBoxShadow: "var(--cui-popoverTheme-contentBoxShadow)" as `var(--${string})`,
	contentMaxWidth: "var(--cui-popoverTheme-contentMaxWidth)" as `var(--${string})`,
	contentRadius: "var(--cui-popoverTheme-contentRadius)" as `var(--${string})`,
	contentPadding: "var(--cui-popoverTheme-contentPadding)" as `var(--${string})`,
	contentFontSize: "var(--cui-popoverTheme-contentFontSize)" as `var(--${string})`,
	contentLineHeight: "var(--cui-popoverTheme-contentLineHeight)" as `var(--${string})`,
	titleColor: "var(--cui-popoverTheme-titleColor)" as `var(--${string})`,
	titleFontSize: "var(--cui-popoverTheme-titleFontSize)" as `var(--${string})`,
	descriptionColor: "var(--cui-popoverTheme-descriptionColor)" as `var(--${string})`,
	contentBorderColor: "var(--cui-popoverTheme-contentBorderColor)" as `var(--${string})`,
};
export const title: string = "cui-popover-title";

export type PopoverVariants = RecipeVariants<typeof content>;
