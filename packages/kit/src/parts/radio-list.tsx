import { radioListStyleProps } from "@codeui/styles/radiolist";
import "@codeui/styles/theme.css";
import "@codeui/styles/radiolist.css";
import "@codeui/styles/textfield.css";
import * as K from "@kobalte/core/radio-group";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { omit } from "solid-js";
import { type ComponentProps, type ValidComponent } from "@solidjs/web";
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
	const local = props as PolymorphicProps<"div", RootProps>;
	const others = omit(local, "class", "size", "variant");
	return (
		<K.Root
			data-cui="radiolist"
			data-field-size={local.size ?? "md"}
			data-field-variant={local.variant ?? "inline"}
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
			data-cui="radiolist-label"
			class={mergeClasses(props.class, label)}
		/>
	);
}

export type ItemsProps = ComponentProps<"div"> &
	ChoiceAppearance & {
		orientation?: K.RadioGroupRootOptions["orientation"];
	};
export function Items(props: ItemsProps) {
	const others = omit(props, "class", "size", "variant", "orientation");
	return (
		<div
			{...others}
			data-cui="radiolist-items"
			data-size={props.size ?? "md"}
			data-orientation={
				radioListStyleProps({ orientation: props.orientation })["data-orientation"]
			}
			data-variant={props.variant ?? "inline"}
			class={mergeClasses(props.class, styles.radioList())}
		/>
	);
}

export type DescriptionProps<T extends ValidComponent = "div"> =
	K.RadioGroupDescriptionProps;
export function Description<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DescriptionProps<T>>,
) {
	return (
		<K.Description<T>
			{...props}
			data-cui="radiolist-description"
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
			data-cui="radiolist-error-message"
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
			data-cui="radiolist-item"
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
			data-cui="radiolist-item-control"
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
			data-cui="radiolist-item-indicator"
			class={mergeClasses(styles.indicator, props.class)}
		/>
	);
}

export type ItemLabelProps<T extends ValidComponent = "label"> =
	K.RadioGroupItemLabelProps<T>;
export function ItemLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, ItemLabelProps<T>>,
) {
	return <K.ItemLabel<T> {...props} data-cui="radiolist-item-label" />;
}

export {
	ItemInput,
	ItemDescription,
	type RadioGroupItemInputProps as ItemInputProps,
	type RadioGroupItemDescriptionProps as ItemDescriptionProps,
} from "@kobalte/core/radio-group";
