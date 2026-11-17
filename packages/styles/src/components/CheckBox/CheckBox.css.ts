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
export const control = (): string => "cui-check-box-control";
export const icon: string = "cui-check-box-icon";
export const indicator: string = "cui-check-box-indicator";
export const input: string = "cui-check-box-input";
export const label: string = "cui-check-box-label";
