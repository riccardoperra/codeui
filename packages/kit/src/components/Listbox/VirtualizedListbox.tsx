import { createVirtualizer } from "@tanstack/solid-virtual";
import { Listbox, ListboxItem, ListboxProps } from "./Listbox";
import { For, onCleanup, splitProps } from "solid-js";

export type VirtualizedListboxProps<OptGroup> = Omit<
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
	let rowHeight = 36;

	const virtualizer = createVirtualizer<HTMLUListElement, HTMLLIElement>({
		get count() {
			return props.options.length;
		},
		get overscan() {
			return props.virtualizerOptions?.overscan ?? 5;
		},
		getScrollElement: () => listboxRef ?? null,
		estimateSize: (index: number) =>
			props.virtualizerOptions?.estimateSize?.(index) ?? rowHeight,
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
					<div
						aria-hidden="true"
						style={{
							position: "absolute",
							visibility: "hidden",
							height: "var(--cui-control-height-sm)",
						}}
						ref={element => {
							const observer = new ResizeObserver(([entry]) => {
								const height = entry.contentRect.height;
								if (height > 0 && height !== rowHeight) {
									rowHeight = height;
									virtualizer.measure();
								}
							});
							observer.observe(element);
							onCleanup(() => observer.disconnect());
						}}
					/>
					<For each={virtualizer.getVirtualItems()}>
						{virtualRow => {
							// TODO what if key is not string?
							const item = items().getItem(virtualRow.key as string);
							if (item) {
								return (
									<ListboxItem<Item>
										classes={props.classes}
										size={props.size}
										item={item}
										itemLabel={item => {
											return local.itemLabel ? local.itemLabel(item) : item.label;
										}}
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											margin: 0,
											width: "100%",
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
