import type { TextAreaLabel, TextAreaProps } from "@codeui/kit";
import type { ComponentProps } from "@solidjs/web";
import type { PropNotes } from "./notes";

/** Props that TextArea adds on top of Kobalte's text field root. */
export type TextArea = Pick<
	TextAreaProps,
	"label" | "description" | "errorMessage" | "placeholder" | "size" | "variant" | "options" | "classes" | "ref"
>;

/** Kobalte text field root options that TextArea passes through. */
export type TextAreaInherited = Pick<
	TextAreaProps,
	"value" | "defaultValue" | "onChange" | "validationState" | "required" | "disabled" | "readOnly" | "name" | "id"
>;

/** Props of TextAreaLabel, Kobalte's TextField.Label with the kit label style. */
export type TextAreaLabelProps = Pick<ComponentProps<typeof TextAreaLabel>, "for" | "id" | "class" | "children">;

export const notes = {
	TextArea: {
		label: { description: "Label above the textarea. Linked with for and id." },
		description: { description: "Hint under the textarea. Accepts JSX. Linked with aria-describedby." },
		errorMessage: { description: 'Message under the textarea. Renders only when validationState is "invalid".' },
		placeholder: { description: "Placeholder of the textarea." },
		size: { default: '"sm"', description: "Font size of every part. The textarea height follows its rows." },
		variant: { default: '"filled"', description: "A filled box, or a bottom border only." },
		options: { description: "Props for Kobalte's TextField.TextArea, such as autoResize and submitOnEnter." },
		classes: { description: "Classes merged after the kit styles, one per part." },
		ref: { description: "Ref to the textarea element, not the root." },
	},
	TextAreaInherited: {
		value: { description: "Controlled value." },
		defaultValue: { description: "Value on first render, when uncontrolled. A form reset restores it." },
		onChange: { description: "Called with the new string on every edit." },
		validationState: { description: 'Set "invalid" to show errorMessage and set aria-invalid.' },
		required: { description: "Sets required and aria-required on the textarea." },
		disabled: { description: "Disables the textarea and dims the field." },
		readOnly: { description: "Keeps the value selectable and blocks edits." },
		name: { default: "root id", description: "Name of the textarea in form data." },
		id: { description: "Root id. The textarea id becomes `${id}-input`." },
	},
} satisfies PropNotes;
