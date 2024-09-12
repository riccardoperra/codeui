import {
	Select as KSelect,
	SelectContentProps as KSelectContentProps,
	SelectItemProps as KSelectItemProps,
	SelectRootProps as KSelectRootProps,
} from "@kobalte/core/select";
import { Accessor, JSX, JSXElement, ParentProps, Show, splitProps } from "solid-js";
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
import * as styles from "./Select.css";

export type SelectProps<Option, OptGroup = never> = KSelectRootProps<
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

function SelectContent(props: ParentProps<KSelectContentProps>) {
	return <KSelect.Content class={styles.content} {...props} />;
}

export function SelectItem<T>(
	props: KSelectItemProps & {
		itemLabel?: (item: T) => JSXElement;
	},
) {
	return (
		<KSelect.Item class={styles.item} item={props.item}>
			<KSelect.ItemLabel>
				{props.itemLabel ? props.itemLabel(props.item.rawValue) : props.item.rawValue}
			</KSelect.ItemLabel>
			<KSelect.ItemIndicator>
				<CheckIcon class={styles.itemIndicator} />
			</KSelect.ItemIndicator>
		</KSelect.Item>
	);
}

export function Select<Option, OptGroup = never>(props: ParentProps<SelectProps<Option, OptGroup>>) {
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
	const labelProps = createFieldLabelProps<"span">({});
	const descriptionProps = createFieldMessageProps({});
	const errorProps = createFieldErrorMessageProps(props);

	return (
		<KSelect
			{...(others as Record<string, unknown>)}
			options={internal.options}
			value={internal.value}
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
				<KSelect.Value<Option>>
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
		</KSelect>
	);
}
