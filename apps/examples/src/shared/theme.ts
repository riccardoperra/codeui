import { createSignal } from "solid-js";

export type Theme = "dark" | "light";

// The docs site keeps its theme under the same key, so a visitor who arrives from it keeps theirs.
const storageKey = "theme";

const read = (): Theme => (document.documentElement.getAttribute("data-cui-theme") === "light" ? "light" : "dark");

const [theme, setThemeSignal] = createSignal<Theme>(read());

export { theme };

export function setTheme(next: Theme) {
	document.documentElement.setAttribute("data-cui-theme", next);
	try {
		localStorage.setItem(storageKey, next);
	} catch {
		// Private windows can refuse storage. The theme still applies to this visit.
	}
	setThemeSignal(next);
}

export const toggleTheme = () => setTheme(theme() === "dark" ? "light" : "dark");
