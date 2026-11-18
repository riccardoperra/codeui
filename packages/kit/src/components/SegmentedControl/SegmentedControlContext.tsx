import { Accessor, createContext, createSignal, type Setter, useContext } from "solid-js";

export interface SegmentedControlContextState {
	items: Accessor<HTMLElement[]>;
	itemClass?: Accessor<string | undefined>;
	indicator: Accessor<HTMLElement | undefined>;
	setIndicator: Setter<HTMLElement | undefined>;

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
	const [indicator, setIndicator] = createSignal<HTMLElement>();
	const context: SegmentedControlContextState = {
		indicator,
		setIndicator,
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
