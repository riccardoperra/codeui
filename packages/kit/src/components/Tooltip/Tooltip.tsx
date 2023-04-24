import { Tooltip as KTooltip } from "@kobalte/core";
import { createSignal, splitProps } from "solid-js";
import * as styles from "./Tooltip.css";
import { mergeClasses } from "../../utils/css";

type TooltipProps = KTooltip.TooltipRootProps &
	styles.TooltipVariants & {
		content: string;
	};

export function Tooltip(props: TooltipProps) {
	const [open, setOpen] = createSignal(true);
	const [local, internal, others] = splitProps(props, ["theme"], ["children", "content"]);
	const classes = () =>
		mergeClasses(
			styles.tooltipContent({
				theme: local.theme,
			}),
		);
	return (
		<KTooltip.Root open={open()} onOpenChange={setOpen} {...others}>
			<KTooltip.Trigger>{internal.children}</KTooltip.Trigger>
			<KTooltip.Portal>
				<KTooltip.Content class={classes()}>{internal.content}</KTooltip.Content>
			</KTooltip.Portal>
		</KTooltip.Root>
	);
}
