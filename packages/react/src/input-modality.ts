import { useEffect } from "react";

const last = { press: -Infinity, hover: -Infinity, key: -Infinity };
const modifiers = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock"]);
const pointerWindowMs = 1000;
let tracking = false;

function startInputTracking() {
	if (tracking || typeof document === "undefined") return;
	tracking = true;
	const root = document.documentElement;
	const modality = (value: "keyboard" | "pointer") => {
		if (root.getAttribute("data-cui-input") !== value)
			root.setAttribute("data-cui-input", value);
	};
	const options = { capture: true, passive: true };
	document.addEventListener(
		"pointerdown",
		() => {
			last.press = performance.now();
			modality("pointer");
		},
		options,
	);
	document.addEventListener(
		"pointermove",
		() => {
			last.hover = performance.now();
		},
		options,
	);
	document.addEventListener(
		"keydown",
		event => {
			last.key = performance.now();
			if (!modifiers.has(event.key)) modality("keyboard");
		},
		options,
	);
}

startInputTracking();

export function useInputTracking() {
	useEffect(startInputTracking, []);
}

export function pointerInitiated(source: "press" | "hover" = "press"): boolean {
	const pointer = source === "hover" ? Math.max(last.press, last.hover) : last.press;
	return pointer > last.key && performance.now() - pointer < pointerWindowMs;
}
