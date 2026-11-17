import { type Accessor, children, mergeProps, Show, splitProps } from "solid-js";
import * as P from "../../parts/switch";
import { createBaseFieldProps, type FieldContent } from "../Field/createBaseFieldProps";
import { mergeClasses } from "../../utils/css";
export type SwitchProps = Omit<P.RootProps, "children"> &
	FieldContent & {
		class?: string;
		inputId?: string;
		"aria-label"?: string;
		"aria-labelledby"?: string;
		"aria-describedby"?: string;
		size?: "sm" | "md";
		classes?: P.SwitchClasses;
	};
export function createSwitchProps(props: Accessor<SwitchProps>) {
	const ids = createBaseFieldProps({}, props).ids;
	const root = () => {
		const [, rest] = splitProps(props(), [
			"label",
			"description",
			"errorMessage",
			"inputId",
			"aria-label",
			"aria-labelledby",
			"aria-describedby",
			"classes",
		]);
		return rest;
	};
	return {
		root,
		input: () => ({
			id: ids.input(),
			"aria-label": props()["aria-label"],
			"aria-labelledby":
				props()["aria-labelledby"] ?? (props().label ? ids.label() : undefined),
			"aria-describedby": props()["aria-describedby"],
			class: props().classes?.input,
		}),
		label: () => ({ id: ids.label(), for: ids.input(), class: props().classes?.label }),
		description: () => ({ id: ids.description(), class: props().classes?.description }),
		errorMessage: () => ({
			id: ids.errorMessage(),
			class: props().classes?.errorMessage,
		}),
	};
}
export function Switch(props: SwitchProps) {
	// createSwitchProps reads the label to set aria-labelledby. Resolve it once and
	// pass the result, so the label element is built once.
	const label = children(() => props.label);
	const resolved = mergeProps(props, {
		get label() {
			return label();
		},
	});
	const field = createSwitchProps(() => resolved);
	return (
		<P.Root
			{...field.root()}
			class={mergeClasses(props.class, props.classes?.root)}
			size={props.size ?? "md"}
		>
			<P.Input {...field.input()} />
			<P.Control class={props.classes?.control} size={props.size ?? "md"}>
				<P.Thumb class={props.classes?.thumb} size={props.size ?? "md"} />
			</P.Control>
			<Show when={label()}>
				<P.Label {...field.label()}>{label()}</P.Label>
			</Show>
			<Show when={props.description}>
				{description => (
					<P.Description {...field.description()}>{description()}</P.Description>
				)}
			</Show>
			<Show when={props.validationState === "invalid" && props.errorMessage}>
				{errorMessage => (
					<P.ErrorMessage {...field.errorMessage()}>{errorMessage()}</P.ErrorMessage>
				)}
			</Show>
		</P.Root>
	);
}
export { switchStyles, SwitchParts } from "../../parts/switch";
export type {
	SwitchClasses,
	SwitchPart,
	SwitchVariants,
	SwitchStyles,
} from "../../parts/switch";
