import { Select as KSelect } from "@kobalte/core";
import { JSX, JSXElement, ParentProps, Show, splitProps } from "solid-js";
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
	} & FieldWithErrorMessageSupport & {
		itemLabel?: (item: T) => JSXElement;
	};

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

export function SelectItem<T>(
	props: KSelect.SelectItemProps & {
		itemLabel?: (item: T) => JSXElement;
	},
) {
	return (
		<KSelect.Item class={styles.item} item={props.item}>
			<KSelect.ItemLabel>
				{props.itemLabel ? props.itemLabel(props.item.rawValue) : props.item.rawValue}
			</KSelect.ItemLabel>
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
		"itemLabel",
		"valueComponent",
	]);
	const baseFieldProps = createBaseFieldProps(props);
	const labelProps = createFieldLabelProps({});
	const descriptionProps = createFieldMessageProps({});
	const errorProps = createFieldErrorMessageProps(props);

	return (
		<KSelect.Root
			{...props}
			class={styles.field}
			valueComponent={props => {
				return local.valueComponent
					? local.valueComponent(props)
					: (props.item.rawValue as string);
			}}
			itemComponent={itemProps => (
				<SelectItem item={itemProps.item} itemLabel={local.itemLabel} />
			)}
		>
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
				<KSelect.ErrorMessage {...errorProps}>{local.errorMessage}</KSelect.ErrorMessage>
			</Show>
			<KSelect.Portal>
				<SelectContent>
					<KSelect.Listbox />
				</SelectContent>
			</KSelect.Portal>
		</KSelect.Root>
	);
}
