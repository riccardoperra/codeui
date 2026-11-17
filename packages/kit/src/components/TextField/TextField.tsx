import { createUniqueId } from "solid-js";
import { INPUT_KEYS, FieldInputProps, FieldClasses } from "../Field/inputProps";
import {
	TextField as KTextField,
	TextFieldRootOptions as KTextFieldRootOptions,
} from "@kobalte/core/text-field";
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

export type TextFieldProps = KTextFieldRootOptions &
	BaseFieldProps &
	FieldWithErrorMessageSupport & {
		description?: JSX.Element;
		classes?: FieldClasses;
		/** @deprecated Use classes. This alias remains until 1.0. */
		slotClasses?: SlotProp<TextFieldSlot>["slotClasses"];
		label?: JSX.Element;
		placeholder?: string;
		ref?: Ref<HTMLInputElement>;
	} & FieldInputProps &
	SlotProp<TextFieldSlot>;

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
		"classes",
	]);

	const [inputProps, rootProps] = splitProps(others, INPUT_KEYS);
	const generatedId = createUniqueId();
	const inputId = () => `${rootProps.id ?? generatedId}-input`;

	const baseFieldProps = createBaseFieldProps(props);
	const errorMessageProps = createFieldErrorMessageProps(props);

	const inputClasses = () =>
		mergeClasses(
			baseFieldProps.baseStyle(),
			styles.textField,
			local.slotClasses?.input,
			local.classes?.input,
		);

	return (
		<KTextField
			data-cui={"text-field"}
			data-field-size={local.size}
			class={mergeClasses(
				baseFieldContainer,
				local?.slotClasses?.root,
				local.classes?.root,
			)}
			{...rootProps}
		>
			<Show when={local.label} keyed={false}>
				{label => (
					<TextFieldLabel
						for={inputId()}
						data-cui="text-field-label"
						class={mergeClasses(local.slotClasses?.label, local.classes?.label)}
					>
						{label()}
					</TextFieldLabel>
				)}
			</Show>
			<KTextField.Input
				{...inputProps}
				id={inputId()}
				data-cui="text-field-input"
				class={inputClasses()}
				placeholder={local.placeholder}
				ref={local.ref}
			/>
			<Show when={local.description} keyed={false}>
				{description => (
					<TextFieldMessage
						data-cui="text-field-description"
						class={local.classes?.description}
					>
						{description()}
					</TextFieldMessage>
				)}
			</Show>

			<Show
				when={props.validationState === "invalid" && local.errorMessage}
				keyed={false}
			>
				{errorMessage => (
					<KTextField.ErrorMessage
						data-cui="text-field-error-message"
						class={mergeClasses(
							errorMessageProps.class,
							local.slotClasses?.errorLabel,
							local.classes?.errorMessage,
						)}
					>
						{errorMessage()}
					</KTextField.ErrorMessage>
				)}
			</Show>
		</KTextField>
	);
}

export { TextFieldLabel } from "./TextFieldLabel";
