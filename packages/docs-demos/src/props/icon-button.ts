import type { IconButton } from "@codeui/kit";
import type { ComponentProps } from "solid-js";
import type { PropNotes } from "./notes";

export type IconButton = Pick<ComponentProps<typeof IconButton>, "variant" | "size" | "ghost" | "pill" | "block" | "loading" | "class" | "aria-label">;
export type IconButtonInherited = Pick<ComponentProps<typeof IconButton>, "disabled" | "as" | "type">;

export const notes = {
	IconButton: {
		"variant": { default: 'undefined', description: "Color scheme. No variant is selected by default." },
		"size": { default: '"sm"', description: "Control height, padding, and font size." },
		"ghost": { default: 'false', description: "Transparent idle fill with the variant colors on hover." },
		"pill": { default: 'false', description: "Uses fully rounded corners." },
		"block": { default: 'false', description: "Sets width to 100% and flex to 1." },
		"loading": { default: 'false', description: "Overlays animated dots and blocks pointer events. Does not disable keyboard activation." },
		"class": { default: 'undefined', description: "Class merged after the kit styles." },
		"aria-label": { description: "Required accessible name for the icon button." },
	},
	IconButtonInherited: {
		"disabled": { default: 'false', description: "Disables native buttons. Non-native elements receive aria-disabled only." },
		"as": { default: '"button"', description: "Element or component to render." },
		"type": { default: '"button"', description: "Native button type. Use submit for a form submission." },
	},
} satisfies PropNotes;
