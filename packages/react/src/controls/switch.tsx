"use client";

import {
	switchStyleProps,
	type SwitchClasses,
	type SwitchVariants,
} from "@codeui/styles/switch";
import { useId, type ComponentProps, type ReactNode } from "react";
import {
	FieldError,
	SwitchButton,
	SwitchField,
	Text,
	composeRenderProps,
	type FieldErrorProps,
} from "react-aria-components";
import { classes } from "../classes";
import { useInputTracking } from "../input-modality";

export type SwitchProps = Omit<ComponentProps<typeof SwitchField>, "children"> &
	SwitchVariants & {
		/** The label. Without one, set `aria-label`. */
		children?: ReactNode;
		description?: ReactNode;
		/** Shown while the switch is invalid. */
		errorMessage?: FieldErrorProps["children"];
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: SwitchClasses;
	};

/** React Aria's SwitchField: an on/off setting that applies at once (DESIGN.md §9.1). */
export function Switch({
	size,
	children,
	description,
	errorMessage,
	classes: parts,
	className,
	id,
	...props
}: SwitchProps) {
	useInputTracking();
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const { class: root, ...rootAttributes } = switchStyleProps.root({ size });
	const { class: control, ...controlAttributes } = switchStyleProps.control({ size });
	const { class: thumb, ...thumbAttributes } = switchStyleProps.thumb({ size });
	const { class: labelClass, ...labelAttributes } = switchStyleProps.label({ size });
	const { class: descriptionClass, ...descriptionAttributes } =
		switchStyleProps.description({
			size,
		});
	const { class: errorClass, ...errorAttributes } = switchStyleProps.errorMessage({
		size,
	});
	return (
		<SwitchField
			{...rootAttributes}
			{...props}
			id={inputId}
			className={composeRenderProps(className, className =>
				classes(root, parts?.root, className),
			)}
		>
			<SwitchButton {...controlAttributes} className={classes(control, parts?.control)}>
				<span {...thumbAttributes} className={classes(thumb, parts?.thumb)} />
			</SwitchButton>
			{children ? (
				<label
					htmlFor={inputId}
					{...labelAttributes}
					className={classes(labelClass, parts?.label)}
				>
					{children}
				</label>
			) : null}
			{description ? (
				<Text
					slot="description"
					{...descriptionAttributes}
					className={classes(descriptionClass, parts?.description)}
				>
					{description}
				</Text>
			) : null}
			<FieldError
				{...errorAttributes}
				className={classes(errorClass, parts?.errorMessage)}
			>
				{errorMessage}
			</FieldError>
		</SwitchField>
	);
}
