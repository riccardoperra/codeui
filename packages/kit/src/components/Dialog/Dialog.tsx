import type {
	DialogContentOptions as KDialogContentOptions,
	DialogRootOptions as KDialogRootOptions,
} from "@kobalte/core/dialog";
import { type JSX, type ParentProps, Show, splitProps } from "solid-js";
import * as D from "../../parts/dialog";

export type DialogProps = KDialogRootOptions &
	Pick<
		KDialogContentOptions,
		| "onOpenAutoFocus"
		| "onCloseAutoFocus"
		| "onEscapeKeyDown"
		| "onPointerDownOutside"
		| "onFocusOutside"
		| "onInteractOutside"
	> & {
		size?: D.DialogSize;
		title?: JSX.Element;
		description?: JSX.Element;
		/** Accessible name of the close button. Defaults to "close". */
		closeLabel?: string;
		/** Node the dialog is portaled into. Defaults to `document.body`. */
		mount?: Node;
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: Pick<
			D.DialogClasses,
			"overlay" | "positioner" | "panel" | "header" | "title" | "description" | "closeButton"
		>;
		"aria-label"?: string;
	};

export const DialogPanel = D.Content;
export const DialogPanelContent = D.Body;
export const DialogPanelFooter = D.Footer;

export function Dialog(props: ParentProps<DialogProps>) {
	const [local, content, others] = splitProps(
		props,
		["size", "children", "title", "description", "closeLabel", "mount", "classes"],
		[
			"aria-label",
			"onOpenAutoFocus",
			"onCloseAutoFocus",
			"onEscapeKeyDown",
			"onPointerDownOutside",
			"onFocusOutside",
			"onInteractOutside",
		],
	);
	return (
		<D.Root {...others}>
			<D.Portal mount={local.mount}>
				<D.Overlay class={local.classes?.overlay} />
				<D.Positioner size={local.size} class={local.classes?.positioner}>
					<D.Content {...content} size={local.size} class={local.classes?.panel}>
						<Show when={local.title}>
							<D.Header class={local.classes?.header}>
								<D.Title class={local.classes?.title}>{local.title}</D.Title>
								<D.CloseButton aria-label={local.closeLabel} class={local.classes?.closeButton} />
							</D.Header>
						</Show>
						<Show when={local.description}>
							<D.Description class={local.classes?.description}>{local.description}</D.Description>
						</Show>
						{local.children}
					</D.Content>
				</D.Positioner>
			</D.Portal>
		</D.Root>
	);
}
