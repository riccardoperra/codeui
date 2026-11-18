import type { PopoverStyleOptions } from "../../generated-appearance/popover";
export const content = (): string => "cui-popover-content";
export const description: string = "cui-popover-description";
export const popoverThemeVars = {
	contentBackground: "var(--cui-popover-content-background)" as `var(--${string})`,
	contentBoxShadow: "var(--cui-popover-content-box-shadow)" as `var(--${string})`,
	contentMaxWidth: "var(--cui-popover-content-max-width)" as `var(--${string})`,
	contentRadius: "var(--cui-popover-content-radius)" as `var(--${string})`,
	contentPadding: "var(--cui-popover-content-padding)" as `var(--${string})`,
	contentFontSize: "var(--cui-popover-content-font-size)" as `var(--${string})`,
	contentLineHeight: "var(--cui-popover-content-line-height)" as `var(--${string})`,
	titleColor: "var(--cui-popover-title-color)" as `var(--${string})`,
	titleFontSize: "var(--cui-popover-title-font-size)" as `var(--${string})`,
	descriptionColor: "var(--cui-popover-description-color)" as `var(--${string})`,
	contentBorderColor: "var(--cui-popover-content-border-color)" as `var(--${string})`,
};
export const title: string = "cui-popover-title";

export type PopoverVariants = Omit<PopoverStyleOptions, "class"> | undefined;
