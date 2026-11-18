import type { SheetProps } from "@codeui/kit";
import type * as Parts from "@codeui/kit/sheet/parts";
import type { ComponentProps } from "solid-js";
import type { PropNotes } from "./notes";

export type Sheet = Pick<SheetProps, "side" | "draggable" | "title" | "description" | "footer" | "mount" | "showCloseButton" | "closeLabel" | "class" | "classes" | "aria-label" | "contentProps" | "motion">;
export type SheetInherited = Pick<SheetProps, "open" | "defaultOpen" | "onOpenChange" | "modal" | "preventScroll">;
export type SheetRoot = Pick<Parts.RootProps, "motion">;
export type SheetRootInherited = Pick<Parts.RootProps, "open" | "defaultOpen" | "onOpenChange" | "modal" | "preventScroll">;
export type SheetContent = Pick<Parts.ContentProps, "side" | "class">;
export type SheetContentInherited = Pick<Parts.ContentProps, "onOpenAutoFocus" | "onCloseAutoFocus" | "onInteractOutside" | "onEscapeKeyDown">;
export type SheetCloseButton = Pick<Parts.CloseButtonProps, "aria-label" | "class">;
export type SheetCloseButtonInherited = Pick<Parts.CloseButtonProps, "disabled">;
export type SheetHandle = Pick<Parts.HandleProps, "aria-label" | "class">;
export type SheetHandleInherited = Pick<Parts.HandleProps, "disabled">;
export type SheetBody = Pick<ComponentProps<typeof Parts.Body>, "class">;
export type SheetHeader = Pick<ComponentProps<typeof Parts.Header>, "class">;
export type SheetFooter = Pick<ComponentProps<typeof Parts.Footer>, "class">;
export type SheetOverlay = Pick<ComponentProps<typeof Parts.Overlay>, "class">;
export type SheetPortal = Pick<ComponentProps<typeof Parts.Portal>, never>;
export type SheetPortalInherited = Pick<ComponentProps<typeof Parts.Portal>, "mount">;
export type SheetTitle = Pick<ComponentProps<typeof Parts.Title>, "class">;
export type SheetDescription = Pick<ComponentProps<typeof Parts.Description>, "class">;
export type SheetTrigger = Pick<ComponentProps<typeof Parts.Trigger>, "class">;
export type SheetTriggerInherited = Pick<ComponentProps<typeof Parts.Trigger>, "disabled">;

export const notes = {
	SheetRootInherited: {
		"open": { description: 'Controlled open state.' },
		"defaultOpen": { default: 'false', description: 'Initial uncontrolled open state.' },
		"onOpenChange": { description: 'Receives the next open state.' },
		"modal": { default: 'true', description: 'Traps focus and blocks interaction outside the sheet.' },
		"preventScroll": { default: 'modal', description: 'Prevents page scrolling while open.' },
	},
	SheetContentInherited: {
		onOpenAutoFocus: { description: "Cancellable event before focus enters the sheet." },
		onCloseAutoFocus: { description: "Cancellable event before focus returns to the opener." },
		onInteractOutside: { description: "Cancellable event for interaction outside the sheet." },
		onEscapeKeyDown: { description: "Cancellable event before Escape dismisses the sheet." },
	},
	SheetPortalInherited: { mount: { default: "document.body", description: "Browser destination for the portal." } },
	SheetCloseButtonInherited: { disabled: { default: "false", description: "Disables the close action." } },
	SheetHandleInherited: { disabled: { default: "false", description: "Disables the handle." } },
	SheetTriggerInherited: { disabled: { default: "false", description: "Disables the trigger." } },
	Sheet: {
		"side": { default: '"bottom"', description: 'Viewport edge for the content.' },
		"draggable": { default: 'false', description: 'Adds the dismiss handle to a bottom sheet.' },
		"title": { description: 'Accessible sheet heading.' },
		"description": { description: 'Description linked to the sheet.' },
		"footer": { description: 'Actions rendered below the body.' },
		"mount": { default: 'document.body', description: 'Portal destination in the browser.' },
		"showCloseButton": { default: 'true', description: 'Includes the close button in the header.' },
		"closeLabel": { default: '"close"', description: 'Accessible name for the close button and handle.' },
		"class": { description: 'Class merged after the kit styles.' },
		"classes": { description: 'Classes keyed by the names in the anatomy table.' },
		"aria-label": { description: 'Accessible name when no title is provided.' },
		"contentProps": { type: "Pick<DialogContentProps, …>", description: 'Focus and outside interaction handlers forwarded to Content.' },
		"motion": { default: '"auto"', description: 'Animates pointer actions. Keyboard actions remain instant.' },
	},
	SheetInherited: {
		"open": { description: 'Controlled open state.' },
		"defaultOpen": { default: 'false', description: 'Initial uncontrolled open state.' },
		"onOpenChange": { description: 'Receives the next open state.' },
		"modal": { default: 'true', description: 'Traps focus and blocks interaction outside the sheet.' },
		"preventScroll": { default: 'modal', description: 'Prevents page scrolling while open.' },
	},
	SheetRoot: {
		"motion": { default: '"auto"', description: 'Animates pointer actions. Keyboard actions remain instant.' },
	},
	SheetContent: {
		"side": { default: '"bottom"', description: 'Viewport edge for the content.' },
		"class": { description: 'Class merged after the kit styles.' },
	},
	SheetCloseButton: {
		"aria-label": { default: '"close"', description: 'Accessible name.' },
		"class": { description: 'Class merged after the kit styles.' },
	},
	SheetHandle: {
		"aria-label": { default: '"close"', description: 'Accessible name.' },
		"class": { description: 'Class merged after the kit styles.' },
	},
	SheetBody: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	SheetHeader: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	SheetFooter: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	SheetOverlay: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	SheetPortal: {
	},
	SheetTitle: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	SheetDescription: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	SheetTrigger: {
		"class": { description: 'Class merged after the kit styles.' },
	},
} satisfies PropNotes;
