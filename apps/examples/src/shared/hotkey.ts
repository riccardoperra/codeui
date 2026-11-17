import { onCleanup, onMount } from "solid-js";

/** Runs `handler` on Cmd+K (macOS) or Ctrl+K. */
export function onModK(handler: () => void) {
	onMount(() => {
		const listener = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey) || event.altKey) return;
			event.preventDefault();
			handler();
		};
		// In the capture phase, so a widget that stops the key cannot swallow the shortcut.
		window.addEventListener("keydown", listener, true);
		onCleanup(() => window.removeEventListener("keydown", listener, true));
	});
}

export const modKey = () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl");
