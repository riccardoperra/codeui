import type {
	HoverCardContentProps,
	HoverCardGroupProps,
	HoverCardItemProps,
	HoverCardProps,
} from "@codeui/kit";
import type { PropNotes } from "./notes";

/** Props that HoverCard adds or changes on Kobalte's popover root. */
export type HoverCard = Pick<
	HoverCardProps,
	"openDelay" | "closeDelay" | "ignoreSafeArea" | "shared"
>;

/** Props of the group that gives its hover cards a surface of their own. */
export type HoverCardGroup = Pick<HoverCardGroupProps, "skipDelayDuration">;

/** Kobalte popover root options that change behavior. The kit sets the gutter default. */
export type HoverCardInherited = Pick<
	HoverCardProps,
	| "open"
	| "defaultOpen"
	| "onOpenChange"
	| "placement"
	| "gutter"
	| "shift"
	| "forceMount"
>;

/** Props that HoverCardContent adds on top of Kobalte's popover content. */
export type HoverCardContent = Pick<HoverCardContentProps, "mount" | "classes" | "class">;

/** Kobalte content options that HoverCardContent passes through. */
export type HoverCardContentInherited = Pick<
	HoverCardContentProps,
	"onEscapeKeyDown" | "onPointerDownOutside"
>;

/** Props of one line in a HoverCardList. */
export type HoverCardItem = Pick<
	HoverCardItemProps,
	"icon" | "iconLabel" | "identifier" | "depth" | "children" | "classes"
>;

export const notes = {
	HoverCard: {
		openDelay: {
			default: "500",
			description: "Milliseconds of hover or focus before the card opens.",
		},
		closeDelay: {
			default: "150",
			description:
				"Milliseconds before it closes after the pointer leaves the trigger and the card.",
		},
		ignoreSafeArea: {
			default: "false",
			description: "Closes as soon as the pointer leaves, even on its way to the card.",
		},
		shared: {
			default: "true",
			description:
				"Shares one card with the page or the nearest HoverCardGroup. With false, the card has its own.",
		},
	},
	HoverCardGroup: {
		skipDelayDuration: {
			default: "400",
			description:
				"Milliseconds after a card of the group closes during which the next one opens at once.",
		},
	},
	HoverCardInherited: {
		open: { description: "Controlled open state." },
		defaultOpen: { description: "Open state on first render, when uncontrolled." },
		onOpenChange: { description: "Called when the card opens or closes." },
		placement: {
			default: '"right-start"',
			description:
				"Side and alignment of the card against the trigger. It flips when there is no room.",
		},
		gutter: {
			default: "6",
			description: "Distance between the trigger and the card, in pixels.",
		},
		shift: { default: "0", description: "Offset along the trigger edge, in pixels." },
		forceMount: {
			description: "Keeps the card in the DOM while it is closed. The card gets a surface of its own.",
		},
	},
	HoverCardContent: {
		mount: { default: "document.body", description: "Node the card is portaled into." },
		classes: { description: "Classes for the content, keyed by part name." },
		class: { description: "Class merged after the kit styles on the card." },
	},
	HoverCardContentInherited: {
		onEscapeKeyDown: {
			description: "Called on Escape. Call preventDefault to keep the card open.",
		},
		onPointerDownOutside: { description: "Called on a pointer down outside the card." },
	},
	HoverCardItem: {
		icon: {
			description: "State icon, 16px. The slot stays empty without it, so entries align.",
		},
		iconLabel: {
			description: "Names the state, such as Running. Without it the icon is decorative.",
		},
		identifier: { description: "Short id before the title, in secondary text." },
		depth: {
			default: "0",
			description:
				"Nesting level. Each level indents by --cui-hovercard-item-indent (16px).",
		},
		children: { description: "The title, on one line, truncated." },
		classes: {
			description: "Classes keyed by part: item, itemIcon, itemId and itemTitle.",
		},
	},
} satisfies PropNotes;
