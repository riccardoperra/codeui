import { mergeClasses } from "../utils/css";
import { pickProps } from "../utils/pick-props";
import "@codeui/styles/theme.css";
import "@codeui/styles/switch.css";
import * as K from "@kobalte/core/switch";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { createMemo, onSettled, omit } from "solid-js";
import { type ValidComponent } from "@solidjs/web";
import { trackInputModality } from "../utils/modality";
export { useSwitchContext } from "@kobalte/core/switch";
import { type SwitchVariants, switchStyleProps } from "@codeui/styles/switch";
export {
	switchParts,
	type SwitchVariants,
	type SwitchPart,
	type SwitchClasses,
	type SwitchStyles,
	switchStyles,
} from "@codeui/styles/switch";
type SwitchAppearance = ReturnType<
	(typeof switchStyleProps)[keyof typeof switchStyleProps]
>;

function bindAppearance(read: () => SwitchAppearance) {
	const props = createMemo(read);
	// Keep the spread source stable so Kobalte can track its polymorphic element separately.
	return {
		get class() {
			return props().class;
		},
		get "data-cui"() {
			return props()["data-cui"];
		},
		get "data-size"() {
			return props()["data-size"];
		},
	};
}

export type RootProps<T extends ValidComponent = "div"> = K.SwitchRootProps<T> &
	SwitchVariants;
export function Root<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const allProps = props as PolymorphicProps<"div", RootProps>;
	const local = pickProps(allProps, "class", "size");
	const others = omit(allProps, "class", "size");
	onSettled(trackInputModality);
	const appearance = bindAppearance(() =>
		switchStyleProps.root({ size: local.size, class: mergeClasses(local.class) }),
	);
	return <K.Root {...others} {...appearance} />;
}
export type InputProps<T extends ValidComponent = "input"> = K.SwitchInputProps<T> &
	SwitchVariants;
export function Input<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, InputProps<T>>,
) {
	const allProps = props as PolymorphicProps<"input", InputProps>;
	const local = pickProps(allProps, "class", "size");
	const others = omit(allProps, "class", "size");
	const appearance = bindAppearance(() =>
		switchStyleProps.input({ size: local.size, class: mergeClasses(local.class) }),
	);
	return <K.Input {...others} {...appearance} />;
}
export type ControlProps<T extends ValidComponent = "div"> = K.SwitchControlProps<T> &
	SwitchVariants;
export function Control<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ControlProps<T>>,
) {
	const allProps = props as PolymorphicProps<"div", ControlProps>;
	const local = pickProps(allProps, "class", "size");
	const others = omit(allProps, "class", "size");
	const appearance = bindAppearance(() =>
		switchStyleProps.control({ size: local.size, class: mergeClasses(local.class) }),
	);
	return <K.Control {...others} {...appearance} />;
}
export type ThumbProps<T extends ValidComponent = "div"> = K.SwitchThumbProps<T> &
	SwitchVariants;
export function Thumb<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ThumbProps<T>>,
) {
	const allProps = props as PolymorphicProps<"div", ThumbProps>;
	const local = pickProps(allProps, "class", "size");
	const others = omit(allProps, "class", "size");
	const appearance = bindAppearance(() =>
		switchStyleProps.thumb({ size: local.size, class: mergeClasses(local.class) }),
	);
	return <K.Thumb {...others} {...appearance} />;
}
export type LabelProps<T extends ValidComponent = "label"> = K.SwitchLabelProps<T> &
	SwitchVariants;
export function Label<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, LabelProps<T>>,
) {
	const allProps = props as PolymorphicProps<"label", LabelProps>;
	const local = pickProps(allProps, "class", "size");
	const others = omit(allProps, "class", "size");
	const appearance = bindAppearance(() =>
		switchStyleProps.label({ size: local.size, class: mergeClasses(local.class) }),
	);
	return <K.Label {...others} {...appearance} />;
}
export type DescriptionProps<T extends ValidComponent = "div"> =
	K.SwitchDescriptionProps<T> & SwitchVariants;
export function Description<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DescriptionProps<T>>,
) {
	const allProps = props as PolymorphicProps<"div", DescriptionProps>;
	const local = pickProps(allProps, "class", "size");
	const others = omit(allProps, "class", "size");
	const appearance = bindAppearance(() =>
		switchStyleProps.description({ size: local.size, class: mergeClasses(local.class) }),
	);
	return <K.Description {...others} {...appearance} />;
}
export type ErrorMessageProps<T extends ValidComponent = "div"> =
	K.SwitchErrorMessageProps<T> & SwitchVariants;
export function ErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ErrorMessageProps<T>>,
) {
	const allProps = props as PolymorphicProps<"div", ErrorMessageProps>;
	const local = pickProps(allProps, "class", "size");
	const others = omit(allProps, "class", "size");
	const appearance = bindAppearance(() =>
		switchStyleProps.errorMessage({ size: local.size, class: mergeClasses(local.class) }),
	);
	return <K.ErrorMessage {...others} {...appearance} />;
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
