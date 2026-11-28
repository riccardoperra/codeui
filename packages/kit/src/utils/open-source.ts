import { isServer } from "@solidjs/web";

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
	// The browser fires pointerover before the pointermove that crosses into an element,
	// so an overlay opened from pointerenter sees this pointer, not the previous one.
	document.addEventListener("pointerover", record("hover"), options);
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
