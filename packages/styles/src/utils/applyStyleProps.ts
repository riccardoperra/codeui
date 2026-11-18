export type StyleProps = {
	class: string;
	"data-cui": string;
	[attribute: `data-${string}`]: string | undefined;
};

/** Apply a helper result to an element, including removal of unset variant attributes. */
export function applyStyleProps(element: Element, props: StyleProps): void {
	for (const [name, value] of Object.entries(props)) {
		if (value === undefined) element.removeAttribute(name);
		else element.setAttribute(name, value);
	}
}
