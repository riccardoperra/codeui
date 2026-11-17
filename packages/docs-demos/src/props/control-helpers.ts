import type {
	SwitchProps,
	SliderProps,
	OptionCardEntry,
	AccordionEntry,
} from "@codeui/kit";
import type { PropNotes } from "./notes";
export type SwitchHelperInput = Pick<
	SwitchProps,
	"label" | "description" | "errorMessage" | "inputId" | "classes"
>;
export type SliderHelperInput = Pick<
	SliderProps,
	"value" | "defaultValue" | "onChange" | "onChangeEnd" | "inputId" | "classes"
>;
export type OptionCardEntryMetadata = Pick<
	OptionCardEntry,
	"value" | "label" | "description" | "preview" | "badge" | "disabled"
>;
export type AccordionEntryMetadata = Pick<
	AccordionEntry,
	"value" | "title" | "summary" | "icon" | "disabled" | "content"
>;
export const notes = {
	SwitchHelperInput: {
		inputId: { description: "Base input ID used to derive label and message IDs." },
	},
	SliderHelperInput: {
		value: { description: "Scalar value mapped to a one-element array." },
		defaultValue: { description: "Initial scalar value mapped to a one-element array." },
	},
	OptionCardEntryMetadata: { value: { description: "Stable selection value." } },
	AccordionEntryMetadata: {
		content: { description: "Rendered panel content omitted from the helper result." },
	},
} satisfies PropNotes;
