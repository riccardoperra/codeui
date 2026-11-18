import "@codeui/styles/theme.css";
import "@codeui/styles/checkbox.css";
import { Checkbox as KCheckbox, CheckboxRootOptions } from "@kobalte/core/checkbox";
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

export type CheckBoxProps = CheckboxRootOptions &
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

	return (
		<KCheckbox
			data-cui={"checkbox"}
			data-field-size={local.size}
			data-field-theme={local.theme ?? "inline"}
			class={mergeClasses(styles.container, local?.slotClasses?.root)}
			{...others}
		>
			<KCheckbox.Input class={inputClasses()} ref={local.ref} />
			<KCheckbox.Control
				data-size={local.size ?? "md"}
				data-theme={local.theme ?? "inline"}
				class={mergeClasses(styles.control(), local.slotClasses?.control)}
			>
				<KCheckbox.Indicator forceMount={true} class={styles.indicator}>
					<CheckIcon class={styles.icon} />
				</KCheckbox.Indicator>
			</KCheckbox.Control>

			<div class={styles.content}>
				<Show when={local.label} keyed={false}>
					{label => <KCheckbox.Label class={labelClasses()}>{label()}</KCheckbox.Label>}
				</Show>

				<Show when={local.description} keyed={false}>
					{description => (
						<KCheckbox.Description {...fieldLabelProps}>
							{description()}
						</KCheckbox.Description>
					)}
				</Show>

				<Show
					when={props.validationState === "invalid" && local.errorMessage}
					keyed={false}
				>
					{errorMessage => (
						<KCheckbox.ErrorMessage
							class={mergeClasses(errorMessageProps.class, local.slotClasses?.errorLabel)}
						>
							{errorMessage()}
						</KCheckbox.ErrorMessage>
					)}
				</Show>
			</div>
		</KCheckbox>
	);
}
