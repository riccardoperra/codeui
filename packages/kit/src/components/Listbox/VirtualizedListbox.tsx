import { createVirtualizer } from "@tanstack/solid-virtual";
import { Listbox, ListboxItem, ListboxProps } from "./Listbox";
import { For } from "solid-js";

type VirtualizedListboxProps<Option, OptGroup> = Omit<
	ListboxProps<Option, OptGroup>,
	"virtualized" | "children" | "options"
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
	disabled: boolean;
}

export function VirtualizedListbox<Option, OptGroup = never>(
	props: VirtualizedListboxProps<Option, OptGroup>,
) {
	let listboxRef: HTMLUListElement | undefined;

	const virtualizer = createVirtualizer<HTMLUListElement | undefined, Option>({
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
			props.virtualizerOptions?.estimateSize?.(index) ?? 42,
		// TODO: why error?
		// @ts-ignore
		getItemKey: (index: number) => {
			return props.options[index].value;
		},
	});

	return (
		<Listbox
			options={props.options}
			optionValue="value"
			optionTextValue="label"
			optionDisabled="disabled"
			ref={listboxRef}
			scrollToItem={key =>
				virtualizer.scrollToIndex(props.options.findIndex(option => option.value === key))
			}
			virtualized
			style={{ height: "200px", width: "100%", overflow: "auto" }}
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
											return item.label;
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
