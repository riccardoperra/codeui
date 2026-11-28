import { IconButton, Text, Tooltip } from "@codeui/kit";
import Maximize2 from "@lucide/solid/icons/maximize-2";
import Minimize2 from "@lucide/solid/icons/minimize-2";
import X from "@lucide/solid/icons/x";
// The default `standalone` entry returns an inactive handle unless NODE_ENV is "development".
// This page is served from a production build, so it takes the entry that mounts everywhere.
import { mountProseMirrorDevtools } from "prosemirror-inspector/standalone/production";
import { createEffect, createSignal, onSettled, Show } from "solid-js";
import { createControlSize } from "../shared/size";
import { theme } from "../shared/theme";
import { useBench } from "./bench";
import { store } from "./devtools";

/**
 * The inspector, docked over the lower part of the content island. It is the library's own panel
 * and keeps its own look: the app only gives it a floating surface, a title and a way to close it.
 */
export default function InspectorDock(props: { onClose: () => void }) {
	const bench = useBench();
	const size = createControlSize();
	const [tall, setTall] = createSignal(false);
	let dock!: HTMLElement;
	let host!: HTMLDivElement;

	const options = () => ({ store, theme: theme(), activePanel: bench.panel(), onActivePanelChange: bench.setPanel });
	let panel: ReturnType<typeof mountProseMirrorDevtools> | undefined;
	onSettled(() => {
		if (bench.takeDockFocus()) dock.focus();
		panel = mountProseMirrorDevtools(host, options());
		return () => panel?.unmount();
	});
	createEffect(options, current => panel?.update(current));

	return (
		<section
			ref={dock}
			class={["pmi-dock", { "pmi-dock-tall": tall() }]}
			aria-label="ProseMirror Inspector"
			tabindex={-1}
			// Escape closes this layer when nothing inside the panel has used it.
			onKeyDown={event => event.key === "Escape" && !event.defaultPrevented && props.onClose()}
		>
			<header class="pmi-dock-header">
				<Text as="h2" size="sm" weight="semibold">
					ProseMirror Inspector
				</Text>
				<span class="ex-header-spacer" />
				<Tooltip content={tall() ? "Restore height" : "Expand"} placement="top">
					<IconButton variant="secondary" ghost size={size()} aria-label={tall() ? "Restore height" : "Expand"} onClick={() => setTall(value => !value)}>
						<Show when={tall()} fallback={<Maximize2 size={16} />}>
							<Minimize2 size={16} />
						</Show>
					</IconButton>
				</Tooltip>
				<Tooltip content="Close · esc" placement="top">
					<IconButton variant="secondary" ghost size={size()} aria-label="Close inspector" onClick={props.onClose}>
						<X size={16} />
					</IconButton>
				</Tooltip>
			</header>
			<div class="pmi-dock-body" ref={host} />
		</section>
	);
}
