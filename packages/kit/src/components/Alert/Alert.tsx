import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { type JSX, Show, splitProps, type ValidComponent } from "solid-js";
import { ToneIcon } from "../../icons/ToneIcon";
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
	// The custom icon, else the tone icon. Neutral has no tone icon.
	const icon = () =>
		local.icon ??
		((others.tone ?? "neutral") !== "neutral" ? (
			<ToneIcon tone={others.tone} />
		) : undefined);
	return (
		<A.Root {...others} class={mergeClasses(local.classes?.root, local.class)}>
			<Show when={local.showIcon && icon()}>
				{icon => <A.Icon class={local.classes?.icon}>{icon()}</A.Icon>}
			</Show>
			<Show when={local.title}>
				{title => <A.Title class={local.classes?.title}>{title()}</A.Title>}
			</Show>
			<A.Description class={local.classes?.description}>
				{local.description ?? local.children}
			</A.Description>
			<Show when={local.action}>
				{action => <A.Action class={local.classes?.action}>{action()}</A.Action>}
			</Show>
		</A.Root>
	);
}
