import { type DialogContentProps as KDialogContentProps, useDialogContext } from "@kobalte/core/dialog";
import { createEffect } from "solid-js";
import { createLayer } from "../utils/layer-scope";

type FocusHandlers = Pick<
	KDialogContentProps,
	"onOpenAutoFocus" | "onCloseAutoFocus" | "onInteractOutside" | "onFocusOutside"
	| "onEscapeKeyDown" | "onPointerDownOutside"
>;

/**
 * Focus handlers for dialog and sheet content.
 *
 * Kobalte moves focus in two frames after opening, so these keep focus that
 * already moved inside. Kobalte returns focus to the Trigger part only; without
 * a Trigger, these return focus to the element that had it when the content
 * opened, unless a nonmodal dialog closed from an outside interaction.
 */
export function createDialogFocus(local: FocusHandlers) {
	const context = useDialogContext();
	const layer = createLayer({
		open: context.isOpen,
		modal: context.modal,
		ref: context.contentRef,
		close: context.close,
		onEscapeKeyDown: event => local.onEscapeKeyDown?.(event),
	});
	let opener: HTMLElement | null = null;
	let interactedOutside = false;

	// Focus has not moved in yet, so the opener still has it.
	createEffect(context.isOpen, open => {
		if (!open) return;
		opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		interactedOutside = false;
	});

	const handlers: Omit<Required<FocusHandlers>, "onEscapeKeyDown"> = {
		onOpenAutoFocus: event => {
			local.onOpenAutoFocus?.(event);
			if (!event.defaultPrevented && context.contentRef()?.contains(document.activeElement)) {
				event.preventDefault();
			}
		},
		onInteractOutside: event => {
			if (!layer.allowsOutsideInteraction(event)) return;
			local.onInteractOutside?.(event);
			if (!context.modal() && !event.defaultPrevented) interactedOutside = true;
		},
		onFocusOutside: event => {
			if (!layer.allowsOutsideInteraction(event)) return;
			local.onFocusOutside?.(event);
			if (!event.defaultPrevented && context.modal() && context.isOpen()) {
				context.contentRef()?.focus({ preventScroll: true });
			}
		},
		onPointerDownOutside: event => {
			if (layer.allowsOutsideInteraction(event)) local.onPointerDownOutside?.(event);
		},
		onCloseAutoFocus: event => {
			local.onCloseAutoFocus?.(event);
			const target = opener;
			opener = null;
			if (event.defaultPrevented || context.triggerRef() || interactedOutside) return;
			if (target?.isConnected) {
				event.preventDefault();
				target.focus({ preventScroll: true });
			}
		},
	};
	return { layer: layer.scope, props: { ...handlers, bypassTopMostLayerCheck: layer.bypassTopMostLayerCheck } };
}
