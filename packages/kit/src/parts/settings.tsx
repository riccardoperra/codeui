import { type JSX, Show, splitProps, type ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import * as styles from "../components/Settings/Settings.css";
import { mergeClasses } from "../utils/css";

export const settingsRowParts = {
	root: "settings-row-root",
	label: "settings-row-label",
	description: "settings-row-description",
	details: "settings-row-details",
	control: "settings-row-control",
	picture: "settings-row-picture",
	marker: "settings-row-marker",
} as const;
export type SettingsRowPart = keyof typeof settingsRowParts;
export type SettingsRowClasses = Partial<Record<SettingsRowPart, string>>;
export type SettingsRowLayout = "inline" | "wide";
export type SettingsRowVariants = {
	layout?: SettingsRowLayout;
	compactControl?: boolean;
};
export type SettingsRowStyles = {
	[P in SettingsRowPart]: (variants?: SettingsRowVariants) => string;
};
export const settingsRowStyles: SettingsRowStyles = {
	root: () => styles.row,
	label: () => styles.label,
	description: () => styles.description,
	details: () => styles.details,
	control: () => styles.control,
	picture: () => styles.picture,
	marker: () => styles.marker,
};

export const settingsGroupParts = {
	root: "settings-group-root",
	title: "settings-group-title",
	description: "settings-group-description",
	content: "settings-group-content",
} as const;
export type SettingsGroupPart = keyof typeof settingsGroupParts;
export type SettingsGroupClasses = Partial<Record<SettingsGroupPart, string>>;
export type SettingsGroupStyles = {
	[P in SettingsGroupPart]: (variants?: {}) => string;
};
export const settingsGroupStyles: SettingsGroupStyles = {
	root: () => styles.group,
	title: () => styles.groupTitle,
	description: () => styles.groupDescription,
	content: () => styles.groupContent,
};

export type RowProps = JSX.HTMLAttributes<HTMLDivElement> & SettingsRowVariants;
/** The row. `layout` and `compactControl` set `data-layout` and `data-compact-control`. */
export function Row(props: RowProps) {
	const [local, others] = splitProps(props, ["class", "layout", "compactControl"]);
	return (
		<div
			{...others}
			data-cui={settingsRowParts.root}
			data-layout={local.layout ?? "inline"}
			data-compact-control={local.compactControl ? "" : undefined}
			class={mergeClasses(settingsRowStyles.root(), local.class)}
		/>
	);
}

export type LabelProps = JSX.HTMLAttributes<HTMLLabelElement> & {
	/** The id of one labelable input. The label renders as `<label for>` when set. */
	for?: string;
};
/** The row title. A `<span>`, or a `<label>` when `for` names one input. */
export function Label(props: LabelProps) {
	const [local, others] = splitProps(props, ["class", "for"]);
	const cls = () => mergeClasses(settingsRowStyles.label(), local.class);
	return (
		<Show
			when={local.for}
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
				for={local.for}
				data-cui={settingsRowParts.label}
				class={cls()}
			/>
		</Show>
	);
}

export type DescriptionProps = JSX.HTMLAttributes<HTMLDivElement>;
export function Description(props: DescriptionProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div
			{...others}
			data-cui={settingsRowParts.description}
			class={mergeClasses(settingsRowStyles.description(), local.class)}
		/>
	);
}

export type DetailsProps = JSX.HTMLAttributes<HTMLDivElement>;
export function Details(props: DetailsProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div
			{...others}
			data-cui={settingsRowParts.details}
			class={mergeClasses(settingsRowStyles.details(), local.class)}
		/>
	);
}

export type ControlProps = JSX.HTMLAttributes<HTMLDivElement>;
export function Control(props: ControlProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div
			{...others}
			data-cui={settingsRowParts.control}
			class={mergeClasses(settingsRowStyles.control(), local.class)}
		/>
	);
}

export type PictureProps = JSX.HTMLAttributes<HTMLDivElement>;
export function Picture(props: PictureProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div
			{...others}
			data-cui={settingsRowParts.picture}
			class={mergeClasses(settingsRowStyles.picture(), local.class)}
		/>
	);
}

export type MarkerProps = JSX.HTMLAttributes<HTMLSpanElement>;
export function Marker(props: MarkerProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<span
			{...others}
			data-cui={settingsRowParts.marker}
			class={mergeClasses(settingsRowStyles.marker(), local.class)}
		/>
	);
}

export type GroupProps = JSX.HTMLAttributes<HTMLElement>;
/** A `<section>` holding a title above one island of rows. */
export function Group(props: GroupProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<section
			{...others}
			data-cui={settingsGroupParts.root}
			class={mergeClasses(settingsGroupStyles.root(), local.class)}
		/>
	);
}

export type GroupTitleProps = JSX.HTMLAttributes<HTMLHeadingElement> & {
	/** The heading element. Defaults to `h3`. */
	as?: ValidComponent;
};
export function GroupTitle(props: GroupTitleProps) {
	const [local, others] = splitProps(props, ["class", "as"]);
	return (
		<Dynamic
			component={local.as ?? "h3"}
			{...others}
			data-cui={settingsGroupParts.title}
			class={mergeClasses(settingsGroupStyles.title(), local.class)}
		/>
	);
}

export type GroupDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement>;
export function GroupDescription(props: GroupDescriptionProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<p
			{...others}
			data-cui={settingsGroupParts.description}
			class={mergeClasses(settingsGroupStyles.description(), local.class)}
		/>
	);
}

export type GroupContentProps = JSX.HTMLAttributes<HTMLDivElement>;
/** The island. Rows touch inside it. */
export function GroupContent(props: GroupContentProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div
			{...others}
			data-cui={settingsGroupParts.content}
			class={mergeClasses(settingsGroupStyles.content(), local.class)}
		/>
	);
}

export {
	createSettingsRowProps,
	type SettingsRowControlProps,
	type SettingsRowFieldProps,
} from "../components/Settings/createSettingsRowProps";
