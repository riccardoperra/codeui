import type { Link } from "@codeui/kit";
import type { ComponentProps } from "@solidjs/web";
import type { PropNotes } from "./notes";

export type Link = Pick<ComponentProps<typeof Link>, "variant" | "class">;
export type LinkInherited = Pick<ComponentProps<typeof Link>, "disabled" | "as" | "href" | "target" | "rel">;

export const notes = {
	Link: {
		"variant": { default: 'undefined', description: "Underlines the link on hover." },
		"class": { default: 'undefined', description: "Class merged after the kit styles." },
	},
	LinkInherited: {
		"disabled": { default: 'false', description: "Removes href and sets aria-disabled." },
		"as": { default: '"a"', description: "Element or component to render." },
		"href": { default: 'undefined', description: "Navigation destination." },
		"target": { default: 'undefined', description: "Browsing context for navigation." },
		"rel": { default: 'undefined', description: "Relationship to the destination." },
	},
} satisfies PropNotes;
