import type { OptionCardItemLabelStyleOptions } from "../generated-appearance/optioncard";
import * as styles from "../components/OptionCard/OptionCard.css";
export const optionCardParts = {
	root: "optioncard",
	label: "optioncard-label",
	description: "optioncard-description",
	errorMessage: "optioncard-error-message",
	item: "optioncard-item",
	itemInput: "optioncard-item-input",
	itemControl: "optioncard-item-control",
	itemIndicator: "optioncard-item-indicator",
	itemLabel: "optioncard-item-label",
	itemDescription: "optioncard-item-description",
	preview: "optioncard-preview",
	badge: "optioncard-badge",
} as const;
export type OptionCardPart = keyof typeof optionCardParts;
export type OptionCardClasses = Partial<Record<OptionCardPart, string>>;
export type OptionCardVariant =
	| NonNullable<OptionCardItemLabelStyleOptions["variant"]>
	| "card";
export type OptionCardVariants = { variant?: OptionCardVariant };
export type OptionCardStyles = {
	[P in OptionCardPart]: () => string;
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
	itemLabel: styles.itemLabel,
	itemDescription: () => styles.itemDescription,
	preview: () => styles.preview,
	badge: () => styles.badge,
};
