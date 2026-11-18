import type { ComboboxProps } from "@codeui/kit";
import type { ControlProps, RootProps } from "@codeui/kit/combobox/parts";
import type { PropNotes } from "./notes";

/** Props that the ready Combobox adds on top of Kobalte's combobox root. */
export type Combobox = Pick<
	ComboboxProps<string>,
	| "label"
	| "description"
	| "errorMessage"
	| "aria-label"
	| "aria-labelledby"
	| "inputValue"
	| "renderOption"
	| "emptyContent"
	| "mount"
	| "size"
	| "inputId"
	| "inputRef"
	| "class"
	| "classes"
>;

/** Kobalte combobox root options that Combobox passes through and that change behavior. */
export type ComboboxInherited = Pick<
	ComboboxProps<string>,
	| "options"
	| "value"
	| "defaultValue"
	| "onChange"
	| "onInputChange"
	| "placeholder"
	| "optionValue"
	| "optionTextValue"
	| "optionLabel"
	| "optionDisabled"
	| "defaultFilter"
	| "triggerMode"
	| "allowsEmptyCollection"
	| "noResetInputOnBlur"
	| "name"
	| "disabled"
	| "readOnly"
	| "required"
	| "validationState"
>;

/** The variant prop that every styled part from @codeui/kit/combobox/parts accepts. */
export type ComboboxPartVariants = Pick<ControlProps<unknown>, "size">;

/** Root props that matter when you compose the parts yourself. */
export type ComboboxRootPart = Pick<RootProps<unknown>, "size" | "options" | "itemComponent" | "sectionComponent">;

export const notes = {
	Combobox: {
		label: { description: "Label above the input." },
		description: { description: "Hint under the input, linked as the accessible description." },
		errorMessage: { description: 'Shown under the input when validationState is "invalid".' },
		"aria-label": { description: "Accessible name of the input when there is no visible label." },
		"aria-labelledby": { description: "Id of an element that names the input." },
		inputValue: { description: "Controlled input text, independent of the selected value." },
		renderOption: { description: "Renders each option in the list. Filtering still uses the text value." },
		emptyContent: { description: "Shown in the list when no option matches the text. Setting it keeps the list open." },
		mount: { default: "document.body", description: "Portal target, such as a parent dialog, so the list stays inside it." },
		size: { default: '"sm"', description: "Control height on the shared size and density scale." },
		inputId: { description: "Id of the input element." },
		inputRef: { description: "Receives the input element." },
		class: { description: "Class merged after the kit styles on the root." },
		classes: { description: "Classes for each part, keyed by part name. content targets the portalled list." },
	},
	ComboboxInherited: {
		options: { description: "Items of the list. Strings work as they are. Objects need optionValue, optionTextValue, and optionLabel." },
		value: { description: "Controlled selected option. Pass null for no selection." },
		defaultValue: { description: "Selected option on first render, when uncontrolled." },
		onChange: { description: "Called with the new option, or null when the selection is cleared." },
		onInputChange: { description: "Called when the input text changes, by typing or by a reset." },
		placeholder: { description: "Shown in the empty input." },
		optionValue: { description: "Key or function that gives each option a unique value." },
		optionTextValue: { description: "Key or function that gives the text used for filtering." },
		optionLabel: { description: "Key or function that gives the text the input shows after a selection." },
		optionDisabled: { description: "Key or function that marks an option as disabled." },
		defaultFilter: { type: '"contains" | "startsWith" | "endsWith" | ((option, inputValue) => boolean)', default: '"contains"', description: "How the text matches options. A function receives the option and the text." },
		triggerMode: { default: '"input"', description: "What opens the list: typing, focus, or the trigger button only." },
		allowsEmptyCollection: { description: "Keeps the list open when no option matches. Defaults to true when emptyContent is set." },
		noResetInputOnBlur: { default: "false", description: "Keeps the typed text on blur instead of restoring the selected label." },
		name: { description: "Submits the selected value under this name in a form." },
		disabled: { default: "false", description: "Disables the input and the trigger." },
		readOnly: { default: "false", description: "Keeps the value and blocks changes." },
		required: { default: "false", description: "Marks the field as required for assistive technology." },
		validationState: { description: 'Set to "invalid" to show errorMessage and mark the input invalid.' },
	},
	ComboboxPartVariants: {
		size: { default: "undefined", description: 'Sets data-size on the part. Control uses the shared height scale and defaults to "sm".' },
	},
	ComboboxRootPart: {
		size: { description: "Sets data-size on the root." },
		options: { description: "Items of the list." },
		itemComponent: { description: "Renders one option. Required. Compose Item, ItemLabel, and ItemIndicator inside it." },
		sectionComponent: { description: "Renders a section heading when options are grouped." },
	},
} satisfies PropNotes;
