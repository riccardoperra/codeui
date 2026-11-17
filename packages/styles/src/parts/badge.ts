import * as styles from "../components/Badge/Badge.css";
import { mergeClasses } from "../utils/css";
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

export type BadgeStyles = { [P in BadgePart]: (variants?: BadgeVariants) => string };

export const badgeStyles: BadgeStyles = {
	root: variants =>
		styles.root({
			size: variants?.size,
			tone: variants?.tone,
			variant: variants?.variant,
		}),
	icon: () => styles.icon,
	label: () => styles.label,
};
