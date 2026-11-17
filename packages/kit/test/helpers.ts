import { fireEvent, waitFor } from "solid-testing-library";

export function press(key: string) {
	const target = document.activeElement ?? document.body;
	fireEvent.keyDown(target, { key });
	fireEvent.keyUp(target, { key });
}

export function tick() {
	return new Promise(resolve => setTimeout(resolve, 0));
}

// Wait for the browser's actual CSS/WAAPI exit, without ending ancestor animations.
export async function expectDismissed(element: HTMLElement) {
	await waitFor(() => expect(element).not.toBeInTheDocument());
	await tick();
}
