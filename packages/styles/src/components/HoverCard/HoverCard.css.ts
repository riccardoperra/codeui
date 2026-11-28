export const content = (): string => "cui-hovercard-content";
export const list = (): string => "cui-hovercard-list";
export const item = (): string => "cui-hovercard-item";
export const itemIcon = (): string => "cui-hovercard-item-icon";
export const itemId = (): string => "cui-hovercard-item-id";
export const itemTitle = (): string => "cui-hovercard-item-title";
export const hoverCardVars = {
	contentBackground: "var(--cui-hovercard-content-background)" as `var(--${string})`,
	contentBoxShadow: "var(--cui-hovercard-content-box-shadow)" as `var(--${string})`,
	contentMaxWidth: "var(--cui-hovercard-content-max-width)" as `var(--${string})`,
	contentRadius: "var(--cui-hovercard-content-radius)" as `var(--${string})`,
	contentPadding: "var(--cui-hovercard-content-padding)" as `var(--${string})`,
	contentFontSize: "var(--cui-hovercard-content-font-size)" as `var(--${string})`,
	contentLineHeight: "var(--cui-hovercard-content-line-height)" as `var(--${string})`,
	contentColor: "var(--cui-hovercard-content-color)" as `var(--${string})`,
	listMaxHeight: "var(--cui-hovercard-list-max-height)" as `var(--${string})`,
	itemIndent: "var(--cui-hovercard-item-indent)" as `var(--${string})`,
	itemDepth: "var(--cui-hovercard-item-depth)" as `var(--${string})`,
};
