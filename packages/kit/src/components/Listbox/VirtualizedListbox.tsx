import { createVirtualizer } from "@tanstack/solid-virtual";
import { Listbox, ListboxItem, ListboxProps } from "./Listbox";
import { For, splitProps } from "solid-js";
import { LISTBOX_ITEM_SIZE } from "./sizes";

type VirtualizedListboxProps<OptGroup> = Omit<
	ListboxProps<Item, OptGroup>,
	| "virtualized"
	| "children"
	| "options"
	| "optionValue"
	| "optionDisabled"
	| "optionLabel"
	| "optionTextValue"
	| "scrollToItem"
> & {
	options: Item[];
	virtualizerOptions?: {
		estimateSize?: (index: number) => number;
		enableSmoothScroll?: false;
		overscan?: number;
	};
};

interface Item {
	value: string;
	label: string;
	disabled?: boolean;
}

export function VirtualizedListbox<OptGroup = never>(
	props: VirtualizedListboxProps<OptGroup>,
) {
	let listboxRef: HTMLUListElement | undefined;

	const virtualizer = createVirtualizer<HTMLUListElement | undefined, Item>({
		get count() {
			return props.options.length;
		},
		get enableSmoothScroll() {
			return props.virtualizerOptions?.enableSmoothScroll ?? false;
		},
		get overscan() {
			return props.virtualizerOptions?.overscan ?? 5;
		},
		getScrollElement: () => listboxRef,
		estimateSize: (index: number) =>
			// TODO: fix that size
			props.virtualizerOptions?.estimateSize?.(index) ??
			LISTBOX_ITEM_SIZE[props.size ?? "md"],
		// TODO: why error?
		// @ts-ignore
		getItemKey: (index: number) => {
			return props.options[index].value;
		},
	});

	const [local, others] = splitProps(props, ["options", "itemLabel"]);

	return (
		// TODO fix type
		<Listbox<any>
			options={local.options}
			optionValue="value"
			optionTextValue="label"
			optionDisabled="disabled"
			ref={listboxRef}
			scrollToItem={key =>
				virtualizer.scrollToIndex(props.options.findIndex(option => option.value === key))
			}
			virtualized
			{...others}
		>
			{items => (
				<div
					style={{
						height: `${virtualizer.getTotalSize()}px`,
						width: "100%",
						position: "relative",
					}}
				>
					<For each={virtualizer.getVirtualItems()}>
						{virtualRow => {
							// TODO what if key is not string?
							const item = items().getItem(virtualRow.key as string);
							if (item) {
								return (
									<ListboxItem<Item>
										size={props.size}
										item={item}
										itemLabel={item => {
											return local.itemLabel ? local.itemLabel(item) : item.label;
										}}
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											height: `${virtualRow.size}px`,
											transform: `translateY(${virtualRow.start}px)`,
										}}
									/>
								);
							}
						}}
					</For>
				</div>
			)}
		</Listbox>
	);
}
