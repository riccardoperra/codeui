import type { SliderProps } from "@codeui/kit";
import type { PropNotes } from "./notes";
export type Slider = Pick<
	SliderProps,
	| "value"
	| "defaultValue"
	| "onChange"
	| "onChangeEnd"
	| "showValue"
	| "label"
	| "description"
	| "errorMessage"
	| "classes"
	| "class"
	| "inputId"
>;
export type SliderInherited = Pick<
	SliderProps,
	| "minValue"
	| "maxValue"
	| "step"
	| "orientation"
	| "disabled"
	| "readOnly"
	| "required"
	| "validationState"
	| "name"
	| "getValueLabel"
>;
import type * as P from "@codeui/kit/slider";
export type SliderDescription = Pick<P.DescriptionProps, "orientation">;
export type SliderErrorMessage = Pick<P.ErrorMessageProps, "orientation">;
export type SliderFill = Pick<P.FillProps, "orientation">;
export type SliderInput = Pick<P.InputProps, never>;
export type SliderLabel = Pick<P.LabelProps, "orientation">;
export type SliderRoot = Pick<P.RootProps, "orientation">;
export type SliderThumb = Pick<P.ThumbProps, "orientation">;
export type SliderTrack = Pick<P.TrackProps, "orientation">;
export type SliderValueLabel = Pick<P.ValueLabelProps, "orientation">;
export type SliderRootInherited = Pick<
	P.RootProps,
	"value" | "defaultValue" | "onChange" | "onChangeEnd"
>;
export const notes = {
	Slider: {
		value: {
			description: "Controlled value.",
		},
		defaultValue: {
			description: "Initial uncontrolled value.",
		},
		onChange: {
			description: "Called when the value changes.",
		},
		onChangeEnd: {
			description: "Called when an interaction finishes.",
		},
		showValue: {
			description: "Render the formatted value label.",
			default: "false",
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
		class: {
			description: "Class merged onto the root.",
		},
		inputId: {
			description: "Stable ID for the form input.",
		},
	},
	SliderDescription: {
		orientation: {
			description: "Direction of the slider.",
		},
	},
	SliderErrorMessage: {
		orientation: {
			description: "Direction of the slider.",
		},
	},
	SliderFill: {
		orientation: {
			description: "Direction of the slider.",
		},
	},
	SliderInput: {},
	SliderLabel: {
		orientation: {
			description: "Direction of the slider.",
		},
	},
	SliderRoot: {
		orientation: {
			description: "Direction of the slider.",
		},
	},
	SliderThumb: {
		orientation: {
			description: "Direction of the slider.",
		},
	},
	SliderTrack: {
		orientation: {
			description: "Direction of the slider.",
		},
	},
	SliderValueLabel: {
		orientation: {
			description: "Direction of the slider.",
		},
	},
	SliderInherited: {
		minValue: {
			description: "Minimum allowed value.",
		},
		maxValue: {
			description: "Maximum allowed value.",
		},
		step: {
			description: "Value increment.",
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
		getValueLabel: {
			description: "Format the visible and accessible value.",
		},
	},
	SliderRootInherited: {
		value: {
			description: "Controlled selection or submitted checkbox value.",
		},
		defaultValue: {
			description: "Initial uncontrolled value.",
		},
		onChange: {
			description: "Called when the selection or value changes.",
		},
		onChangeEnd: {
			description: "Called when an interaction finishes.",
		},
	},
} satisfies PropNotes;
