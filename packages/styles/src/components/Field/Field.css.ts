import type { FieldStyleOptions } from "../../generated-appearance/field";
import { ComponentSizes } from "../../foundation/sizes";

export const FieldSizes = ComponentSizes;
export const baseFieldTheme: string = "cui-field";
export const baseFieldVariants = (): string => "cui-field-input";
export const baseFieldVars = {
	borderColor: "var(--cui-field-border-color)" as `var(--${string})`,
	background: "var(--cui-field-background)" as `var(--${string})`,
	color: "var(--cui-field-color)" as `var(--${string})`,
	inputHeight: "var(--cui-field-input-height)" as `var(--${string})`,
	fontSize: "var(--cui-field-font-size)" as `var(--${string})`,
	descriptionColor: "var(--cui-field-description-color)" as `var(--${string})`,
	disabledBackground:
		"var(--cui-field-disabled-background)" as `var(--${string})`,
};
export const fontSize: `var(--${string})` = "var(--cui-field-base-font-size)";
export const inputHeight: `var(--${string})` = "var(--cui-field-base-input-height)";

export type BaseFieldVariants = Omit<FieldStyleOptions, "class"> | undefined;
