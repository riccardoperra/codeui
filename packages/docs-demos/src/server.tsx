import type { Component } from "solid-js";
import { generateHydrationScript, renderToString } from "@solidjs/web";

const demos = import.meta.glob<{ default: Component }>(["./demos/*.tsx", "./demos/*/*.tsx"], { eager: true });

export const hydrationScript = () => generateHydrationScript();

export function renderDemo(name: string) {
	const demo = demos[`./demos/${name}.tsx`];
	if (!demo) throw new Error(`Unknown demo "${name}". Add packages/docs-demos/src/demos/${name}.tsx.`);
	return renderToString(() => <demo.default />, { renderId: name });
}
