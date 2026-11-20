import type { StackProps } from "@codeui/kit";
import type { ValidComponent } from "@solidjs/web";
import type { PropNotes } from "./notes";

/** Props that Stack adds. Every other prop goes to the element that `as` names. */
export type Stack = Pick<
	StackProps<ValidComponent>,
	"direction" | "gap" | "align" | "justify" | "wrap" | "as" | "style" | "classes" | "class"
>;

export const notes = {
	Stack: {
		direction: { default: '"column"', description: "Main axis. Sets flex-direction." },
		gap: { default: '"2"', description: "Space between children, as a key of the space scale." },
		align: { default: '"stretch"', description: "Cross-axis alignment. Sets align-items." },
		justify: { default: '"start"', description: "Main-axis distribution. Sets justify-content." },
		wrap: { default: "false", description: "Lets children wrap onto new lines." },
		as: { default: '"div"', description: "Element or component to render." },
		style: { description: "Inline style, passed to the element as is." },
		classes: { description: "Classes keyed by part. The only key is root." },
		class: { description: "Class merged after the kit styles on the root." },
	},
} satisfies PropNotes;
