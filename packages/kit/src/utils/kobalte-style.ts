import type { JSX } from "solid-js";

const variables = {
	"--cui-popper-anchor-width": "var(--kb-popper-anchor-width)",
	"--cui-popper-content-available-height": "var(--kb-popper-content-available-height)",
	"--cui-popper-content-transform-origin": "var(--kb-popper-content-transform-origin)",
	"--cui-toast-swipe-end-x": "var(--kb-toast-swipe-end-x)",
	"--cui-toast-swipe-move-x": "var(--kb-toast-swipe-move-x)",
	"--cui-toast-progress-fill-width": "var(--kb-toast-progress-fill-width)",
	"--cui-progress-fill-width": "var(--kb-progress-fill-width)",
} satisfies JSX.CSSProperties;

/** Translate engine geometry on the element where Kobalte supplies it. */
export function kobalteStyle(style: JSX.CSSProperties | string | undefined) {
	if (typeof style === "string") {
		return (
			Object.entries(variables)
				.map(([key, value]) => `${key}:${value}`)
				.join(";") +
			";" +
			style
		);
	}
	return { ...variables, ...style };
}

export function mapKobalteVariables(element: HTMLElement) {
	for (const [key, value] of Object.entries(variables)) {
		if (!element.style.getPropertyValue(key)) element.style.setProperty(key, value);
	}
}
