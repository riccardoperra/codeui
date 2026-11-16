import type { DialogProps } from "@codeui/kit";
import type { PropNotes } from "./notes";

/** Props that Dialog adds on top of Kobalte's dialog root. */
export type Dialog = Pick<DialogProps, "title" | "description" | "size" | "closeLabel" | "mount" | "classes">;

/** Kobalte dialog root and content options that Dialog passes through. */
export type DialogInherited = Pick<
	DialogProps,
	"open" | "defaultOpen" | "onOpenChange" | "modal" | "preventScroll" | "onEscapeKeyDown" | "onPointerDownOutside"
>;

export const notes = {
	Dialog: {
		title: { description: "Heading of the panel. The header and its close button render only when it is set." },
		description: { description: "Text under the header, linked as the accessible description." },
		size: { description: "Width of the panel." },
		closeLabel: { default: '"close"' },
		mount: { default: "document.body" },
	},
	DialogInherited: {
		open: { description: "Controlled open state." },
		defaultOpen: { description: "Open state on first render, when uncontrolled." },
		onOpenChange: { description: "Called when the dialog opens or closes." },
		onEscapeKeyDown: { description: "Called on Escape. Call preventDefault to keep the dialog open." },
		onPointerDownOutside: { description: "Called on a pointer down outside the panel." },
	},
} satisfies PropNotes;
