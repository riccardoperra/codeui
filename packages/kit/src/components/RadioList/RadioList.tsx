import { RadioGroup } from "@kobalte/core";
import { BaseFieldProps, createBaseFieldProps } from "../Field/createBaseFieldProps";
import {
	createFieldErrorMessageProps,
	FieldWithErrorMessageSupport,
} from "../Field/FieldError/createFieldErrorMessageProps";
import { For, JSXElement, Show, splitProps } from "solid-js";
import { createFieldLabelProps } from "../Field/FieldLabel/createFieldLabelProps";
import { mergeClasses } from "../../utils/css";
import { baseFieldContainer } from "../TextField/TextField.css";
import { createFieldMessageProps } from "../Field/FieldMessage/createFieldMessageProps";
import * as styles from "./Radio.css";

type RadioListProps = RadioGroup.RadioGroupRootProps &
	BaseFieldProps &
	FieldWithErrorMessageSupport & { label?: JSXElement; description?: string };

function RadioGroupLabel(props: RadioGroup.RadioGroupLabelProps) {
	const fieldLabelProps = createFieldLabelProps(props);

	return <RadioGroup.Label {...fieldLabelProps} />;
}

function RadioGroupDescription(props: RadioGroup.RadioGroupDescriptionProps) {
	const fieldLabelProps = createFieldMessageProps(props);

	return <RadioGroup.Description {...fieldLabelProps} />;
}

interface RadioGroupItemProps extends RadioGroup.RadioGroupItemProps {
	label: string;
}

export function RadioGroupItem(props: RadioGroupItemProps) {
	return (
		<RadioGroup.Item value={props.value} class={styles.radioItem}>
			<RadioGroup.ItemInput />
			<RadioGroup.ItemControl class={styles.radio}>
				<RadioGroup.ItemIndicator class={styles.indicator} />
			</RadioGroup.ItemControl>
			<Show when={props.label}>
				<RadioGroup.ItemLabel aria-label={props.label}>
					{props.label}
				</RadioGroup.ItemLabel>
			</Show>
		</RadioGroup.Item>
	);
}

export function RadioList(props: RadioListProps) {
	const [local, others] = splitProps(props, [
		"description",
		"size",
		"label",
		"theme",
		"errorMessage",
		"ref",
	]);

	const errorMessageProps = createFieldErrorMessageProps(props);

	const baseFieldProps = createBaseFieldProps(props);

	return (
		<RadioGroup.Root
			data-cui={"radio-group-field"}
			data-field-size={local.size}
			{...others}
			class={mergeClasses(baseFieldContainer)}
		>
			<Show when={local.label} keyed={false}>
				<RadioGroupLabel>Favorite fruit</RadioGroupLabel>
			</Show>
			<div
				class={styles.radioList({
					size: local.size ?? "lg",
					orientation: props.orientation,
				})}
			>
				{props.children}
			</div>
			<Show when={local.description} keyed={false}>
				<RadioGroupDescription>{local.description}</RadioGroupDescription>
			</Show>

			<Show when={errorMessageProps.errorMessage} keyed={false}>
				<RadioGroup.ErrorMessage class={errorMessageProps.class}>
					{local.errorMessage}
				</RadioGroup.ErrorMessage>
			</Show>
		</RadioGroup.Root>
	);
}
