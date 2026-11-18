import { splitProps, type JSX } from "solid-js";
import * as P from "../../parts/tooltip";
import type { SlotProp } from "../../utils/component";
import type { TooltipVariants } from "./Tooltip.css";

type TooltipSlot = "trigger" | "content";

export type TooltipProps = P.RootProps &
	TooltipVariants &
	SlotProp<TooltipSlot> & {
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

	return (
		<P.Root {...others}>
			<P.Trigger class={local.slotClasses?.trigger}>{local.children}</P.Trigger>
			<P.Portal mount={local.mount}>
				<P.Content variant={local.variant} class={local.slotClasses?.content}>
					{local.content}
				</P.Content>
			</P.Portal>
		</P.Root>
	);
}
