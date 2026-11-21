import {
	elementScroll,
	observeElementOffset,
	observeElementRect,
	Virtualizer,
} from "@tanstack/virtual-core";
import { Listbox, ListboxItem, ListboxProps } from "./Listbox";
import { createEffect, createSignal, For, onSettled, omit, Show } from "solid-js";

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

	const [viewport, setViewport] = createSignal<{
		rows: ReturnType<Virtualizer<HTMLUListElement, HTMLLIElement>["getVirtualItems"]>;
		height: number;
	}>({ rows: [], height: 0 });
	let heightProbe: HTMLDivElement | undefined;
	const coreOptions = {
		getScrollElement: () => listboxRef ?? null,
		estimateSize: () => rowHeight,
		observeElementRect,
		observeElementOffset,
		scrollToFn: elementScroll,
		onChange: updateWindow,
	};
	function updateWindow(instance: Virtualizer<HTMLUListElement, HTMLLIElement>) {
		setViewport({ rows: instance.getVirtualItems(), height: instance.getTotalSize() });
	}
	const virtualizer = new Virtualizer<HTMLUListElement, HTMLLIElement>({
		...coreOptions,
		count: 0,
	});
	onSettled(() => {
		const dispose = virtualizer._didMount();
		const observer = new ResizeObserver(([entry]) => {
			const height = entry.contentRect.height;
			if (height > 0 && height !== rowHeight) {
				rowHeight = height;
				virtualizer.measure();
			}
		});
		if (heightProbe) observer.observe(heightProbe);
		return () => {
			observer.disconnect();
			dispose();
		};
	});
	createEffect(
		() => ({
			keys: props.options.map(option => option.value),
			overscan: props.virtualizerOptions?.overscan ?? 5,
			estimateSize: props.virtualizerOptions?.estimateSize,
		}),
		({ keys, overscan, estimateSize }) => {
			virtualizer.setOptions({
				...coreOptions,
				count: keys.length,
				overscan,
				getItemKey: index => keys[index],
				estimateSize: index => estimateSize?.(index) ?? rowHeight,
			});
			virtualizer._willUpdate();
			virtualizer.measure();
		},
	);

	const others = omit(props, "options", "itemLabel", "virtualizerOptions");

	return (
		<Listbox<Item, OptGroup>
			options={props.options}
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
						height: `${viewport().height}px`,
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
						ref={heightProbe}
					/>
					<For each={viewport().rows} keyed={row => row.key}>
						{row => (
							<Show when={items().getItem(String(row().key))}>
								{item => (
									<ListboxItem<Item>
										classes={props.classes}
										size={props.size}
										item={item()}
										itemLabel={item => {
											return props.itemLabel ? props.itemLabel(item) : item.label;
										}}
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											margin: 0,
											width: "100%",
											transform: `translateY(${row().start}px)`,
										}}
									/>
								)}
							</Show>
						)}
					</For>
				</div>
			)}
		</Listbox>
	);
}
