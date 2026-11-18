export const checkboxVars = {
	size: "var(--cui-checkbox-size)" as `var(--${string})`,
	fontSize: "var(--cui-checkbox-font-size)" as `var(--${string})`,
	borderColor: "var(--cui-checkbox-border-color)" as `var(--${string})`,
	background: "var(--cui-checkbox-background)" as `var(--${string})`,
	activeHoverBackground:
		"var(--cui-checkbox-active-hover-background)" as `var(--${string})`,
	nonActiveHoverBackground:
		"var(--cui-checkbox-non-active-hover-background)" as `var(--${string})`,
	color: "var(--cui-checkbox-color)" as `var(--${string})`,
	radius: "var(--cui-checkbox-radius)" as `var(--${string})`,
	fill: "var(--cui-checkbox-fill)" as `var(--${string})`,
};
export const container: string =
	"cui-checkbox cui-field";
export const content: string = "cui-checkbox-content";
export const control = (): string => "cui-checkbox-control";
export const icon: string = "cui-checkbox-icon";
export const indicator: string = "cui-checkbox-indicator";
export const input: string = "cui-checkbox-input";
export const label: string = "cui-checkbox-label";
