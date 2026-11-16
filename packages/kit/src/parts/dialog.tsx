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
import { type ComponentProps, splitProps, type ValidComponent } from "solid-js";
import * as styles from "../components/Dialog/Dialog.css";
import { IconButton, type IconButtonProps } from "../components/IconButton/IconButton";
import { CloseIcon } from "../icons";
import { mergeClasses } from "../utils/css";

export const dialogParts = {
	trigger: "dialog-trigger",
	overlay: "dialog-overlay",
	positioner: "dialog-positioner",
	panel: "dialog-panel",
	header: "dialog-panel-title",
	title: "dialog-title",
	description: "dialog-description",
	closeButton: "dialog-close-button",
	body: "dialog-panel-content",
	footer: "dialog-panel-footer",
} as const;

export type DialogPart = keyof typeof dialogParts;
export type DialogClasses = Partial<Record<DialogPart, string>>;
export type DialogSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export type DialogStyles = {
	[P in DialogPart]: P extends "panel" ? (variants?: { size?: DialogSize }) => string : () => string;
};

export const dialogStyles: DialogStyles = {
	trigger: () => "",
	overlay: () => styles.overlay,
	positioner: () => mergeClasses(styles.dialogTheme, styles.positioner),
	panel: variants => mergeClasses(styles.dialogTheme, styles.panel({ size: variants?.size })),
	header: () => styles.title,
	title: () => "",
	description: () => styles.description,
	closeButton: () => "",
	body: () => styles.panelContent,
	footer: () => styles.panelFooter,
};

export type RootProps = KDialogRootProps;

export function Root(props: RootProps) {
	return <KDialog {...props} />;
}

export function Portal(props: KDialogPortalProps) {
	return <KDialog.Portal {...props} />;
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
	return (
		<div
			data-cui={dialogParts.positioner}
			data-panel-size={local.size}
			class={mergeClasses(dialogStyles.positioner(), local.class)}
			{...others}
		/>
	);
}

export type ContentProps<T extends ValidComponent = "div"> = KDialogContentProps<T> & {
	size?: DialogSize;
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
		"onOpenAutoFocus",
		"onCloseAutoFocus",
		"onInteractOutside",
	]);
	const context = useDialogContext();
	let opener: HTMLElement | null = null;
	let interactedOutside = false;

	const onOpenAutoFocus = (event: Event) => {
		opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		interactedOutside = false;
		local.onOpenAutoFocus?.(event);
	};

	const onInteractOutside: KDialogContentProps["onInteractOutside"] = event => {
		local.onInteractOutside?.(event);
		if (!context.modal() && !event.defaultPrevented) interactedOutside = true;
	};

	const onCloseAutoFocus = (event: Event) => {
		local.onCloseAutoFocus?.(event);
		const target = opener;
		opener = null;
		if (event.defaultPrevented || context.triggerRef() || interactedOutside) return;
		if (target?.isConnected) target.focus({ preventScroll: true });
	};

	return (
		<KDialog.Content
			data-cui={dialogParts.panel}
			class={mergeClasses(dialogStyles.panel({ size: local.size }), local.class)}
			onOpenAutoFocus={onOpenAutoFocus}
			onCloseAutoFocus={onCloseAutoFocus}
			onInteractOutside={onInteractOutside}
			{...others}
		/>
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
	return (
		<KDialog.CloseButton
			as={IconButton}
			size={"xs"}
			theme={"secondary"}
			{...others}
			data-cui={dialogParts.closeButton}
			aria-label={local["aria-label"] ?? "close"}
			class={mergeClasses(dialogStyles.closeButton(), local.class)}
		>
			{local.children ?? <CloseIcon />}
		</KDialog.CloseButton>
	);
}

export function Body(props: ComponentProps<"div">) {
	const [local, others] = splitProps(props, ["class"]);
	return <div data-cui={dialogParts.body} class={mergeClasses(dialogStyles.body(), local.class)} {...others} />;
}

export function Footer(props: ComponentProps<"div">) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div data-cui={dialogParts.footer} class={mergeClasses(dialogStyles.footer(), local.class)} {...others} />
	);
}
