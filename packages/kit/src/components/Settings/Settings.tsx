import {
	children,
	createMemo,
	createUniqueId,
	type JSX,
	Show,
	splitProps,
	untrack,
} from "solid-js";
import * as P from "../../parts/settings";
import { mergeClasses } from "../../utils/css";
import {
	createSettingsRowProps,
	type SettingsRowControlProps,
} from "./createSettingsRowProps";

export type SettingsRowProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> &
	P.SettingsRowVariants & {
		/** Root id, and the base of `<id>-label` and `<id>-description`. */
		id?: string;
		label: JSX.Element;
		description?: JSX.Element;
		/** Extra content under the description, such as requirements or links. */
		details?: JSX.Element;
		/** Content before the text, such as a thumbnail. */
		picture?: JSX.Element;
		/** Content after the label, such as a `New` badge. */
		marker?: JSX.Element;
		/**
		 * The control. Pass a function to receive the `aria-labelledby` and
		 * `aria-describedby` props that connect the row text to the control.
		 * The function runs once; the props it receives stay reactive.
		 */
		children: JSX.Element | ((control: SettingsRowControlProps) => JSX.Element);
		/** The id of one labelable input. The label then renders as `<label for>`. */
		controlId?: string;
		classes?: P.SettingsRowClasses;
	};

/** One setting: label and description on the left, the control on the right. */
export function SettingsRow(props: SettingsRowProps) {
	const [local, others] = splitProps(props, [
		"id",
		"label",
		"description",
		"details",
		"picture",
		"marker",
		"children",
		"controlId",
		"layout",
		"compactControl",
		"class",
		"classes",
	]);
	// Each content prop resolves once: reading a JSX prop twice creates its
	// components twice, which breaks hydration and repeats their side effects.
	const label = children(() => local.label);
	const description = children(() => local.description);
	const details = children(() => local.details);
	const picture = children(() => local.picture);
	const marker = children(() => local.marker);
	const row = createSettingsRowProps(() => ({
		id: local.id,
		controlId: local.controlId,
		description: description(),
	}));
	const controlProps: SettingsRowControlProps = {
		get "aria-labelledby"() {
			return row.control()["aria-labelledby"];
		},
		get "aria-describedby"() {
			return row.control()["aria-describedby"];
		},
	};
	const control = createMemo((): JSX.Element => {
		const content = local.children;
		return typeof content === "function" && content.length > 0
			? untrack(() =>
					(content as (control: SettingsRowControlProps) => JSX.Element)(controlProps),
				)
			: (content as JSX.Element);
	});
	return (
		<P.Row
			{...others}
			{...row.root()}
			layout={local.layout}
			compactControl={local.compactControl}
			class={mergeClasses(local.classes?.root, local.class)}
		>
			<Show when={picture()}>
				<P.Picture class={local.classes?.picture}>{picture()}</P.Picture>
			</Show>
			<P.Label {...row.label()} class={local.classes?.label}>
				{label()}
				<Show when={marker()}>
					<P.Marker class={local.classes?.marker}>{marker()}</P.Marker>
				</Show>
			</P.Label>
			<Show when={description()}>
				<P.Description {...row.description()} class={local.classes?.description}>
					{description()}
				</P.Description>
			</Show>
			<Show when={details()}>
				<P.Details class={local.classes?.details}>{details()}</P.Details>
			</Show>
			<P.Control class={local.classes?.control}>{control()}</P.Control>
		</P.Row>
	);
}

export type SettingsGroupProps = Omit<JSX.HTMLAttributes<HTMLElement>, "title"> & {
	id?: string;
	/** The heading above the island. It names the group. */
	title?: JSX.Element;
	description?: JSX.Element;
	children: JSX.Element;
	classes?: P.SettingsGroupClasses;
};

/** Rows that belong together: a heading and one island. */
export function SettingsGroup(props: SettingsGroupProps) {
	const [local, others] = splitProps(props, [
		"id",
		"title",
		"description",
		"children",
		"class",
		"classes",
	]);
	const title = children(() => local.title);
	const description = children(() => local.description);
	const fallback = createUniqueId();
	const base = () => local.id ?? `settings-group-${fallback}`;
	return (
		<P.Group
			{...others}
			id={local.id}
			aria-labelledby={title() ? `${base()}-title` : undefined}
			aria-describedby={description() ? `${base()}-description` : undefined}
			class={mergeClasses(local.classes?.root, local.class)}
		>
			<Show when={title()}>
				<P.GroupTitle id={`${base()}-title`} class={local.classes?.title}>
					{title()}
				</P.GroupTitle>
			</Show>
			<Show when={description()}>
				<P.GroupDescription
					id={`${base()}-description`}
					class={local.classes?.description}
				>
					{description()}
				</P.GroupDescription>
			</Show>
			<P.GroupContent class={local.classes?.content}>{local.children}</P.GroupContent>
		</P.Group>
	);
}

export { createSettingsRowProps };
export type { SettingsRowControlProps };
export type { SettingsRowFieldProps } from "./createSettingsRowProps";
