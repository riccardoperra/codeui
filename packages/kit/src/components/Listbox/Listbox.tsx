import { JSXElement, splitProps } from "solid-js";
import { Listbox as KListbox } from "@kobalte/core";
import { CheckIcon } from "../../icons";
import { mergeClasses } from "../../utils/css";
import * as styles from "./Listbox.css";

export type ListboxProps<Option, OptGroup> = Omit<
	KListbox.ListboxRootProps<Option, OptGroup>,
	"renderItem"
> & {
	size?: "xs" | "sm" | "md";
	theme?: "primary" | "neutral";
	itemLabel?: (item: Option) => JSXElement;
	bordered?: boolean;
};

export function Listbox<Option, OptGroup = never>(props: ListboxProps<Option, OptGroup>) {
	const [local, others] = splitProps(props, [
		"class",
		"size",
		"itemLabel",
		"bordered",
		"theme",
	]);

	return (
		<KListbox.Root
			data-bordered={local.bordered ? "" : undefined}
			data-theme={local.theme ?? "neutral"}
			class={mergeClasses(styles.list)}
			renderItem={node => (
				<ListboxItem itemLabel={local.itemLabel} size={local.size} item={node} />
			)}
			{...others}
		/>
	);
}

export function ListboxItem<T>(
	props: KListbox.ListboxItemProps & {
		size?: "xs" | "sm" | "md";
		itemLabel?: (item: T) => JSXElement;
	},
) {
	const [local, others] = splitProps(props, ["size", "itemLabel"]);
	return (
		<KListbox.Item data-size={props.size ?? undefined} class={styles.item} {...others}>
			<KListbox.ItemLabel>
				{local.itemLabel ? local.itemLabel(others.item.rawValue) : others.item.rawValue}
			</KListbox.ItemLabel>
			<KListbox.ItemIndicator forceMount>
				<CheckIcon data-size={props.size ?? undefined} class={styles.itemIndicator} />
			</KListbox.ItemIndicator>
		</KListbox.Item>
	);
}
