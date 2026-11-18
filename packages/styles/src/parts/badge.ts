import type { BadgeStyleOptions } from "../generated-appearance/badge";
import * as styles from "../components/Badge/Badge.css";
export const badgeParts = {
	root: "badge",
	icon: "badge-icon",
	label: "badge-label",
} as const;

export type BadgePart = keyof typeof badgeParts;
export type BadgeClasses = Partial<Record<BadgePart, string>>;
export type BadgeSize = NonNullable<BadgeStyleOptions["size"]>;
export type BadgeTone = NonNullable<BadgeStyleOptions["tone"]>;
export type BadgeVariant = NonNullable<BadgeStyleOptions["variant"]>;
export type BadgeVariants = {
	size?: BadgeSize;
	tone?: BadgeTone;
	variant?: BadgeVariant;
};

export type BadgeStyles = { [P in BadgePart]: () => string };

export const badgeStyles: BadgeStyles = {
	root: styles.root,
	icon: () => styles.icon,
	label: () => styles.label,
};
