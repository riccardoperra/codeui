import { TextField as KTextField } from "@kobalte/core";
import { JSX, Ref, Show, splitProps } from "solid-js";
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
import { SlotProp } from "../../utils/component";

// TODO: add to base field slot that respect the BaseFieldProps signature?
type TextFieldSlot = "root" | "input" | "label" | "errorLabel";

export type TextFieldProps = KTextField.TextFieldRootOptions &
	BaseFieldProps &
	FieldWithErrorMessageSupport & {
		description?: string;
		label?: JSX.Element;
		placeholder?: string;
		ref?: Ref<HTMLInputElement>;
	} & SlotProp<TextFieldSlot>;

export function TextField(props: TextFieldProps) {
	const [local, others] = splitProps(props, [
		"description",
		"size",
		"label",
		"theme",
		"errorMessage",
		"placeholder",
		"ref",
		"slotClasses",
	]);

	const baseFieldProps = createBaseFieldProps(props);
	const errorMessageProps = createFieldErrorMessageProps(props);

	const inputClasses = () =>
		mergeClasses(baseFieldProps.baseStyle(), styles.textField, local.slotClasses?.input);

	return (
		<KTextField.Root
			data-cui={"text-field"}
			data-field-size={local.size}
			class={mergeClasses(baseFieldContainer, local?.slotClasses?.root)}
			{...others}
		>
			<Show when={local.label} keyed={false}>
				<TextFieldLabel class={local.slotClasses?.label}>{local.label}</TextFieldLabel>
			</Show>
			<KTextField.Input
				class={inputClasses()}
				placeholder={local.placeholder}
				ref={local.ref}
			/>
			<Show when={local.description} keyed={false}>
				<TextFieldMessage>{local.description}</TextFieldMessage>
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

export { TextFieldLabel } from "./TextFieldLabel";
