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

export type ButtonVariants = {
	size?: "xl" | "lg" | "md" | "sm" | "xs";
	theme?: "primary" | "tertiary" | "secondary" | "negative" | "caution";
	variant?: "ghost";
	block?: boolean;
	pill?: boolean;
	loading?: boolean;
} | undefined;
