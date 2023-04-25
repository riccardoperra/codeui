import { As, Tooltip as KTooltip } from "@kobalte/core";
import { createSignal, JSX, mergeProps, splitProps } from "solid-js";
import { SlotProp } from "../../utils/component";
import { mergeClasses } from "../../utils/css";
import * as styles from "./Tooltip.css";

type TooltipSlot = "trigger" | "content";

type TooltipProps = KTooltip.TooltipRootProps &
	styles.TooltipVariants &
	SlotProp<TooltipSlot> & {
		content: JSX.Element;
	};

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
		<KTooltip.Root open={open()} onOpenChange={setOpen} {...others}>
			<KTooltip.Trigger asChild>
				<As
					component={"div"}
					class={mergeClasses(local.slotClasses?.trigger, styles.trigger)}
				>
					{internal.children}
				</As>
			</KTooltip.Trigger>
			<KTooltip.Portal>
				<KTooltip.Content class={contentClasses()}>{internal.content}</KTooltip.Content>
			</KTooltip.Portal>
		</KTooltip.Root>
	);
}
