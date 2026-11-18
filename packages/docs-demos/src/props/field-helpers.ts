import type { BaseFieldProps, FieldWithErrorMessageSupport } from "@codeui/kit";
import type { PropNotes } from "./notes";

/** Variants that createBaseFieldProps reads. */
export type BaseField = Pick<NonNullable<BaseFieldProps>, "size" | "theme">;

/** Props that createFieldErrorMessageProps reads. */
export type FieldErrorMessageSupport = Pick<FieldWithErrorMessageSupport, "errorMessage">;

export const notes = {
	BaseField: {
		size: { default: '"sm"', description: "Height, font size, and corner radius of the control." },
		theme: { default: '"filled"', description: "A filled box, or a bottom border only." },
	},
	FieldErrorMessageSupport: {
		errorMessage: { description: "The message to render. The helper passes it through unchanged." },
	},
} satisfies PropNotes;
