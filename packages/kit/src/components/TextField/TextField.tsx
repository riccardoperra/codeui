import { TextField as KTextField } from "@kobalte/core";
import { JSX, Show, splitProps } from "solid-js";
import * as styles from "./TextField.css";
import { baseFieldContainer } from "./TextField.css";
import { mergeClasses } from "../../utils/css";
import { TextFieldLabel } from "./TextFieldLabel";
import { TextFieldMessage } from "./TextFieldMessage";
import {
	createFieldErrorMessageProps,
	FieldWithErrorMessageSupport,
} from "../Field/FieldError/createFieldErrorMessageProps";
import { BaseFieldProps, createBaseFieldProps } from "../Field/createBaseFieldProps";

export type TextFieldProps = KTextField.TextFieldRootOptions &
	BaseFieldProps & {
		description?: string;
		label?: JSX.Element;
		placeholder?: string;
	} & FieldWithErrorMessageSupport;

export function TextField(props: TextFieldProps) {
	const [local, others] = splitProps(props, [
		"description",
		"size",
		"label",
		"theme",
		"errorMessage",
		"placeholder",
	]);

	const baseFieldProps = createBaseFieldProps(props);
	const errorMessageProps = createFieldErrorMessageProps(props);

	const inputClasses = () => mergeClasses(baseFieldProps.baseStyle(), styles.textField);

	return (
		<KTextField.Root
			data-cui={"text-field"}
			data-field-size={local.size}
			{...others}
			class={mergeClasses(baseFieldContainer)}
		>
			<Show when={local.label} keyed={false}>
				<TextFieldLabel>{local.label}</TextFieldLabel>
			</Show>
			<KTextField.Input class={inputClasses()} placeholder={local.placeholder} />
			<Show when={local.description} keyed={false}>
				<TextFieldMessage>{local.description}</TextFieldMessage>
			</Show>

			<Show when={errorMessageProps.errorMessage} keyed={false}>
				<KTextField.ErrorMessage class={errorMessageProps.class}>
					{local.errorMessage}
				</KTextField.ErrorMessage>
			</Show>
		</KTextField.Root>
	);
}

export { TextFieldLabel } from "./TextFieldLabel";
