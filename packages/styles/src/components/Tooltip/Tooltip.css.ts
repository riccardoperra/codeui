export const tooltipContent = (): string => "cui-tooltip-tooltipContent cui-tooltip-tooltipTheme";
export const tooltipTheme: string = "cui-tooltip-tooltipTheme";
export const tooltipVars = {
	fontSize: "var(--cui-tooltipTheme-fontSize)" as `var(--${string})`,
	lineHeight: "var(--cui-tooltipTheme-lineHeight)" as `var(--${string})`,
	backgroundColor: "var(--cui-tooltipTheme-backgroundColor)" as `var(--${string})`,
	color: "var(--cui-tooltipTheme-color)" as `var(--${string})`,
	padding: "var(--cui-tooltipTheme-padding)" as `var(--${string})`,
	borderRadius: "var(--cui-tooltipTheme-borderRadius)" as `var(--${string})`,
	zIndex: "var(--cui-tooltipTheme-zIndex)" as `var(--${string})`,
};
export const trigger: string = "cui-tooltip-trigger";

export type TooltipVariants = {
	theme?: "primary" | "secondary";
} | undefined;
