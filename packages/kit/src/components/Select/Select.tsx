import {
	Select as KSelect,
	SelectItemProps as KSelectItemProps,
	SelectRootProps as KSelectRootProps,
} from "@kobalte/core/select";
import { Accessor, For, JSX, JSXElement, ParentProps, Show, splitProps } from "solid-js";
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

type SelectSlot = "root" | "input" | "label" | "errorLabel" | "itemValue";

export const selectParts = {
	root: "select",
	label: "select-label",
	trigger: "select-trigger",
	value: "select-value",
	icon: "select-icon",
	description: "select-description",
	errorMessage: "select-error-message",
	content: "select-content",
	listbox: "select-listbox",
	item: "select-item",
	itemLabel: "select-item-label",
	itemIndicator: "select-item-indicator",
} as const;

export type SelectPart = keyof typeof selectParts;
export type SelectClasses = Partial<Record<SelectPart, string>>;

const partToSlot: Partial<Record<SelectPart, SelectSlot>> = {
	root: "root",
	trigger: "input",
	label: "label",
	errorMessage: "errorLabel",
	value: "itemValue",
};

function partClass(props: SelectClassesProps, part: SelectPart): string | undefined {
	const slot = partToSlot[part];
	return mergeClasses(slot && props.slotClasses?.[slot], props.classes?.[part]) || undefined;
}

type SelectClassesProps = {
	/** Classes for each part, keyed by part name. `content` targets the portaled list. */
	classes?: SelectClasses;
	/** @deprecated Use `classes`. `input` maps to `trigger`, `errorLabel` to `errorMessage` and `itemValue` to `value`. */
	slotClasses?: Partial<Record<SelectSlot, string>>;
};

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
	valueComponentMultiple?: (state: Accessor<Option[]>) => JSXElement;
} & SelectClassesProps;

export function SelectItem<T>(
	props: KSelectItemProps & {
		itemLabel?: (item: T) => JSXElement;
		classes?: Pick<SelectClasses, "item" | "itemLabel" | "itemIndicator">;
	},
) {
	return (
		<KSelect.Item
			data-cui={selectParts.item}
			class={mergeClasses(styles.item, props.classes?.item)}
			item={props.item}
		>
			<KSelect.ItemLabel data-cui={selectParts.itemLabel} class={props.classes?.itemLabel}>
				{props.itemLabel ? props.itemLabel(props.item.rawValue) : props.item.rawValue}
			</KSelect.ItemLabel>
			<KSelect.ItemIndicator data-cui={selectParts.itemIndicator} class={props.classes?.itemIndicator}>
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
			"classes",
			"slotClasses",
		],
		["options", "value"],
	);
	const baseFieldProps = createBaseFieldProps(props);

	const labelProps = createFieldLabelProps<"span">({
		get class() {
			return partClass(local, "label");
		},
	});

	const descriptionProps = createFieldMessageProps({
		get class() {
			return partClass(local, "description");
		},
	});
	const errorProps = createFieldErrorMessageProps(props);

	return (
		<KSelect
			{...(others as Record<string, unknown>)}
			options={internal.options}
			value={internal.value}
			data-cui={selectParts.root}
			class={mergeClasses(styles.field, partClass(local, "root"))}
			data-field-size={local.size}
			itemComponent={itemProps => (
				<SelectItem item={itemProps.item} itemLabel={local.itemLabel} classes={local.classes} />
			)}
		>
			<Show when={local.label} keyed={false}>
				<KSelect.Label data-cui={selectParts.label} {...labelProps}>
					{local.label}
				</KSelect.Label>
			</Show>
			<KSelect.Trigger
				data-cui={selectParts.trigger}
				aria-label={local["aria-label"]}
				class={mergeClasses(baseFieldProps.baseStyle(), styles.selectField, partClass(local, "trigger"))}
			>
				<KSelect.Value<Option> data-cui={selectParts.value} class={partClass(local, "value")}>
					{state => {

						return (
							<Show
								fallback={(() => {
									const value = state.selectedOption();
									if (!value) return null;
									return local.valueComponent
										? local.valueComponent(state.selectedOption)
										: (state.selectedOption() as string);
								})()}
								when={props.multiple}>
								<Show
									fallback={state.selectedOptions().join(", ")}
									when={props.valueComponentMultiple}>
									{callback => (
										<>
											{callback()(state.selectedOptions)}
										</>
									)}
								</Show>
							</Show>
						);
					}}
				</KSelect.Value>
				<KSelect.Icon data-cui={selectParts.icon} class={partClass(local, "icon")}>
					<SelectorIcon />
				</KSelect.Icon>
			</KSelect.Trigger>
			<Show when={local.description} keyed={false}>
				<KSelect.Description data-cui={selectParts.description} {...descriptionProps}>
					{local.description}
				</KSelect.Description>
			</Show>
			<Show when={local.errorMessage} keyed={false}>
				<KSelect.ErrorMessage
					data-cui={selectParts.errorMessage}
					{...errorProps}
					class={mergeClasses(errorProps.class, partClass(local, "errorMessage"))}
				>
					{local.errorMessage}
				</KSelect.ErrorMessage>
			</Show>
			<KSelect.Portal>
				<KSelect.Content
					data-cui={selectParts.content}
					class={mergeClasses(styles.content, partClass(local, "content"))}
				>
					<KSelect.Listbox data-cui={selectParts.listbox} class={partClass(local, "listbox")} />
				</KSelect.Content>
			</KSelect.Portal>
		</KSelect>
	);
}
