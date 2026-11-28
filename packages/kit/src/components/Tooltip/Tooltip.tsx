import { Show, splitProps, type JSX } from "solid-js";
import * as P from "../../parts/tooltip";
import type { SlotProp } from "../../utils/component";
import type { TooltipVariants } from "./Tooltip.css";

type TooltipSlot = "trigger" | "content";

export type TooltipProps = P.RootProps &
	TooltipVariants &
	SlotProp<TooltipSlot> & {
		/** Tooltip body. When `undefined`, `null`, `false` or `""`, the tooltip never opens. */
		content: JSX.Element;
		/** Portal target for the content. Defaults to `document.body`. */
		mount?: Node;
	};

export function Tooltip(props: TooltipProps) {
	const [local, others] = splitProps(props, [
		"variant",
		"slotClasses",
		"mount",
		"children",
		"content",
	]);

	// Empty content turns the tooltip off: Kobalte's `disabled` stops hover and focus from opening it,
	// so the trigger never gets an `aria-describedby` that points at a missing bubble.
	const hasContent = () => {
		const content = local.content;
		return content != null && content !== false && content !== "";
	};

	return (
		<P.Root {...others} disabled={others.disabled || !hasContent()}>
			<P.Trigger class={local.slotClasses?.trigger}>{local.children}</P.Trigger>
			<Show when={hasContent()}>
				<P.Portal mount={local.mount}>
					<P.Content variant={local.variant} class={local.slotClasses?.content}>
						{local.content}
					</P.Content>
				</P.Portal>
			</Show>
		</P.Root>
	);
}
