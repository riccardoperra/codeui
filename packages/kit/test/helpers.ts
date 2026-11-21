import { fireEvent, waitFor } from "@solidjs/testing-library";

export function press(key: string) {
	const target = document.activeElement ?? document.body;
	fireEvent.keyDown(target, { key });
	fireEvent.keyUp(target, { key });
}

export function tick() {
	return new Promise(resolve => setTimeout(resolve, 0));
}

// Kobalte's focus trap moves focus in, and back out, two frames after open and close.
export async function expectFocus(element: Element) {
	await waitFor(() => expect(element).toHaveFocus());
}

export async function expectFocusWithin(container: HTMLElement) {
	await waitFor(() => expect(container).toContainElement(document.activeElement as HTMLElement));
}

// Wait for the browser's actual CSS/WAAPI exit, without ending ancestor animations.
export async function expectDismissed(element: HTMLElement) {
	await waitFor(() => expect(element).not.toBeInTheDocument());
	await tick();
}
