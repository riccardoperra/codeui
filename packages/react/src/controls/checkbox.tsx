"use client";

import {
	checkboxStyleProps,
	content,
	icon,
	indicator,
	label,
	type CheckboxControlStyleOptions,
} from "@codeui/styles/checkbox";
import { errorMessage as errorClass } from "@codeui/styles/fielderror";
import { description as descriptionClass } from "@codeui/styles/fieldmessage";
import { useId, type ComponentProps, type ReactNode } from "react";
import {
	CheckboxButton,
	CheckboxField,
	FieldError,
	Text,
	composeRenderProps,
	type FieldErrorProps,
} from "react-aria-components";
import { classes } from "../classes";
import { CheckIcon, MinusIcon } from "./icons";

export type CheckboxClasses = Partial<
	Record<
		"root" | "control" | "indicator" | "label" | "description" | "errorMessage",
		string
	>
>;

export type CheckboxProps = Omit<ComponentProps<typeof CheckboxField>, "children"> &
	Omit<CheckboxControlStyleOptions, "class"> & {
		/** The label. Without one, set `aria-label`. */
		children?: ReactNode;
		description?: ReactNode;
		/** Shown while the checkbox is invalid. */
		errorMessage?: FieldErrorProps["children"];
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: CheckboxClasses;
	};

/**
 * React Aria's CheckboxField. The box is the CheckboxButton; the label beside it is a native
 * label for the same input, so the description and error stay out of the accessible name.
 */
export function Checkbox({
	size,
	variant,
	children,
	description,
	errorMessage,
	classes: parts,
	className,
	id,
	...props
}: CheckboxProps) {
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const { class: root, ...rootAttributes } = checkboxStyleProps({ fieldSize: size });
	const { class: control, ...controlAttributes } = checkboxStyleProps.control({
		size,
		variant,
	});
	return (
		<CheckboxField
			{...rootAttributes}
			{...props}
			id={inputId}
			className={composeRenderProps(className, className =>
				classes(root, parts?.root, className),
			)}
		>
			<CheckboxButton {...controlAttributes} className={classes(control, parts?.control)}>
				{({ isIndeterminate }) => (
					<span
						data-cui="checkbox-indicator"
						className={classes(indicator, parts?.indicator)}
					>
						{isIndeterminate ? (
							<MinusIcon className={icon} />
						) : (
							<CheckIcon className={icon} />
						)}
					</span>
				)}
			</CheckboxButton>
			<span data-cui="checkbox-content" className={content}>
				{children ? (
					<label
						htmlFor={inputId}
						data-cui="checkbox-label"
						className={classes(label, parts?.label)}
					>
						{children}
					</label>
				) : null}
				{description ? (
					<Text
						slot="description"
						data-cui="checkbox-description"
						className={classes(descriptionClass, parts?.description)}
					>
						{description}
					</Text>
				) : null}
				<FieldError
					data-cui="checkbox-error-message"
					className={classes(errorClass, parts?.errorMessage)}
				>
					{errorMessage}
				</FieldError>
			</span>
		</CheckboxField>
	);
}
