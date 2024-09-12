import {
	Popover as KPopover,
	PopoverContentProps as KPopoverContentProps,
	PopoverRootOptions as KPopoverRootOptions,
} from "@kobalte/core/popover";
import { ParentProps, Show, splitProps, ValidComponent } from "solid-js";
import { mergeClasses } from "../../utils/css";
import { GetKobalteParams } from "../../utils/types";
import * as styles from "./Popover.css";
import { PopoverVariants } from "./Popover.css";
import { PolymorphicProps } from "@kobalte/core/polymorphic";


export function PopoverTrigger(props: GetKobalteParams<(typeof KPopover)["Trigger"]>) {
	return <KPopover.Trigger {...props} />;
}

export type PopoverProps = KPopoverRootOptions;

export function Popover(props: ParentProps<PopoverProps>) {
	const [local, others] = splitProps(props, ["children"]);

	return (
		<KPopover {...others} gutter={6}>
			{local.children}
		</KPopover>
	);
}

type PopoverContentProps<T extends ValidComponent = "div"> = KPopoverContentProps<T> &
	PopoverVariants & {
	title?: string;
};

export function PopoverContent<T extends ValidComponent = "div">(props: PolymorphicProps<T, PopoverContentProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", PopoverContentProps>, ["title", "children", "class", "variant"]);

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
