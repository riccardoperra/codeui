import {
	RadioGroup,
	RadioGroupDescriptionProps as KRadioGroupDescriptionProps,
	RadioGroupItemProps as KRadioGroupItemProps,
	RadioGroupLabelProps as KRadioGroupLabelProps,
	RadioGroupRootProps as KRadioGroupRootProps,
} from "@kobalte/core/radio-group";
import { BaseFieldProps } from "../Field/createBaseFieldProps";
import {
	createFieldErrorMessageProps,
	FieldWithErrorMessageSupport,
} from "../Field/FieldError/createFieldErrorMessageProps";
import { JSXElement, Show, splitProps, ValidComponent } from "solid-js";
import { createFieldLabelProps } from "../Field/FieldLabel/createFieldLabelProps";
import { mergeClasses } from "../../utils/css";
import { baseFieldContainer } from "../TextField/TextField.css";
import { createFieldMessageProps } from "../Field/FieldMessage/createFieldMessageProps";
import * as styles from "./Radio.css";
import { PolymorphicProps } from "@kobalte/core/polymorphic";


export type RadioListProps<T extends ValidComponent = "div"> = KRadioGroupRootProps<T> &
	BaseFieldProps &
	FieldWithErrorMessageSupport & { label?: JSXElement; description?: string };

function RadioGroupLabel(props: KRadioGroupLabelProps) {
	const fieldLabelProps = createFieldLabelProps<"span">(props);

	return <RadioGroup.Label {...fieldLabelProps} />;
}

function RadioGroupDescription(props: KRadioGroupDescriptionProps) {
	const fieldLabelProps = createFieldMessageProps(props);

	return <RadioGroup.Description {...fieldLabelProps} />;
}

interface RadioGroupItemProps extends KRadioGroupItemProps {
	label: string;
}

export function RadioListItem(props: RadioGroupItemProps) {
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

export function RadioList<T extends ValidComponent = "div">(props: PolymorphicProps<T, RadioListProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"button", RadioListProps>, [
		"description",
		"size",
		"label",
		"theme",
		"errorMessage",
		"ref",
	]);

	const size = () => local.size ?? "md";

	const errorMessageProps = createFieldErrorMessageProps(props);

	return (
		<RadioGroup
			data-cui={"radio-group-field"}
			data-field-size={size()}
			{...others}
			class={mergeClasses(baseFieldContainer)}
		>
			<Show when={local.label} keyed={false}>
				<RadioGroupLabel>{local.label}</RadioGroupLabel>
			</Show>
			<div
				class={styles.radioList({
					size: size(),
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
		</RadioGroup>
	);
}
