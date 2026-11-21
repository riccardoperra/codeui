import type { ComponentProps } from "@solidjs/web";
import type { DropdownMenu as Root, DropdownMenuItem as Item, DropdownSubMenu as Sub, DropdownSubMenuTrigger as SubTrigger } from "@codeui/kit";
import type { PropNotes } from "./notes";

type RootProps = ComponentProps<typeof Root<"div">>;
type ItemProps = ComponentProps<typeof Item<"div">>;
type SubProps = ComponentProps<typeof Sub<"div">>;
type SubTriggerProps = ComponentProps<typeof SubTrigger<"div">>;

/** Kobalte dropdown menu root options that change behavior. The kit only sets the gutter default. */
export type DropdownMenu = Pick<RootProps, "open" | "defaultOpen" | "onOpenChange" | "placement" | "gutter" | "modal">;

/** Props that DropdownMenuItem adds, and the Kobalte item options that change behavior. */
export type DropdownMenuItem = Pick<ItemProps, "rightSlot" | "onSelect" | "disabled" | "closeOnSelect" | "textValue" | "class">;

/** Kobalte submenu options that change behavior. The kit only sets the gutter default. */
export type DropdownSubMenu = Pick<SubProps, "open" | "defaultOpen" | "onOpenChange" | "gutter" | "shift">;

/** Props that DropdownSubMenuTrigger adds, and the Kobalte options that change behavior. */
export type DropdownSubMenuTrigger = Pick<SubTriggerProps, "rightSlot" | "disabled" | "textValue">;

export const notes = {
	DropdownMenu: {
		open: { description: "Controlled open state." },
		defaultOpen: { description: "Open state on first render, when uncontrolled." },
		onOpenChange: { description: "Called when the menu opens or closes." },
		placement: { default: '"bottom-start"', description: "Side and alignment of the menu against the trigger." },
		gutter: { default: "6", description: "Distance between the trigger and the menu, in pixels." },
		modal: { default: "true", description: "Makes the rest of the page inert while the menu is open." },
	},
	DropdownMenuItem: {
		rightSlot: { description: "Content aligned to the right, such as a shortcut." },
		onSelect: { description: "Called when the user chooses the item with a click, Enter, or Space." },
		disabled: { description: "Skips the item in keyboard navigation and ignores clicks." },
		closeOnSelect: { default: "true", description: "Closes the menu after onSelect." },
		textValue: { description: "Text used for typeahead when the label is not plain text." },
		class: { description: "Class merged after the kit styles." },
	},
	DropdownSubMenu: {
		open: { description: "Controlled open state of the submenu." },
		defaultOpen: { description: "Open state on first render, when uncontrolled." },
		onOpenChange: { description: "Called when the submenu opens or closes." },
		gutter: { default: "-4", description: "Distance from the parent menu, in pixels. The negative default overlaps the parent padding." },
		shift: { description: "Offset along the trigger edge, in pixels." },
	},
	DropdownSubMenuTrigger: {
		rightSlot: { description: "Content aligned to the right, such as an arrow." },
		disabled: { description: "Keeps the submenu closed and skips the trigger in keyboard navigation." },
		textValue: { description: "Text used for typeahead when the label is not plain text." },
	},
} satisfies PropNotes;
