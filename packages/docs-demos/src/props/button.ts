import type { ComponentProps } from "solid-js";
import type { Button as KitButton, ButtonProps } from "@codeui/kit";
import type { PropNotes } from "./notes";

export type Button = Pick<ButtonProps, "variant" | "size" | "ghost" | "pill" | "block" | "loading" | "leftIcon" | "class">;
export type ButtonInherited = Pick<ComponentProps<typeof KitButton>, "disabled" | "as" | "type">;

export const notes = {
	Button: {
		"variant": { default: 'undefined', description: "Color scheme. No variant is selected by default." },
		"size": { default: '"sm"', description: "Control height, padding, and font size." },
		"ghost": { default: 'false', description: "Transparent idle fill with the variant colors on hover." },
		"pill": { default: 'false', description: "Uses fully rounded corners." },
		"block": { default: 'false', description: "Sets width to 100% and flex to 1." },
		"loading": { default: 'false', description: "Overlays animated dots, sets aria-busy and aria-disabled, and ignores activation. The button keeps focus." },
		"leftIcon": { default: 'undefined', description: "Element before the children. Hide decorative icons from assistive technology." },
		"class": { default: 'undefined', description: "Class merged after the kit styles." },
	},
	ButtonInherited: {
		"disabled": { default: 'false', description: "Disables native buttons. Non-native elements receive aria-disabled only." },
		"as": { default: '"button"', description: "Element or component to render." },
		"type": { default: '"button"', description: "Native button type. Use submit for a form submission." },
	},
} satisfies PropNotes;
