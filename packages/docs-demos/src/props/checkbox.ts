import type { CheckBoxProps } from "@codeui/kit";
import type { PropNotes } from "./notes";
export type Checkbox = Pick<
	CheckBoxProps,
	"size" | "variant" | "label" | "description" | "errorMessage" | "ref" | "slotClasses"
>;
export type CheckboxInherited = Pick<
	CheckBoxProps,
	| "checked"
	| "defaultChecked"
	| "onChange"
	| "indeterminate"
	| "disabled"
	| "readOnly"
	| "required"
	| "validationState"
	| "name"
	| "value"
>;
export const notes = {
	Checkbox: {
		size: {
			description: "Control size.",
			default: '"md"',
		},
		variant: {
			description:
				"Accepts filled or inline from BaseFieldProps. This component currently ignores theme.",
		},
		label: {
			description: "Accessible visible label.",
		},
		description: {
			description: "Hint associated with the control.",
		},
		errorMessage: {
			description: "Message shown for invalid validation state.",
		},
		ref: {
			description: "Reference to the hidden checkbox input.",
		},
		slotClasses: {
			description: "Classes for named slots. Prefer classes where available.",
		},
	},
	CheckboxInherited: {
		checked: {
			description: "Controlled checked state.",
			default: "false",
		},
		defaultChecked: {
			description: "Initial checked state when uncontrolled.",
			default: "false",
		},
		onChange: {
			description: "Called when the selection or value changes.",
		},
		indeterminate: {
			description: "Expose a mixed selection state.",
			default: "false",
		},
		disabled: {
			description: "Prevent focus and interaction.",
			default: "false",
		},
		readOnly: {
			description: "Keep the value fixed while retaining focus.",
			default: "false",
		},
		required: {
			description: "Mark the field as required.",
			default: "false",
		},
		validationState: {
			description: "Validation state that controls the error message.",
		},
		name: {
			description: "Form submission field name.",
		},
		value: {
			description: "Controlled selection or submitted checkbox value.",
		},
	},
} satisfies PropNotes;
