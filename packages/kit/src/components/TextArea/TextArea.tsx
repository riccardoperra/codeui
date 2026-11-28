import { pickProps } from "../../utils/pick-props";
import { INPUT_KEYS, FieldInputProps, FieldClasses } from "../Field/inputProps";
import type {
	TextFieldRootOptions as KTextFieldRootOptions,
	TextFieldTextAreaProps as KTextFieldTextAreaProps,
} from "@kobalte/core/text-field";
import { Ref, Show, omit } from "solid-js";
import { JSX } from "@solidjs/web";
import * as P from "../../parts/text-area";
import { mergeClasses } from "../../utils/css";
import type { FieldWithErrorMessageSupport } from "../Field/FieldError/createFieldErrorMessageProps";
import type { BaseFieldProps } from "../Field/createBaseFieldProps";
import { SlotProp } from "../../utils/component";

type TextAreaSlot = "root" | "input" | "label" | "errorLabel";

export type TextAreaProps = KTextFieldRootOptions &
	BaseFieldProps &
	FieldWithErrorMessageSupport & {
		description?: JSX.Element;
		classes?: FieldClasses;
		/** @deprecated Use classes. This alias remains until 1.0. */
		slotClasses?: SlotProp<TextAreaSlot>["slotClasses"];
		label?: JSX.Element;
		placeholder?: string;
		ref?: Ref<HTMLTextAreaElement>;
		options?: KTextFieldTextAreaProps;
	} & FieldInputProps &
	SlotProp<TextAreaSlot>;

export function TextArea(props: TextAreaProps) {
	const others = omit(
		props,
		"description",
		"size",
		"label",
		"variant",
		"errorMessage",
		"placeholder",
		"ref",
		"slotClasses",
		"classes",
		"options",
	);

	const inputProps = pickProps(others, ...INPUT_KEYS);
	const rootProps = omit(others, ...INPUT_KEYS);
	return (
		<P.Root
			size={props.size}
			variant={props.variant}
			inputId={props.options?.id}
			class={mergeClasses(props.slotClasses?.root, props.classes?.root)}
			{...rootProps}
		>
			<Show when={props.label} keyed={false}>
				{label => (
					<P.Label class={mergeClasses(props.slotClasses?.label, props.classes?.label)}>
						{label()}
					</P.Label>
				)}
			</Show>
			<P.Input
				{...inputProps}
				{...props.options}
				class={mergeClasses(props.slotClasses?.input, props.classes?.input)}
				placeholder={props.placeholder}
				ref={props.ref}
			/>
			<Show when={props.description} keyed={false}>
				{description => (
					<P.Description class={props.classes?.description}>
						{description()}
					</P.Description>
				)}
			</Show>

			<Show
				when={props.validationState === "invalid" && props.errorMessage}
				keyed={false}
			>
				{errorMessage => (
					<P.ErrorMessage
						class={mergeClasses(
							props.slotClasses?.errorLabel,
							props.classes?.errorMessage,
						)}
					>
						{errorMessage()}
					</P.ErrorMessage>
				)}
			</Show>
		</P.Root>
	);
}

export { TextAreaLabel } from "./TextAreaLabel";
