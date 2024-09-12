import { GetKobalteParams } from "../../utils/types";
import {
	DropdownMenu as KDropdownMenu,
	DropdownMenuContentProps as KDropdownMenuContentProps,
	DropdownMenuItemProps as KDropdownMenuItemProps,
	DropdownMenuRootProps as KDropdownMenuRootProps,
	DropdownMenuSeparatorProps as KDropdownMenuSeparatorProps,
	DropdownMenuSubContentProps as KDropdownMenuSubContentProps,
	DropdownMenuSubProps as KDropdownMenuSubProps,
	DropdownMenuSubTriggerProps as KDropdownMenuSubTriggerProps,
	DropdownMenuTriggerProps as KDropdownMenuTriggerProps,
} from "@kobalte/core/dropdown-menu";
import * as styles from "./Dropdown.css";
import { JSXElement, Show, splitProps, ValidComponent } from "solid-js";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

export function DropdownMenuContent<T extends ValidComponent = "div">(props: PolymorphicProps<T, KDropdownMenuContentProps<T>>) {
	return <KDropdownMenu.Content {...props} class={styles.content} />;
}

export function DropdownMenuPortal(props: GetKobalteParams<typeof KDropdownMenu.Portal>) {
	return <KDropdownMenu.Portal {...props} />;
}

export interface DropdownMenuItemProps<T> extends KDropdownMenuItemProps {
	rightSlot?: JSXElement;
}

export function DropdownMenuItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DropdownMenuItemProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", DropdownMenuItemProps<T>>, ["rightSlot", "children"]);

	return (
		<KDropdownMenu.Item {...others} class={styles.item}>
			{local.children}
			<Show when={props.rightSlot} keyed={false}>
				<div class={styles.rightSlot}>{props.rightSlot}</div>
			</Show>
		</KDropdownMenu.Item>
	);
}

export interface DropdownSubMenuProps<T> extends KDropdownMenuSubProps {
	rightSlot?: JSXElement;
}

export function DropdownSubMenu<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DropdownSubMenuProps<T>>,
) {
	return <KDropdownMenu.Sub {...props} gutter={-4} />;
}

export interface DropdownSubMenuTriggerProps<T> extends KDropdownMenuSubTriggerProps {
	rightSlot?: JSXElement;
}

export function DropdownSubMenuTrigger<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DropdownSubMenuTriggerProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"button", DropdownSubMenuTriggerProps<T>>, ["rightSlot", "children"]);

	return (
		<KDropdownMenu.SubTrigger {...others} class={styles.item}>
			{local.children}
			<Show when={local.rightSlot} keyed={false}>
				<div class={styles.rightSlot}>{local.rightSlot}</div>
			</Show>
		</KDropdownMenu.SubTrigger>
	);
}

export function DropdownSubMenuContent<T extends ValidComponent = "div">(props: PolymorphicProps<T, KDropdownMenuSubContentProps<T>>) {
	return <KDropdownMenu.SubContent {...props} class={styles.subMenuContent} />;
}

export function DropdownMenuSeparator<T extends ValidComponent = "div">(props: PolymorphicProps<T, KDropdownMenuSeparatorProps<T>>) {
	return <KDropdownMenu.Separator {...props} class={styles.separator} />;
}

export function DropdownMenuTrigger<T extends ValidComponent = "div">(props: PolymorphicProps<T, KDropdownMenuTriggerProps<T>>) {
	return <KDropdownMenu.Trigger {...props} />;
}

export function DropdownMenu<T extends ValidComponent = "div">(props: PolymorphicProps<T, KDropdownMenuRootProps>) {
	return <KDropdownMenu gutter={6} {...props} />;
}
