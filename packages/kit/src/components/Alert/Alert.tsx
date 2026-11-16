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
