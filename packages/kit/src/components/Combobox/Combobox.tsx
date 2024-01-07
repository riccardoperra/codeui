import { Combobox as KCombobox } from "@kobalte/core";
import { Accessor, JSX, JSXElement, Show, createSignal, splitProps } from "solid-js";
import { CheckIcon } from "../../icons/CheckIcon";
import { SelectorIcon } from "../../icons/SelectorIcon";
import { mergeClasses } from "../../utils/css";
import { BaseFieldProps, createBaseFieldProps } from "../Field/createBaseFieldProps";
import {
	createFieldErrorMessageProps,
	FieldWithErrorMessageSupport,
} from "../Field/FieldError/createFieldErrorMessageProps";
import { createFieldLabelProps } from "../Field/FieldLabel/createFieldLabelProps";
import { createFieldMessageProps } from "../Field/FieldMessage/createFieldMessageProps";
import * as styles from "./Combobox.css";
import { highlight } from "../../utils/highlight/highlight";

void highlight;

export type ComboboxProps<Option, OptGroup = never> = KCombobox.ComboboxRootProps<
	Option,
	OptGroup
> &
	BaseFieldProps & {
		"aria-label": string;
		placeholder?: string;
		description?: string;
		label?: JSX.Element;
	} & FieldWithErrorMessageSupport & {
		itemLabel?: (item: Option) => JSXElement;
		valueComponent?: (state: Accessor<Option>) => JSXElement;
	};

function ComboboxContent(props: KCombobox.ComboboxContentProps) {
	return <KCombobox.Content class={styles.content} {...props} />;
}

export function ComboboxItem<T>(
	props: KCombobox.ComboboxItemProps & {
		itemLabel?: (item: T) => JSXElement;
		textValue?: string;
	},
) {
	return (
		<KCombobox.Item data-cui="combobox-item" class={styles.item} item={props.item}>
			<KCombobox.ItemLabel ref={ref => highlight(ref, () => props.textValue ?? "")}>
				{props.itemLabel ? props.itemLabel(props.item.rawValue) : props.item.rawValue}
			</KCombobox.ItemLabel>
			<KCombobox.ItemIndicator>
				<CheckIcon class={styles.itemIndicator} />
			</KCombobox.ItemIndicator>
		</KCombobox.Item>
	);
}

export function Combobox<Option, OptGroup = never>(
	props: ComboboxProps<Option, OptGroup>,
) {
	const [local, internal, others] = splitProps(
		props,
		[
			"aria-label",
			"children",
			"size",
			"theme",
			"errorMessage",
			"description",
			"label",
			"itemLabel",
			"valueComponent",
		],
		["options", "value"],
	);
	const baseFieldProps = createBaseFieldProps(props);
	const labelProps = createFieldLabelProps<"label">({});
	const descriptionProps = createFieldMessageProps({});
	const errorProps = createFieldErrorMessageProps(props);

	const [textValue, setTextValue] = createSignal("");

	return (
		<KCombobox.Root
			data-cui="combobox"
			{...(others as Record<string, unknown>)}
			options={internal.options}
			value={internal.value}
			class={styles.field}
			itemComponent={itemProps => (
				<ComboboxItem
					item={itemProps.item}
					textValue={textValue()}
					itemLabel={local.itemLabel}
				/>
			)}
		>
			<Show when={local.label} keyed={false}>
				<KCombobox.Label {...labelProps}>{local.label}</KCombobox.Label>
			</Show>

			<KCombobox.Control
				data-cui="combobox-control"
				class={mergeClasses(baseFieldProps.baseStyle(), styles.comboboxField)}
				aria-label={local["aria-label"]}
			>
				<KCombobox.Input
					onInput={el => setTextValue(el.currentTarget.value)}
					class={styles.comboboxInput}
				/>
				<KCombobox.Trigger>
					<KCombobox.Icon>
						<SelectorIcon />
					</KCombobox.Icon>
				</KCombobox.Trigger>
			</KCombobox.Control>

			<Show when={local.description} keyed={false}>
				<KCombobox.Description {...descriptionProps}>
					{local.description}
				</KCombobox.Description>
			</Show>
			<Show when={local.errorMessage} keyed={false}>
				<KCombobox.ErrorMessage {...errorProps}>
					{local.errorMessage}
				</KCombobox.ErrorMessage>
			</Show>
			<KCombobox.Portal>
				<ComboboxContent>
					<KCombobox.Listbox />
				</ComboboxContent>
			</KCombobox.Portal>
		</KCombobox.Root>
	);
}
