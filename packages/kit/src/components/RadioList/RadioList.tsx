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
import {
	createContext,
	useContext,
	Accessor,
	JSXElement,
	Show,
	splitProps,
	ValidComponent,
} from "solid-js";
import { createFieldLabelProps } from "../Field/FieldLabel/createFieldLabelProps";
import { mergeClasses } from "../../utils/css";
import { baseFieldContainer } from "../TextField/TextField.css";
import { createFieldMessageProps } from "../Field/FieldMessage/createFieldMessageProps";
import * as styles from "./Radio.css";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

export type RadioListProps<T extends ValidComponent = "div"> = KRadioGroupRootProps<T> &
	BaseFieldProps &
	FieldWithErrorMessageSupport & {
		label?: JSXElement;
		description?: JSXElement;
		classes?: RadioListClasses;
	};

function RadioGroupLabel(props: PolymorphicProps<"span", KRadioGroupLabelProps>) {
	const fieldLabelProps = createFieldLabelProps<"span">(props);

	return <RadioGroup.Label {...fieldLabelProps} />;
}

function RadioGroupDescription(
	props: PolymorphicProps<"div", KRadioGroupDescriptionProps>,
) {
	const fieldLabelProps = createFieldMessageProps(props);

	return <RadioGroup.Description {...fieldLabelProps} />;
}

export type RadioListClasses = Partial<
	Record<
		| "root"
		| "label"
		| "items"
		| "description"
		| "errorMessage"
		| "item"
		| "itemControl"
		| "itemIndicator"
		| "itemLabel",
		string
	>
>;
const RadioClassesContext = createContext<Accessor<RadioListClasses | undefined>>();

export type RadioListItemProps<T extends ValidComponent = "div"> =
	KRadioGroupItemProps<T> & {
		label?: JSXElement;
		classes?: RadioListClasses;
	};

export function RadioListItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RadioListItemProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", RadioListItemProps>,
		["label", "class", "classes"],
	);
	const parentClasses = useContext(RadioClassesContext);
	return (
		<RadioGroup.Item
			{...others}
			data-cui="radio-list-item"
			class={mergeClasses(
				styles.radioItem,
				local.class,
				parentClasses?.()?.item,
				local.classes?.item,
			)}
		>
			<RadioGroup.ItemInput />
			<RadioGroup.ItemControl
				data-cui="radio-list-item-control"
				class={mergeClasses(
					styles.radio,
					parentClasses?.()?.itemControl,
					local.classes?.itemControl,
				)}
			>
				<RadioGroup.ItemIndicator
					data-cui="radio-list-item-indicator"
					class={mergeClasses(
						styles.indicator,
						parentClasses?.()?.itemIndicator,
						local.classes?.itemIndicator,
					)}
				/>
			</RadioGroup.ItemControl>
			<Show when={local.label}>
				<RadioGroup.ItemLabel
					data-cui="radio-list-item-label"
					class={mergeClasses(parentClasses?.()?.itemLabel, local.classes?.itemLabel)}
				>
					{local.label}
				</RadioGroup.ItemLabel>
			</Show>
		</RadioGroup.Item>
	);
}

export function RadioList<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RadioListProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"button", RadioListProps>,
		["description", "size", "label", "theme", "errorMessage", "class", "classes"],
	);

	const size = () => local.size ?? "md";

	const errorMessageProps = createFieldErrorMessageProps(props);

	return (
		<RadioGroup
			data-cui={"radio-group-field"}
			data-field-size={size()}
			{...others}
			class={mergeClasses(baseFieldContainer, local.class, local.classes?.root)}
		>
			<Show when={local.label} keyed={false}>
				<RadioGroupLabel data-cui="radio-list-label" class={local.classes?.label}>
					{local.label}
				</RadioGroupLabel>
			</Show>
			<div
				data-cui="radio-list-items"
				class={mergeClasses(
					local.classes?.items,
					styles.radioList({
						size: size(),
						orientation: props.orientation,
					}),
				)}
			>
				<RadioClassesContext.Provider value={() => local.classes}>
					{props.children}
				</RadioClassesContext.Provider>
			</div>
			<Show when={local.description} keyed={false}>
				<RadioGroupDescription
					data-cui="radio-list-description"
					class={local.classes?.description}
				>
					{local.description}
				</RadioGroupDescription>
			</Show>

			<Show when={errorMessageProps.errorMessage} keyed={false}>
				<RadioGroup.ErrorMessage
					data-cui="radio-list-error-message"
					class={mergeClasses(errorMessageProps.class, local.classes?.errorMessage)}
				>
					{local.errorMessage}
				</RadioGroup.ErrorMessage>
			</Show>
		</RadioGroup>
	);
}
