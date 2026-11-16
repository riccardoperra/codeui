import { Tooltip as KTooltip, TooltipRootProps as KTooltipRootProps } from "@kobalte/core/tooltip";
import { createSignal, JSX, mergeProps, splitProps } from "solid-js";
import { SlotProp } from "../../utils/component";
import { mergeClasses } from "../../utils/css";
import * as styles from "./Tooltip.css";

type TooltipSlot = "trigger" | "content";

type TooltipProps = KTooltipRootProps &
	styles.TooltipVariants &
	SlotProp<TooltipSlot> & {
	content: JSX.Element;
};

// Kobalte 0.13.13+ sets type="button" on the trigger. On a div it means nothing, and CSS resets that target [type="button"] would restyle it.
function TriggerElement(props: JSX.HTMLAttributes<HTMLDivElement> & { type?: string }) {
	const [, others] = splitProps(props, ["type"]);
	return <div {...others} />;
}

export function Tooltip(props: TooltipProps) {
	props = mergeProps(
		{
			gutter: 4,
			shift: 0,
			openDelay: 200,
			closeDelay: 0,
		},
		props,
	);

	const [open, setOpen] = createSignal(false);
	const [local, internal, others] = splitProps(
		props,
		["theme", "slotClasses"],
		["children", "content"],
	);

	const contentClasses = () =>
		mergeClasses(
			local.slotClasses?.content,
			styles.tooltipContent({
				theme: local.theme,
			}),
		);

	return (
		<KTooltip open={open()} onOpenChange={setOpen} {...others}>
			<KTooltip.Trigger as={TriggerElement} class={mergeClasses(local.slotClasses?.trigger, styles.trigger)}>
				{internal.children}
			</KTooltip.Trigger>
			<KTooltip.Portal>
				<KTooltip.Content class={contentClasses()}>{internal.content}</KTooltip.Content>
			</KTooltip.Portal>
		</KTooltip>
	);
}
