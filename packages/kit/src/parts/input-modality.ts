let lastInput: { pointer: boolean; time: number } | undefined;
let listening = false;

/**
 * Starts recording whether the last input was a pointer press or a key. Call
 * it on mount, before the user can open an overlay. Safe to call many times.
 */
export function trackInput() {
	if (listening || typeof document === "undefined") return;
	listening = true;
	const record = (pointer: boolean) => () => {
		lastInput = { pointer, time: performance.now() };
	};
	document.addEventListener("pointerdown", record(true), true);
	document.addEventListener("keydown", record(false), true);
}

/**
 * An open or close counts as a pointer one when the last input was a pointer
 * press shortly before. Keyboard and programmatic changes do not move.
 */
export const pointerInitiated = () => !!lastInput?.pointer && performance.now() - lastInput.time < 1000;
