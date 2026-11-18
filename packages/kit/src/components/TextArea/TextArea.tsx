import "@codeui/styles/theme.css";
import "@codeui/styles/text-area.css";
import { createUniqueId } from "solid-js";
import { INPUT_KEYS, FieldInputProps, FieldClasses } from "../Field/inputProps";
import {
	TextField as KTextField,
	TextFieldRootOptions as KTextFieldRootOptions,
	TextFieldTextAreaProps as KTextFieldTextAreaProps,
} from "@kobalte/core/text-field";
import { JSX, Ref, Show, splitProps } from "solid-js";
import * as styles from "./TextArea.css";
import { baseFieldContainer } from "./TextArea.css";
import { mergeClasses } from "../../utils/css";
import { TextAreaLabel } from "./TextAreaLabel";
import { TextAreaMessage } from "./TextAreaMessage";
import {
	createFieldErrorMessageProps,
	FieldWithErrorMessageSupport,
} from "../Field/FieldError/createFieldErrorMessageProps";
import type { BaseFieldProps } from "../Field/createBaseFieldProps";
import { baseFieldVariants } from "../Field/Field.css";
import { SlotProp } from "../../utils/component";

// TODO: add to base field slot that respect the BaseFieldProps signature?
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
		"theme",
		"errorMessage",
		"placeholder",
		"ref",
		"slotClasses",
		"classes",
		"options",
	]);

	const [inputProps, rootProps] = splitProps(others, INPUT_KEYS);
	const generatedId = createUniqueId();
	const inputId = () => local.options?.id ?? `${rootProps.id ?? generatedId}-input`;

	const errorMessageProps = createFieldErrorMessageProps(props);

	const inputClasses = () =>
		mergeClasses(
			baseFieldVariants(),
			styles.textArea,
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
					<TextAreaLabel
						for={inputId()}
						data-cui="text-field-label"
						class={mergeClasses(local.slotClasses?.label, local.classes?.label)}
					>
						{label()}
					</TextAreaLabel>
				)}
			</Show>
			<KTextField.TextArea
				{...inputProps}
				id={inputId()}
				data-cui="text-field-input"
				data-size={local.size ?? "md"}
				data-theme={local.theme ?? "filled"}
				{...local.options}
				class={inputClasses()}
				placeholder={local.placeholder}
				ref={local.ref}
			/>
			<Show when={local.description} keyed={false}>
				{description => (
					<TextAreaMessage
						data-cui="text-field-description"
						class={local.classes?.description}
					>
						{description()}
					</TextAreaMessage>
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

export { TextAreaLabel } from "./TextAreaLabel";
