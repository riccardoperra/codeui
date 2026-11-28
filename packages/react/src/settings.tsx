"use client";

import {
	settingsGroupParts,
	settingsGroupStyles,
	settingsRowParts,
	settingsRowStyles,
	type SettingsGroupClasses,
	type SettingsRowClasses,
	type SettingsRowVariants,
} from "@codeui/styles/settings";
import { useId, type ComponentProps, type ReactNode } from "react";
import { classes } from "./classes";

export type SettingsRowControlProps = {
	"aria-labelledby": string;
	"aria-describedby"?: string;
};

export type SettingsRowProps = Omit<ComponentProps<"div">, "children"> &
	SettingsRowVariants & {
		label: ReactNode;
		description?: ReactNode;
		details?: ReactNode;
		picture?: ReactNode;
		marker?: ReactNode;
		controlId?: string;
		classes?: SettingsRowClasses;
		children: ReactNode | ((props: SettingsRowControlProps) => ReactNode);
	};

export function SettingsRow({
	id,
	label,
	description,
	details,
	picture,
	marker,
	controlId,
	layout,
	compactControl,
	children,
	classes: slotClasses,
	className,
	...props
}: SettingsRowProps) {
	const fallbackId = useId();
	const rowId = id ?? fallbackId;
	const labelId = `${rowId}-label`;
	const descriptionId = description == null ? undefined : `${rowId}-description`;
	const Label = controlId ? "label" : "span";

	return (
		<div
			{...props}
			data-layout={layout ?? "inline"}
			data-compact-control={compactControl ? "" : undefined}
			id={id}
			data-cui={settingsRowParts.root}
			className={classes(settingsRowStyles.root(), slotClasses?.root, className)}
		>
			{picture != null && (
				<div
					data-cui={settingsRowParts.picture}
					className={classes(settingsRowStyles.picture(), slotClasses?.picture)}
				>
					{picture}
				</div>
			)}
			<Label
				id={labelId}
				htmlFor={controlId}
				data-cui={settingsRowParts.label}
				className={classes(settingsRowStyles.label(), slotClasses?.label)}
			>
				{label}
				{marker != null && (
					<span
						data-cui={settingsRowParts.marker}
						className={classes(settingsRowStyles.marker(), slotClasses?.marker)}
					>
						{marker}
					</span>
				)}
			</Label>
			{descriptionId && (
				<div
					id={descriptionId}
					data-cui={settingsRowParts.description}
					className={classes(settingsRowStyles.description(), slotClasses?.description)}
				>
					{description}
				</div>
			)}
			{details != null && (
				<div
					data-cui={settingsRowParts.details}
					className={classes(settingsRowStyles.details(), slotClasses?.details)}
				>
					{details}
				</div>
			)}
			<div
				data-cui={settingsRowParts.control}
				className={classes(settingsRowStyles.control(), slotClasses?.control)}
			>
				{typeof children === "function"
					? children({ "aria-labelledby": labelId, "aria-describedby": descriptionId })
					: children}
			</div>
		</div>
	);
}

export type SettingsGroupProps = Omit<ComponentProps<"section">, "title"> & {
	title?: ReactNode;
	description?: ReactNode;
	classes?: SettingsGroupClasses;
};

export function SettingsGroup({
	id,
	title,
	description,
	children,
	classes: slotClasses,
	className,
	...props
}: SettingsGroupProps) {
	const fallbackId = useId();
	const groupId = id ?? fallbackId;
	const titleId = title == null ? undefined : `${groupId}-title`;
	const descriptionId = description == null ? undefined : `${groupId}-description`;

	return (
		<section
			aria-labelledby={titleId}
			aria-describedby={descriptionId}
			{...props}
			id={id}
			data-cui={settingsGroupParts.root}
			className={classes(settingsGroupStyles.root(), slotClasses?.root, className)}
		>
			{titleId && (
				<h2
					id={titleId}
					data-cui={settingsGroupParts.title}
					className={classes(settingsGroupStyles.title(), slotClasses?.title)}
				>
					{title}
				</h2>
			)}
			{descriptionId && (
				<p
					id={descriptionId}
					data-cui={settingsGroupParts.description}
					className={classes(settingsGroupStyles.description(), slotClasses?.description)}
				>
					{description}
				</p>
			)}
			<div
				data-cui={settingsGroupParts.content}
				className={classes(settingsGroupStyles.content(), slotClasses?.content)}
			>
				{children}
			</div>
		</section>
	);
}
