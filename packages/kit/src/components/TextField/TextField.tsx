import { TextField as KTextField } from "@kobalte/core";
import { JSX, Show, splitProps } from "solid-js";
import * as styles from "./TextField.css";
import { baseFieldContainer } from "./TextField.css";
import { mergeClasses } from "../../utils/css";
import { TextFieldLabel } from "./TextFieldLabel";

export type TextFieldProps = KTextField.TextFieldRootOptions &
	styles.TextFieldVariants & {
		description?: string;
		label?: JSX.Element;
		errorMessage?: JSX.Element;
		placeholder?: string;
	};

export function TextField(props: TextFieldProps) {
	const [local, others] = splitProps(props, [
		"description",
		"size",
		"label",
		"theme",
		"errorMessage",
		"placeholder",
	]);
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
			<KTextField.Input
				class={styles.textField({
					size: local.size,
					theme: local.theme,
				})}
				placeholder={local.placeholder}
			/>
			<Show when={local.description} keyed={false}>
				<KTextField.Description class={styles.description}>
					{local.description}
				</KTextField.Description>
			</Show>
			<Show when={local.errorMessage} keyed={false}>
				<KTextField.ErrorMessage class={styles.errorMessage}>
					{local.errorMessage}
				</KTextField.ErrorMessage>
			</Show>
		</KTextField.Root>
	);
}

export { TextFieldLabel } from "./TextFieldLabel";
