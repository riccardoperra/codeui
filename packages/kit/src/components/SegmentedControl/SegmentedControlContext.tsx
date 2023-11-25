import { Accessor, createContext, createSignal, useContext } from "solid-js";

export interface SegmentedControlContextState {
	items: Accessor<HTMLElement[]>;

	mountItem(el: HTMLElement): void;

	unmountItem(el: HTMLElement): void;
}

export const SegmentedControlContext = createContext<SegmentedControlContextState>();

export function useSegmentedControlContext() {
	const context = useContext(SegmentedControlContext);
	if (context === undefined) {
		throw new Error(
			"[@codeui/kit]: `useSegmentedControlContext` must be used within a `SegmentedControl` component",
		);
	}
	return context;
}

export function createSegmentedControlContextState() {
	const [items, setItems] = createSignal<HTMLElement[]>([]);
	const context: SegmentedControlContextState = {
		items,
		mountItem(el) {
			setItems(items => items.concat(el));
		},
		unmountItem(el) {
			setItems(items => items.filter(item => item !== el));
		},
	};
	return context;
}
