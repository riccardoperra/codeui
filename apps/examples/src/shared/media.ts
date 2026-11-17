import { createSignal, onCleanup } from "solid-js";

/** Inkstone has one breakpoint: 768px and below is a phone. */
export function createIsPhone() {
	const query = window.matchMedia("(max-width: 768px)");
	const [matches, setMatches] = createSignal(query.matches);
	const listener = () => setMatches(query.matches);
	query.addEventListener("change", listener);
	onCleanup(() => query.removeEventListener("change", listener));
	return matches;
}
