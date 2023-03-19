import { Select as KSelect } from "@kobalte/core";
import { JSX, JSXElement, ParentProps, Show, splitProps } from "solid-js";
import { GetKobalteParams } from "../../utils/types";
import * as styles from "./Select.css";
import { createFieldLabelProps } from "../Field/FieldLabel/createFieldLabelProps";
import { createFieldMessageProps } from "../Field/FieldMessage/createFieldMessageProps";
import {
	createFieldErrorMessageProps,
	FieldWithErrorMessageSupport,
} from "../Field/FieldError/createFieldErrorMessageProps";
import { BaseFieldProps, createBaseFieldProps } from "../Field/createBaseFieldProps";
import { mergeClasses } from "../../utils/css";

type SelectProps<T> = KSelect.SelectRootProps<T> &
	BaseFieldProps & {
		"aria-label": string;
		placeholder?: string;

		description?: string;
		label?: JSX.Element;
	} & FieldWithErrorMessageSupport;

function SelectorIcon(props: JSX.IntrinsicElements["svg"]): JSX.Element {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			width={"1.1em"}
			height={"1.1em"}
			{...props}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8 9l4-4 4 4m0 6l-4 4-4-4"
			/>
		</svg>
	);
}

function SelectContent(props: KSelect.SelectContentProps) {
	return <KSelect.Content class={styles.content} {...props} />;
}

export function SelectItem(props: KSelect.SelectItemProps) {
	return (
		<KSelect.Item class={styles.item} {...props}>
			<KSelect.ItemLabel>{props.item.rawValue}</KSelect.ItemLabel>
			<KSelect.ItemIndicator />
		</KSelect.Item>
	);
}

export function Select<T>(props: ParentProps<SelectProps<T>>) {
	const [local, others] = splitProps(props, [
		"aria-label",
		"children",
		"size",
		"theme",
		"errorMessage",
		"description",
		"label",
	]);
	const baseFieldProps = createBaseFieldProps(props);
	const labelProps = createFieldLabelProps({});
	const descriptionProps = createFieldMessageProps({});
	const errorProps = createFieldErrorMessageProps(props);

	return (
		<KSelect.Root
			{...props}
			renderValue={selectedOption => selectedOption() as JSXElement}
			renderItem={item => <SelectItem item={item()} />}
		>
			<div class={styles.field}>
				<Show when={local.label} keyed={false}>
					<KSelect.Label {...labelProps}>{local.label}</KSelect.Label>
				</Show>
				<KSelect.Trigger
					aria-label={local["aria-label"]}
					class={mergeClasses(baseFieldProps.baseStyle(), styles.selectField)}
				>
					<KSelect.Value />
					<KSelect.Icon>
						<SelectorIcon />
					</KSelect.Icon>
				</KSelect.Trigger>
				<Show when={local.description} keyed={false}>
					<KSelect.Description {...descriptionProps}>
						{local.description}
					</KSelect.Description>
				</Show>
				<Show when={local.errorMessage} keyed={false}>
					<KSelect.ErrorMessage {...errorProps}>
						{local.errorMessage}
					</KSelect.ErrorMessage>
				</Show>
			</div>
			<KSelect.Portal>
				<SelectContent>
					<KSelect.Listbox />
				</SelectContent>
			</KSelect.Portal>
		</KSelect.Root>
	);
}
