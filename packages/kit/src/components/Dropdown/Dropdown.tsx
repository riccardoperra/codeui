import { GetKobalteParams } from "../../utils/types";
import { DropdownMenu as KDropdownMenu } from "@kobalte/core";
import * as styles from "./Dropdown.css";
import { JSX, JSXElement, Show } from "solid-js";

export function DropdownMenuContent(
	props: GetKobalteParams<typeof KDropdownMenu.Content>,
) {
	return <KDropdownMenu.Content {...props} class={styles.content} />;
}

export function DropdownMenuPortal(props: GetKobalteParams<typeof KDropdownMenu.Portal>) {
	return <KDropdownMenu.Portal {...props} />;
}

export function DropdownMenuItem(
	props: GetKobalteParams<typeof KDropdownMenu.Item> & {
		rightSlot?: JSXElement;
	},
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
	return <KDropdownMenu.Sub {...props} gutter={-4} />;
}

export function DropdownSubMenuTrigger(
	props: KDropdownMenu.DropdownMenuSubTriggerProps & {
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

export function DropdownSubMenuContent(props: KDropdownMenu.DropdownMenuSubContentProps) {
	return <KDropdownMenu.SubContent {...props} class={styles.subMenuContent} />;
}

export function DropdownMenuSeparator(props: KDropdownMenu.DropdownMenuSeparatorProps) {
	return <KDropdownMenu.Separator {...props} class={styles.separator} />;
}

export function DropdownMenuTrigger(props: KDropdownMenu.DropdownMenuTriggerProps) {
	return <KDropdownMenu.Trigger {...props} />;
}

export function DropdownMenu(props: KDropdownMenu.DropdownMenuRootProps) {
	return <KDropdownMenu.Root {...props} gutter={6} />;
}
