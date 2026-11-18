import type { KbdProps } from "@codeui/kit";
import type { RootProps } from "@codeui/kit/kbd/parts";
import type { PropNotes } from "./notes";

/** Props that Kbd adds. Every other prop goes to the kbd element. */
export type Kbd = Pick<KbdProps, "size" | "variant" | "classes" | "class">;

/** Props of the Root part from @codeui/kit/kbd. */
export type KbdRoot = Pick<RootProps, "size" | "variant" | "class">;

export const notes = {
	Kbd: {
		size: { default: '"sm"', description: "Height, minimum width and font size." },
		variant: { default: '"keycap"', description: "A bordered keycap, or bare hint text." },
		classes: { description: "Classes keyed by part. The only key is root." },
		class: { description: "Class merged after the kit styles on the root." },
	},
	KbdRoot: {
		size: { default: '"sm"', description: "Height, minimum width and font size." },
		variant: { default: '"keycap"', description: "A bordered keycap, or bare hint text." },
		class: { description: "Class merged after the kit styles." },
	},
} satisfies PropNotes;
