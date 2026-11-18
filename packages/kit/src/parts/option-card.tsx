import "@codeui/styles/theme.css";
import "@codeui/styles/option-card.css";
import * as K from "@kobalte/core/radio-group";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { type JSX, splitProps, type ValidComponent } from "solid-js";
import {
	Badge as KitBadge,
	type BadgeProps as KitBadgeProps,
} from "../components/Badge/Badge";
import * as styles from "../components/OptionCard/OptionCard.css";
import { mergeClasses } from "../utils/css";

import { optionCardParts, type OptionCardPart, type OptionCardClasses, type OptionCardVariant, type OptionCardVariants, type OptionCardStyles, optionCardStyles } from "@codeui/styles/option-card";
export { optionCardParts, type OptionCardPart, type OptionCardClasses, type OptionCardVariant, type OptionCardVariants, type OptionCardStyles, optionCardStyles } from "@codeui/styles/option-card";
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
			// Kobalte sets only aria-orientation; the vertical layout reads this.
			data-orientation={local.orientation ?? "horizontal"}
			data-cui={optionCardParts.root}
			data-variant={local.variant ?? "card"}
			class={mergeClasses(optionCardStyles.root(), local.class)}
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
				optionCardStyles.label(),
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
				optionCardStyles.description(),
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
				optionCardStyles.errorMessage(),
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
			class={mergeClasses(optionCardStyles.item(), local.class)}
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
				optionCardStyles.itemInput(),
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
				optionCardStyles.itemControl(),
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
				optionCardStyles.itemIndicator(),
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
				styles.itemLabel(),
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
				optionCardStyles.itemDescription(),
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
