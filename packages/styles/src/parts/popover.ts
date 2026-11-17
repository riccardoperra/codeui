import * as styles from "../components/Popover/Popover.css";
import { mergeClasses } from "../utils/css";
export const popoverParts = {
	trigger: "popover-trigger",
	anchor: "popover-anchor",
	content: "popover-content",
	arrow: "popover-arrow",
	title: "popover-title",
	description: "popover-description",
	closeButton: "popover-close-button",
} as const;

export type PopoverPart = keyof typeof popoverParts;
export type PopoverClasses = Partial<Record<PopoverPart, string>>;
export type PopoverVariant = "bordered";

export type PopoverStyles = {
	[P in PopoverPart]: P extends "content"
		? (variants?: { variant?: PopoverVariant }) => string
		: () => string;
};

export const popoverStyles: PopoverStyles = {
	trigger: () => "",
	anchor: () => "",
	content: variants => styles.content({ variant: variants?.variant }),
	arrow: () => "",
	title: () => styles.title,
	description: () => styles.description,
	closeButton: () => "",
};
