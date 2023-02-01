import { Popover as KPopover } from "@kobalte/core";
import { ParentProps, Show, splitProps } from "solid-js";
import * as styles from "./Popover.css";
import { GetKobalteParams } from "../../utils/types";

type PopoverProps = KPopover.PopoverRootOptions & {
	title?: string;
};

export function PopoverTrigger(props: GetKobalteParams<(typeof KPopover)["Trigger"]>) {
	return <KPopover.Trigger {...props} />;
}

export function Popover(props: ParentProps<PopoverProps>) {
	const [local, others] = splitProps(props, ["children", "title"]);

	return (
		<KPopover.Root {...others} gutter={6}>
			{local.children}
		</KPopover.Root>
	);
}

export function PopoverContent(props: ParentProps<{ title?: string }>) {
	// const { setRef, registerOnExit, registerOnEnter } = useAnimationContext();
	//
	// registerOnEnter(ref =>
	// 	animate(ref, {
	// 		opacity: [0, 1],
	// 		transform: ["translateY(-10px)", "translateY(0px)"],
	// 	}),
	// );
	//
	// registerOnExit(ref =>
	// 	animate(ref, {
	// 		opacity: 0,
	// 		transform: "translateY(-10px)",
	// 	}),
	// );

	return (
		<KPopover.Portal>
			<KPopover.Content class={styles.content}>
				<Show when={props.title} keyed={false}>
					<div class={styles.title}>
						<KPopover.Title>{props.title}</KPopover.Title>
					</div>
				</Show>
				<KPopover.Description class={styles.description}>
					{props.children}
				</KPopover.Description>
			</KPopover.Content>
		</KPopover.Portal>
	);
}
