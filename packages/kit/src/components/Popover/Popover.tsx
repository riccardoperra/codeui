import { Popover as KPopover } from "@kobalte/core";
import { ParentProps, Show, splitProps } from "solid-js";
import { mergeClasses } from "../../utils/css";
import { GetKobalteParams } from "../../utils/types";
import * as styles from "./Popover.css";
import { PopoverVariants } from "./Popover.css";

type PopoverProps = KPopover.PopoverRootOptions;

export function PopoverTrigger(props: GetKobalteParams<(typeof KPopover)["Trigger"]>) {
	return <KPopover.Trigger {...props} />;
}

export function Popover(props: ParentProps<PopoverProps>) {
	const [local, others] = splitProps(props, ["children"]);

	return (
		<KPopover.Root {...others} gutter={6}>
			{local.children}
		</KPopover.Root>
	);
}

type PopoverContentProps = KPopover.PopoverContentProps &
	PopoverVariants & {
		title?: string;
	};

export function PopoverContent(props: ParentProps<PopoverContentProps>) {
	const [local, others] = splitProps(props, ["title", "children", "class", "variant"]);

	const contentClass = () =>
		mergeClasses(
			styles.content({
				variant: local.variant,
			}),
			props.class,
		);

	return (
		<KPopover.Portal>
			<KPopover.Content class={contentClass()} {...others}>
				<Show when={local.title} keyed={false}>
					<div class={styles.title}>
						<KPopover.Title>{local.title}</KPopover.Title>
					</div>
				</Show>
				<KPopover.Description class={styles.description}>
					{local.children}
				</KPopover.Description>
			</KPopover.Content>
		</KPopover.Portal>
	);
}
