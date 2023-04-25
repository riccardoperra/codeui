import { Tooltip as KTooltip, As } from "@kobalte/core";
import { createSignal, splitProps, mergeProps, JSX } from "solid-js";
import * as styles from "./Tooltip.css";
import { mergeClasses } from "../../utils/css";

type TooltipProps = KTooltip.TooltipRootProps &
	styles.TooltipVariants & {
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
	const [local, internal, others] = splitProps(props, ["theme"], ["children", "content"]);
	const classes = () =>
		mergeClasses(
			styles.tooltipContent({
				theme: local.theme,
			}),
		);

	return (
		<KTooltip.Root open={open()} onOpenChange={setOpen} {...others}>
			<KTooltip.Trigger asChild>
				<As component={"span"} class={styles.trigger}>
					{internal.children}
				</As>
			</KTooltip.Trigger>
			<KTooltip.Portal>
				<KTooltip.Content class={classes()}>{internal.content}</KTooltip.Content>
			</KTooltip.Portal>
		</KTooltip.Root>
	);
}
