import { pickProps } from "../../utils/pick-props";
import type {
	SelectItemProps as KSelectItemProps,
	SelectRootProps as KSelectRootProps,
} from "@kobalte/core/select";
import { type Accessor, type Element, type ParentProps, Show, omit } from "solid-js";
import { type JSX } from "@solidjs/web";
import { CheckIcon } from "../../icons/CheckIcon";
import { SelectorIcon } from "../../icons/SelectorIcon";
import * as P from "../../parts/select";
import { mergeClasses } from "../../utils/css";
import type { BaseFieldProps } from "../Field/createBaseFieldProps";
import type { FieldWithErrorMessageSupport } from "../Field/FieldError/createFieldErrorMessageProps";
import * as styles from "./Select.css";

export { selectParts, type SelectClasses, type SelectPart } from "../../parts/select";

type SelectSlot = "root" | "input" | "label" | "errorLabel" | "itemValue";

const partToSlot: Partial<Record<P.SelectPart, SelectSlot>> = {
	root: "root",
	trigger: "input",
	label: "label",
	errorMessage: "errorLabel",
	value: "itemValue",
};

function partClass(props: SelectClassesProps, part: P.SelectPart): string | undefined {
	const slot = partToSlot[part];
	return (
		mergeClasses(slot && props.slotClasses?.[slot], props.classes?.[part]) || undefined
	);
}

type SelectClassesProps = {
	/** Classes for each part, keyed by part name. `content` targets the portaled list. */
	classes?: P.SelectClasses;
	/** @deprecated Use `classes`. `input` maps to `trigger`, `errorLabel` to `errorMessage` and `itemValue` to `value`. */
	slotClasses?: Partial<Record<SelectSlot, string>>;
};

export type SelectProps<Option, OptGroup = never> = KSelectRootProps<Option, OptGroup> &
	BaseFieldProps & {
		/** Accessible name for the trigger. Optional when `label` is set. */
		"aria-label"?: string;
		placeholder?: string;
		description?: string;
		label?: JSX.Element;
	} & FieldWithErrorMessageSupport & {
		itemLabel?: (item: Option) => Element;
		valueComponent?: (state: Accessor<Option>) => Element;
		valueComponentMultiple?: (state: Accessor<Option[]>) => Element;
		/** Portal target, such as a parent dialog, so the list stays inside it. */
		mount?: globalThis.Element;
	} & SelectClassesProps;

export function SelectItem<T>(
	props: KSelectItemProps & {
		itemLabel?: (item: T) => Element;
		classes?: Pick<P.SelectClasses, "item" | "itemLabel" | "itemIndicator">;
	},
) {
	return (
		<P.Item class={props.classes?.item} item={props.item}>
			<P.ItemLabel class={props.classes?.itemLabel}>
				{props.itemLabel ? props.itemLabel(props.item.rawValue) : props.item.rawValue}
			</P.ItemLabel>
			<P.ItemIndicator class={props.classes?.itemIndicator}>
				<CheckIcon class={styles.itemIndicator} />
			</P.ItemIndicator>
		</P.Item>
	);
}

export function Select<Option, OptGroup = never>(
	props: ParentProps<SelectProps<Option, OptGroup>>,
) {
	const local = pickProps(
		props,
		"aria-label",
		"children",
		"size",
		"variant",
		"errorMessage",
		"description",
		"label",
		"itemLabel",
		"valueComponent",
		"classes",
		"slotClasses",
		"mount",
	);
	const others = omit(
		props,
		"aria-label",
		"children",
		"size",
		"variant",
		"errorMessage",
		"description",
		"label",
		"itemLabel",
		"valueComponent",
		"classes",
		"slotClasses",
		"mount",
	);

	return (
		<P.Root<Option, OptGroup>
			{...others}
			class={partClass(local, "root")}
			size={local.size}
			itemComponent={itemProps => (
				<SelectItem
					item={itemProps.item}
					itemLabel={local.itemLabel}
					classes={local.classes}
				/>
			)}
		>
			<Show when={local.label} keyed={false}>
				{label => <P.Label class={partClass(local, "label")}>{label()}</P.Label>}
			</Show>
			<Show when={props.name}>
				{name => <P.FormValue name={name()} disabled={props.disabled} />}
			</Show>
			<P.Trigger
				size={local.size}
				variant={local.variant}
				aria-label={local["aria-label"]}
				class={partClass(local, "trigger")}
			>
				<P.Value<Option> class={partClass(local, "value")}>
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
								when={props.multiple}
							>
								<Show
									fallback={state.selectedOptions().join(", ")}
									when={props.valueComponentMultiple}
								>
									{callback => <>{callback()(state.selectedOptions)}</>}
								</Show>
							</Show>
						);
					}}
				</P.Value>
				<P.Icon class={partClass(local, "icon")}>
					<SelectorIcon />
				</P.Icon>
			</P.Trigger>
			<Show when={local.description} keyed={false}>
				{description => (
					<P.Description class={partClass(local, "description")}>
						{description()}
					</P.Description>
				)}
			</Show>
			<Show
				when={props.validationState === "invalid" && local.errorMessage}
				keyed={false}
			>
				{errorMessage => (
					<P.ErrorMessage class={partClass(local, "errorMessage")}>
						{errorMessage()}
					</P.ErrorMessage>
				)}
			</Show>
			<P.Portal mount={local.mount}>
				<P.Content class={partClass(local, "content")}>
					<P.Listbox class={partClass(local, "listbox")} />
				</P.Content>
			</P.Portal>
		</P.Root>
	);
}
