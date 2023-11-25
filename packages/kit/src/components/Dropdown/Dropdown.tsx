import { GetKobalteParams } from "../../utils/types";
import { DropdownMenu as KDropdownMenu } from "@kobalte/core";
import * as styles from "./Dropdown.css";
import { JSX, JSXElement, Show, splitProps } from "solid-js";

export function DropdownMenuContent(props: KDropdownMenu.DropdownMenuContentProps) {
	return <KDropdownMenu.Content {...props} class={styles.content} />;
}

export function DropdownMenuPortal(props: GetKobalteParams<typeof KDropdownMenu.Portal>) {
	return <KDropdownMenu.Portal {...props} />;
}

export function DropdownMenuItem(
	props: KDropdownMenu.DropdownMenuItemProps & {
		rightSlot?: JSXElement;
	},
) {
	const [local, others] = splitProps(props, ["rightSlot", "children"]);

	return (
		<KDropdownMenu.Item {...others} class={styles.item}>
			{local.children}
			<Show when={props.rightSlot} keyed={false}>
				<div class={styles.rightSlot}>{props.rightSlot}</div>
			</Show>
		</KDropdownMenu.Item>
	);
}

export function DropdownSubMenu(
	props: KDropdownMenu.DropdownMenuSubProps & {
		rightSlot?: JSXElement;
	},
) {
	return <KDropdownMenu.Sub {...props} gutter={-4} />;
}

export function DropdownSubMenuTrigger(
	props: KDropdownMenu.DropdownMenuSubTriggerProps & {
		rightSlot: JSX.Element;
	},
) {
	const [local, others] = splitProps(props, ["rightSlot", "children"]);

	return (
		<KDropdownMenu.SubTrigger {...others} class={styles.item}>
			{local.children}
			<Show when={local.rightSlot} keyed={false}>
				<div class={styles.rightSlot}>{local.rightSlot}</div>
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
