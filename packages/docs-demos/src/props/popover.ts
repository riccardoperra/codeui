import type { PopoverContentProps, PopoverProps } from "@codeui/kit";
import type { CloseButtonProps, ContentProps, RootProps } from "@codeui/kit/popover";
import type { PropNotes } from "./notes";

/** Kobalte popover root options that change behavior. The kit only sets the gutter default. */
export type Popover = Pick<
	PopoverProps,
	"open" | "defaultOpen" | "onOpenChange" | "placement" | "gutter" | "shift" | "modal"
>;

/** Props that PopoverContent adds on top of the Content part. */
export type PopoverContent = Pick<
	PopoverContentProps,
	"title" | "description" | "variant" | "mount" | "classes" | "class"
>;

/** Kobalte content options that PopoverContent passes through. */
export type PopoverContentInherited = Pick<
	PopoverContentProps,
	"onEscapeKeyDown" | "onPointerDownOutside" | "onOpenAutoFocus" | "onCloseAutoFocus"
>;

/** Props that the Root part changes on Kobalte's Popover root. */
export type PopoverRootPart = Pick<RootProps, "gutter">;

/** Props that the Content part adds to Kobalte's Popover.Content. */
export type PopoverContentPart = Pick<ContentProps, "variant" | "class">;

/** Props that the CloseButton part changes on the kit IconButton. */
export type PopoverCloseButtonPart = Pick<CloseButtonProps, "aria-label" | "children">;

export const notes = {
	Popover: {
		open: { description: "Controlled open state." },
		defaultOpen: { description: "Open state on first render, when uncontrolled." },
		onOpenChange: { description: "Called when the popover opens or closes." },
		placement: { default: '"bottom"', description: "Side and alignment of the panel against the trigger." },
		gutter: { default: "6", description: "Distance between the trigger and the panel, in pixels." },
		shift: { default: "0", description: "Offset along the trigger edge, in pixels." },
		modal: { default: "false", description: "Traps focus and makes the rest of the page inert." },
	},
	PopoverContent: {
		title: { description: "Heading of the panel. Takes JSX. Names the dialog." },
		description: { description: "Text under the title, rendered in a p element. Use inline content only." },
		variant: { description: "Adds a border to the panel." },
		mount: { default: "document.body", description: "Node the panel is portaled into." },
		classes: { description: "Classes for the content, the title, and the description." },
		class: { description: "Class merged after the kit styles on the panel." },
	},
	PopoverContentInherited: {
		onEscapeKeyDown: { description: "Called on Escape. Call preventDefault to keep the panel open." },
		onPointerDownOutside: { description: "Called on a pointer down outside the panel." },
		onOpenAutoFocus: { description: "Called when focus moves into the panel." },
		onCloseAutoFocus: { description: "Called when focus returns to the trigger." },
	},
	PopoverRootPart: {
		gutter: { default: "6", description: "Distance between the trigger and the panel, in pixels." },
	},
	PopoverContentPart: {
		variant: { description: "Adds a border to the panel." },
		class: { description: "Class merged after the kit styles." },
	},
	PopoverCloseButtonPart: {
		"aria-label": { default: '"close"', description: "Accessible name of the button." },
		children: { default: "<CloseIcon />", description: "Icon inside the button." },
	},
} satisfies PropNotes;
