import { getScrollParent } from "@kobalte/utils";

// Alpha.5 calls scrollIntoView on focus, which can move the page along
// with the collection. Keep that call within its popup until Kobalte #770 lands.
export function keepCollectionScrollLocal(item: HTMLElement) {
	const nativeScrollIntoView = item.scrollIntoView;
	item.scrollIntoView = options => {
		const popup = item.closest<HTMLElement>(
			'[data-cui="select-content"], [data-cui="combobox-content"], [role="menu"]',
		);
		if (!popup || typeof options !== "object" || options?.block !== "nearest" ||
			Object.keys(options).length !== 1) {
			nativeScrollIntoView.call(item, options);
			return;
		}

		const parent = getScrollParent(item.parentElement) as HTMLElement;
		const scroller = popup.contains(parent) ? parent : popup;
		const viewport = scroller.getBoundingClientRect();
		const row = item.getBoundingClientRect();
		const scale = viewport.height / scroller.offsetHeight || 1;
		const top = viewport.top + scroller.clientTop * scale;
		const bottom = top + scroller.clientHeight * scale;
		if (row.top < top) scroller.scrollTop += (row.top - top) / scale;
		else if (row.bottom > bottom) scroller.scrollTop += (row.bottom - bottom) / scale;
	};
}
