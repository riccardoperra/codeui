import type { CommandItem, CommandMenuProps } from "@codeui/kit";
import type {
	ContentProps,
	ItemIndicatorProps,
	ItemProps,
	ListboxProps,
	PortalProps,
	RootProps,
} from "@codeui/kit/command-menu";
import type { PropNotes } from "./notes";

/** Example shapes for the generic Content props. */
type Option = { id: string; label: string; disabled?: boolean };
type OptGroup = { name: string; options: Option[] };

/** Props of the ready CommandMenu. It owns every prop; nothing passes through to Kobalte. */
export type CommandMenu = Pick<
	CommandMenuProps<CommandItem>,
	| "open"
	| "onOpenChange"
	| "items"
	| "title"
	| "placeholder"
	| "hint"
	| "emptyContent"
	| "query"
	| "onQueryChange"
	| "filter"
	| "onHighlightChange"
	| "onSelect"
	| "onBeforeClose"
	| "onCancel"
	| "onCloseAutoFocus"
	| "mount"
	| "classes"
	| "class"
>;

/** The fields of one entry in `items`. */
export type CommandMenuItemFields = Pick<
	CommandItem,
	"id" | "textValue" | "label" | "description" | "leading" | "shortcut" | "group" | "section" | "disabled" | "current"
>;

/** Kobalte dialog root props that the Root part passes through. */
export type CommandMenuRootInherited = Pick<RootProps, "open" | "defaultOpen" | "onOpenChange" | "modal" | "preventScroll">;

/** Kobalte portal props that the Portal part passes through. */
export type CommandMenuPortalInherited = Pick<PortalProps, "mount">;

/** The engine props the Content part adds on top of the dialog content. */
export type CommandMenuContent = Pick<
	ContentProps<Option, OptGroup>,
	| "options"
	| "optionValue"
	| "optionTextValue"
	| "optionLabel"
	| "optionDisabled"
	| "optionGroupChildren"
	| "itemComponent"
	| "sectionComponent"
	| "defaultFilter"
	| "onInputChange"
	| "onHighlightChange"
	| "onSelect"
	| "class"
>;

/** Kobalte dialog content props that change how the Content part closes and moves focus. */
export type CommandMenuContentInherited = Pick<
	ContentProps<Option, OptGroup>,
	"onOpenAutoFocus" | "onCloseAutoFocus" | "onEscapeKeyDown" | "onPointerDownOutside" | "onInteractOutside"
>;

/** Kobalte combobox listbox props that the Listbox part passes through. */
export type CommandMenuListboxInherited = Pick<ListboxProps, "scrollRef" | "scrollToItem">;

/** Kobalte combobox item props that the Item part passes through. */
export type CommandMenuItemInherited = Pick<ItemProps, "item">;

/** Kobalte item indicator props that the ItemIndicator part passes through. */
export type CommandMenuItemIndicatorInherited = Pick<ItemIndicatorProps, "forceMount">;

export const notes = {
	CommandMenu: {
		open: { description: "Controlled open state. The menu has no uncontrolled mode." },
		onOpenChange: { description: "Called to open or close the menu. Runs after `onBeforeClose` and `onCancel` on close." },
		items: { description: "The commands. Ids must be unique. Consecutive items with the same group and section share a heading." },
		title: { description: "Accessible name of the dialog, the search field and the list. Not shown." },
		placeholder: { description: "Placeholder of the search field." },
		hint: { description: "Key hints at the end of the search field. Hidden from assistive technology and on phones." },
		emptyContent: { description: "Shown while no item matches the query. Nothing renders when it is unset." },
		query: { description: "Controlled query. Pair it with `onQueryChange`." },
		onQueryChange: { description: "Called on every keystroke, and with an empty string on close when the query is controlled." },
		filter: { default: "filterCommandItems", description: "Replaces the default filter. Return the items to show, in order." },
		onHighlightChange: { description: "Called with the highlighted item, or `undefined`, as the arrows or the pointer move. Use it to preview." },
		onSelect: { description: "Enter or a click on an item. Runs after the menu closes." },
		onBeforeClose: { description: "Runs first on every close, before `onCancel` and `onOpenChange`. Use it to end a preview." },
		onCancel: { description: "Runs on a close without a selection: Escape, a click outside, or `open` set to false." },
		onCloseAutoFocus: { description: "Called before focus returns on close. Call preventDefault to move focus yourself." },
		mount: { default: "document.body", description: "Portal target." },
		classes: { description: "Classes for each part, keyed by part name." },
		class: { description: "Class merged after the kit styles on the content." },
	},
	CommandMenuItemFields: {
		id: { description: "Unique across the items. A duplicate throws." },
		textValue: { description: "Plain text the default filter searches and typeahead reads." },
		label: { description: "What the row shows." },
		description: { description: "Secondary text after the label. The default filter searches it when it is a string." },
		leading: { description: "A 20px visual before the label, such as an icon or a theme swatch." },
		shortcut: { description: "Key label at the end of the row. Display only; the app binds the keys." },
		group: { description: "Heading of the group the item belongs to." },
		section: { description: "Prefix of the heading, shown as `Section / Group`." },
		disabled: { description: "Skipped by the arrows and not selectable." },
		current: { description: "Shows a check, to mark the value in use." },
	},
	CommandMenuContent: {
		options: { description: "Items, or groups of items when `optionGroupChildren` is set." },
		defaultFilter: { type: '"contains" | "startsWith" | "endsWith" | ((option, inputValue) => boolean)', description: "Filter the engine applies to the options. Pass `() => true` to filter the options yourself." },
		onHighlightChange: { description: "Called with the option under the highlight, or `undefined`." },
		onSelect: { description: "Called when Enter or a click picks an option. The part does not close the menu." },
		class: { description: "Class merged after the kit styles." },
	},
	CommandMenuItemIndicatorInherited: {
		forceMount: { description: "Pass it to show the indicator. The menu never keeps a selection of its own." },
	},
} satisfies PropNotes;
