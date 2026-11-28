export const root = (): string => "cui-avatar";
export const image = (): string => "cui-avatar-image";
export const fallback = (): string => "cui-avatar-fallback";
export const avatarVars = {
	size: "var(--cui-avatar-size)" as `var(--${string})`,
	fontSize: "var(--cui-avatar-font-size)" as `var(--${string})`,
	hue: "var(--cui-avatar-hue)" as `var(--${string})`,
	lightness: "var(--cui-avatar-lightness)" as `var(--${string})`,
	chroma: "var(--cui-avatar-chroma)" as `var(--${string})`,
	background: "var(--cui-avatar-background)" as `var(--${string})`,
	color: "var(--cui-avatar-color)" as `var(--${string})`,
	ring: "var(--cui-avatar-ring)" as `var(--${string})`,
	unassignedColor: "var(--cui-avatar-unassigned-color)" as `var(--${string})`,
};
