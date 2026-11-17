import { mergeClasses } from "../utils/css";
import * as styles from "../components/Combobox/Combobox.css";
export type ComboboxVariants = { size?: "sm" | "md" };
export const comboboxParts = {
	root: "combobox-root",
	control: "combobox-control",
	input: "combobox-input",
	trigger: "combobox-trigger",
	icon: "combobox-icon",
	content: "combobox-content",
	arrow: "combobox-arrow",
	listbox: "combobox-listbox",
	item: "combobox-item",
	itemLabel: "combobox-item-label",
	itemDescription: "combobox-item-description",
	itemIndicator: "combobox-item-indicator",
	section: "combobox-section",
	hiddenSelect: "combobox-hidden-select",
	label: "combobox-label",
	description: "combobox-description",
	errorMessage: "combobox-error-message",
} as const;
export type ComboboxPart = keyof typeof comboboxParts;
export type ComboboxClasses = Partial<Record<ComboboxPart, string>>;
export type ComboboxStyles = Record<
	ComboboxPart,
	(variants?: ComboboxVariants) => string
>;
export const comboboxStyles: ComboboxStyles = {
	root: () => styles.root,
	control: variants => styles.control({ size: variants?.size }),
	input: () => styles.input,
	trigger: () => styles.trigger,
	icon: () => styles.icon,
	content: () => styles.content,
	arrow: () => styles.arrow,
	listbox: () => styles.listbox,
	item: () => styles.item,
	itemLabel: () => styles.itemLabel,
	itemDescription: () => styles.itemDescription,
	itemIndicator: () => styles.itemIndicator,
	section: () => styles.section,
	hiddenSelect: () => styles.hiddenSelect,
	label: () => styles.label,
	description: () => styles.description,
	errorMessage: () => styles.errorMessage,
};
