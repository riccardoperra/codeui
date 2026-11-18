export const indicator: string = "cui-radio-indicator";
export const radio: string = "cui-radio-radio";
export const radioItem: string = "cui-radio-radioItem";
export const radioList = (): string => "cui-radio-radioList cui-radio-radioTheme";
export const radioTheme: string = "cui-radio-radioTheme";
export const radioVars = {
	inputColor: "var(--cui-radioTheme-inputColor)" as `var(--${string})`,
	inputBackground: "var(--cui-radioTheme-inputBackground)" as `var(--${string})`,
	inputInvalidBackground:
		"var(--cui-radioTheme-inputInvalidBackground)" as `var(--${string})`,
	inputText: "var(--cui-radioTheme-inputText)" as `var(--${string})`,
	inputSize: "var(--cui-radioTheme-inputSize)" as `var(--${string})`,
	labelSize: "var(--cui-radioTheme-labelSize)" as `var(--${string})`,
	inputFill: "var(--cui-radioTheme-inputFill)" as `var(--${string})`,
};
