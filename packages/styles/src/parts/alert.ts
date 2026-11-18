import type { AlertStyleOptions } from "../generated-appearance/alert";
import * as styles from "../components/Alert/Alert.css";
export const alertParts = {
	root: "alert-root",
	icon: "alert-icon",
	title: "alert-title",
	description: "alert-description",
	action: "alert-action",
} as const;

export type AlertPart = keyof typeof alertParts;
export type AlertClasses = Partial<Record<AlertPart, string>>;
export type AlertTone = NonNullable<AlertStyleOptions["tone"]>;
export type AlertVariants = { tone?: AlertTone; fluid?: boolean };

export type AlertStyles = { [P in AlertPart]: () => string };

export const alertStyles: AlertStyles = {
	root: styles.root,
	icon: () => styles.icon,
	title: () => styles.title,
	description: () => styles.description,
	action: () => styles.action,
};
