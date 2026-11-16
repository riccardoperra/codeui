import type { DialogContentProps as KDialogContentProps } from "@kobalte/core/dialog";
import { type JSX, Show, splitProps } from "solid-js";
import * as S from "../../parts/sheet";
import { mergeClasses } from "../../utils/css";

export type SheetProps = Omit<S.RootProps, "children"> & {
	children?: JSX.Element;
	title?: JSX.Element;
	description?: JSX.Element;
	footer?: JSX.Element;
	/** Edge the sheet is attached to. Defaults to `bottom`. */
	side?: S.SheetSide;
	/** Node the sheet is portaled into. Defaults to `document.body`. */
	mount?: HTMLElement;
	/** Shows the close button in the header. Defaults to true. */
	showCloseButton?: boolean;
	/** Accessible name of the close button. Defaults to "close". */
	closeLabel?: string;
	/** Class of the sheet content. */
	class?: string;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: S.SheetClasses;
	"aria-label"?: string;
	contentProps?: Pick<
		KDialogContentProps,
		| "onOpenAutoFocus"
		| "onCloseAutoFocus"
		| "onPointerDownOutside"
		| "onFocusOutside"
		| "onInteractOutside"
		| "onEscapeKeyDown"
	>;
};

/**
 * A dialog attached to an edge of the viewport. Modal by default, with a
 * scrim. A nonmodal sheet has no scrim and leaves the page usable.
 */
export function Sheet(props: SheetProps) {
	const [local, root] = splitProps(props, [
		"children",
		"title",
		"description",
		"footer",
		"side",
		"mount",
		"showCloseButton",
		"closeLabel",
		"class",
		"classes",
		"aria-label",
		"contentProps",
	]);
	const showCloseButton = () => local.showCloseButton !== false;
	return (
		<S.Root {...root}>
			<S.Portal mount={local.mount}>
				<Show when={root.modal !== false}>
					<S.Overlay class={local.classes?.overlay} />
				</Show>
				<S.Content
					{...local.contentProps}
					side={local.side}
					aria-label={local["aria-label"]}
					class={mergeClasses(local.class, local.classes?.content)}
				>
					<Show when={local.title || showCloseButton()}>
						<S.Header class={local.classes?.header}>
							<Show when={local.title}>
								<S.Title class={local.classes?.title}>{local.title}</S.Title>
							</Show>
							<Show when={showCloseButton()}>
								<S.CloseButton
									aria-label={local.closeLabel}
									class={local.classes?.closeButton}
								/>
							</Show>
						</S.Header>
					</Show>
					<Show when={local.description}>
						<S.Description class={local.classes?.description}>{local.description}</S.Description>
					</Show>
					<S.Body class={local.classes?.body}>{local.children}</S.Body>
					<Show when={local.footer}>
						<S.Footer class={local.classes?.footer}>{local.footer}</S.Footer>
					</Show>
				</S.Content>
			</S.Portal>
		</S.Root>
	);
}
