export const indicator: string = "cui-radiolist-indicator";
export const radio: string = "cui-radiolist-radio";
export const radioItem: string = "cui-radiolist-item";
export const radioList = (): string => "cui-radiolist";
export const radioVars = {
	inputColor: "var(--cui-radiolist-input-color)" as `var(--${string})`,
	inputBackground: "var(--cui-radiolist-input-background)" as `var(--${string})`,
	inputInvalidBackground:
		"var(--cui-radiolist-input-invalid-background)" as `var(--${string})`,
	inputText: "var(--cui-radiolist-input-text)" as `var(--${string})`,
	inputSize: "var(--cui-radiolist-input-size)" as `var(--${string})`,
	labelSize: "var(--cui-radiolist-label-size)" as `var(--${string})`,
	inputFill: "var(--cui-radiolist-input-fill)" as `var(--${string})`,
};
