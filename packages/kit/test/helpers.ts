import { fireEvent } from "solid-testing-library";

export function press(key: string) {
	const target = document.activeElement ?? document.body;
	fireEvent.keyDown(target, { key });
	fireEvent.keyUp(target, { key });
}

export function tick() {
	return new Promise(resolve => setTimeout(resolve, 0));
}

// jsdom never runs CSS animations, so end the exit animation the way a browser would.
export async function expectDismissed(element: HTMLElement) {
	for (let node: HTMLElement | null = element; node && node !== document.body; node = node.parentElement) {
		const end = new Event("animationend");
		Object.defineProperty(end, "animationName", { value: getComputedStyle(node).animationName });
		node.dispatchEvent(end);
	}
	await tick();
	expect(element).not.toBeInTheDocument();
}
