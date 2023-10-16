import { TextField as KTextField } from "@kobalte/core";
import { JSX, Ref, Show, splitProps } from "solid-js";
import * as styles from "./TextArea.css";
import { baseFieldContainer, textArea } from "./TextArea.css";
import { mergeClasses } from "../../utils/css";
import { TextAreaLabel } from "./TextAreaLabel";
import { TextAreaMessage } from "./TextAreaMessage";
import {
	createFieldErrorMessageProps,
	FieldWithErrorMessageSupport,
} from "../Field/FieldError/createFieldErrorMessageProps";
import { BaseFieldProps, createBaseFieldProps } from "../Field/createBaseFieldProps";
import { SlotProp } from "../../utils/component";

// TODO: add to base field slot that respect the BaseFieldProps signature?
type TextAreaSlot = "root" | "input" | "label" | "errorLabel";

export type TextAreaProps = KTextField.TextFieldRootOptions &
	BaseFieldProps &
	FieldWithErrorMessageSupport & {
		description?: string;
		label?: JSX.Element;
		placeholder?: string;
		ref?: Ref<HTMLTextAreaElement>;
		options?: KTextField.TextFieldTextAreaProps;
	} & SlotProp<TextAreaSlot>;

export function TextArea(props: TextAreaProps) {
	const [local, others] = splitProps(props, [
		"description",
		"size",
		"label",
		"theme",
		"errorMessage",
		"placeholder",
		"ref",
		"slotClasses",
		"options",
	]);

	const baseFieldProps = createBaseFieldProps(props);
	const errorMessageProps = createFieldErrorMessageProps(props);

	const inputClasses = () =>
		mergeClasses(baseFieldProps.baseStyle(), styles.textArea, local.slotClasses?.input);

	return (
		<KTextField.Root
			data-cui={"text-field"}
			data-field-size={local.size}
			class={mergeClasses(baseFieldContainer, local?.slotClasses?.root)}
			{...others}
		>
			<Show when={local.label} keyed={false}>
				<TextAreaLabel class={local.slotClasses?.label}>{local.label}</TextAreaLabel>
			</Show>
			<KTextField.TextArea
				{...local.options}
				class={inputClasses()}
				placeholder={local.placeholder}
				ref={local.ref}
			/>
			<Show when={local.description} keyed={false}>
				<TextAreaMessage>{local.description}</TextAreaMessage>
			</Show>

			<Show when={errorMessageProps.errorMessage} keyed={false}>
				<KTextField.ErrorMessage
					class={mergeClasses(errorMessageProps.class, local.slotClasses?.errorLabel)}
				>
					{local.errorMessage}
				</KTextField.ErrorMessage>
			</Show>
		</KTextField.Root>
	);
}

export { TextAreaLabel } from "./TextAreaLabel";
