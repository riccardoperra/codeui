import { Select as KSelect } from "@kobalte/core";
import { Accessor, JSX, JSXElement, ParentProps, Show, splitProps } from "solid-js";
import { mergeClasses } from "../../utils/css";
import { BaseFieldProps, createBaseFieldProps } from "../Field/createBaseFieldProps";
import {
	createFieldErrorMessageProps,
	FieldWithErrorMessageSupport,
} from "../Field/FieldError/createFieldErrorMessageProps";
import { createFieldLabelProps } from "../Field/FieldLabel/createFieldLabelProps";
import { createFieldMessageProps } from "../Field/FieldMessage/createFieldMessageProps";
import * as styles from "./Select.css";

type SelectProps<T> = Omit<KSelect.SelectRootProps<T>, "multiple"> &
	BaseFieldProps & {
		"aria-label": string;
		placeholder?: string;

		description?: string;
		label?: JSX.Element;
	} & FieldWithErrorMessageSupport & {
		itemLabel?: (item: T) => JSXElement;
		valueComponent?: (state: Accessor<T>) => JSXElement;
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

function SelectIndicatorIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class={styles.itemIndicator}
		>
			<path
				fill-rule="evenodd"
				d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
				clip-rule="evenodd"
			/>
		</svg>
	);
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
			<KSelect.ItemIndicator>
				<SelectIndicatorIcon />
			</KSelect.ItemIndicator>
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
			multiple={false}
			{...(others as KSelect.SelectRootProps<T>)}
			class={styles.field}
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
				<KSelect.Value<T>>
					{state => {
						const value = state.selectedOption();
						if (!value) return null;
						return local.valueComponent
							? local.valueComponent(state.selectedOption)
							: (state.selectedOption() as string);
					}}
				</KSelect.Value>
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
