export const content: string = "cui-select-content";
export const field: string = "cui-select cui-field";
export const input: string = "cui-select-input";
export const item: string = "cui-select-item";
export const itemIndicator: string = "cui-select-item-indicator";
export const selectField: string = "cui-select-trigger";
export const selectThemeVars = {
	contentBackground: "var(--cui-select-content-background)" as `var(--${string})`,
	contentRadius: "var(--cui-select-content-radius)" as `var(--${string})`,
	contentBoxShadow: "var(--cui-select-content-box-shadow)" as `var(--${string})`,
	contentPadding: "var(--cui-select-content-padding)" as `var(--${string})`,
	contentBorderColor: "var(--cui-select-content-border-color)" as `var(--${string})`,
	contentMaxHeight: "var(--cui-select-content-max-height)" as `var(--${string})`,
	contentMaxHeightXs: "var(--cui-select-content-max-height-xs)" as `var(--${string})`,
	separator: "var(--cui-select-separator)" as `var(--${string})`,
	itemMinHeight: "var(--cui-select-item-min-height)" as `var(--${string})`,
	itemTextColor: "var(--cui-select-item-text-color)" as `var(--${string})`,
	itemHoverBackground: "var(--cui-select-item-hover-background)" as `var(--${string})`,
	itemHoverTextColor: "var(--cui-select-item-hover-text-color)" as `var(--${string})`,
	itemDisabledOpacity: "var(--cui-select-item-disabled-opacity)" as `var(--${string})`,
	indicatorSize: "var(--cui-select-indicator-size)" as `var(--${string})`,
};
