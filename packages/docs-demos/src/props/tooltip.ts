import type { ComponentProps } from "@solidjs/web";
import type { Tooltip as TooltipComponent } from "@codeui/kit";
import type { PropNotes } from "./notes";

type TooltipProps = ComponentProps<typeof TooltipComponent>;

/** Props that Tooltip adds on top of Kobalte's tooltip root. */
export type Tooltip = Pick<TooltipProps, "content" | "variant" | "slotClasses">;

/** Kobalte tooltip root options that change behavior. Some defaults are set by the kit. */
export type TooltipInherited = Pick<
	TooltipProps,
	"placement" | "gutter" | "shift" | "openDelay" | "closeDelay" | "disabled" | "open" | "defaultOpen" | "onOpenChange"
>;

export const notes = {
	Tooltip: {
		content: { description: "Content of the tooltip. Takes JSX." },
		variant: { default: '"primary"', description: "Color of the tooltip." },
		slotClasses: { description: "Classes for the trigger wrapper and the content." },
	},
	TooltipInherited: {
		placement: { default: '"bottom"', description: "Side and alignment against the trigger." },
		gutter: { default: "4", description: "Distance from the trigger, in pixels." },
		shift: { default: "0", description: "Offset along the trigger edge, in pixels." },
		openDelay: { default: "200", description: "Milliseconds of hover before it opens." },
		closeDelay: { default: "0", description: "Milliseconds before it closes after the pointer leaves." },
		disabled: { description: "Keeps the tooltip closed." },
		open: { description: "Controlled open state." },
		defaultOpen: { description: "Open state on first render, when uncontrolled." },
		onOpenChange: { description: "Called when the tooltip opens or closes." },
	},
} satisfies PropNotes;
