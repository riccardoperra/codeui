import { pickProps } from "../utils/pick-props";
import { comboboxStyleProps } from "@codeui/styles/combobox";
import "@codeui/styles/theme.css";
import "@codeui/styles/combobox.css";
import * as K from "@kobalte/core/combobox";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { omit } from "solid-js";
import { type ValidComponent, type JSX } from "@solidjs/web";
import { callHandler } from "@kobalte/utils";
import { mergeClasses } from "../utils/css";
import { LayerScope } from "../utils/layer-scope";
import { createPopMotion, motionRef, PopMotionContext } from "../utils/pop-motion";
import { keepCollectionScrollLocal } from "../utils/collection-scroll";
export { useComboboxContext } from "@kobalte/core/combobox";
export {
	createComboboxOptions,
	type ComboboxOption,
	type ComboboxOptionsConfig,
	type CreateComboboxOptionsReturn,
} from "../components/Combobox/createComboboxOptions";

import {
	type ComboboxVariants,
	comboboxParts,
	type ComboboxPart,
	type ComboboxClasses,
	type ComboboxStyles,
	comboboxStyles,
} from "@codeui/styles/combobox";
export {
	type ComboboxVariants,
	comboboxParts,
	type ComboboxPart,
	type ComboboxClasses,
	type ComboboxStyles,
	comboboxStyles,
} from "@codeui/styles/combobox";
const defaultComboboxSize = comboboxStyleProps()["data-size"];

type Local = ComboboxVariants & { class?: JSX.ClassValue };
const variantKeys = ["class", "size"] as const;
function partAttributes(part: ComboboxPart, local: Local) {
	return {
		"data-cui": comboboxParts[part],
		get "data-size"() {
			return local.size ?? defaultComboboxSize;
		},
		get class() {
			return mergeClasses(comboboxStyles[part](), local.class);
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
	const allProps = props as PolymorphicProps<"div", RootProps<Option, OptGroup>> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const input = allProps;
	const others = omit(allProps, ...variantKeys, "onInputChange", "forceMount", "onOpenChange");
	const motion = createPopMotion(allProps);
	// Kobalte clears a single selection on empty text only when `value` is undefined.
	// Report the clear for a controlled value too, so the parent can drop it.
	const onInputChange = (text: string) => {
		input.onInputChange?.(text);
		if (text === "" && !others.multiple && others.value != null) {
			(others.onChange as ((value: Option | null) => void) | undefined)?.(null);
		}
	};
	return (
		<PopMotionContext value={motion.setTarget}>
			<K.Root<Option, OptGroup>
				{...others}
				forceMount={motion.forceMount()}
				onOpenChange={motion.onOpenChange}
				onInputChange={onInputChange}
				{...partAttributes("root", local)}
			/>
		</PopMotionContext>
	);
}

export type ControlProps<
	Option,
	T extends ValidComponent = "div",
> = K.ComboboxControlProps<Option, T> & ComboboxVariants;
export function Control<Option, T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ControlProps<Option, T>>,
) {
	const allProps = props as PolymorphicProps<"div", ControlProps<Option>> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
	return <K.Control<Option> {...others} {...partAttributes("control", local)} />;
}

export type InputProps<T extends ValidComponent = "input"> = K.ComboboxInputProps<T> &
	ComboboxVariants;
export function Input<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, InputProps<T>>,
) {
	const allProps = props as PolymorphicProps<"input", InputProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
	const context = K.useComboboxContext();
	const events = others;
	const rest = omit(others, "onKeyDown");
	return (
		<K.Input
			{...rest}
			{...partAttributes("input", local)}
			onKeyDown={event => {
				callHandler(event, events.onKeyDown);
				// Kobalte closes the list next; keep this Escape from dismissing its parent dialog.
				if (event.key === "Escape" && context.isOpen()) event.preventDefault();
			}}
		/>
	);
}

export type TriggerProps<T extends ValidComponent = "button"> =
	K.ComboboxTriggerProps<T> & ComboboxVariants;
export function Trigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, TriggerProps<T>>,
) {
	const allProps = props as PolymorphicProps<"button", TriggerProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
	return <K.Trigger {...others} {...partAttributes("trigger", local)} />;
}

export type IconProps<T extends ValidComponent = "span"> = K.ComboboxIconProps<T> &
	ComboboxVariants;
export function Icon<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, IconProps<T>>,
) {
	const allProps = props as PolymorphicProps<"span", IconProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
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
	const allProps = props as PolymorphicProps<"div", ContentProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
	const refs = others;
	const rest = omit(others, "ref");
	return (
		<LayerScope>
			<K.Content
				ref={[motionRef(), refs.ref]}
				{...rest}
				{...partAttributes("content", local)}
			/>
		</LayerScope>
	);
}

export type ArrowProps<T extends ValidComponent = "div"> = K.ComboboxArrowProps<T> &
	ComboboxVariants;
export function Arrow<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ArrowProps<T>>,
) {
	const allProps = props as PolymorphicProps<"div", ArrowProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
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
	const allProps = props as PolymorphicProps<"ul", ListboxProps<Option, OptGroup>> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
	return (
		<K.Listbox<Option, OptGroup> {...others} {...partAttributes("listbox", local)} />
	);
}

export type ItemProps<T extends ValidComponent = "li"> = K.ComboboxItemProps<T> &
	ComboboxVariants;
export function Item<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, ItemProps<T>>,
) {
	const allProps = props as PolymorphicProps<"li", ItemProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys, "ref");
	return (
		<K.Item
			{...others}
			{...partAttributes("item", local)}
			ref={[keepCollectionScrollLocal, allProps.ref]}
		/>
	);
}

export type ItemLabelProps<T extends ValidComponent = "div"> =
	K.ComboboxItemLabelProps<T> & ComboboxVariants;
export function ItemLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemLabelProps<T>>,
) {
	const allProps = props as PolymorphicProps<"div", ItemLabelProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
	return <K.ItemLabel {...others} {...partAttributes("itemLabel", local)} />;
}

export type ItemDescriptionProps<T extends ValidComponent = "div"> =
	K.ComboboxItemDescriptionProps & ComboboxVariants;
export function ItemDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemDescriptionProps<T>>,
) {
	const allProps = props as PolymorphicProps<"div", ItemDescriptionProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
	return <K.ItemDescription {...others} {...partAttributes("itemDescription", local)} />;
}

export type ItemIndicatorProps<T extends ValidComponent = "div"> =
	K.ComboboxItemIndicatorProps<T> & ComboboxVariants;
export function ItemIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemIndicatorProps<T>>,
) {
	const allProps = props as PolymorphicProps<"div", ItemIndicatorProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
	return <K.ItemIndicator {...others} {...partAttributes("itemIndicator", local)} />;
}

export type SectionProps<T extends ValidComponent = "li"> = K.ComboboxSectionProps<T> &
	ComboboxVariants;
export function Section<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, SectionProps<T>>,
) {
	const allProps = props as PolymorphicProps<"li", SectionProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
	return <K.Section {...others} {...partAttributes("section", local)} />;
}

export type HiddenSelectProps = K.ComboboxHiddenSelectProps & ComboboxVariants;
export function HiddenSelect(props: HiddenSelectProps) {
	const local = pickProps(props, ...variantKeys);
	const others = omit(props, ...variantKeys);
	return <K.HiddenSelect {...others} {...partAttributes("hiddenSelect", local)} />;
}

export type LabelProps<T extends ValidComponent = "span"> = K.ComboboxLabelProps<T> &
	ComboboxVariants;
export function Label<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, LabelProps<T>>,
) {
	const allProps = props as PolymorphicProps<"span", LabelProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
	return <K.Label {...others} {...partAttributes("label", local)} />;
}

export type DescriptionProps<T extends ValidComponent = "div"> =
	K.ComboboxDescriptionProps & ComboboxVariants;
export function Description<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DescriptionProps<T>>,
) {
	const allProps = props as PolymorphicProps<"div", DescriptionProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
	return <K.Description {...others} {...partAttributes("description", local)} />;
}

export type ErrorMessageProps<T extends ValidComponent = "div"> =
	K.ComboboxErrorMessageProps<T> & ComboboxVariants;
export function ErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ErrorMessageProps<T>>,
) {
	const allProps = props as PolymorphicProps<"div", ErrorMessageProps> & Local;
	const local = pickProps(allProps, ...variantKeys);
	const others = omit(allProps, ...variantKeys);
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
