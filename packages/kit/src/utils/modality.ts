/**
 * The input the user touched last, written to `<html data-cui-input>` as
 * `keyboard` or `pointer`. Styles read it to keep keyboard actions instant
 * (Inkstone §7.1) and to hide the focus ring that a script focus after a click
 * would otherwise show. One listener pair serves every component.
 */
export const inputModalityAttribute = "data-cui-input";

let tracking = false;
const modifiers = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock"]);

export function trackInputModality() {
	if (tracking || typeof document === "undefined") return;
	tracking = true;
	const root = document.documentElement;
	const set = (value: "keyboard" | "pointer") => {
		if (root.getAttribute(inputModalityAttribute) !== value) {
			root.setAttribute(inputModalityAttribute, value);
		}
	};
	document.addEventListener(
		"keydown",
		event => {
			if (!modifiers.has(event.key)) set("keyboard");
		},
		true,
	);
	document.addEventListener("pointerdown", () => set("pointer"), true);
}

/** Selector prefix that matches while the last input was the keyboard. */
export const whileKeyboard = `:root[${inputModalityAttribute}="keyboard"]`;
/** Selector prefix that matches while the last input was a pointer. */
export const whilePointer = `:root[${inputModalityAttribute}="pointer"]`;
