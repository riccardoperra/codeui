import { checkboxStyleProps } from "@codeui/styles/checkbox";
import "@codeui/styles/theme.css";
import "@codeui/styles/checkbox.css";
import * as K from "@kobalte/core/checkbox";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { omit } from "solid-js";
import { type ComponentProps, type ValidComponent } from "@solidjs/web";
import * as styles from "../components/CheckBox/CheckBox.css";
import type { BaseFieldProps } from "../components/Field/createBaseFieldProps";
import { errorMessage } from "../components/Field/FieldError/FieldError.css";
import { description } from "../components/Field/FieldMessage/FieldMessage.css";
import { CheckIcon } from "../icons/CheckIcon";
import { mergeClasses } from "../utils/css";

type ChoiceAppearance = Omit<NonNullable<BaseFieldProps>, "size"> & {
	size?: NonNullable<BaseFieldProps>["size"] | "xl";
};

export type RootProps<T extends ValidComponent = "div"> = K.CheckboxRootProps<T> &
	ChoiceAppearance;
export function Root<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const local = props as PolymorphicProps<"div", RootProps>;
	const others = omit(local, "class", "size", "variant");
	return (
		<K.Root
			{...others}
			data-cui="checkbox"
			data-field-size={checkboxStyleProps({ fieldSize: local.size })["data-field-size"]}
			data-field-variant={local.variant ?? "inline"}
			class={mergeClasses(styles.container, local.class)}
		/>
	);
}

export type InputProps<T extends ValidComponent = "input"> = K.CheckboxInputProps<T>;
export function Input<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, InputProps<T>>,
) {
	return <K.Input<T> {...props} class={mergeClasses(styles.input, props.class)} />;
}

export type ControlProps<T extends ValidComponent = "div"> = K.CheckboxControlProps<T> &
	ChoiceAppearance;
export function Control<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ControlProps<T>>,
) {
	const local = props as PolymorphicProps<"div", ControlProps>;
	const others = omit(local, "class", "size", "variant");
	return (
		<K.Control
			{...others}
			data-size={checkboxStyleProps.control({ size: local.size })["data-size"]}
			data-variant={local.variant ?? "inline"}
			class={mergeClasses(styles.control(), local.class)}
		/>
	);
}

export type IndicatorProps<T extends ValidComponent = "div"> =
	K.CheckboxIndicatorProps<T>;
export function Indicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, IndicatorProps<T>>,
) {
	return (
		<K.Indicator<T>
			{...props}
			forceMount={props.forceMount ?? true}
			class={mergeClasses(styles.indicator, props.class)}
		>
			{props.children === undefined ? <CheckIcon class={styles.icon} /> : props.children}
		</K.Indicator>
	);
}

export type ContentProps = ComponentProps<"div">;
export function Content(props: ContentProps) {
	return <div {...props} class={mergeClasses(styles.content, props.class)} />;
}

export type LabelProps<T extends ValidComponent = "label"> = K.CheckboxLabelProps<T>;
export function Label<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, LabelProps<T>>,
) {
	return <K.Label<T> {...props} class={mergeClasses(styles.label, props.class)} />;
}

export type DescriptionProps<T extends ValidComponent = "div"> =
	K.CheckboxDescriptionProps<T>;
export function Description<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DescriptionProps<T>>,
) {
	return <K.Description<T> {...props} class={mergeClasses(props.class, description)} />;
}

export type ErrorMessageProps<T extends ValidComponent = "div"> =
	K.CheckboxErrorMessageProps<T>;
export function ErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ErrorMessageProps<T>>,
) {
	return <K.ErrorMessage<T> {...props} class={mergeClasses(errorMessage, props.class)} />;
}
