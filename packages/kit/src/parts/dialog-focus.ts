import { type DialogContentProps as KDialogContentProps, useDialogContext } from "@kobalte/core/dialog";

type FocusHandlers = Pick<KDialogContentProps, "onOpenAutoFocus" | "onCloseAutoFocus" | "onInteractOutside">;

/**
 * Kobalte returns focus to the Trigger part only. Without a Trigger, these
 * handlers return focus to the element that had it when the content opened,
 * unless a nonmodal dialog closed from an outside interaction.
 */
export function createFocusReturn(local: FocusHandlers): Required<FocusHandlers> {
	const context = useDialogContext();
	let opener: HTMLElement | null = null;
	let interactedOutside = false;

	return {
		onOpenAutoFocus: event => {
			opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			interactedOutside = false;
			local.onOpenAutoFocus?.(event);
		},
		onInteractOutside: event => {
			local.onInteractOutside?.(event);
			if (!context.modal() && !event.defaultPrevented) interactedOutside = true;
		},
		onCloseAutoFocus: event => {
			local.onCloseAutoFocus?.(event);
			const target = opener;
			opener = null;
			if (event.defaultPrevented || context.triggerRef() || interactedOutside) return;
			if (target?.isConnected) target.focus({ preventScroll: true });
		},
	};
}
