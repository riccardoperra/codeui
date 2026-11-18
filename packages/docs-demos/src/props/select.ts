import type { ComponentProps } from "solid-js";
import type { Select as KitSelect } from "@codeui/kit";
import type { PropNotes } from "./notes";

type SelectProps = ComponentProps<typeof KitSelect>;

/** Props that Select adds on top of Kobalte's select root. */
export type Select = Pick<
	SelectProps,
	| "aria-label"
	| "label"
	| "placeholder"
	| "description"
	| "errorMessage"
	| "itemLabel"
	| "valueComponent"
	| "valueComponentMultiple"
	| "size"
	| "variant"
	| "classes"
	| "slotClasses"
>;

/** Kobalte select root options that Select passes through and that change behavior. */
export type SelectInherited = Pick<
	SelectProps,
	| "options"
	| "value"
	| "defaultValue"
	| "onChange"
	| "multiple"
	| "optionValue"
	| "optionTextValue"
	| "optionDisabled"
	| "disabled"
	| "readOnly"
	| "required"
	| "name"
	| "validationState"
	| "open"
	| "defaultOpen"
	| "onOpenChange"
>;

export const notes = {
	Select: {
		"aria-label": { description: "Accessible name of the trigger. Needed only when there is no visible label." },
		label: { description: "Label above the trigger." },
		placeholder: { description: "Shown in the trigger when nothing is selected." },
		description: { description: "Hint under the trigger, linked as the accessible description." },
		errorMessage: { description: 'Shown under the trigger when validationState is "invalid".' },
		itemLabel: { description: "Renders the label of each item in the list. Required for object options." },
		valueComponent: { description: "Renders the selected option in the trigger. Required for object options." },
		valueComponentMultiple: { description: 'Renders the selected options when multiple is set. Defaults to the options joined by ", ".' },
		size: { default: '"sm"', description: "Height, radius, and font size of the trigger." },
		variant: { default: '"filled"', description: "Filled box, or a transparent trigger with a bottom border." },
		classes: { description: "Classes for each part, keyed by part name. content targets the portalled list." },
		slotClasses: { description: "Deprecated. Use classes." },
	},
	SelectInherited: {
		options: { description: "Items of the list. Strings work as they are. Objects need optionValue and optionTextValue." },
		value: { description: "Controlled selected option. An array when multiple is set." },
		defaultValue: { description: "Selected option on first render, when uncontrolled." },
		onChange: { description: "Called with the new option, or null when the selection is cleared." },
		multiple: { default: "false", description: "Allows more than one selected option." },
		optionValue: { description: "Key or function that gives each option a unique value." },
		optionTextValue: { description: "Key or function that gives the text used for type-ahead." },
		optionDisabled: { description: "Key or function that marks an option as disabled." },
		disabled: { default: "false", description: "Disables the trigger." },
		readOnly: { default: "false", description: "Keeps the value and blocks changes." },
		required: { default: "false", description: "Marks the field as required for assistive technology." },
		name: { description: "Name the selected value submits under in a form, through one hidden input per value." },
		validationState: { description: 'Set to "invalid" to show errorMessage and mark the trigger invalid.' },
		open: { description: "Controlled open state of the list." },
		defaultOpen: { description: "Open state on first render, when uncontrolled." },
		onOpenChange: { description: "Called when the list opens or closes." },
	},
} satisfies PropNotes;
