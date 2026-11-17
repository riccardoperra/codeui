import type { DialogProps } from "@codeui/kit";
import type { CloseButtonProps, ContentProps, PositionerProps } from "@codeui/kit/dialog";
import type { PropNotes } from "./notes";

/** Props that Dialog adds on top of Kobalte's dialog root. */
export type Dialog = Pick<DialogProps, "title" | "description" | "size" | "closeLabel" | "mount" | "classes">;

/** Kobalte dialog root and content options that Dialog passes through. */
export type DialogInherited = Pick<
	DialogProps,
	| "open"
	| "defaultOpen"
	| "onOpenChange"
	| "modal"
	| "preventScroll"
	| "onEscapeKeyDown"
	| "onPointerDownOutside"
	| "onOpenAutoFocus"
	| "onCloseAutoFocus"
>;

/** Props of DialogPanel, the same component as the Content part. */
export type DialogPanel = Pick<ContentProps, "size" | "class">;

/** Props that the Positioner part adds to a div. */
export type DialogPositionerPart = Pick<PositionerProps, "size" | "class">;

/** Props that the Content part adds to Kobalte's Dialog.Content. */
export type DialogContentPart = Pick<ContentProps, "size" | "class" | "onCloseAutoFocus">;

/** Props that the CloseButton part changes on the kit IconButton. */
export type DialogCloseButtonPart = Pick<CloseButtonProps, "aria-label" | "children">;

export const notes = {
	Dialog: {
		title: { description: "Heading of the panel. Takes JSX. The header and its close button render only when it is set." },
		description: { description: "Text under the header. Takes JSX. Linked as the accessible description." },
		size: { description: "Width of the panel. full covers the viewport." },
		closeLabel: { default: '"close"', description: "Accessible name of the close button." },
		mount: { default: "document.body", description: "Node the dialog is portaled into." },
		classes: { type: "Pick<DialogClasses, …>", description: "Classes for the overlay, positioner, panel, header, title, description, and close button." },
	},
	DialogInherited: {
		open: { description: "Controlled open state." },
		defaultOpen: { description: "Open state on first render, when uncontrolled." },
		onOpenChange: { description: "Called when the dialog opens or closes." },
		modal: { default: "true", description: "Traps focus and makes the rest of the page inert." },
		preventScroll: { description: "Locks page scroll while the dialog is open." },
		onEscapeKeyDown: { description: "Called on Escape. Call preventDefault to keep the dialog open." },
		onPointerDownOutside: { description: "Called on a pointer down outside the panel." },
		onOpenAutoFocus: { description: "Called when focus moves into the panel. Call preventDefault to place focus yourself." },
		onCloseAutoFocus: {
			description: "Called when focus leaves on close. Call preventDefault to keep focus from returning to the opener.",
		},
	},
	DialogPanel: {
		size: { description: "Width of the panel. Pass the same value to the Positioner." },
		class: { description: "Class merged after the kit styles." },
	},
	DialogPositionerPart: {
		size: { description: "Sets data-panel-size. full removes the padding around the panel." },
		class: { description: "Class merged after the kit styles." },
	},
	DialogContentPart: {
		size: { description: "Width of the panel." },
		class: { description: "Class merged after the kit styles." },
		onCloseAutoFocus: {
			description: "Called on close. Without a Trigger part, focus returns to the element that had it when the dialog opened.",
		},
	},
	DialogCloseButtonPart: {
		"aria-label": { default: '"close"', description: "Accessible name of the button." },
		children: { default: "<CloseIcon />", description: "Icon inside the button." },
	},
} satisfies PropNotes;
