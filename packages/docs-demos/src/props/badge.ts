import type { BadgeProps } from "@codeui/kit";
import type { PropNotes } from "./notes";

/** Props that Badge adds. Kobalte's badge props are listed in Badge's inherited table. */
export type Badge = Pick<BadgeProps, "tone" | "size" | "variant" | "icon" | "classes" | "class">;

/** Props inherited from Kobalte's badge root that change behavior. */
export type BadgeInherited = Pick<BadgeProps, "textValue">;

export const notes = {
	Badge: {
		tone: { default: '"neutral"', description: "Status the badge reports. Sets the color." },
		size: { default: '"sm"', description: "Height and font size." },
		variant: { default: '"soft"', description: "A tinted fill, or a transparent fill with a border." },
		class: { description: "Class merged after the kit styles on the root." },
	},
} satisfies PropNotes;
