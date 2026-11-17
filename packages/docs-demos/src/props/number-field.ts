import type { NumberFieldLabel, NumberFieldProps } from "@codeui/kit";
import type { ComponentProps } from "solid-js";
import type { PropNotes } from "./notes";

/** Props that NumberField adds or changes on top of Kobalte's text field root. */
export type NumberField = Pick<
	NumberFieldProps,
	| "value"
	| "defaultValue"
	| "onChange"
	| "min"
	| "max"
	| "step"
	| "precision"
	| "prefix"
	| "postfix"
	| "label"
	| "description"
	| "errorMessage"
	| "placeholder"
	| "size"
	| "theme"
	| "classes"
	| "ref"
>;

/** Kobalte text field root options that NumberField passes through. */
export type NumberFieldInherited = Pick<
	NumberFieldProps,
	"validationState" | "required" | "disabled" | "readOnly" | "name" | "id"
>;

/** Props of NumberFieldLabel, Kobalte's TextField.Label with the kit label style. */
export type NumberFieldLabelProps = Pick<ComponentProps<typeof NumberFieldLabel>, "for" | "id" | "class" | "children">;

export const notes = {
	NumberField: {
		value: { description: "Controlled value. null means empty." },
		defaultValue: { description: "Value on first render, when uncontrolled." },
		onChange: { description: "Called with the parsed number on every edit, or null when the input is cleared." },
		min: { default: "Number.MIN_SAFE_INTEGER", description: "Lowest value. Applied on blur and by the step controls." },
		max: { default: "Number.MAX_SAFE_INTEGER", description: "Highest value. The mask blocks typing past it." },
		step: { default: "1", description: "Amount the buttons and the arrow keys add or remove." },
		precision: { default: "0", description: "Number of decimal digits the mask accepts." },
		prefix: { default: '""', description: "Text the mask keeps before the number." },
		postfix: { default: '""', description: "Text the mask keeps after the number." },
		label: { description: "Label above the input. Linked with for and id." },
		description: { description: "Hint under the input. Accepts JSX." },
		errorMessage: { description: 'Message under the input. Renders only when validationState is "invalid".' },
		size: { default: '"md"', description: "Height of the input, font size, and size of the step buttons." },
		theme: { default: '"filled"', description: "A filled box, or a bottom border only." },
		classes: { description: "Classes merged after the kit styles, one per part." },
		ref: { description: "Ref to the input element." },
	},
	NumberFieldInherited: {
		validationState: { description: 'Set "invalid" to show errorMessage and set aria-invalid.' },
		name: { default: "root id", description: "Name of the input in form data. The submitted value is the formatted text." },
		id: { description: "Root id. The input id becomes `${id}-input`." },
	},
} satisfies PropNotes;
