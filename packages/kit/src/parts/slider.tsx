import "@codeui/styles/theme.css";
import "@codeui/styles/slider.css";
import * as K from "@kobalte/core/slider";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { splitProps, type ValidComponent } from "solid-js";
import { mergeClasses } from "../utils/css";
import * as styles from "../components/Slider/Slider.css";
export { useSliderContext } from "@kobalte/core/slider";
import { type SliderVariants, sliderParts, type SliderPart, type SliderClasses, type SliderStyles, sliderStyles } from "@codeui/styles/slider";
export { type SliderVariants, sliderParts, type SliderPart, type SliderClasses, type SliderStyles, sliderStyles } from "@codeui/styles/slider";
export type RootProps<T extends ValidComponent = "div"> = K.SliderRootProps<T> &
	SliderVariants;
export function Root<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", RootProps>, [
		"class",
		"orientation",
	]);
	return (
		<K.Root
			{...others}
			orientation={local.orientation}
			data-cui={sliderParts.root}
			data-orientation={local.orientation}
			class={mergeClasses(sliderStyles.root(local), local.class)}
		/>
	);
}
export type LabelProps<T extends ValidComponent = "label"> = K.SliderLabelProps<T> &
	SliderVariants;
export function Label<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, LabelProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"label", LabelProps>, [
		"class",
		"orientation",
	]);
	return (
		<K.Label
			{...others}
			data-cui={sliderParts.label}
			data-orientation={local.orientation}
			class={mergeClasses(sliderStyles.label(local), local.class)}
		/>
	);
}
export type DescriptionProps<T extends ValidComponent = "div"> =
	K.SliderDescriptionProps<T> & SliderVariants;
export function Description<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DescriptionProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", DescriptionProps>, [
		"class",
		"orientation",
	]);
	return (
		<K.Description
			{...others}
			data-cui={sliderParts.description}
			data-orientation={local.orientation}
			class={mergeClasses(sliderStyles.description(local), local.class)}
		/>
	);
}
export type ErrorMessageProps<T extends ValidComponent = "div"> =
	K.SliderErrorMessageProps<T> & SliderVariants;
export function ErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ErrorMessageProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ErrorMessageProps>,
		["class", "orientation"],
	);
	return (
		<K.ErrorMessage
			{...others}
			data-cui={sliderParts.errorMessage}
			data-orientation={local.orientation}
			class={mergeClasses(sliderStyles.errorMessage(local), local.class)}
		/>
	);
}
export type TrackProps<T extends ValidComponent = "div"> = K.SliderTrackProps<T> &
	SliderVariants;
export function Track<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TrackProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", TrackProps>, [
		"class",
		"orientation",
	]);
	return (
		<K.Track
			{...others}
			data-cui={sliderParts.track}
			data-orientation={local.orientation}
			class={mergeClasses(styles.track.classNames.base, local.class)}
		/>
	);
}
export type FillProps<T extends ValidComponent = "div"> = K.SliderFillProps<T> &
	SliderVariants;
export function Fill<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FillProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", FillProps>, [
		"class",
		"orientation",
	]);
	return (
		<K.Fill
			{...others}
			data-cui={sliderParts.fill}
			data-orientation={local.orientation}
			class={mergeClasses(styles.fill.classNames.base, local.class)}
		/>
	);
}
export type ThumbProps<T extends ValidComponent = "span"> = K.SliderThumbProps<T> &
	SliderVariants;
export function Thumb<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, ThumbProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"span", ThumbProps>, [
		"class",
		"orientation",
	]);
	return (
		<K.Thumb
			{...others}
			data-cui={sliderParts.thumb}
			data-orientation={local.orientation}
			class={mergeClasses(sliderStyles.thumb(local), local.class)}
		/>
	);
}
export type InputProps = K.SliderInputProps;
export function Input(props: InputProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<K.Input
			{...others}
			data-cui="slider-input"
			class={mergeClasses(styles.input, local.class)}
		/>
	);
}
export type ValueLabelProps<T extends ValidComponent = "div"> =
	K.SliderValueLabelProps<T> & SliderVariants;
export function ValueLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ValueLabelProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", ValueLabelProps>, [
		"class",
		"orientation",
	]);
	return (
		<K.ValueLabel
			{...others}
			data-cui={sliderParts.valueLabel}
			data-orientation={local.orientation}
			class={mergeClasses(sliderStyles.valueLabel(local), local.class)}
		/>
	);
}
export const SliderParts = {
	Root,
	Label,
	Description,
	ErrorMessage,
	Track,
	Fill,
	Thumb,
	Input,
	ValueLabel,
};
