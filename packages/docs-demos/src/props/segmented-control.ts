import type { SegmentedControlProps, SegmentedControlItemProps } from "@codeui/kit";
import type { PropNotes } from "./notes";
export type SegmentedControl = Pick<
	SegmentedControlProps,
	| "size"
	| "theme"
	| "variant"
	| "pill"
	| "fluid"
	| "autoWidth"
	| "classes"
	| "slotClasses"
	| "onEscapeKeyDown"
	| "value"
	| "defaultValue"
	| "onChange"
>;
export type SegmentedControlInherited = Pick<
	SegmentedControlProps,
	"disabled" | "activationMode"
>;
export type SegmentedControlItem = Pick<SegmentedControlItemProps, never>;
export type SegmentedControlItemInherited = Pick<
	SegmentedControlItemProps,
	"value" | "disabled"
>;
export const notes = {
	SegmentedControl: {
		size: {
			description: "Control size.",
			default: '"sm"',
		},
		theme: {
			description: "Field theme.",
			default: '"neutral"',
		},
		variant: {
			description: "Solid fill or bordered track.",
			default: '"solid"',
		},
		pill: {
			description: "Round the track and segments fully.",
			default: "false",
		},
		fluid: {
			description: "Fill the available width and keep the size height.",
			default: "false",
		},
		autoWidth: {
			description:
				"Set segment width to 1px with equal flex growth and no horizontal padding.",
			default: "false",
		},
		classes: {
			description: "Classes merged onto the named parts.",
		},
		slotClasses: {
			description: "Classes for named slots. Prefer classes where available.",
		},
		onEscapeKeyDown: {
			description: "Called before Escape is forwarded to the enclosing layer.",
		},
		value: {
			description: "Controlled value.",
		},
		defaultValue: {
			description: "Initial uncontrolled value.",
		},
		onChange: {
			description: "Called when the value changes.",
		},
	},
	SegmentedControlInherited: {
		disabled: {
			description: "Prevent focus and interaction.",
			default: "false",
		},
		activationMode: {
			description: "Select on activation or on focus.",
		},
	},
	SegmentedControlItemInherited: {
		value: {
			description: "Controlled selection or submitted checkbox value.",
		},
		disabled: {
			description: "Prevent focus and interaction.",
			default: "false",
		},
	},
} satisfies PropNotes;
