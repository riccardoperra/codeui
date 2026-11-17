import * as styles from "../components/Badge/Badge.css";
export const badgeParts = {
	root: "badge-root",
	icon: "badge-icon",
	label: "badge-label",
} as const;

export type BadgePart = keyof typeof badgeParts;
export type BadgeClasses = Partial<Record<BadgePart, string>>;
export type BadgeSize = "sm" | "md";
export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";
export type BadgeVariant = "soft" | "outline";
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
