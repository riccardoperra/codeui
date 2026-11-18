import type { TextFieldLabel, TextFieldProps } from "@codeui/kit";
import type { ComponentProps } from "solid-js";
import type { PropNotes } from "./notes";

/** Props that TextField adds on top of Kobalte's text field root. */
export type TextField = Pick<
	TextFieldProps,
	"label" | "description" | "errorMessage" | "placeholder" | "size" | "theme" | "classes" | "ref"
>;

/** Kobalte text field root options that TextField passes through. */
export type TextFieldInherited = Pick<
	TextFieldProps,
	"value" | "defaultValue" | "onChange" | "validationState" | "required" | "disabled" | "readOnly" | "name" | "id"
>;

/** Native attributes that TextField sends to the input element instead of the root. */
export type TextFieldInputAttributes = Pick<
	TextFieldProps,
	| "type"
	| "autocomplete"
	| "inputmode"
	| "enterkeyhint"
	| "spellcheck"
	| "maxLength"
	| "minLength"
	| "pattern"
	| "autofocus"
	| "aria-label"
	| "aria-describedby"
>;

/** Props of TextFieldLabel, Kobalte's TextField.Label with the kit label style. */
export type TextFieldLabelProps = Pick<ComponentProps<typeof TextFieldLabel>, "for" | "id" | "class" | "children">;

export const notes = {
	TextField: {
		label: { description: "Label above the input. Linked to the input with for and id." },
		description: { description: "Hint under the input. Accepts JSX. Linked with aria-describedby." },
		errorMessage: { description: 'Message under the input. Renders only when validationState is "invalid".' },
		placeholder: { description: "Placeholder of the input." },
		size: { default: '"sm"', description: "Height of the input and font size of every part." },
		theme: { default: '"filled"', description: "A filled box, or a bottom border only." },
		classes: { description: "Classes merged after the kit styles, one per part." },
		ref: { description: "Ref to the input element, not the root." },
	},
	TextFieldInherited: {
		value: { description: "Controlled value." },
		defaultValue: { description: "Value on first render, when uncontrolled. A form reset restores it." },
		onChange: { description: "Called with the new string on every edit." },
		validationState: { description: 'Set "invalid" to show errorMessage and set aria-invalid.' },
		required: { description: "Sets required and aria-required on the input." },
		disabled: { description: "Disables the input and dims the field." },
		readOnly: { description: "Keeps the value selectable and blocks edits." },
		name: { default: "root id", description: "Name of the input in form data." },
		id: { description: "Root id. The input id becomes `${id}-input`." },
	},
	TextFieldInputAttributes: {
		type: { type: '"text" | "email" | "password" | "search" | "url" | … | string', default: '"text"', description: "Input type, such as email, url, or password." },
	},
} satisfies PropNotes;
