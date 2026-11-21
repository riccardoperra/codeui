"use client";

import { textAreaStyleProps } from "@codeui/styles/textarea";
import { textFieldStyleProps } from "@codeui/styles/textfield";
import type { ComponentProps, ReactNode } from "react";
import { TextField as AriaTextField, composeRenderProps } from "react-aria-components";
import { classes } from "../classes";
import {
	FieldDescription,
	FieldError,
	FieldInput,
	FieldLabel,
	FieldTextArea,
	type FieldErrorProps,
} from "./field";
import { FieldAppearanceContext, type FieldAppearance } from "./field-appearance";

export type FieldClasses = Partial<
	Record<"root" | "label" | "input" | "description" | "errorMessage", string>
>;

export type TextFieldProps = ComponentProps<typeof AriaTextField> &
	FieldAppearance & {
		label?: ReactNode;
		description?: ReactNode;
		/** Shown while the field is invalid. Defaults to the browser's validation message. */
		errorMessage?: FieldErrorProps["children"];
		placeholder?: string;
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: FieldClasses;
	};

/**
 * React Aria's TextField with a label, an input, a description and an error. Pass `children` to
 * compose the parts yourself with FieldLabel, FieldInput, FieldDescription and FieldError.
 */
export function TextField({ placeholder, classes: parts, ...props }: TextFieldProps) {
	return (
		<FieldFrame
			{...props}
			classes={parts}
			root={textFieldStyleProps.root({ fieldSize: props.size })}
			input={<FieldInput placeholder={placeholder} className={parts?.input} />}
		/>
	);
}

export type TextAreaProps = TextFieldProps;

/** A multi-line TextField. Pass `children` to compose the parts with FieldTextArea. */
export function TextArea({ placeholder, classes: parts, ...props }: TextAreaProps) {
	return (
		<FieldFrame
			{...props}
			classes={parts}
			root={textAreaStyleProps.root({ fieldSize: props.size })}
			input={<FieldTextArea placeholder={placeholder} className={parts?.input} />}
		/>
	);
}

type FieldFrameProps = Omit<TextFieldProps, "placeholder"> & {
	root: { class: string; "data-cui": string; "data-field-size": string };
	input: ReactNode;
};

function FieldFrame({
	root: { class: root, ...rootAttributes },
	input,
	size,
	variant,
	label,
	description,
	errorMessage,
	classes: parts,
	className,
	children,
	...props
}: FieldFrameProps) {
	return (
		<FieldAppearanceContext.Provider value={{ size, variant }}>
			<AriaTextField
				{...rootAttributes}
				{...props}
				className={composeRenderProps(className, className =>
					classes(root, parts?.root, className),
				)}
			>
				{children ?? (
					<>
						{label ? (
							<FieldLabel data-cui="textfield-label" className={parts?.label}>
								{label}
							</FieldLabel>
						) : null}
						{input}
						{description ? (
							<FieldDescription
								data-cui="textfield-description"
								className={parts?.description}
							>
								{description}
							</FieldDescription>
						) : null}
						<FieldError
							data-cui="textfield-error-message"
							className={parts?.errorMessage}
						>
							{errorMessage}
						</FieldError>
					</>
				)}
			</AriaTextField>
		</FieldAppearanceContext.Provider>
	);
}
