import type { DialogProps } from "@codeui/kit";
import type {
	BodyProps,
	CloseButtonProps,
	ContentProps,
	NavItemProps,
	NavProps,
	PositionerProps,
	RootProps,
	SectionProps,
	SidebarProps,
} from "@codeui/kit/dialog";
import type { PropNotes } from "./notes";

/** Props that Dialog adds on top of Kobalte's dialog root. */
export type Dialog = Pick<
	DialogProps,
	"title" | "description" | "size" | "chrome" | "motion" | "closeLabel" | "mount" | "classes"
>;

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
export type DialogPanel = Pick<ContentProps, "size" | "chrome" | "class">;

/** Props that the Root part adds to Kobalte's dialog root. */
export type DialogRootPart = Pick<RootProps, "motion">;

/** Props that the Positioner part adds to a div. */
export type DialogPositionerPart = Pick<PositionerProps, "size" | "class">;

/** Props that the Content part adds to Kobalte's Dialog.Content. */
export type DialogContentPart = Pick<ContentProps, "size" | "chrome" | "class" | "onCloseAutoFocus">;

/** Props that the Body part adds to a div. */
export type DialogBodyPart = Pick<BodyProps, "layout" | "class">;

/** Props that the Sidebar part adds to a div. */
export type DialogSidebarPart = Pick<SidebarProps, "search" | "classes" | "class">;

/** Props that the Nav part adds to a nav. */
export type DialogNavPart = Pick<NavProps, "aria-label" | "class">;

/** Props that the NavItem part adds to a button. */
export type DialogNavItemPart = Pick<NavItemProps, "current" | "icon" | "classes" | "class">;

/** Props that the Section part adds to a section. */
export type DialogSectionPart = Pick<SectionProps, "title" | "variant" | "columns" | "classes" | "class">;

/** Props that the CloseButton part changes on the kit IconButton. */
export type DialogCloseButtonPart = Pick<CloseButtonProps, "aria-label" | "children">;

export const notes = {
	Dialog: {
		title: { description: "Heading of the panel. Takes JSX. The header and its close button render only when it is set." },
		description: { description: "Text under the header. Takes JSX. Linked as the accessible description." },
		size: {
			description: "Width of the panel. settings is 1000×680 and export 800 wide, both capped by the viewport. full covers the viewport.",
		},
		chrome: { default: '"bar"', description: "bar puts the title in a bar with a divider. inset puts it in the panel padding, with a ghost close button and 24px corners." },
		motion: { default: '"auto"', description: "auto animates opens and closes that start with a pointer. none never animates." },
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
		chrome: { default: '"bar"', description: "How the header sits in the panel." },
		class: { description: "Class merged after the kit styles." },
	},
	DialogPositionerPart: {
		size: { description: "Sets data-panel-size. full removes the padding around the panel." },
		class: { description: "Class merged after the kit styles." },
	},
	DialogRootPart: {
		motion: { default: '"auto"', description: "auto animates opens and closes that start with a pointer. none never animates." },
	},
	DialogContentPart: {
		size: { description: "Width of the panel." },
		chrome: { default: '"bar"', description: "bar or inset. inset also sets the defaults of CloseButton, Footer and Body." },
		class: { description: "Class merged after the kit styles." },
		onCloseAutoFocus: {
			description: "Called on close. Without a Trigger part, focus returns to the element that had it when the dialog opened.",
		},
	},
	DialogBodyPart: {
		layout: { description: "split puts the first child beside the second, 1.1fr to 1fr. One column at 768px and below." },
		class: { description: "Class merged after the kit styles." },
	},
	DialogSidebarPart: {
		search: { description: "Content above the navigation, such as a search field." },
		classes: { description: "Class for the sidebarSearch wrapper." },
		class: { description: "Class merged after the kit styles." },
	},
	DialogNavPart: {
		"aria-label": { description: "Accessible name of the navigation. Required." },
		class: { description: "Class merged after the kit styles." },
	},
	DialogNavItemPart: {
		current: { description: "Marks the section on screen with aria-current=\"page\" and a field fill." },
		icon: { description: "A 16px icon before the label. Hidden at 768px and below." },
		classes: { description: "Class for the navIcon wrapper." },
		class: { description: "Class merged after the kit styles." },
	},
	DialogSectionPart: {
		title: { description: "Heading of the section, an h3. group puts it over the island, well inside it." },
		variant: { default: '"group"', description: "group is a title over one island of rows. well makes the section the island." },
		columns: { default: "1", description: "2 lays the content out in two columns, one at 768px and below." },
		classes: { description: "Classes for the sectionTitle and sectionContent parts." },
		class: { description: "Class merged after the kit styles." },
	},
	DialogCloseButtonPart: {
		"aria-label": { default: '"close"', description: "Accessible name of the button." },
		children: { default: "<CloseIcon />", description: "Icon inside the button." },
	},
} satisfies PropNotes;
