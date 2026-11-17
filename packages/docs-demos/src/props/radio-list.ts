import type { RadioListProps, RadioListItemProps } from "@codeui/kit";
import type { PropNotes } from "./notes";
export type RadioList = Pick<
	RadioListProps,
	"size" | "theme" | "label" | "description" | "errorMessage" | "classes"
>;
export type RadioListInherited = Pick<
	RadioListProps,
	| "value"
	| "defaultValue"
	| "onChange"
	| "orientation"
	| "disabled"
	| "readOnly"
	| "required"
	| "validationState"
	| "name"
>;
export type RadioListItem = Pick<RadioListItemProps, "label" | "classes">;
export type RadioListItemInherited = Pick<RadioListItemProps, "value" | "disabled">;
export const notes = {
	RadioList: {
		size: {
			description: "Control size.",
			default: '"md"',
		},
		theme: {
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
		classes: {
			description: "Classes merged onto the named parts.",
		},
	},
	RadioListInherited: {
		value: {
			description: "Controlled selection or submitted checkbox value.",
		},
		defaultValue: {
			description: "Initial uncontrolled value.",
		},
		onChange: {
			description: "Called when the selection or value changes.",
		},
		orientation: {
			description: "Direction of the control.",
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
	},
	RadioListItem: {
		label: {
			description: "Class or content for this part.",
		},
		classes: {
			description: "Class or content for this part.",
		},
	},
	RadioListItemInherited: {
		value: {
			description: "Controlled selection or submitted checkbox value.",
		},
		disabled: {
			description: "Prevent focus and interaction.",
			default: "false",
		},
	},
} satisfies PropNotes;
