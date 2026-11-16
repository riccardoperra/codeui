import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { type JSX, Match, Show, splitProps, Switch, type ValidComponent } from "solid-js";
import { CheckIcon } from "../../icons/CheckIcon";
import { SvgIcon } from "../../icons/SvgIcon";
import * as A from "../../parts/alert";
import { mergeClasses } from "../../utils/css";

export type AlertProps<T extends ValidComponent = "div"> = A.RootProps<T> & {
	children?: JSX.Element;
	title?: JSX.Element;
	/** The message. Falls back to `children`. */
	description?: JSX.Element;
	/** Replaces the tone icon. Shown only with `showIcon`. */
	icon?: JSX.Element;
	/** Shows `icon`, or the tone icon for a status tone. Neutral has no tone icon. */
	showIcon?: boolean;
	action?: JSX.Element;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: A.AlertClasses;
};

/** A message that the screen reader announces when it appears. Use Text for static hints. */
export function Alert<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, AlertProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", AlertProps>, [
		"children",
		"title",
		"description",
		"icon",
		"showIcon",
		"action",
		"classes",
		"class",
	]);
	const hasIcon = () =>
		local.showIcon && (local.icon != null || (others.tone ?? "neutral") !== "neutral");
	return (
		<A.Root {...others} class={mergeClasses(local.classes?.root, local.class)}>
			<Show when={hasIcon()}>
				<A.Icon class={local.classes?.icon}>
					{local.icon ?? <ToneIcon tone={others.tone} />}
				</A.Icon>
			</Show>
			<Show when={local.title}>
				<A.Title class={local.classes?.title}>{local.title}</A.Title>
			</Show>
			<A.Description class={local.classes?.description}>
				{local.description ?? local.children}
			</A.Description>
			<Show when={local.action}>
				<A.Action class={local.classes?.action}>{local.action}</A.Action>
			</Show>
		</A.Root>
	);
}

function ToneIcon(props: { tone?: A.AlertTone }) {
	return (
		<Switch>
			<Match when={props.tone === "success"}>
				<CheckIcon />
			</Match>
			<Match when={props.tone === "info"}>
				<SvgIcon viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/>
				</SvgIcon>
			</Match>
			<Match when={props.tone === "warning" || props.tone === "danger"}>
				<SvgIcon viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a1 1 0 01.993.883L11 6v4a1 1 0 01-1.993.117L9 10V6a1 1 0 011-1zm0 8a1 1 0 100 2 1 1 0 000-2z"
						clip-rule="evenodd"
					/>
				</SvgIcon>
			</Match>
		</Switch>
	);
}
