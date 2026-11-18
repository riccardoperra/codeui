"use client";

import { errorMessage } from "@codeui/styles/fielderror";
import { label } from "@codeui/styles/fieldlabel";
import { description } from "@codeui/styles/fieldmessage";
import { textAreaStyleProps } from "@codeui/styles/textarea";
import { textFieldStyleProps } from "@codeui/styles/textfield";
import { useContext, type ComponentProps } from "react";
import {
	FieldError as AriaFieldError,
	Input,
	Label,
	Text,
	TextArea,
	composeRenderProps,
} from "react-aria-components";
import { classes } from "../classes";
import { FieldAppearanceContext, type FieldAppearance } from "./field-appearance";

export type { FieldAppearance };

export type FieldLabelProps = ComponentProps<typeof Label>;

/** The field label. Inside a React Aria field it labels the input. */
export function FieldLabel({ className, ...props }: FieldLabelProps) {
	return <Label {...props} className={classes(label, className)} />;
}

export type FieldDescriptionProps = ComponentProps<typeof Text>;

/** One line of help under the input, wired to `aria-describedby` by the field. */
export function FieldDescription({ className, ...props }: FieldDescriptionProps) {
	return (
		<Text slot="description" {...props} className={classes(description, className)} />
	);
}

export type FieldErrorProps = ComponentProps<typeof AriaFieldError>;

/** The validation message. It renders only while the field is invalid. */
export function FieldError({ className, ...props }: FieldErrorProps) {
	return (
		<AriaFieldError
			{...props}
			className={composeRenderProps(className, className =>
				classes(errorMessage, className),
			)}
		/>
	);
}

export type FieldInputProps = ComponentProps<typeof Input> & FieldAppearance;

/** The text input of a TextField. Size and variant default to the enclosing field's. */
export function FieldInput({ size, variant, className, ...props }: FieldInputProps) {
	const field = useContext(FieldAppearanceContext);
	const { class: root, ...appearance } = textFieldStyleProps.input({
		size: size ?? field.size,
		variant: variant ?? field.variant,
	});
	return (
		<Input
			{...appearance}
			{...props}
			className={composeRenderProps(className, className => classes(root, className))}
		/>
	);
}

export type FieldTextAreaProps = ComponentProps<typeof TextArea> & FieldAppearance;

/** The textarea of a TextArea field. Size and variant default to the enclosing field's. */
export function FieldTextArea({
	size,
	variant,
	className,
	...props
}: FieldTextAreaProps) {
	const field = useContext(FieldAppearanceContext);
	const { class: root, ...appearance } = textAreaStyleProps.input({
		size: size ?? field.size,
		variant: variant ?? field.variant,
	});
	return (
		<TextArea
			{...appearance}
			{...props}
			className={composeRenderProps(className, className => classes(root, className))}
		/>
	);
}
