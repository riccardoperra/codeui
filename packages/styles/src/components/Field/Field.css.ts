export const FieldSizes = { xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" } as const;
export const baseFieldTheme: string = "cui-field-baseFieldTheme";
export const baseFieldVariants = (): string => "cui-field-baseFieldVariants";
export const baseFieldVars = {
	borderColor: "var(--cui-baseFieldTheme-borderColor)" as `var(--${string})`,
	background: "var(--cui-baseFieldTheme-background)" as `var(--${string})`,
	color: "var(--cui-baseFieldTheme-color)" as `var(--${string})`,
	inputHeight: "var(--cui-baseFieldTheme-inputHeight)" as `var(--${string})`,
	fontSize: "var(--cui-baseFieldTheme-fontSize)" as `var(--${string})`,
	descriptionColor: "var(--cui-baseFieldTheme-descriptionColor)" as `var(--${string})`,
	disabledBackground:
		"var(--cui-baseFieldTheme-disabledBackground)" as `var(--${string})`,
};
export const fontSize: `var(--${string})` = "var(--cui-field-fontSize)";
export const inputHeight: `var(--${string})` = "var(--cui-field-inputHeight)";

export type BaseFieldVariants = {
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	theme?: "filled" | "inline";
} | undefined;
