import * as K from "@kobalte/core/progress";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { splitProps, type ValidComponent } from "solid-js";
import { mergeClasses } from "../utils/css";
import * as styles from "../components/Progress/Progress.css";
export { useProgressContext } from "@kobalte/core/progress";
export type ProgressVariants = { size?: "sm" | "md" };
export const progressParts = {
	root: "progress-root",
	label: "progress-label",
	track: "progress-track",
	fill: "progress-fill",
	valueLabel: "progress-value-label",
} as const;
export type ProgressPart = keyof typeof progressParts;
export type ProgressClasses = Partial<Record<ProgressPart, string>>;
export type ProgressStyles = Record<
	ProgressPart,
	(variants?: ProgressVariants) => string
>;
export const progressStyles: ProgressStyles = {
	root: () => styles.root,
	label: () => styles.label,
	track: () => styles.track,
	fill: () => styles.fill,
	valueLabel: () => styles.valueLabel,
};
export type RootProps<T extends ValidComponent = "div"> = K.ProgressRootProps<T> &
	ProgressVariants;
export function Root<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", RootProps>, [
		"class",
		"size",
	]);
	return (
		<K.Root
			{...others}
			data-cui={progressParts.root}
			data-size={local.size}
			class={mergeClasses(progressStyles.root(local), local.class)}
		/>
	);
}
export type LabelProps<T extends ValidComponent = "span"> = K.ProgressLabelProps<T> &
	ProgressVariants;
export function Label<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, LabelProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"span", LabelProps>, [
		"class",
		"size",
	]);
	return (
		<K.Label
			{...others}
			data-cui={progressParts.label}
			data-size={local.size}
			class={mergeClasses(progressStyles.label(local), local.class)}
		/>
	);
}
export type TrackProps<T extends ValidComponent = "div"> = K.ProgressTrackProps<T> &
	ProgressVariants;
export function Track<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TrackProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", TrackProps>, [
		"class",
		"size",
	]);
	return (
		<K.Track
			{...others}
			data-cui={progressParts.track}
			data-size={local.size}
			class={mergeClasses(progressStyles.track(local), local.class)}
		/>
	);
}
export type FillProps<T extends ValidComponent = "div"> = K.ProgressFillProps<T> &
	ProgressVariants;
export function Fill<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FillProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", FillProps>, [
		"class",
		"size",
	]);
	return (
		<K.Fill
			{...others}
			data-cui={progressParts.fill}
			data-size={local.size}
			class={mergeClasses(progressStyles.fill(local), local.class)}
		/>
	);
}
export type ValueLabelProps<T extends ValidComponent = "div"> =
	K.ProgressValueLabelProps<T> & ProgressVariants;
export function ValueLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ValueLabelProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", ValueLabelProps>, [
		"class",
		"size",
	]);
	return (
		<K.ValueLabel
			{...others}
			data-cui={progressParts.valueLabel}
			data-size={local.size}
			class={mergeClasses(progressStyles.valueLabel(local), local.class)}
		/>
	);
}
export const ProgressParts = { Root, Label, Track, Fill, ValueLabel };
