import { omit, Show } from "solid-js";
import { type JSX } from "@solidjs/web";
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
		mount?: globalThis.Element;
	};

export function Tooltip(props: TooltipProps) {
	const others = omit(props, "variant", "slotClasses", "mount", "children", "content");

	// Empty content turns the tooltip off: Kobalte's `disabled` stops hover and focus from opening it,
	// so the trigger never gets an `aria-describedby` that points at a missing bubble.
	const hasContent = () => {
		const content = props.content;
		return content != null && content !== false && content !== "";
	};

	return (
		<P.Root {...others} disabled={props.disabled || !hasContent()}>
			<P.Trigger class={props.slotClasses?.trigger}>{props.children}</P.Trigger>
			<Show when={hasContent()}>
				<P.Portal mount={props.mount}>
					<P.Content variant={props.variant} class={props.slotClasses?.content}>
						{props.content}
					</P.Content>
				</P.Portal>
			</Show>
		</P.Root>
	);
}
