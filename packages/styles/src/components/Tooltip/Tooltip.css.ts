import type { TooltipStyleOptions } from "../../generated-appearance/tooltip";
export const tooltipContent = (): string =>
	"cui-tooltip-content";
export const tooltipVars = {
	fontSize: "var(--cui-tooltip-font-size)" as `var(--${string})`,
	lineHeight: "var(--cui-tooltip-line-height)" as `var(--${string})`,
	backgroundColor: "var(--cui-tooltip-background-color)" as `var(--${string})`,
	color: "var(--cui-tooltip-color)" as `var(--${string})`,
	padding: "var(--cui-tooltip-padding)" as `var(--${string})`,
	borderRadius: "var(--cui-tooltip-border-radius)" as `var(--${string})`,
	zIndex: "var(--cui-tooltip-z-index)" as `var(--${string})`,
};
export const trigger: string = "cui-tooltip-trigger";

export type TooltipVariants = Omit<TooltipStyleOptions, "class"> | undefined;
