import "@codeui/styles/theme.css";
import "@codeui/styles/settings.css";
import { Show, omit } from "solid-js";
import { type JSX, type ValidComponent, dynamic } from "@solidjs/web";

import * as styles from "../components/Settings/Settings.css";
import { mergeClasses } from "../utils/css";

import {
	settingsRowParts,
	type SettingsRowPart,
	type SettingsRowClasses,
	type SettingsRowLayout,
	type SettingsRowVariants,
	type SettingsRowStyles,
	settingsRowStyles,
	settingsGroupParts,
	type SettingsGroupPart,
	type SettingsGroupClasses,
	type SettingsGroupStyles,
	settingsGroupStyles,
} from "@codeui/styles/settings";
export {
	settingsRowParts,
	type SettingsRowPart,
	type SettingsRowClasses,
	type SettingsRowLayout,
	type SettingsRowVariants,
	type SettingsRowStyles,
	settingsRowStyles,
	settingsGroupParts,
	type SettingsGroupPart,
	type SettingsGroupClasses,
	type SettingsGroupStyles,
	settingsGroupStyles,
} from "@codeui/styles/settings";
export type RowProps = JSX.HTMLAttributes<HTMLDivElement> & SettingsRowVariants;
/** The row. `layout` and `compactControl` set `data-layout` and `data-compact-control`. */
export function Row(props: RowProps) {
	const others = omit(props, "class", "layout", "compactControl");
	return (
		<div
			{...others}
			data-cui={settingsRowParts.root}
			data-layout={props.layout ?? "inline"}
			data-compact-control={props.compactControl ? "" : undefined}
			class={mergeClasses(settingsRowStyles.root(), props.class)}
		/>
	);
}

export type LabelProps = JSX.HTMLAttributes<HTMLLabelElement> & {
	/** The id of one labelable input. The label renders as `<label for>` when set. */
	for?: string;
};
/** The row title. A `<span>`, or a `<label>` when `for` names one input. */
export function Label(props: LabelProps) {
	const others = omit(props, "class", "for");
	const cls = () => mergeClasses(settingsRowStyles.label(), props.class);
	return (
		<Show
			when={props.for}
			fallback={
				<span
					{...(others as JSX.HTMLAttributes<HTMLSpanElement>)}
					data-cui={settingsRowParts.label}
					class={cls()}
				/>
			}
		>
			<label
				{...others}
				for={props.for}
				data-cui={settingsRowParts.label}
				class={cls()}
			/>
		</Show>
	);
}

export type DescriptionProps = JSX.HTMLAttributes<HTMLDivElement>;
export function Description(props: DescriptionProps) {
	const others = omit(props, "class");
	return (
		<div
			{...others}
			data-cui={settingsRowParts.description}
			class={mergeClasses(settingsRowStyles.description(), props.class)}
		/>
	);
}

export type DetailsProps = JSX.HTMLAttributes<HTMLDivElement>;
export function Details(props: DetailsProps) {
	const others = omit(props, "class");
	return (
		<div
			{...others}
			data-cui={settingsRowParts.details}
			class={mergeClasses(settingsRowStyles.details(), props.class)}
		/>
	);
}

export type ControlProps = JSX.HTMLAttributes<HTMLDivElement>;
export function Control(props: ControlProps) {
	const others = omit(props, "class");
	return (
		<div
			{...others}
			data-cui={settingsRowParts.control}
			class={mergeClasses(settingsRowStyles.control(), props.class)}
		/>
	);
}

export type PictureProps = JSX.HTMLAttributes<HTMLDivElement>;
export function Picture(props: PictureProps) {
	const others = omit(props, "class");
	return (
		<div
			{...others}
			data-cui={settingsRowParts.picture}
			class={mergeClasses(settingsRowStyles.picture(), props.class)}
		/>
	);
}

export type MarkerProps = JSX.HTMLAttributes<HTMLSpanElement>;
export function Marker(props: MarkerProps) {
	const others = omit(props, "class");
	return (
		<span
			{...others}
			data-cui={settingsRowParts.marker}
			class={mergeClasses(settingsRowStyles.marker(), props.class)}
		/>
	);
}

export type GroupProps = JSX.HTMLAttributes<HTMLElement>;
/** A `<section>` holding a title above one island of rows. */
export function Group(props: GroupProps) {
	const others = omit(props, "class");
	return (
		<section
			{...others}
			data-cui={settingsGroupParts.root}
			class={mergeClasses(settingsGroupStyles.root(), props.class)}
		/>
	);
}

export type GroupTitleProps = JSX.HTMLAttributes<HTMLHeadingElement> & {
	/** The heading element. Defaults to `h3`. */
	as?: ValidComponent;
};
export function GroupTitle(props: GroupTitleProps) {
	const others = omit(props, "class", "as");
	const Element = dynamic(() => props.as ?? "h3");
	return (
		<Element
			{...others}
			data-cui={settingsGroupParts.title}
			class={mergeClasses(settingsGroupStyles.title(), props.class)}
		/>
	);
}

export type GroupDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement>;
export function GroupDescription(props: GroupDescriptionProps) {
	const others = omit(props, "class");
	return (
		<p
			{...others}
			data-cui={settingsGroupParts.description}
			class={mergeClasses(settingsGroupStyles.description(), props.class)}
		/>
	);
}

export type GroupContentProps = JSX.HTMLAttributes<HTMLDivElement>;
/** The island. Rows touch inside it. */
export function GroupContent(props: GroupContentProps) {
	const others = omit(props, "class");
	return (
		<div
			{...others}
			data-cui={settingsGroupParts.content}
			class={mergeClasses(settingsGroupStyles.content(), props.class)}
		/>
	);
}

export {
	createSettingsRowProps,
	type SettingsRowControlProps,
	type SettingsRowFieldProps,
} from "../components/Settings/createSettingsRowProps";
