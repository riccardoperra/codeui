import { Combobox as KCombobox, createControllableBooleanSignal } from "@kobalte/core";
import { Accessor, JSX, JSXElement, Show, createSignal, splitProps } from "solid-js";
import { CheckIcon } from "../../icons/CheckIcon";
import { SelectorIcon } from "../../icons/SelectorIcon";
import { mergeClasses } from "../../utils/css";
import { highlight } from "../../utils/highlight/highlight";
import {
	FieldWithErrorMessageSupport,
	createFieldErrorMessageProps,
} from "../Field/FieldError/createFieldErrorMessageProps";
import { createFieldLabelProps } from "../Field/FieldLabel/createFieldLabelProps";
import { createFieldMessageProps } from "../Field/FieldMessage/createFieldMessageProps";
import { BaseFieldProps, createBaseFieldProps } from "../Field/createBaseFieldProps";
import * as styles from "./Combobox.css";

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
	const [local, others] = splitProps(props, [
		"aria-label",
		"size",
		"theme",
		"errorMessage",
		"description",
		"label",
		"itemLabel",
		"value",
		"onChange",
		"open",
		"onOpenChange",
		"onInputChange",
	]);
	const baseFieldProps = createBaseFieldProps(props);
	const labelProps = createFieldLabelProps<"label">({});
	const descriptionProps = createFieldMessageProps({});
	const errorProps = createFieldErrorMessageProps(props);

	const [open, setOpen] = createControllableBooleanSignal({
		value: () => local.open,
		defaultValue: () => local.open,
		onChange(value) {
			local.onOpenChange?.(value);
		},
	});

	const [textValue, setTextValue] = createSignal("");
	let control!: HTMLInputElement;

	const onInputFocus = (event: FocusEvent) => {
		if (isChangingValue) {
			setOpen(false);
		} else {
			setOpen(true);
		}
	};

	let controlWorkaround!: HTMLInputElement;

	type TriggerMode = KCombobox.ComboboxRootOptions<any, any>["triggerMode"];

	const handleOpenChange = (open: boolean, mode: TriggerMode) => {
		setOpen(open);
		if (!open && mode === "focus") {
			// If open is false and mode is focus, then portal will be closed. Currently
			// there is a behavior where input is automatically focused triggering the modal opening.
			// As a workaround, i'm focusing another input in order to don't retrigger the portal content opening.
			setTimeout(() => {
				controlWorkaround.focus();
				setOpen(false);
			});
		}
	};

	const handleOnChange = (value: Option & Option[]) => {
		local.onChange?.(value as Option & Option[]);
		// On handle change we set `isChangingValue` to true in order to force close the modal.
		// Read `onInputFocus`;
		isChangingValue = true;
		setTimeout(() => (isChangingValue = false), 0);
	};

	let isChangingValue = false;

	return (
		<KCombobox.Root
			data-cui="combobox"
			class={styles.field}
			itemComponent={itemProps => (
				<ComboboxItem
					item={itemProps.item}
					itemLabel={local.itemLabel}
					textValue={textValue()}
				/>
			)}
			open={open()}
			onInputChange={text => {
				setTextValue(text);
				local.onInputChange?.(text);
			}}
			onChange={handleOnChange}
			onOpenChange={(isOpen, mode) => {
				handleOpenChange(isOpen, mode);
				local.onOpenChange?.(isOpen, mode);
			}}
			{...(others as Record<string, unknown>)}
			triggerMode={"input"}
		>
			<Show when={local.label}>
				<KCombobox.Label {...labelProps}>{local.label}</KCombobox.Label>
			</Show>

			<KCombobox.Control
				data-cui="combobox-control"
				class={mergeClasses(baseFieldProps.baseStyle(), styles.comboboxField)}
				aria-label={local["aria-label"]}
			>
				<KCombobox.Input
					onFocus={onInputFocus}
					ref={control}
					class={styles.comboboxInput}
				/>
				<input
					aria-hidden="true"
					ref={controlWorkaround}
					class={styles.comboboxInputWorkaround}
				/>

				<KCombobox.Trigger>
					<KCombobox.Icon>
						<SelectorIcon />
					</KCombobox.Icon>
				</KCombobox.Trigger>
			</KCombobox.Control>

			<KCombobox.Portal>
				<KCombobox.Content class={styles.content}>
					<KCombobox.Listbox />
				</KCombobox.Content>
			</KCombobox.Portal>
			<Show when={local.description}>
				<KCombobox.Description {...descriptionProps}>
					{local.description}
				</KCombobox.Description>
			</Show>
			<Show when={local.errorMessage}>
				<KCombobox.ErrorMessage {...errorProps}>
					{local.errorMessage}
				</KCombobox.ErrorMessage>
			</Show>
		</KCombobox.Root>
	);
}
