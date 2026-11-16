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
