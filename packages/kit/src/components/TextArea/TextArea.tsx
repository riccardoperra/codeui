import { INPUT_KEYS, FieldInputProps, FieldClasses } from "../Field/inputProps";
import type {
	TextFieldRootOptions as KTextFieldRootOptions,
	TextFieldTextAreaProps as KTextFieldTextAreaProps,
} from "@kobalte/core/text-field";
import { JSX, Ref, Show, splitProps } from "solid-js";
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
	const [local, others] = splitProps(props, [
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
	]);

	const [inputProps, rootProps] = splitProps(others, INPUT_KEYS);
	return (
		<P.Root
			size={local.size}
			variant={local.variant}
			inputId={local.options?.id}
			class={mergeClasses(local.slotClasses?.root, local.classes?.root)}
			{...rootProps}
		>
			<Show when={local.label} keyed={false}>
				{label => (
					<P.Label class={mergeClasses(local.slotClasses?.label, local.classes?.label)}>
						{label()}
					</P.Label>
				)}
			</Show>
			<P.Input
				{...inputProps}
				{...local.options}
				class={mergeClasses(local.slotClasses?.input, local.classes?.input)}
				placeholder={local.placeholder}
				ref={local.ref}
			/>
			<Show when={local.description} keyed={false}>
				{description => (
					<P.Description class={local.classes?.description}>
						{description()}
					</P.Description>
				)}
			</Show>

			<Show
				when={props.validationState === "invalid" && local.errorMessage}
				keyed={false}
			>
				{errorMessage => (
					<P.ErrorMessage
						class={mergeClasses(
							local.slotClasses?.errorLabel,
							local.classes?.errorMessage,
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
