import type { DialogContentProps as KDialogContentProps } from "@kobalte/core/dialog";
import { type JSX, Show, splitProps } from "solid-js";
import * as S from "../../parts/sheet";
import { mergeClasses } from "../../utils/css";

/** Only a bottom sheet can be dragged to dismiss. */
export type SheetPlacement =
	| {
			/** Edge the sheet is attached to. Defaults to `bottom`. */
			side?: "bottom";
			/** Shows a handle that closes the sheet on a tap or a downward drag. Defaults to false. */
			draggable?: boolean;
	  }
	| { side: "left" | "right"; draggable?: false };

export type SheetProps = SheetPlacement & SheetOptions;

type SheetOptions = Omit<S.RootProps, "children"> & {
	children?: JSX.Element;
	title?: JSX.Element;
	description?: JSX.Element;
	footer?: JSX.Element;
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
		"draggable",
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
					<Show when={local.draggable && (local.side ?? "bottom") === "bottom"}>
						<S.Handle aria-label={local.closeLabel} class={local.classes?.handle} />
					</Show>
					<Show
						when={local.title}
						fallback={
							<Show when={showCloseButton()}>
								<S.Header class={local.classes?.header}>
									<S.CloseButton aria-label={local.closeLabel} class={local.classes?.closeButton} />
								</S.Header>
							</Show>
						}
					>
						{title => (
							<S.Header class={local.classes?.header}>
								<S.Title class={local.classes?.title}>{title()}</S.Title>
								<Show when={showCloseButton()}>
									<S.CloseButton aria-label={local.closeLabel} class={local.classes?.closeButton} />
								</Show>
							</S.Header>
						)}
					</Show>
					<Show when={local.description}>
						{description => <S.Description class={local.classes?.description}>{description()}</S.Description>}
					</Show>
					<S.Body class={local.classes?.body}>{local.children}</S.Body>
					<Show when={local.footer}>
						{footer => <S.Footer class={local.classes?.footer}>{footer()}</S.Footer>}
					</Show>
				</S.Content>
			</S.Portal>
		</S.Root>
	);
}
