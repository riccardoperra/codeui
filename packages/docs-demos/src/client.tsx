import type { Component } from "solid-js";
import { hydrate, render } from "solid-js/web";

const demos = import.meta.glob<{ default: Component }>([
	"./demos/*.tsx",
	"./demos/*/*.tsx",
]);

export async function mount(name: string, el: HTMLElement) {
	const { default: Demo } = await demos[`./demos/${name}.tsx`]();
	return el.firstElementChild
		? hydrate(() => <Demo />, el, { renderId: name })
		: render(() => <Demo />, el);
}
