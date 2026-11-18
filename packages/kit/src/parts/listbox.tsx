import { listboxStyleProps } from "@codeui/styles/listbox";
import "@codeui/styles/theme.css";
import "@codeui/styles/listbox.css";
import * as K from "@kobalte/core/listbox";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { mergeProps, splitProps, type ValidComponent } from "solid-js";
import * as styles from "../components/Listbox/Listbox.css";
import { CheckIcon } from "../icons/CheckIcon";
import { mergeClasses } from "../utils/css";

const defaultItemSize = listboxStyleProps.item()["data-size"];

type ItemSize = "xs" | "sm" | "md";

export type RootProps<
	Option,
	OptGroup = never,
	T extends ValidComponent = "ul",
> = K.ListboxRootProps<Option, OptGroup, T> & {
	bordered?: boolean;
	theme?: "primary" | "neutral";
};
export function Root<Option, OptGroup = never, T extends ValidComponent = "ul">(
	props: PolymorphicProps<T, RootProps<Option, OptGroup, T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"ul", RootProps<Option, OptGroup>>,
		["class", "bordered", "theme"],
	);
	return (
		<K.Root<Option, OptGroup>
			data-cui="listbox"
			data-bordered={local.bordered ? "" : undefined}
			data-theme={local.theme ?? "neutral"}
			shouldFocusOnHover
			{...others}
			class={mergeClasses(styles.list, local.class)}
		/>
	);
}

export type ItemProps<T extends ValidComponent = "li"> = K.ListboxItemProps<T> & {
	size?: ItemSize;
};
export function Item<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, ItemProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"li", ItemProps>, [
		"class",
		"size",
	]);
	return (
		<K.Item
			data-size={local.size ?? defaultItemSize}
			data-cui="listbox-item"
			{...others}
			class={mergeClasses(styles.item, local.class)}
		/>
	);
}

export type ItemLabelProps<T extends ValidComponent = "div"> = K.ListboxItemLabelProps<T>;
export function ItemLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemLabelProps<T>>,
) {
	return <K.ItemLabel<T> {...props} data-cui="listbox-item-label" />;
}

export type ItemIndicatorProps<T extends ValidComponent = "div"> =
	K.ListboxItemIndicatorProps<T> & {
		size?: ItemSize;
	};
export function ItemIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemIndicatorProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ItemIndicatorProps>,
		["size"],
	);
	const resolved = mergeProps(
		{
			forceMount: true,
			get children() {
				return <CheckIcon data-size={local.size ?? defaultItemSize} class={styles.itemIndicator} />;
			},
		},
		others,
	);
	return <K.ItemIndicator {...resolved} data-cui="listbox-item-indicator" />;
}

export {
	ItemDescription,
	Section,
	type ListboxItemDescriptionProps as ItemDescriptionProps,
	type ListboxSectionProps as SectionProps,
} from "@kobalte/core/listbox";
