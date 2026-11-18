import type { SwitchProps } from "@codeui/kit";
import type { PropNotes } from "./notes";
export type Switch = Pick<
	SwitchProps,
	"size" | "label" | "description" | "errorMessage" | "inputId" | "classes" | "class"
>;
export type SwitchInherited = Pick<
	SwitchProps,
	| "checked"
	| "defaultChecked"
	| "onChange"
	| "disabled"
	| "readOnly"
	| "required"
	| "validationState"
	| "name"
	| "value"
>;
import type * as P from "@codeui/kit/switch/parts";
export type SwitchControl = Pick<P.ControlProps, "size">;
export type SwitchDescription = Pick<P.DescriptionProps, "size">;
export type SwitchErrorMessage = Pick<P.ErrorMessageProps, "size">;
export type SwitchInput = Pick<P.InputProps, "size">;
export type SwitchLabel = Pick<P.LabelProps, "size">;
export type SwitchRoot = Pick<P.RootProps, "size">;
export type SwitchThumb = Pick<P.ThumbProps, "size">;
export type SwitchRootInherited = Pick<
	P.RootProps,
	"checked" | "defaultChecked" | "onChange"
>;
export const notes = {
	Switch: {
		size: {
			description: "Control size.",
			default: '"md"',
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
		inputId: {
			description: "Stable ID for the form input.",
		},
		classes: {
			description: "Classes merged onto the named parts.",
		},
		class: {
			description: "Class merged onto the root.",
		},
	},
	SwitchControl: {
		size: {
			description: "Control size.",
		},
	},
	SwitchDescription: {
		size: {
			description: "Control size.",
		},
	},
	SwitchErrorMessage: {
		size: {
			description: "Control size.",
		},
	},
	SwitchInput: {
		size: {
			description: "Control size.",
		},
	},
	SwitchLabel: {
		size: {
			description: "Control size.",
		},
	},
	SwitchRoot: {
		size: {
			description: "Control size.",
		},
	},
	SwitchThumb: {
		size: {
			description: "Control size.",
		},
	},
	SwitchInherited: {
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
	SwitchRootInherited: {
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
	},
} satisfies PropNotes;
