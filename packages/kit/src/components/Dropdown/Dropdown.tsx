import { GetKobalteParams } from "../../utils/types";
import { createDisclosureState, DropdownMenu as KDropdownMenu } from "@kobalte/core";
import * as styles from "./Dropdown.css";
import { createEffect, createSignal, JSX, JSXElement, ParentProps, Show } from "solid-js";
import { DropdownMenuRootOptions } from "@kobalte/core/dist/types/dropdown-menu";
import { animate } from "motion";
import { AnimationContextProvider, useAnimationContext } from "../../utils/animation";

export function DropdownMenuContent(
	props: GetKobalteParams<typeof KDropdownMenu.Content>,
) {
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

	return <KDropdownMenu.Content {...props} class={styles.content} ref={setRef} />;
}

export function DropdownMenuPortal(props: GetKobalteParams<typeof KDropdownMenu.Portal>) {
	return <KDropdownMenu.Portal {...props} />;
}

export function DropdownMenuItem(
	props: GetKobalteParams<typeof KDropdownMenu.Item> & { rightSlot?: JSXElement },
) {
	return (
		<KDropdownMenu.Item {...props} class={styles.item}>
			{props.children}
			<Show when={props.rightSlot} keyed={false}>
				<div class={styles.rightSlot}>{props.rightSlot}</div>
			</Show>
		</KDropdownMenu.Item>
	);
}

export function DropdownSubMenu(props: GetKobalteParams<(typeof KDropdownMenu)["Sub"]>) {
	const [open, setOpen] = createSignal<boolean>(false);
	const internalState = createDisclosureState(props);

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
			<KDropdownMenu.Sub
				{...props}
				isOpen={open()}
				onOpenChange={value => internalState.setIsOpen(value)}
				gutter={12}
				shift={-8}
			/>
		</AnimationContextProvider>
	);
}

export function DropdownSubMenuTrigger(
	props: GetKobalteParams<(typeof KDropdownMenu)["SubTrigger"]> & {
		rightSlot: JSX.Element;
	},
) {
	return (
		<KDropdownMenu.SubTrigger {...props} class={styles.item}>
			{props.children}
			<Show when={props.rightSlot} keyed={false}>
				<div class={styles.rightSlot}>{props.rightSlot}</div>
			</Show>
		</KDropdownMenu.SubTrigger>
	);
}

export function DropdownSubMenuContent(
	props: GetKobalteParams<(typeof KDropdownMenu)["SubContent"]>,
) {
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
		<KDropdownMenu.SubContent {...props} class={styles.subMenuContent} ref={setRef} />
	);
}

export function DropdownMenuSeparator(
	props: GetKobalteParams<(typeof KDropdownMenu)["Separator"]>,
) {
	return <KDropdownMenu.Separator {...props} class={styles.separator} />;
}

export function DropdownMenuTrigger(
	props: GetKobalteParams<(typeof KDropdownMenu)["Trigger"]>,
) {
	return <KDropdownMenu.Trigger {...props} />;
}

export function DropdownMenu(props: ParentProps<DropdownMenuRootOptions>) {
	const [open, setOpen] = createSignal<boolean>(false);
	const internalState = createDisclosureState(props);

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
			<KDropdownMenu.Root
				{...props}
				isOpen={open()}
				gutter={6}
				onOpenChange={value => internalState.setIsOpen(value)}
			/>
		</AnimationContextProvider>
	);
}
