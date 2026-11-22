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
import { createContext, createSignal, Element, onCleanup, Show, omit, useContext } from "solid-js";
import { ValidComponent } from "@solidjs/web";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { mergeClasses } from "../../utils/css";
import { createPopMotion, motionRef, PopMotionContext } from "../../utils/pop-motion";
import { keepCollectionScrollLocal } from "../../utils/collection-scroll";

type MenuMotion = {
	present: () => boolean | undefined;
	forced: () => boolean | undefined;
	registerSubmenu: (closing: () => boolean) => void;
};

const MenuMotionContext = createContext<MenuMotion | null>(null);

export function DropdownMenuContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KDropdownMenuContentProps<T>>,
) {
	const local = props as PolymorphicProps<"div", KDropdownMenuContentProps>;
	const others = omit(local, "ref", "class", "onOpenAutoFocus");
	const motion = useContext(MenuMotionContext);
	return (
		<Show when={!motion || motion.present()}>
			<KDropdownMenu.Content
				ref={[motionRef(), local.ref]}
				data-cui={"dropdownmenu-content"}
				{...others}
				class={mergeClasses(styles.content, local.class)}
				onOpenAutoFocus={event => {
					local.onOpenAutoFocus?.(event);
					// The collection already focuses its menu or starting item with preventScroll.
					event.preventDefault();
				}}
			/>
		</Show>
	);
}

export function DropdownMenuPortal(props: GetKobalteParams<typeof KDropdownMenu.Portal>) {
	const motion = useContext(MenuMotionContext);
	return (
		<Show when={!motion || motion.present()}>
			<KDropdownMenu.Portal {...props} />
		</Show>
	);
}

export interface DropdownMenuItemProps<T> extends KDropdownMenuItemProps {
	rightSlot?: Element;
}

export function DropdownMenuItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DropdownMenuItemProps<T>>,
) {
	const local = props as PolymorphicProps<"div", DropdownMenuItemProps<T>>;
	const others = omit(local, "rightSlot", "children", "ref");

	return (
		<KDropdownMenu.Item
			data-cui={"dropdownmenu-item"}
			{...others}
			ref={[keepCollectionScrollLocal, local.ref]}
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
	const parent = useContext(MenuMotionContext);
	const motion = createPopMotion(props);
	parent?.registerSubmenu(motion.closing);
	const others = omit(props, "onOpenChange");
	const scope = parent && {
		...parent,
		present: () => parent.forced() || motion.present(),
	};
	return (
		<MenuMotionContext value={scope}>
			<PopMotionContext value={motion.setTarget}>
				<KDropdownMenu.Sub {...others} gutter={props.gutter ?? -4} onOpenChange={motion.onOpenChange} />
			</PopMotionContext>
		</MenuMotionContext>
	);
}

export interface DropdownSubMenuTriggerProps<T> extends KDropdownMenuSubTriggerProps {
	rightSlot?: Element;
}

export function DropdownSubMenuTrigger<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DropdownSubMenuTriggerProps<T>>,
) {
	const local = props as PolymorphicProps<"button", DropdownSubMenuTriggerProps<T>>;
	const others = omit(local, "rightSlot", "children", "class", "ref");

	return (
		<KDropdownMenu.SubTrigger
			{...others}
			ref={[keepCollectionScrollLocal, local.ref]}
			class={mergeClasses(styles.item, local.class)}
		>
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
	const motion = useContext(MenuMotionContext);
	// A submenu opens on hover, so a pointer that only moved counts.
	return (
		<Show when={!motion || motion.present()}>
			<KDropdownMenu.SubContent
				ref={[motionRef({ hover: true }), local.ref]}
				{...others}
				class={mergeClasses(styles.subMenuContent, local.class)}
			/>
		</Show>
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
	const motion = createPopMotion(props);
	const [submenus, setSubmenus] = createSignal<(() => boolean)[]>([], { ownedWrite: true });
	const scope = {
		present: motion.present,
		forced: () => props.forceMount,
		registerSubmenu(closing: () => boolean) {
			setSubmenus(previous => [...previous, closing]);
			onCleanup(() => setSubmenus(previous => previous.filter(submenu => submenu !== closing)));
		},
	};
	const others = omit(props, "forceMount", "onOpenChange");
	return (
		<MenuMotionContext value={scope}>
			<PopMotionContext value={motion.setTarget}>
				<KDropdownMenu
					gutter={6}
					{...others}
					forceMount={motion.forceMount() || submenus().some(closing => closing())}
					onOpenChange={motion.onOpenChange}
				/>
			</PopMotionContext>
		</MenuMotionContext>
	);
}
