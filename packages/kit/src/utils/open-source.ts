import { mapKobalteVariables } from "./kobalte-style";
import { isServer } from "solid-js/web";

/**
 * Remembers the last input, so an overlay can tell whether a pointer or the
 * keyboard opened it. Inkstone: nothing opened from the keyboard animates.
 */
const last = { press: -Infinity, hover: -Infinity, key: -Infinity };
let listening = false;

/** A pointer input this recent counts as the one that opened the overlay. */
const recent = 1000;

export function trackInput() {
	if (listening || isServer || typeof document === "undefined") return;
	listening = true;
	const record = (kind: keyof typeof last) => () => {
		last[kind] = performance.now();
	};
	const options = { capture: true, passive: true };
	document.addEventListener("pointerdown", record("press"), options);
	document.addEventListener("pointermove", record("hover"), options);
	document.addEventListener("keydown", record("key"), options);
}

// Listen from the first import, so the first open already knows its source.
trackInput();

/**
 * True when a pointer press came shortly before, after any key. With `hover`,
 * a pointer that only moved counts too: tooltips and submenus open on hover.
 * Keyboard and programmatic opens return false.
 */
export function pointerInitiated(options?: { hover?: boolean }): boolean {
	const pointer = options?.hover ? Math.max(last.press, last.hover) : last.press;
	return pointer > last.key && performance.now() - pointer < recent;
}

/**
 * A ref for an overlay content. It runs once, when the content mounts on
 * open: after a pointer the content plays its Pop; otherwise it gets
 * `data-motion="none"` and shows and hides in place. The value stays fixed
 * while the content is mounted, so a later input cannot restart the entrance.
 */
export function motionRef(options?: { hover?: boolean; still?: () => boolean }) {
	return (element: HTMLElement) => {
		mapKobalteVariables(element);
		if (!options?.still?.() && pointerInitiated(options)) element.removeAttribute("data-motion");
		else element.setAttribute("data-motion", "none");
	};
}
