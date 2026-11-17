import { HydratablePortal } from "../utils/hydratable-portal";
import "@codeui/styles/theme.css";
import "@codeui/styles/dialog.css";
import {
	Dialog as KDialog,
	type DialogCloseButtonProps as KDialogCloseButtonProps,
	type DialogContentProps as KDialogContentProps,
	type DialogDescriptionProps as KDialogDescriptionProps,
	type DialogOverlayProps as KDialogOverlayProps,
	type DialogPortalProps as KDialogPortalProps,
	type DialogRootProps as KDialogRootProps,
	type DialogTitleProps as KDialogTitleProps,
	type DialogTriggerProps as KDialogTriggerProps,
	useDialogContext,
} from "@kobalte/core/dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { callHandler } from "@kobalte/utils";
import {
	type Accessor,
	type ComponentProps,
	createContext,
	createMemo,
	type JSX,
	onMount,
	Show,
	splitProps,
	useContext,
	type ValidComponent,
} from "solid-js";
import * as styles from "../components/Dialog/Dialog.css";
import { IconButton, type IconButtonProps } from "../components/IconButton/IconButton";
import { CloseIcon } from "../icons";
import { mergeClasses } from "../utils/css";
import { createFocusReturn } from "./dialog-focus";
import { pointerInitiated, trackInput } from "../utils/open-source";


import { dialogParts, type DialogPart, type DialogThemeVar, dialogThemeVars, type DialogClasses, type DialogSize, type DialogChrome, type DialogMotion, type DialogBodyLayout, type DialogSectionVariant, type DialogStyles, dialogStyles } from "@codeui/styles/dialog";
export { dialogParts, type DialogPart, type DialogThemeVar, dialogThemeVars, type DialogClasses, type DialogSize, type DialogChrome, type DialogMotion, type DialogBodyLayout, type DialogSectionVariant, type DialogStyles, dialogStyles } from "@codeui/styles/dialog";
type MotionContextValue = { moves: Accessor<boolean> };
const MotionContext = createContext<MotionContextValue>();

type ChromeContextValue = { chrome: Accessor<DialogChrome> };
const ChromeContext = createContext<ChromeContextValue>({ chrome: (): DialogChrome => "bar" });

function MotionScope(props: { motion?: DialogMotion; children?: JSX.Element }) {
	const dialog = useDialogContext();
	const moves = createMemo(() => {
		dialog.isOpen();
		return props.motion !== "none" && pointerInitiated();
	});
	return <MotionContext.Provider value={{ moves }}>{props.children}</MotionContext.Provider>;
}

/** `none` while the dialog opened or closed from the keyboard or from code. */
function motionAttribute() {
	const context = useContext(MotionContext);
	return () => (context?.moves() ? undefined : "none");
}

export type RootProps = KDialogRootProps & {
	/**
	 * `auto` animates opens and closes that start with a pointer press. Keyboard
	 * and programmatic ones do not move. `none` never animates. Defaults to `auto`.
	 */
	motion?: DialogMotion;
};

export function Root(props: RootProps) {
	const [local, others] = splitProps(props, ["motion", "children"]);
	onMount(trackInput);
	return (
		<KDialog {...others}>
			<MotionScope motion={local.motion}>{local.children}</MotionScope>
		</KDialog>
	);
}

export function Portal(props: KDialogPortalProps) {
	const context = useDialogContext();
	return <Show when={context.contentPresent() || context.overlayPresent()}><HydratablePortal {...props} /></Show>;
}

export function Trigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, KDialogTriggerProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"button", KDialogTriggerProps>, ["class"]);
	return (
		<KDialog.Trigger
			data-cui={dialogParts.trigger}
			class={mergeClasses(dialogStyles.trigger(), local.class)}
			{...others}
		/>
	);
}

export function Overlay<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KDialogOverlayProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", KDialogOverlayProps>, ["class"]);
	return (
		<KDialog.Overlay
			data-cui={dialogParts.overlay}
			class={mergeClasses(dialogStyles.overlay(), local.class)}
			{...others}
		/>
	);
}

export type PositionerProps = ComponentProps<"div"> & { size?: DialogSize };

export function Positioner(props: PositionerProps) {
	const [local, others] = splitProps(props, ["class", "size"]);
	const motion = motionAttribute();
	return (
		<div
			data-cui={dialogParts.positioner}
			data-panel-size={local.size}
			data-motion={motion()}
			class={mergeClasses(dialogStyles.positioner(), local.class)}
			{...others}
		/>
	);
}

export type ContentProps<T extends ValidComponent = "div"> = KDialogContentProps<T> & {
	size?: DialogSize;
	/** How the header sits in the panel. Defaults to `bar`. */
	chrome?: DialogChrome;
	class?: string;
};

/**
 * Kobalte returns focus to the Trigger part only. Without a Trigger, Content
 * returns focus to the element that had it when the dialog opened.
 */
export function Content<T extends ValidComponent = "div">(props: PolymorphicProps<T, ContentProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", ContentProps>, [
		"class",
		"size",
		"chrome",
		"onOpenAutoFocus",
		"onCloseAutoFocus",
		"onInteractOutside",
	]);
	const focus = createFocusReturn(local);
	const motion = motionAttribute();
	const chrome = () => local.chrome ?? "bar";

	return (
		<ChromeContext.Provider value={{ chrome }}>
			<KDialog.Content
				data-cui={dialogParts.panel}
				data-chrome={chrome()}
				data-size={local.size}
				data-motion={motion()}
				class={mergeClasses(dialogStyles.panel(), local.class)}
				{...focus}
				{...others}
			/>
		</ChromeContext.Provider>
	);
}

export function Header(props: ComponentProps<"div">) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div data-cui={dialogParts.header} class={mergeClasses(dialogStyles.header(), local.class)} {...others} />
	);
}

export function Title<T extends ValidComponent = "h2">(props: PolymorphicProps<T, KDialogTitleProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"h2", KDialogTitleProps>, ["class"]);
	return (
		<KDialog.Title
			data-cui={dialogParts.title}
			class={mergeClasses(dialogStyles.title(), local.class)}
			{...others}
		/>
	);
}

export function Description<T extends ValidComponent = "p">(
	props: PolymorphicProps<T, KDialogDescriptionProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"p", KDialogDescriptionProps>, ["class"]);
	return (
		<KDialog.Description
			data-cui={dialogParts.description}
			class={mergeClasses(dialogStyles.description(), local.class)}
			{...others}
		/>
	);
}

export type CloseButtonProps = Omit<PolymorphicProps<"button", IconButtonProps>, "aria-label"> &
	KDialogCloseButtonProps & {
		/** Accessible name of the button. Defaults to "close". */
		"aria-label"?: string;
	};

export function CloseButton(props: CloseButtonProps) {
	const [local, others] = splitProps(props, ["class", "children", "aria-label"]);
	const { chrome } = useContext(ChromeContext);
	return (
		<KDialog.CloseButton
			as={IconButton}
			size={chrome() === "inset" ? "sm" : "xs"}
			theme={"secondary"}
			variant={chrome() === "inset" ? "ghost" : undefined}
			{...others}
			data-cui={dialogParts.closeButton}
			aria-label={local["aria-label"] ?? "close"}
			class={mergeClasses(dialogStyles.closeButton(), local.class)}
		>
			{local.children ?? <CloseIcon />}
		</KDialog.CloseButton>
	);
}

export type BodyProps = ComponentProps<"div"> & {
	/** `split` puts a preview beside its options, in one column on a phone. */
	layout?: DialogBodyLayout;
};

export function Body(props: BodyProps) {
	const [local, others] = splitProps(props, ["class", "layout"]);
	return (
		<div
			data-cui={dialogParts.body}
			data-layout={local.layout}
			class={mergeClasses(dialogStyles.body({ layout: local.layout }), local.class)}
			{...others}
		/>
	);
}

export function Footer(props: ComponentProps<"div">) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div data-cui={dialogParts.footer} class={mergeClasses(dialogStyles.footer(), local.class)} {...others} />
	);
}

export type SidebarProps = ComponentProps<"div"> & {
	/** Content above the navigation, such as a search field. */
	search?: JSX.Element;
	classes?: Pick<DialogClasses, "sidebarSearch">;
};

/**
 * The left pane of a settings dialog: a 232px column on its own surface. On a
 * phone it becomes rows above the body.
 */
export function Sidebar(props: SidebarProps) {
	const [local, others] = splitProps(props, ["class", "classes", "search", "children"]);
	return (
		<div data-cui={dialogParts.sidebar} class={mergeClasses(dialogStyles.sidebar(), local.class)} {...others}>
			<Show when={local.search}>
				{search => (
					<div
						data-cui={dialogParts.sidebarSearch}
						class={mergeClasses(dialogStyles.sidebarSearch(), local.classes?.sidebarSearch)}
					>
						{search()}
					</div>
				)}
			</Show>
			{local.children}
		</div>
	);
}

const navItemSelector = `[data-cui="${dialogParts.navItem}"]:not(:disabled)`;

const navStep: Record<string, number | "first" | "last"> = {
	ArrowDown: 1,
	ArrowRight: 1,
	ArrowUp: -1,
	ArrowLeft: -1,
	Home: "first",
	End: "last",
};

export type NavProps = Omit<ComponentProps<"nav">, "aria-label"> & {
	/** Accessible name of the navigation, such as "Settings sections". */
	"aria-label": string;
};

/**
 * A list of sections. Arrow keys move focus between the items, Home and End
 * jump to the ends, and Enter or Space selects the focused item.
 */
export function Nav(props: NavProps) {
	const [local, others] = splitProps(props, ["class", "children", "onKeyDown"]);
	const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = event => {
		callHandler(event, local.onKeyDown);
		const step = navStep[event.key];
		if (step === undefined || event.defaultPrevented) return;
		const items = [...event.currentTarget.querySelectorAll<HTMLElement>(navItemSelector)];
		const index = items.findIndex(item => item === document.activeElement);
		if (index < 0) return;
		event.preventDefault();
		const next =
			step === "first"
				? 0
				: step === "last"
					? items.length - 1
					: (index + step + items.length) % items.length;
		items[next]?.focus();
	};
	return (
		<nav
			data-cui={dialogParts.nav}
			class={mergeClasses(dialogStyles.nav(), local.class)}
			onKeyDown={onKeyDown}
			{...others}
		>
			<ul class={styles.navList}>{local.children}</ul>
		</nav>
	);
}

export type NavItemProps = ComponentProps<"button"> & {
	/** Marks the section on screen with `aria-current="page"` and a field fill. */
	current?: boolean;
	/** A 16px icon before the label. Hidden on a phone. */
	icon?: JSX.Element;
	classes?: Pick<DialogClasses, "navIcon">;
};

export function NavItem(props: NavItemProps) {
	const [local, others] = splitProps(props, ["class", "classes", "current", "icon", "children"]);
	return (
		<li>
			<button
				type="button"
				data-cui={dialogParts.navItem}
				aria-current={local.current ? "page" : undefined}
				class={mergeClasses(dialogStyles.navItem(), local.class)}
				{...others}
			>
				<Show when={local.icon}>
					{icon => (
						<span
							data-cui={dialogParts.navIcon}
							aria-hidden="true"
							class={mergeClasses(dialogStyles.navIcon(), local.classes?.navIcon)}
						>
							{icon()}
						</span>
					)}
				</Show>
				{local.children}
			</button>
		</li>
	);
}

/** The pane next to the sidebar. Put the `Header` and the `Body` in it. */
export function Main(props: ComponentProps<"div">) {
	const [local, others] = splitProps(props, ["class"]);
	return <div data-cui={dialogParts.main} class={mergeClasses(dialogStyles.main(), local.class)} {...others} />;
}

export type SectionProps = Omit<ComponentProps<"section">, "title"> & {
	/** Heading of the section. `group` puts it over the island, `well` inside it. */
	title?: JSX.Element;
	/**
	 * `group` is a title over one island of rows that touch. `well` makes the
	 * section itself the island, for a preview or a block of actions.
	 * Defaults to `group`.
	 */
	variant?: DialogSectionVariant;
	/** Lays the content out in two columns, one on a phone. Defaults to 1. */
	columns?: 1 | 2;
	classes?: Pick<DialogClasses, "sectionTitle" | "sectionContent">;
};

export function Section(props: SectionProps) {
	const [local, others] = splitProps(props, ["class", "classes", "title", "variant", "columns", "children"]);
	const variant = () => local.variant ?? "group";
	return (
		<section
			data-cui={dialogParts.section}
			data-variant={variant()}
			data-columns={local.columns === 2 ? "2" : undefined}
			class={mergeClasses(styles.section.classNames.base, local.class)}
			{...others}
		>
			<Show when={local.title}>
				{title => (
					<h3
						data-cui={dialogParts.sectionTitle}
						class={mergeClasses(dialogStyles.sectionTitle(), local.classes?.sectionTitle)}
					>
						{title()}
					</h3>
				)}
			</Show>
			<div
				data-cui={dialogParts.sectionContent}
				class={mergeClasses(dialogStyles.sectionContent(), local.classes?.sectionContent)}
			>
				{local.children}
			</div>
		</section>
	);
}
