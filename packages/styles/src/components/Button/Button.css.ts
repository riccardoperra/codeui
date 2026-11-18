import type { ButtonStyleOptions } from "../../generated-appearance/button";

export const button = (): string => "cui-button";
export const buttonIcon: string = "cui-button-icon";
export const buttonText: string = "cui-button-text";
export const buttonVars = {
	buttonHeight: "var(--cui-button-button-height)" as `var(--${string})`,
	fontSize: "var(--cui-button-font-size)" as `var(--${string})`,
	background: "var(--cui-button-background)" as `var(--${string})`,
	hoverBackground: "var(--cui-button-hover-background)" as `var(--${string})`,
	activeBackground: "var(--cui-button-active-background)" as `var(--${string})`,
	color: "var(--cui-button-color)" as `var(--${string})`,
	borderColor: "var(--cui-button-border-color)" as `var(--${string})`,
	padding: "var(--cui-button-padding)" as `var(--${string})`,
	borderRadius: "var(--cui-button-border-radius)" as `var(--${string})`,
};

export {
	buttonStyleProps,
	type ButtonStyleOptions,
} from "../../generated-appearance/button";

type ButtonAppearance = Omit<ButtonStyleOptions, "class">;
export type ButtonVariants = (ButtonAppearance & { loading?: boolean }) | undefined;
