import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { type Element, omit } from "solid-js";
import { type ValidComponent } from "@solidjs/web";
import * as P from "../../parts/listbox";
import { mergeClasses } from "../../utils/css";

export type ListboxClasses = Partial<
	Record<"root" | "item" | "itemLabel" | "itemIndicator", string>
>;

export interface ListboxProps<Option, OptGroup, T extends ValidComponent = "ul">
	extends Omit<P.RootProps<Option, OptGroup, T>, "renderItem"> {
	class?: string;
	classes?: ListboxClasses;
	size?: "xs" | "sm" | "md";
	variant?: "primary" | "neutral";
	itemLabel?: (item: Option) => Element;
	bordered?: boolean;
}

export function Listbox<Option, OptGroup = never, T extends ValidComponent = "ul">(
	props: PolymorphicProps<T, ListboxProps<Option, OptGroup, T>>,
) {
	const local = props as PolymorphicProps<"ul", ListboxProps<Option, OptGroup>>;
	const others = omit(local, "class", "size", "itemLabel", "classes");

	return (
		<P.Root<Option, OptGroup>
			class={mergeClasses(local.class, local.classes?.root)}
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
	extends P.ItemProps<T> {
	class?: string;
	classes?: ListboxClasses;
	size?: "xs" | "sm" | "md";
	itemLabel?: (item: Item) => Element;
}

export function ListboxItem<Item, T extends ValidComponent = "li">(
	props: PolymorphicProps<T, ListboxItemProps<Item, T>>,
) {
	const local = props as PolymorphicProps<"li", ListboxItemProps<Item>>;
	const others = omit(local, "size", "itemLabel", "class", "classes");
	return (
		<P.Item
			size={local.size}
			class={mergeClasses(local.class, local.classes?.item)}
			{...others}
		>
			<P.ItemLabel class={local.classes?.itemLabel}>
				{local.itemLabel ? local.itemLabel(others.item.rawValue) : others.item.rawValue}
			</P.ItemLabel>
			<P.ItemIndicator size={local.size} class={local.classes?.itemIndicator} />
		</P.Item>
	);
}
