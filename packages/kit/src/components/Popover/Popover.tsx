import { createDisclosureState, Popover as KPopover } from "@kobalte/core";
import { AnimationContextProvider, useAnimationContext } from "../../utils/animation";
import { createEffect, createSignal, ParentProps, Show, splitProps } from "solid-js";
import * as styles from "./Popover.css";
import { GetKobalteParams } from "../../utils/types";
import { animate } from "motion";

type PopoverProps = KPopover.PopoverRootOptions & {
	title?: string;
};

export function PopoverTrigger(props: GetKobalteParams<(typeof KPopover)["Trigger"]>) {
	return <KPopover.Trigger {...props} />;
}

export function Popover(props: ParentProps<PopoverProps>) {
	const [open, setOpen] = createSignal<boolean>(false);
	const internalState = createDisclosureState(props);

	const [local, others] = splitProps(props, ["children", "title"]);

	createEffect(() => {
		if (internalState.isOpen()) {
			setOpen(true);
		}
	});

	return (
		<AnimationContextProvider
			state={internalState.isOpen()}
			onExitAnimationFinish={() => setOpen(false)}
		>
			<KPopover.Root
				{...others}
				isOpen={open()}
				onOpenChange={value => internalState.setIsOpen(value)}
				gutter={6}
			>
				{local.children}
			</KPopover.Root>
		</AnimationContextProvider>
	);
}

export function PopoverContent(props: ParentProps<{ title?: string }>) {
	const { setRef, registerOnExit, registerOnEnter } = useAnimationContext();

	registerOnEnter(ref =>
		animate(ref, {
			opacity: [0, 1],
			transform: ["translateY(-10px)", "translateY(0px)"],
		}),
	);

	registerOnExit(ref =>
		animate(ref, {
			opacity: 0,
			transform: "translateY(-10px)",
		}),
	);

	return (
		<KPopover.Portal>
			<KPopover.Content class={styles.content} ref={setRef}>
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
