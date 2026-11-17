import * as styles from "../components/Toast/Toast.css";
export const toastParts = {
	region: "toast-region",
	list: "toast-list",
	root: "toast-root",
	title: "toast-title",
	description: "toast-description",
	closeButton: "toast-close-button",
	progressTrack: "toast-progress-track",
	progressFill: "toast-progress-fill",
	icon: "toast-icon",
	action: "toast-action",
} as const;

export type ToastPart = keyof typeof toastParts;
export type ToastClasses = Partial<Record<ToastPart, string>>;
export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";
export type ToastPosition =
	| "top-left"
	| "top-center"
	| "top-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right";
export type ToastVariants = { tone?: ToastTone; position?: ToastPosition };

export type ToastStyles = { [P in ToastPart]: () => string };

export const toastStyles: ToastStyles = {
	region: styles.region,
	list: () => styles.list,
	root: styles.root,
	title: () => styles.title,
	description: () => styles.description,
	closeButton: () => styles.closeButton,
	progressTrack: () => styles.progressTrack,
	progressFill: () => styles.progressFill,
	icon: () => styles.icon,
	action: () => styles.action,
};
