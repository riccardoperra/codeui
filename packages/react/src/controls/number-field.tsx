"use client";

import {
	control,
	controlButton,
	controlsContainer,
	numberFieldContainer,
	numberFieldStyleProps,
} from "@codeui/styles/numberfield";
import type { ComponentProps, ReactNode } from "react";
import {
	Group,
	Input,
	NumberField as AriaNumberField,
	composeRenderProps,
} from "react-aria-components";
import { classes } from "../classes";
import { Button } from "./button";
import { FieldDescription, FieldError, FieldLabel, type FieldErrorProps } from "./field";
import type { FieldAppearance } from "./field-appearance";
import { ChevronDownIcon, ChevronUpIcon } from "./icons";
import type { FieldClasses } from "./text-field";

export type NumberFieldClasses = FieldClasses &
	Partial<Record<"group" | "controls" | "controlButton", string>>;

export type NumberFieldProps = Omit<ComponentProps<typeof AriaNumberField>, "children"> &
	FieldAppearance & {
		label?: ReactNode;
		description?: ReactNode;
		/** Shown while the field is invalid. Defaults to the browser's validation message. */
		errorMessage?: FieldErrorProps["children"];
		placeholder?: string;
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: NumberFieldClasses;
	};

/**
 * React Aria's NumberField. It parses and formats with `formatOptions` and steps with the arrow
 * keys; the step buttons appear on hover and focus and stay out of the tab order.
 */
export function NumberField({
	size,
	variant,
	label,
	description,
	errorMessage,
	placeholder,
	classes: parts,
	className,
	...props
}: NumberFieldProps) {
	const { class: root, ...rootAttributes } = numberFieldStyleProps.root({
		fieldSize: size,
	});
	const { class: input, ...inputAttributes } = numberFieldStyleProps.input({
		size,
		variant,
	});
	return (
		<AriaNumberField
			{...rootAttributes}
			{...props}
			className={composeRenderProps(className, className =>
				classes(root, parts?.root, className),
			)}
		>
			{label ? (
				<FieldLabel data-cui="textfield-label" className={parts?.label}>
					{label}
				</FieldLabel>
			) : null}
			<Group
				data-cui="numberfield-group"
				className={classes(numberFieldContainer, parts?.group)}
			>
				<Input
					{...inputAttributes}
					placeholder={placeholder}
					className={classes(input, parts?.input)}
				/>
				<div
					data-cui="numberfield-controls"
					className={classes(controlsContainer, parts?.controls)}
				>
					<Button
						slot="increment"
						ghost
						variant="secondary"
						className={classes(controlButton, parts?.controlButton)}
					>
						<ChevronUpIcon className={control} />
					</Button>
					<Button
						slot="decrement"
						ghost
						variant="secondary"
						className={classes(controlButton, parts?.controlButton)}
					>
						<ChevronDownIcon className={control} />
					</Button>
				</div>
			</Group>
			{description ? (
				<FieldDescription data-cui="textfield-description" className={parts?.description}>
					{description}
				</FieldDescription>
			) : null}
			<FieldError data-cui="textfield-error-message" className={parts?.errorMessage}>
				{errorMessage}
			</FieldError>
		</AriaNumberField>
	);
}
