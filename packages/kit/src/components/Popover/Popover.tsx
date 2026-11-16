import type { PopoverRootOptions as KPopoverRootOptions } from "@kobalte/core/popover";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { type JSX, type ParentProps, Show, splitProps, type ValidComponent } from "solid-js";
import * as P from "../../parts/popover";
import { mergeClasses } from "../../utils/css";

export const PopoverTrigger = P.Trigger;

export type PopoverProps = KPopoverRootOptions;

export function Popover(props: ParentProps<PopoverProps>) {
	return <P.Root {...props} />;
}

export type PopoverContentProps<T extends ValidComponent = "div"> = P.ContentProps<T> & {
	title?: JSX.Element;
	/** Short text that describes the popover. It is linked with `aria-describedby`. */
	description?: JSX.Element;
	/** Node the popover is portaled into. Defaults to `document.body`. */
	mount?: Node;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: Pick<P.PopoverClasses, "content" | "title" | "description">;
};

export function PopoverContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, PopoverContentProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", PopoverContentProps>, [
		"title",
		"description",
		"mount",
		"classes",
		"class",
		"children",
	]);

	return (
		<P.Portal mount={local.mount}>
			<P.Content {...others} class={mergeClasses(local.classes?.content, local.class)}>
				<Show when={local.title}>
					<P.Title class={local.classes?.title}>{local.title}</P.Title>
				</Show>
				<Show when={local.description}>
					<P.Description class={local.classes?.description}>{local.description}</P.Description>
				</Show>
				{local.children}
			</P.Content>
		</P.Portal>
	);
}
