import * as styles from "../components/OptionCard/OptionCard.css";
import { mergeClasses } from "../utils/css";
export const optionCardParts = {
	root: "option-card-root",
	label: "option-card-label",
	description: "option-card-description",
	errorMessage: "option-card-error-message",
	item: "option-card-item",
	itemInput: "option-card-item-input",
	itemControl: "option-card-item-control",
	itemIndicator: "option-card-item-indicator",
	itemLabel: "option-card-item-label",
	itemDescription: "option-card-item-description",
	preview: "option-card-preview",
	badge: "option-card-badge",
} as const;
export type OptionCardPart = keyof typeof optionCardParts;
export type OptionCardClasses = Partial<Record<OptionCardPart, string>>;
export type OptionCardVariant = "card" | "tile";
export type OptionCardVariants = { variant?: OptionCardVariant };
export type OptionCardStyles = {
	[P in OptionCardPart]: (variants?: OptionCardVariants) => string;
};
export const optionCardStyles: OptionCardStyles = {
	root: () => styles.root,
	label: () => styles.label,
	description: () => styles.description,
	errorMessage: () => styles.errorMessage,
	item: () => styles.item,
	itemInput: () => styles.itemInput,
	itemControl: () => styles.itemControl,
	itemIndicator: () => styles.itemIndicator,
	itemLabel: variants => styles.itemLabel({ variant: variants?.variant ?? "card" }),
	itemDescription: () => styles.itemDescription,
	preview: () => styles.preview,
	badge: () => styles.badge,
};
