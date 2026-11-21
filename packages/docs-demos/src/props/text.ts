import type { TextProps } from "@codeui/kit";
import type { ValidComponent } from "@solidjs/web";
import type { PropNotes } from "./notes";

/** Props that Text adds. Every other prop goes to the element that `as` names. */
export type Text = Pick<TextProps<ValidComponent>, "size" | "weight" | "tone" | "as" | "classes" | "class">;

export const notes = {
	Text: {
		size: { default: '"sm"', description: "Font size, as a key of the --cui-font-size-* scale." },
		weight: { default: '"normal"', description: "Font weight, as a key of the --cui-font-weight-* scale." },
		tone: { default: '"default"', description: "Text color role." },
		as: { default: '"span"', description: "Element or component to render, such as h2 or p." },
		classes: { description: "Classes keyed by part. The only key is root." },
		class: { description: "Class merged after the kit styles on the root." },
	},
} satisfies PropNotes;
