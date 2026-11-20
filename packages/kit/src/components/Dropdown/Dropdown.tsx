import "@codeui/styles/theme.css";
import "@codeui/styles/dropdownmenu.css";
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
import { Element, Show, omit } from "solid-js";
import { ValidComponent } from "@solidjs/web";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { mergeClasses } from "../../utils/css";
import { motionRef } from "../../utils/open-source";

export function DropdownMenuContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KDropdownMenuContentProps<T>>,
) {
	const local = props as PolymorphicProps<"div", KDropdownMenuContentProps>;
	const others = omit(local, "ref", "class");
	return (
		<KDropdownMenu.Content
			ref={[motionRef(), local.ref]}
			data-cui={"dropdownmenu-content"}
			{...others}
			class={mergeClasses(styles.content, local.class)}
		/>
	);
}

export function DropdownMenuPortal(props: GetKobalteParams<typeof KDropdownMenu.Portal>) {
	return <KDropdownMenu.Portal {...props} />;
}

export interface DropdownMenuItemProps<T> extends KDropdownMenuItemProps {
	rightSlot?: Element;
}

export function DropdownMenuItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DropdownMenuItemProps<T>>,
) {
	const local = props as PolymorphicProps<"div", DropdownMenuItemProps<T>>;
	const others = omit(local, "rightSlot", "children");

	return (
		<KDropdownMenu.Item
			data-cui={"dropdownmenu-item"}
			{...others}
			class={mergeClasses(styles.item, props.class)}
		>
			{local.children}
			<Show when={props.rightSlot} keyed={false}>
				{rightSlot => <div class={styles.rightSlot}>{rightSlot()}</div>}
			</Show>
		</KDropdownMenu.Item>
	);
}

export interface DropdownSubMenuProps<T> extends KDropdownMenuSubProps {
	rightSlot?: Element;
}

export function DropdownSubMenu<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DropdownSubMenuProps<T>>,
) {
	return <KDropdownMenu.Sub {...props} gutter={props.gutter ?? -4} />;
}

export interface DropdownSubMenuTriggerProps<T> extends KDropdownMenuSubTriggerProps {
	rightSlot?: Element;
}

export function DropdownSubMenuTrigger<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DropdownSubMenuTriggerProps<T>>,
) {
	const local = props as PolymorphicProps<"button", DropdownSubMenuTriggerProps<T>>;
	const others = omit(local, "rightSlot", "children", "class");

	return (
		<KDropdownMenu.SubTrigger {...others} class={mergeClasses(styles.item, local.class)}>
			{local.children}
			<Show when={local.rightSlot} keyed={false}>
				{rightSlot => <div class={styles.rightSlot}>{rightSlot()}</div>}
			</Show>
		</KDropdownMenu.SubTrigger>
	);
}

export function DropdownSubMenuContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KDropdownMenuSubContentProps<T>>,
) {
	const local = props as PolymorphicProps<"div", KDropdownMenuSubContentProps>;
	const others = omit(local, "ref", "class");
	// A submenu opens on hover, so a pointer that only moved counts.
	return (
		<KDropdownMenu.SubContent
			ref={[motionRef({ hover: true }), local.ref]}
			{...others}
			class={mergeClasses(styles.subMenuContent, local.class)}
		/>
	);
}

export function DropdownMenuSeparator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KDropdownMenuSeparatorProps<T>>,
) {
	return (
		<KDropdownMenu.Separator
			{...props}
			class={mergeClasses(styles.separator, props.class)}
		/>
	);
}

export function DropdownMenuTrigger<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KDropdownMenuTriggerProps<T>>,
) {
	return <KDropdownMenu.Trigger {...props} />;
}

export function DropdownMenu<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KDropdownMenuRootProps>,
) {
	return <KDropdownMenu gutter={6} {...props} />;
}
