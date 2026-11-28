export function releaseEscape(
	root: HTMLElement,
	onEscapeKeyDown?: (event: KeyboardEvent) => void,
): () => void {
	const listener = (event: KeyboardEvent) => {
		if (event.key !== "Escape" || event.defaultPrevented) return;
		event.stopPropagation();
		onEscapeKeyDown?.(event);
		if (!event.defaultPrevented) {
			root.parentElement?.dispatchEvent(
				new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
			);
		}
	};
	root.addEventListener("keydown", listener, true);
	return () => root.removeEventListener("keydown", listener, true);
}

/** Kobalte alpha.5 prevents Escape even when the list cannot clear selection. */
export function allowEscapeToBubble(event: KeyboardEvent) {
	if (event.key !== "Escape" || event.defaultPrevented) return;
	// Skip the list's preventDefault call and leave the parent layer in charge.
	event.preventDefault = () => Reflect.deleteProperty(event, "preventDefault");
}
