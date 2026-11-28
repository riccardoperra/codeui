type Handler = (event: Event) => void;

function handlerOf(value: unknown): Handler | undefined {
	if (typeof value === "function") return value as Handler;
	// Solid's bound form: [handler, data] calls handler(data, event).
	if (Array.isArray(value) && typeof value[0] === "function") {
		const [handler, data] = value as [(data: unknown, event: Event) => void, unknown];
		return event => handler(data, event);
	}
}

/**
 * Puts the active card's attributes and event handlers on the shared surface, and takes
 * them off when another card takes the surface. Kobalte reads a spread once, so the
 * surface cannot take them through JSX.
 */
export function applyAttributes(element: HTMLElement, entries: [string, unknown][]) {
	const cleanups: (() => void)[] = [];
	for (const [name, value] of entries) {
		const handler = name.startsWith("on") ? handlerOf(value) : undefined;
		if (handler) {
			const type = name.slice(2).toLowerCase();
			element.addEventListener(type, handler);
			cleanups.push(() => element.removeEventListener(type, handler));
			continue;
		}
		if (value == null || value === false || typeof value === "object") continue;
		const previous = element.getAttribute(name);
		element.setAttribute(name, value === true ? "" : String(value));
		cleanups.push(() =>
			previous === null
				? element.removeAttribute(name)
				: element.setAttribute(name, previous),
		);
	}
	return () => {
		for (const cleanup of cleanups.reverse()) cleanup();
	};
}
