import { createContext, createEffect, isHydrating, useContext, type Accessor, type ParentProps } from "solid-js";
import { isServer } from "@solidjs/web";

type Layer = { parent: Layer | null; modal: Accessor<boolean> };
const Scope = createContext<Layer | null>(null);
const adoptedLayers = new WeakMap<Document, Set<Layer>>();

function topLayer(layers: Set<Layer>) {
	const parents = new Set<Layer>();
	for (const layer of layers) {
		for (let parent = layer.parent; parent; parent = parent.parent) parents.add(parent);
	}
	return [...layers].findLast(layer => !parents.has(layer));
}

/**
 * Wraps Kobalte content that renders a dismissable layer: dialog, sheet,
 * popover and list content.
 *
 * Kobalte joins its layer stack in `onSettled` and reads its own ref there.
 * Inside a Solid 2.0.3 `Portal`, that ref write has not committed yet, so the
 * layer never joins the stack: Escape, outside clicks and modal pointer
 * blocking stop working. A provider between the portal and the layer lets the
 * write commit first. Remove it once Kobalte registers the layer from an
 * effect on its ref.
 */
export function LayerScope(props: ParentProps<{ layer?: Layer }>) {
	const parent = useContext(Scope);
	return <Scope value={props.layer ?? parent}>{props.children}</Scope>;
}

export function useNestedLayerMarker() {
	const parent = useContext(Scope);
	// Kobalte's modal only exposes portaled descendants marked as top layers.
	return () => {
		for (let layer = parent; layer; layer = layer.parent) {
			if (layer.modal()) return "";
		}
	};
}

function containsPortaledTarget(element: HTMLElement | undefined, target: EventTarget | null) {
	for (let node = target; node instanceof Node;) {
		if (node === element) return true;
		// Solid links portal nodes to their declaration to route delegated events.
		const host = "_$host" in node ? node._$host : undefined;
		node = host instanceof Node ? host : node instanceof ShadowRoot ? node.host : node.parentNode;
	}
	return false;
}

export function createLayer(options: {
	open: Accessor<boolean>;
	modal: Accessor<boolean>;
	ref: Accessor<HTMLElement | undefined>;
	close: () => void;
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
}) {
	const layer: Layer = {
		parent: useContext(Scope),
		modal: () => options.open() && options.modal(),
	};
	const adopting = !isServer && isHydrating();
	let layers: Set<Layer> | undefined;

	// During hydration alpha.5 reads the layer ref before the server snapshot
	// is released. Let the live layers handle Escape first.
	createEffect(() => {
		const element = adopting && options.open() && options.ref();
		return element && { element, modal: options.modal() };
	}, active => {
		if (!active) return;
		const { element, modal } = active;
		const document = element.ownerDocument;
		const stack = adoptedLayers.get(document) ?? new Set<Layer>();
		adoptedLayers.set(document, stack);
		stack.add(layer);
		layers = stack;
		element.setAttribute("data-cui-adopted-layer", modal ? "modal" : "nonmodal");
		const window = document.defaultView;
		const onEscape = (event: KeyboardEvent) => {
			if (event.key !== "Escape" || event.repeat || event.defaultPrevented) return;
			if (topLayer(stack) !== layer) return;
			// Kobalte also listens on window. A newer layer's handler can run after this one.
			queueMicrotask(() => {
				if (event.defaultPrevented || !stack.has(layer)) return;
				options.onEscapeKeyDown?.(event);
				if (event.defaultPrevented) return;
				event.preventDefault();
				options.close();
			});
		};
		window?.addEventListener("keydown", onEscape);
		return () => {
			window?.removeEventListener("keydown", onEscape);
			element.removeAttribute("data-cui-adopted-layer");
			stack.delete(layer);
			layers = undefined;
		};
	}, { ssrSource: "client" });
	return {
		scope: layer,
		bypassTopMostLayerCheck: adopting,
		allowsOutsideInteraction(event: Event) {
			if (
				(adopting && (!layers || topLayer(layers) !== layer)) ||
				containsPortaledTarget(options.ref(), event.target)
			) {
				event.preventDefault();
				return false;
			}
			return true;
		},
	};
}
