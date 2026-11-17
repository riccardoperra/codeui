import type { ComponentProps } from "solid-js";
import type { Button as KitButton, ButtonProps } from "@codeui/kit";
import type { PropNotes } from "./notes";

export type Button = Pick<ButtonProps, "theme" | "size" | "variant" | "pill" | "block" | "loading" | "leftIcon" | "class">;
export type ButtonInherited = Pick<ComponentProps<typeof KitButton>, "disabled" | "as" | "type">;

export const notes = {
	Button: {
		"theme": { default: 'undefined', description: "Color scheme. No theme is selected by default." },
		"size": { default: '"md"', description: "Control height, padding, and font size." },
		"variant": { default: 'undefined', description: "Transparent idle fill with theme colors on hover." },
		"pill": { default: 'false', description: "Uses fully rounded corners." },
		"block": { default: 'false', description: "Sets width to 100% and flex to 1." },
		"loading": { default: 'false', description: "Overlays animated dots and blocks pointer events. Does not disable keyboard activation." },
		"leftIcon": { default: 'undefined', description: "Element before the children. Hide decorative icons from assistive technology." },
		"class": { default: 'undefined', description: "Class merged after the kit styles." },
	},
	ButtonInherited: {
		"disabled": { default: 'false', description: "Disables native buttons. Non-native elements receive aria-disabled only." },
		"as": { default: '"button"', description: "Element or component to render." },
		"type": { default: '"button"', description: "Native button type. Use submit for a form submission." },
	},
} satisfies PropNotes;
