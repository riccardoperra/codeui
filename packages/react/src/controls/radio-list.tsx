"use client";

import { errorMessage } from "@codeui/styles/fielderror";
import { label } from "@codeui/styles/fieldlabel";
import { description } from "@codeui/styles/fieldmessage";
import {
	indicator,
	radio,
	radioItem,
	radioListStyleProps,
	type RadioListStyleOptions,
} from "@codeui/styles/radiolist";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import {
	FieldError,
	Label,
	Radio,
	RadioGroup,
	Text,
	composeRenderProps,
	type FieldErrorProps,
} from "react-aria-components";
import { classes } from "../classes";
import { flag } from "./utils";

export type RadioListClasses = Partial<
	Record<
		| "root"
		| "label"
		| "items"
		| "description"
		| "errorMessage"
		| "item"
		| "itemControl"
		| "itemIndicator"
		| "itemLabel",
		string
	>
>;

const ItemClasses = createContext<RadioListClasses | undefined>(undefined);

export type RadioListProps = Omit<ComponentProps<typeof RadioGroup>, "children"> &
	Omit<RadioListStyleOptions, "class" | "orientation"> & {
		children?: ReactNode;
		label?: ReactNode;
		description?: ReactNode;
		/** Shown while the group is invalid. */
		errorMessage?: FieldErrorProps["children"];
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: RadioListClasses;
	};

/** React Aria's RadioGroup laid out as a row or a column of RadioListItem. */
export function RadioList({
	size,
	variant,
	orientation = "horizontal",
	label: labelText,
	description: descriptionText,
	errorMessage: errorText,
	classes: parts,
	className,
	children,
	...props
}: RadioListProps) {
	const { class: root, ...rootAttributes } = radioListStyleProps.root({
		fieldSize: size,
	});
	const { class: items, ...itemsAttributes } = radioListStyleProps.items({
		size,
		variant,
		orientation,
	});
	return (
		<RadioGroup
			{...rootAttributes}
			{...props}
			orientation={orientation}
			className={composeRenderProps(className, className =>
				classes(root, parts?.root, className),
			)}
		>
			{labelText ? (
				<Label data-cui="radiolist-label" className={classes(label, parts?.label)}>
					{labelText}
				</Label>
			) : null}
			<div {...itemsAttributes} className={classes(items, parts?.items)}>
				<ItemClasses.Provider value={parts}>{children}</ItemClasses.Provider>
			</div>
			{descriptionText ? (
				<Text
					slot="description"
					data-cui="radiolist-description"
					className={classes(description, parts?.description)}
				>
					{descriptionText}
				</Text>
			) : null}
			<FieldError
				data-cui="radiolist-error-message"
				className={classes(errorMessage, parts?.errorMessage)}
			>
				{errorText}
			</FieldError>
		</RadioGroup>
	);
}

export type RadioListItemProps = Omit<ComponentProps<typeof Radio>, "children"> & {
	/** The label. */
	children?: ReactNode;
	/** Classes for the parts this item renders, keyed by part name. */
	classes?: Pick<
		RadioListClasses,
		"item" | "itemControl" | "itemIndicator" | "itemLabel"
	>;
};

/** One option of a RadioList. The whole row is the label of its radio. */
export function RadioListItem({
	classes: own,
	className,
	children,
	...props
}: RadioListItemProps) {
	const group = useContext(ItemClasses);
	return (
		<Radio
			data-cui="radiolist-item"
			{...props}
			className={composeRenderProps(className, className =>
				classes(radioItem, group?.item, own?.item, className),
			)}
		>
			{({ isSelected, isInvalid, isDisabled }) => (
				<>
					<span
						data-cui="radiolist-item-control"
						data-checked={flag(isSelected)}
						data-invalid={flag(isInvalid)}
						data-disabled={flag(isDisabled)}
						className={classes(radio, group?.itemControl, own?.itemControl)}
					>
						{isSelected ? (
							<span
								data-cui="radiolist-item-indicator"
								className={classes(indicator, group?.itemIndicator, own?.itemIndicator)}
							/>
						) : null}
					</span>
					{children ? (
						<span
							data-cui="radiolist-item-label"
							className={classes(group?.itemLabel, own?.itemLabel) || undefined}
						>
							{children}
						</span>
					) : null}
				</>
			)}
		</Radio>
	);
}
