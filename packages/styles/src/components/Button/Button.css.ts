import { type BaseComponentSize } from "../../foundation/sizes";

import { mergeClasses } from "../../utils/css";

export const button = (): string => "cui-button-button cui-button-buttonTheme";
export const buttonIcon: string = "cui-button-buttonIcon";
export const buttonText: string = "cui-button-buttonText";
export const buttonTheme: string = "cui-button-buttonTheme";
export const buttonVars = {
	buttonHeight: "var(--cui-buttonTheme-buttonHeight)" as `var(--${string})`,
	fontSize: "var(--cui-buttonTheme-fontSize)" as `var(--${string})`,
	background: "var(--cui-buttonTheme-background)" as `var(--${string})`,
	hoverBackground: "var(--cui-buttonTheme-hoverBackground)" as `var(--${string})`,
	activeBackground: "var(--cui-buttonTheme-activeBackground)" as `var(--${string})`,
	color: "var(--cui-buttonTheme-color)" as `var(--${string})`,
	borderColor: "var(--cui-buttonTheme-borderColor)" as `var(--${string})`,
	padding: "var(--cui-buttonTheme-padding)" as `var(--${string})`,
	borderRadius: "var(--cui-buttonTheme-borderRadius)" as `var(--${string})`,
};

type ButtonAppearance = {
	size?: BaseComponentSize;
	theme?: "primary" | "tertiary" | "secondary" | "negative" | "caution";
	variant?: "ghost";
	block?: boolean;
	pill?: boolean;
};

export type ButtonVariants = (ButtonAppearance & { loading?: boolean }) | undefined;
export type ButtonStyleOptions = ButtonAppearance & { class?: string };

export function buttonStyleProps({
	size = "sm",
	theme,
	variant,
	block,
	pill,
	class: className,
}: ButtonStyleOptions = {}) {
	return {
		class: mergeClasses(button(), className),
		"data-cui": "button" as const,
		"data-size": size,
		"data-theme": theme,
		"data-variant": variant,
		"data-block": block ? "" : undefined,
		"data-pill": pill ? "" : undefined,
	};
}
