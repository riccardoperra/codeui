import { omit } from "solid-js";
import { type JSX } from "@solidjs/web";
import * as P from "../../parts/tooltip";
import type { SlotProp } from "../../utils/component";
import type { TooltipVariants } from "./Tooltip.css";

type TooltipSlot = "trigger" | "content";

export type TooltipProps = P.RootProps &
	TooltipVariants &
	SlotProp<TooltipSlot> & {
		content: JSX.Element;
		/** Portal target for the content. Defaults to `document.body`. */
		mount?: globalThis.Element;
	};

export function Tooltip(props: TooltipProps) {
	const others = omit(props, "variant", "slotClasses", "mount", "children", "content");

	return (
		<P.Root {...others}>
			<P.Trigger class={props.slotClasses?.trigger}>{props.children}</P.Trigger>
			<P.Portal mount={props.mount}>
				<P.Content variant={props.variant} class={props.slotClasses?.content}>
					{props.content}
				</P.Content>
			</P.Portal>
		</P.Root>
	);
}
