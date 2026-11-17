import { JSXElement, splitProps, ValidComponent } from "solid-js";
import {
	Listbox as KListbox,
	ListboxItemProps as KListboxItemProps,
	ListboxRootProps as KListboxRootProps,
} from "@kobalte/core/listbox";
import { CheckIcon } from "../../icons";
import { mergeClasses } from "../../utils/css";
import * as styles from "./Listbox.css";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

export type ListboxClasses = Partial<
	Record<"root" | "item" | "itemLabel" | "itemIndicator", string>
>;

export interface ListboxProps<Option, OptGroup, T extends ValidComponent = "ul">
	extends Omit<KListboxRootProps<Option, OptGroup, T>, "renderItem"> {
	class?: string;
	classes?: ListboxClasses;
	size?: "xs" | "sm" | "md";
	theme?: "primary" | "neutral";
	itemLabel?: (item: Option) => JSXElement;
	bordered?: boolean;
}

export function Listbox<Option, OptGroup = never, T extends ValidComponent = "ul">(
	props: PolymorphicProps<T, ListboxProps<Option, OptGroup, T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"ul", ListboxProps<Option, OptGroup>>,
		["class", "size", "itemLabel", "bordered", "theme", "classes"],
	);

	return (
		<KListbox
			data-cui="listbox"
			data-bordered={local.bordered ? "" : undefined}
			data-theme={local.theme ?? "neutral"}
			class={mergeClasses(styles.list, local.class, local.classes?.root)}
			shouldFocusOnHover
			renderItem={node => (
				<ListboxItem
					classes={local.classes}
					itemLabel={local.itemLabel}
					size={local.size}
					item={node}
				/>
			)}
			{...others}
		/>
	);
}

export interface ListboxItemProps<Item, T extends ValidComponent = "li">
	extends KListboxItemProps<T> {
	class?: string;
	classes?: ListboxClasses;
	size?: "xs" | "sm" | "md";
	itemLabel?: (item: Item) => JSXElement;
}

export function ListboxItem<Item, T extends ValidComponent = "li">(
	props: PolymorphicProps<T, ListboxItemProps<Item, T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"li", ListboxItemProps<Item>>,
		["size", "itemLabel", "class", "classes"],
	);
	return (
		<KListbox.Item
			data-size={props.size ?? undefined}
			data-cui="listbox-item"
			class={mergeClasses(styles.item, local.class, local.classes?.item)}
			{...others}
		>
			<KListbox.ItemLabel data-cui="listbox-item-label" class={local.classes?.itemLabel}>
				{local.itemLabel ? local.itemLabel(others.item.rawValue) : others.item.rawValue}
			</KListbox.ItemLabel>
			<KListbox.ItemIndicator
				data-cui="listbox-item-indicator"
				class={local.classes?.itemIndicator}
				forceMount
			>
				<CheckIcon data-size={props.size ?? undefined} class={styles.itemIndicator} />
			</KListbox.ItemIndicator>
		</KListbox.Item>
	);
}
