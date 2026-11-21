import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Show, omit } from "solid-js";
import { type JSX, type ValidComponent } from "@solidjs/web";
import * as B from "../../parts/badge";
import { mergeClasses } from "../../utils/css";

export type BadgeProps<T extends ValidComponent = "span"> = B.RootProps<T> & {
	children?: JSX.Element;
	/** Decorative icon before the label. */
	icon?: JSX.Element;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: B.BadgeClasses;
};

/** A short, non-interactive status label. Set `textValue` when the content is not text. */
export function Badge<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, BadgeProps<T>>,
) {
	const local = props as PolymorphicProps<"span", BadgeProps>;
	const others = omit(local, "children", "icon", "classes", "class");
	return (
		<B.Root {...others} class={mergeClasses(local.classes?.root, local.class)}>
			<Show when={local.icon}>
				{icon => <B.Icon class={local.classes?.icon}>{icon()}</B.Icon>}
			</Show>
			<B.Label class={local.classes?.label}>{local.children}</B.Label>
		</B.Root>
	);
}
