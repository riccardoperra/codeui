import { Checkbox as KCheckbox } from "@kobalte/core";
import { JSX, Ref, Show, splitProps } from "solid-js";
import * as styles from "./CheckBox.css";
import { BaseFieldProps } from "../Field/createBaseFieldProps";
import {
	createFieldErrorMessageProps,
	FieldWithErrorMessageSupport,
} from "../Field/FieldError/createFieldErrorMessageProps";
import { SlotProp } from "../../utils/component";
import { mergeClasses } from "../../utils/css";
import { CheckIcon } from "../../icons/CheckIcon";
import { createFieldMessageProps } from "../Field/FieldMessage/createFieldMessageProps";

type CheckBoxSlot = "root" | "input" | "label" | "errorLabel" | "control";

export type CheckBoxProps = KCheckbox.CheckboxRootOptions &
	BaseFieldProps &
	FieldWithErrorMessageSupport &
	SlotProp<CheckBoxSlot> & {
		description?: string;
		label?: JSX.Element;
		ref?: Ref<HTMLInputElement>;
	};

export function Checkbox(props: CheckBoxProps) {
	const [local, others] = splitProps(props, [
		"description",
		"size",
		"label",
		"theme",
		"errorMessage",
		"ref",
		"slotClasses",
	]);

	const errorMessageProps = createFieldErrorMessageProps(props);
	const fieldLabelProps = createFieldMessageProps({});

	const inputClasses = () => mergeClasses(styles.input, local.slotClasses?.input);

	const labelClasses = () => mergeClasses(styles.label, local.slotClasses?.label);

	const controlClasses = () =>
		mergeClasses(
			styles.control({
				size: local.size,
			}),
			local.slotClasses?.control,
		);

	return (
		<KCheckbox.Root
			data-cui={"checkbox"}
			data-field-size={local.size}
			class={mergeClasses(styles.container, local?.slotClasses?.root)}
			{...others}
		>
			<KCheckbox.Input class={inputClasses()} ref={local.ref} />
			<KCheckbox.Control class={controlClasses()}>
				<KCheckbox.Indicator forceMount={true} class={styles.indicator}>
					<CheckIcon class={styles.icon} />
				</KCheckbox.Indicator>
			</KCheckbox.Control>

			<div class={styles.content}>
				<Show when={local.label} keyed={false}>
					<KCheckbox.Label class={labelClasses()}>{local.label}</KCheckbox.Label>
				</Show>

				<Show when={local.description} keyed={false}>
					<KCheckbox.Description {...fieldLabelProps}>
						{local.description}
					</KCheckbox.Description>
				</Show>

				<Show when={errorMessageProps.errorMessage} keyed={false}>
					<KCheckbox.ErrorMessage
						class={mergeClasses(errorMessageProps.class, local.slotClasses?.errorLabel)}
					>
						{local.errorMessage}
					</KCheckbox.ErrorMessage>
				</Show>
			</div>
		</KCheckbox.Root>
	);
}
