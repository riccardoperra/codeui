import { radioListStyleProps } from "@codeui/styles/radio-list";
import "@codeui/styles/theme.css";
import "@codeui/styles/radio-list.css";
import "@codeui/styles/text-field.css";
import * as K from "@kobalte/core/radio-group";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { splitProps, type ComponentProps, type ValidComponent } from "solid-js";
import type { BaseFieldProps } from "../components/Field/createBaseFieldProps";
import { errorMessage } from "../components/Field/FieldError/FieldError.css";
import { label } from "../components/Field/FieldLabel/FieldLabel.css";
import { description } from "../components/Field/FieldMessage/FieldMessage.css";
import * as styles from "../components/RadioList/Radio.css";
import { baseFieldContainer } from "../components/TextField/TextField.css";
import { mergeClasses } from "../utils/css";

type ChoiceAppearance = Omit<NonNullable<BaseFieldProps>, "size"> & {
	size?: NonNullable<BaseFieldProps>["size"] | "xl";
};

export type RootProps<T extends ValidComponent = "div"> = K.RadioGroupRootProps<T> &
	ChoiceAppearance;
export function Root<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", RootProps>, [
		"class",
		"size",
		"theme",
	]);
	return (
		<K.Root
			data-cui="radio-group-field"
			data-field-size={local.size ?? "md"}
			data-field-theme={local.theme ?? "inline"}
			{...others}
			class={mergeClasses(baseFieldContainer, local.class)}
		/>
	);
}

export type LabelProps<T extends ValidComponent = "span"> = K.RadioGroupLabelProps<T>;
export function Label<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, LabelProps<T>>,
) {
	return (
		<K.Label<T>
			{...props}
			data-cui="radio-list-label"
			class={mergeClasses(props.class, label)}
		/>
	);
}

export type ItemsProps = ComponentProps<"div"> &
	ChoiceAppearance & {
		orientation?: K.RadioGroupRootOptions["orientation"];
	};
export function Items(props: ItemsProps) {
	const [local, others] = splitProps(props, ["class", "size", "theme", "orientation"]);
	return (
		<div
			{...others}
			data-cui="radio-list-items"
			data-size={local.size ?? "md"}
			data-orientation={radioListStyleProps({ orientation: local.orientation })["data-orientation"]}
			data-theme={local.theme ?? "inline"}
			class={mergeClasses(local.class, styles.radioList())}
		/>
	);
}

export type DescriptionProps<T extends ValidComponent = "div"> =
	K.RadioGroupDescriptionProps<T>;
export function Description<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DescriptionProps<T>>,
) {
	return (
		<K.Description<T>
			{...props}
			data-cui="radio-list-description"
			class={mergeClasses(props.class, description)}
		/>
	);
}

export type ErrorMessageProps<T extends ValidComponent = "div"> =
	K.RadioGroupErrorMessageProps<T>;
export function ErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ErrorMessageProps<T>>,
) {
	return (
		<K.ErrorMessage<T>
			{...props}
			data-cui="radio-list-error-message"
			class={mergeClasses(errorMessage, props.class)}
		/>
	);
}

export type ItemProps<T extends ValidComponent = "div"> = K.RadioGroupItemProps<T>;
export function Item<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemProps<T>>,
) {
	return (
		<K.Item<T>
			{...props}
			data-cui="radio-list-item"
			class={mergeClasses(styles.radioItem, props.class)}
		/>
	);
}

export type ItemControlProps<T extends ValidComponent = "div"> =
	K.RadioGroupItemControlProps<T>;
export function ItemControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemControlProps<T>>,
) {
	return (
		<K.ItemControl<T>
			{...props}
			data-cui="radio-list-item-control"
			class={mergeClasses(styles.radio, props.class)}
		/>
	);
}

export type ItemIndicatorProps<T extends ValidComponent = "div"> =
	K.RadioGroupItemIndicatorProps<T>;
export function ItemIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemIndicatorProps<T>>,
) {
	return (
		<K.ItemIndicator<T>
			{...props}
			data-cui="radio-list-item-indicator"
			class={mergeClasses(styles.indicator, props.class)}
		/>
	);
}

export type ItemLabelProps<T extends ValidComponent = "label"> =
	K.RadioGroupItemLabelProps<T>;
export function ItemLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, ItemLabelProps<T>>,
) {
	return <K.ItemLabel<T> {...props} data-cui="radio-list-item-label" />;
}

export {
	ItemInput,
	ItemDescription,
	type RadioGroupItemInputProps as ItemInputProps,
	type RadioGroupItemDescriptionProps as ItemDescriptionProps,
} from "@kobalte/core/radio-group";
