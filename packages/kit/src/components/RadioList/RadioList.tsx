import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type {
	RadioGroupItemProps as KRadioGroupItemProps,
	RadioGroupRootProps as KRadioGroupRootProps,
} from "@kobalte/core/radio-group";
import {
	createContext,
	useContext,
	type Accessor,
	type JSXElement,
	Show,
	splitProps,
	type ValidComponent,
} from "solid-js";
import * as P from "../../parts/radio-list";
import { mergeClasses } from "../../utils/css";
import type { FieldWithErrorMessageSupport } from "../Field/FieldError/createFieldErrorMessageProps";

export type RadioListProps<T extends ValidComponent = "div"> = KRadioGroupRootProps<T> &
	Pick<P.RootProps, "size" | "theme"> &
	FieldWithErrorMessageSupport & {
		label?: JSXElement;
		description?: JSXElement;
		classes?: RadioListClasses;
	};

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
		<P.Item
			{...others}
			class={mergeClasses(local.class, parentClasses?.()?.item, local.classes?.item)}
		>
			<P.ItemInput />
			<P.ItemControl
				class={mergeClasses(parentClasses?.()?.itemControl, local.classes?.itemControl)}
			>
				<P.ItemIndicator
					class={mergeClasses(
						parentClasses?.()?.itemIndicator,
						local.classes?.itemIndicator,
					)}
				/>
			</P.ItemControl>
			<Show when={local.label}>
				{label => (
					<P.ItemLabel
						class={mergeClasses(parentClasses?.()?.itemLabel, local.classes?.itemLabel)}
					>
						{label()}
					</P.ItemLabel>
				)}
			</Show>
		</P.Item>
	);
}

export function RadioList<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RadioListProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", RadioListProps>, [
		"description",
		"size",
		"label",
		"theme",
		"errorMessage",
		"class",
		"classes",
	]);

	return (
		<P.Root
			size={local.size}
			theme={local.theme}
			{...others}
			class={mergeClasses(local.class, local.classes?.root)}
		>
			<Show when={local.label} keyed={false}>
				{label => <P.Label class={local.classes?.label}>{label()}</P.Label>}
			</Show>
			<P.Items
				size={local.size}
				theme={local.theme}
				orientation={props.orientation}
				class={local.classes?.items}
			>
				<RadioClassesContext.Provider value={() => local.classes}>
					{props.children}
				</RadioClassesContext.Provider>
			</P.Items>
			<Show when={local.description} keyed={false}>
				{description => (
					<P.Description class={local.classes?.description}>
						{description()}
					</P.Description>
				)}
			</Show>

			<Show
				when={props.validationState === "invalid" && local.errorMessage}
				keyed={false}
			>
				{errorMessage => (
					<P.ErrorMessage class={local.classes?.errorMessage}>
						{errorMessage()}
					</P.ErrorMessage>
				)}
			</Show>
		</P.Root>
	);
}
