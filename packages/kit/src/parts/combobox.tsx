import * as K from "@kobalte/core/combobox";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { splitProps, type ValidComponent } from "solid-js";
import { mergeClasses } from "../utils/css";
import * as styles from "../components/Combobox/Combobox.css";
export { useComboboxContext } from "@kobalte/core/combobox";
export {
	createComboboxOptions,
	type ComboboxOption,
	type ComboboxOptionsConfig,
	type CreateComboboxOptionsReturn,
} from "../components/Combobox/createComboboxOptions";

export type ComboboxVariants = { size?: "sm" | "md" };
export const comboboxParts = {
	root: "combobox-root",
	control: "combobox-control",
	input: "combobox-input",
	trigger: "combobox-trigger",
	icon: "combobox-icon",
	content: "combobox-content",
	arrow: "combobox-arrow",
	listbox: "combobox-listbox",
	item: "combobox-item",
	itemLabel: "combobox-item-label",
	itemDescription: "combobox-item-description",
	itemIndicator: "combobox-item-indicator",
	section: "combobox-section",
	hiddenSelect: "combobox-hidden-select",
	label: "combobox-label",
	description: "combobox-description",
	errorMessage: "combobox-error-message",
} as const;
export type ComboboxPart = keyof typeof comboboxParts;
export type ComboboxClasses = Partial<Record<ComboboxPart, string>>;
export type ComboboxStyles = Record<
	ComboboxPart,
	(variants?: ComboboxVariants) => string
>;
export const comboboxStyles: ComboboxStyles = {
	root: () => styles.root,
	control: variants => styles.control({ size: variants?.size }),
	input: () => styles.input,
	trigger: () => styles.trigger,
	icon: () => styles.icon,
	content: () => styles.content,
	arrow: () => styles.arrow,
	listbox: () => styles.listbox,
	item: () => styles.item,
	itemLabel: () => styles.itemLabel,
	itemDescription: () => styles.itemDescription,
	itemIndicator: () => styles.itemIndicator,
	section: () => styles.section,
	hiddenSelect: () => styles.hiddenSelect,
	label: () => styles.label,
	description: () => styles.description,
	errorMessage: () => styles.errorMessage,
};

type Local = ComboboxVariants & { class?: string };
const variantKeys = ["class", "size"] as const;
function partAttributes(part: ComboboxPart, local: Local) {
	return {
		"data-cui": comboboxParts[part],
		get "data-size"() {
			return local.size;
		},
		get class() {
			return mergeClasses(comboboxStyles[part](local), local.class);
		},
	};
}

export type RootProps<
	Option,
	OptGroup = never,
	T extends ValidComponent = "div",
> = K.ComboboxRootProps<Option, OptGroup, T> & ComboboxVariants;
export function Root<Option, OptGroup = never, T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<Option, OptGroup, T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", RootProps<Option, OptGroup>> & Local,
		variantKeys,
	);
	return <K.Root<Option, OptGroup> {...others} {...partAttributes("root", local)} />;
}

export type ControlProps<
	Option,
	T extends ValidComponent = "div",
> = K.ComboboxControlProps<Option, T> & ComboboxVariants;
export function Control<Option, T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ControlProps<Option, T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ControlProps<Option>> & Local,
		variantKeys,
	);
	return <K.Control<Option> {...others} {...partAttributes("control", local)} />;
}

export type InputProps<T extends ValidComponent = "input"> = K.ComboboxInputProps<T> &
	ComboboxVariants;
export function Input<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, InputProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"input", InputProps> & Local,
		variantKeys,
	);
	return <K.Input {...others} {...partAttributes("input", local)} />;
}

export type TriggerProps<T extends ValidComponent = "button"> =
	K.ComboboxTriggerProps<T> & ComboboxVariants;
export function Trigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, TriggerProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"button", TriggerProps> & Local,
		variantKeys,
	);
	return <K.Trigger {...others} {...partAttributes("trigger", local)} />;
}

export type IconProps<T extends ValidComponent = "span"> = K.ComboboxIconProps<T> &
	ComboboxVariants;
export function Icon<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, IconProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"span", IconProps> & Local,
		variantKeys,
	);
	return <K.Icon {...others} {...partAttributes("icon", local)} />;
}

export type PortalProps = K.ComboboxPortalProps;
export function Portal(props: PortalProps) {
	return <K.Portal {...props} />;
}

export type ContentProps<T extends ValidComponent = "div"> = K.ComboboxContentProps<T> &
	ComboboxVariants;
export function Content<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ContentProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ContentProps> & Local,
		variantKeys,
	);
	return <K.Content {...others} {...partAttributes("content", local)} />;
}

export type ArrowProps<T extends ValidComponent = "div"> = K.ComboboxArrowProps<T> &
	ComboboxVariants;
export function Arrow<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ArrowProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ArrowProps> & Local,
		variantKeys,
	);
	return <K.Arrow {...others} {...partAttributes("arrow", local)} />;
}

export type ListboxProps<
	Option = unknown,
	OptGroup = never,
	T extends ValidComponent = "ul",
> = K.ComboboxListboxProps<Option, OptGroup, T> & ComboboxVariants;
export function Listbox<
	Option = unknown,
	OptGroup = never,
	T extends ValidComponent = "ul",
>(props: PolymorphicProps<T, ListboxProps<Option, OptGroup, T>>) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"ul", ListboxProps<Option, OptGroup>> & Local,
		variantKeys,
	);
	return (
		<K.Listbox<Option, OptGroup> {...others} {...partAttributes("listbox", local)} />
	);
}

export type ItemProps<T extends ValidComponent = "li"> = K.ComboboxItemProps<T> &
	ComboboxVariants;
export function Item<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, ItemProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"li", ItemProps> & Local,
		variantKeys,
	);
	return <K.Item {...others} {...partAttributes("item", local)} />;
}

export type ItemLabelProps<T extends ValidComponent = "div"> =
	K.ComboboxItemLabelProps<T> & ComboboxVariants;
export function ItemLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemLabelProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ItemLabelProps> & Local,
		variantKeys,
	);
	return <K.ItemLabel {...others} {...partAttributes("itemLabel", local)} />;
}

export type ItemDescriptionProps<T extends ValidComponent = "div"> =
	K.ComboboxItemDescriptionProps<T> & ComboboxVariants;
export function ItemDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemDescriptionProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ItemDescriptionProps> & Local,
		variantKeys,
	);
	return <K.ItemDescription {...others} {...partAttributes("itemDescription", local)} />;
}

export type ItemIndicatorProps<T extends ValidComponent = "div"> =
	K.ComboboxItemIndicatorProps<T> & ComboboxVariants;
export function ItemIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemIndicatorProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ItemIndicatorProps> & Local,
		variantKeys,
	);
	return <K.ItemIndicator {...others} {...partAttributes("itemIndicator", local)} />;
}

export type SectionProps<T extends ValidComponent = "li"> = K.ComboboxSectionProps<T> &
	ComboboxVariants;
export function Section<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, SectionProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"li", SectionProps> & Local,
		variantKeys,
	);
	return <K.Section {...others} {...partAttributes("section", local)} />;
}

export type HiddenSelectProps = K.ComboboxHiddenSelectProps & ComboboxVariants;
export function HiddenSelect(props: HiddenSelectProps) {
	const [local, others] = splitProps(props, variantKeys);
	return <K.HiddenSelect {...others} {...partAttributes("hiddenSelect", local)} />;
}

export type LabelProps<T extends ValidComponent = "span"> = K.ComboboxLabelProps<T> &
	ComboboxVariants;
export function Label<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, LabelProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"span", LabelProps> & Local,
		variantKeys,
	);
	return <K.Label {...others} {...partAttributes("label", local)} />;
}

export type DescriptionProps<T extends ValidComponent = "div"> =
	K.ComboboxDescriptionProps<T> & ComboboxVariants;
export function Description<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DescriptionProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", DescriptionProps> & Local,
		variantKeys,
	);
	return <K.Description {...others} {...partAttributes("description", local)} />;
}

export type ErrorMessageProps<T extends ValidComponent = "div"> =
	K.ComboboxErrorMessageProps<T> & ComboboxVariants;
export function ErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ErrorMessageProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ErrorMessageProps> & Local,
		variantKeys,
	);
	return <K.ErrorMessage {...others} {...partAttributes("errorMessage", local)} />;
}

export const ComboboxParts = {
	Root,
	Control,
	Input,
	Trigger,
	Icon,
	Portal,
	Content,
	Arrow,
	Listbox,
	Item,
	ItemLabel,
	ItemDescription,
	ItemIndicator,
	Section,
	HiddenSelect,
	Label,
	Description,
	ErrorMessage,
};
