import "@codeui/styles/theme.css";
import "@codeui/styles/switch.css";
import * as K from "@kobalte/core/switch";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { onMount, splitProps, type ValidComponent } from "solid-js";
import { mergeClasses } from "../utils/css";
import * as styles from "../components/Switch/Switch.css";
import { createFieldLabelProps } from "../components/Field/FieldLabel/createFieldLabelProps";
import { trackInputModality } from "../utils/modality";
export { useSwitchContext } from "@kobalte/core/switch";
import { switchParts, type SwitchVariants, type SwitchPart, type SwitchClasses, type SwitchStyles, switchStyles } from "@codeui/styles/switch";
export { switchParts, type SwitchVariants, type SwitchPart, type SwitchClasses, type SwitchStyles, switchStyles } from "@codeui/styles/switch";
export type RootProps<T extends ValidComponent = "div"> = K.SwitchRootProps<T> &
	SwitchVariants;
export function Root<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", RootProps>, [
		"class",
		"size",
	]);
	onMount(trackInputModality);
	return (
		<K.Root
			{...others}
			data-cui="switch-root"
			data-size={local.size}
			class={mergeClasses(switchStyles.root(), local.class)}
		/>
	);
}
export type InputProps<T extends ValidComponent = "input"> = K.SwitchInputProps<T> &
	SwitchVariants;
export function Input<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, InputProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"input", InputProps>, [
		"class",
		"size",
	]);
	return (
		<K.Input
			{...others}
			data-cui="switch-input"
			data-size={local.size}
			class={mergeClasses(switchStyles.input(), local.class)}
		/>
	);
}
export type ControlProps<T extends ValidComponent = "div"> = K.SwitchControlProps<T> &
	SwitchVariants;
export function Control<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ControlProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", ControlProps>, [
		"class",
		"size",
	]);
	return (
		<K.Control
			{...others}
			data-cui="switch-control"
			data-size={local.size}
			class={mergeClasses(styles.control(), local.class)}
		/>
	);
}
export type ThumbProps<T extends ValidComponent = "div"> = K.SwitchThumbProps<T> &
	SwitchVariants;
export function Thumb<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ThumbProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", ThumbProps>, [
		"class",
		"size",
	]);
	return (
		<K.Thumb
			{...others}
			data-cui="switch-thumb"
			data-size={local.size}
			class={mergeClasses(styles.thumb(), local.class)}
		/>
	);
}
export type LabelProps<T extends ValidComponent = "label"> = K.SwitchLabelProps<T> &
	SwitchVariants;
export function Label<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, LabelProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"label", LabelProps>, [
		"class",
		"size",
	]);
	return (
		<K.Label
			{...others}
			data-cui="switch-label"
			data-size={local.size}
			class={mergeClasses(
				switchStyles.label(),
				createFieldLabelProps({ class: local.class }).class,
			)}
		/>
	);
}
export type DescriptionProps<T extends ValidComponent = "div"> =
	K.SwitchDescriptionProps<T> & SwitchVariants;
export function Description<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DescriptionProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", DescriptionProps>, [
		"class",
		"size",
	]);
	return (
		<K.Description
			{...others}
			data-cui="switch-description"
			data-size={local.size}
			class={mergeClasses(switchStyles.description(), local.class)}
		/>
	);
}
export type ErrorMessageProps<T extends ValidComponent = "div"> =
	K.SwitchErrorMessageProps<T> & SwitchVariants;
export function ErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ErrorMessageProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ErrorMessageProps>,
		["class", "size"],
	);
	return (
		<K.ErrorMessage
			{...others}
			data-cui="switch-error-message"
			data-size={local.size}
			class={mergeClasses(switchStyles.errorMessage(), local.class)}
		/>
	);
}
export const SwitchParts = {
	Root,
	Input,
	Control,
	Thumb,
	Label,
	Description,
	ErrorMessage,
};
