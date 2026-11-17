import * as K from "@kobalte/core/radio-group";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { type JSX, splitProps, type ValidComponent } from "solid-js";
import {
	Badge as KitBadge,
	type BadgeProps as KitBadgeProps,
} from "../components/Badge/Badge";
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

export type RootProps<T extends ValidComponent = "div"> = K.RadioGroupRootProps<T> &
	OptionCardVariants & { class?: string };
export function Root<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", RootProps>, [
		"class",
		"variant",
		"orientation",
	]);
	return (
		<K.Root
			{...others}
			orientation={local.orientation ?? "horizontal"}
			data-cui={optionCardParts.root}
			data-variant={local.variant ?? "card"}
			class={mergeClasses(optionCardStyles.root({ variant: local.variant }), local.class)}
		/>
	);
}

export type LabelProps<T extends ValidComponent = "span"> = K.RadioGroupLabelProps<T> &
	OptionCardVariants & { class?: string };
export function Label<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, LabelProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"span", LabelProps>, [
		"class",
		"variant",
	]);
	return (
		<K.Label
			{...others}
			data-cui={optionCardParts.label}
			data-variant={local.variant ?? "card"}
			class={mergeClasses(
				optionCardStyles.label({ variant: local.variant }),
				local.class,
			)}
		/>
	);
}

export type DescriptionProps<T extends ValidComponent = "div"> =
	K.RadioGroupDescriptionProps<T> & OptionCardVariants & { class?: string };
export function Description<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DescriptionProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", DescriptionProps>, [
		"class",
		"variant",
	]);
	return (
		<K.Description
			{...others}
			data-cui={optionCardParts.description}
			data-variant={local.variant ?? "card"}
			class={mergeClasses(
				optionCardStyles.description({ variant: local.variant }),
				local.class,
			)}
		/>
	);
}

export type ErrorMessageProps<T extends ValidComponent = "div"> =
	K.RadioGroupErrorMessageProps<T> & OptionCardVariants & { class?: string };
export function ErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ErrorMessageProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ErrorMessageProps>,
		["class", "variant"],
	);
	return (
		<K.ErrorMessage
			{...others}
			data-cui={optionCardParts.errorMessage}
			data-variant={local.variant ?? "card"}
			class={mergeClasses(
				optionCardStyles.errorMessage({ variant: local.variant }),
				local.class,
			)}
		/>
	);
}

export type ItemProps<T extends ValidComponent = "div"> = K.RadioGroupItemProps<T> &
	OptionCardVariants & { class?: string };
export function Item<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", ItemProps>, [
		"class",
		"variant",
	]);
	return (
		<K.Item
			{...others}
			data-cui={optionCardParts.item}
			data-variant={local.variant ?? "card"}
			class={mergeClasses(optionCardStyles.item({ variant: local.variant }), local.class)}
		/>
	);
}

export type ItemInputProps<T extends ValidComponent = "input"> =
	K.RadioGroupItemInputProps<T> & OptionCardVariants & { class?: string };
export function ItemInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, ItemInputProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"input", ItemInputProps>, [
		"class",
		"variant",
	]);
	return (
		<K.ItemInput
			{...others}
			data-cui={optionCardParts.itemInput}
			data-variant={local.variant ?? "card"}
			class={mergeClasses(
				optionCardStyles.itemInput({ variant: local.variant }),
				local.class,
			)}
		/>
	);
}

export type ItemControlProps<T extends ValidComponent = "div"> =
	K.RadioGroupItemControlProps<T> & OptionCardVariants & { class?: string };
export function ItemControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemControlProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", ItemControlProps>, [
		"class",
		"variant",
	]);
	return (
		<K.ItemControl
			{...others}
			data-cui={optionCardParts.itemControl}
			data-variant={local.variant ?? "card"}
			class={mergeClasses(
				optionCardStyles.itemControl({ variant: local.variant }),
				local.class,
			)}
		/>
	);
}

export type ItemIndicatorProps<T extends ValidComponent = "div"> =
	K.RadioGroupItemIndicatorProps<T> & OptionCardVariants & { class?: string };
export function ItemIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemIndicatorProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ItemIndicatorProps>,
		["class", "variant"],
	);
	return (
		<K.ItemIndicator
			{...others}
			data-cui={optionCardParts.itemIndicator}
			data-variant={local.variant ?? "card"}
			class={mergeClasses(
				optionCardStyles.itemIndicator({ variant: local.variant }),
				local.class,
			)}
		/>
	);
}

export type ItemLabelProps<T extends ValidComponent = "label"> =
	K.RadioGroupItemLabelProps<T> & OptionCardVariants & { class?: string };
export function ItemLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, ItemLabelProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"label", ItemLabelProps>, [
		"class",
		"variant",
	]);
	return (
		<K.ItemLabel
			{...others}
			data-cui={optionCardParts.itemLabel}
			data-variant={local.variant ?? "card"}
			class={mergeClasses(
				optionCardStyles.itemLabel({ variant: local.variant }),
				local.class,
			)}
		/>
	);
}

export type ItemDescriptionProps<T extends ValidComponent = "div"> =
	K.RadioGroupItemDescriptionProps<T> & OptionCardVariants & { class?: string };
export function ItemDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemDescriptionProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ItemDescriptionProps>,
		["class", "variant"],
	);
	return (
		<K.ItemDescription
			{...others}
			data-cui={optionCardParts.itemDescription}
			data-variant={local.variant ?? "card"}
			class={mergeClasses(
				optionCardStyles.itemDescription({ variant: local.variant }),
				local.class,
			)}
		/>
	);
}

export type PreviewProps = JSX.HTMLAttributes<HTMLDivElement>;
export function Preview(props: PreviewProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div
			aria-hidden="true"
			{...others}
			data-cui={optionCardParts.preview}
			class={mergeClasses(optionCardStyles.preview(), local.class)}
		/>
	);
}
export type BadgeProps = KitBadgeProps;
export function Badge(props: BadgeProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<KitBadge
			{...others}
			data-cui={optionCardParts.badge}
			class={mergeClasses(optionCardStyles.badge(), local.class)}
		/>
	);
}
export { useRadioGroupContext } from "@kobalte/core/radio-group";
