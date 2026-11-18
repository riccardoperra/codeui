import type { PopoverStyleOptions } from "../generated-appearance/popover";
import * as styles from "../components/Popover/Popover.css";
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
export type PopoverVariant = NonNullable<PopoverStyleOptions["variant"]>;

export type PopoverStyles = {
	[P in PopoverPart]: () => string;
};

export const popoverStyles: PopoverStyles = {
	trigger: () => "",
	anchor: () => "",
	content: styles.content,
	arrow: () => "",
	title: () => styles.title,
	description: () => styles.description,
	closeButton: () => "",
};
