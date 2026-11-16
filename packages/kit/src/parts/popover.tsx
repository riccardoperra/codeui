import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	Popover as KPopover,
	type PopoverAnchorProps as KPopoverAnchorProps,
	type PopoverArrowProps as KPopoverArrowProps,
	type PopoverCloseButtonProps as KPopoverCloseButtonProps,
	type PopoverContentProps as KPopoverContentProps,
	type PopoverDescriptionProps as KPopoverDescriptionProps,
	type PopoverPortalProps as KPopoverPortalProps,
	type PopoverRootProps as KPopoverRootProps,
	type PopoverTitleProps as KPopoverTitleProps,
	type PopoverTriggerProps as KPopoverTriggerProps,
} from "@kobalte/core/popover";
import { mergeProps, splitProps, type ValidComponent } from "solid-js";
import * as styles from "../components/Popover/Popover.css";
import { IconButton, type IconButtonProps } from "../components/IconButton/IconButton";
import { CloseIcon } from "../icons";
import { mergeClasses } from "../utils/css";

export const popoverParts = {
	trigger: "popover-trigger",
	anchor: "popover-anchor",
	content: "popover-content",
	arrow: "popover-arrow",
	title: "popover-title",
	description: "popover-description",
	closeButton: "popover-close-button",
} as const;

export type PopoverPart = keyof typeof popoverParts;
export type PopoverClasses = Partial<Record<PopoverPart, string>>;
export type PopoverVariant = "bordered";

export type PopoverStyles = {
	[P in PopoverPart]: P extends "content" ? (variants?: { variant?: PopoverVariant }) => string : () => string;
};

export const popoverStyles: PopoverStyles = {
	trigger: () => "",
	anchor: () => "",
	content: variants => styles.content({ variant: variants?.variant }),
	arrow: () => "",
	title: () => styles.title,
	description: () => styles.description,
	closeButton: () => "",
};

export type RootProps = KPopoverRootProps;

/** Kobalte's Popover root with a default `gutter` of 6. */
export function Root(props: RootProps) {
	return <KPopover {...mergeProps({ gutter: 6 }, props)} />;
}

export function Portal(props: KPopoverPortalProps) {
	return <KPopover.Portal {...props} />;
}

export function Trigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, KPopoverTriggerProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"button", KPopoverTriggerProps>, ["class"]);
	return (
		<KPopover.Trigger
			data-cui={popoverParts.trigger}
			class={mergeClasses(popoverStyles.trigger(), local.class)}
			{...others}
		/>
	);
}

export function Anchor<T extends ValidComponent = "div">(props: PolymorphicProps<T, KPopoverAnchorProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", KPopoverAnchorProps>, ["class"]);
	return (
		<KPopover.Anchor
			data-cui={popoverParts.anchor}
			class={mergeClasses(popoverStyles.anchor(), local.class)}
			{...others}
		/>
	);
}

export type ContentProps<T extends ValidComponent = "div"> = KPopoverContentProps<T> & {
	variant?: PopoverVariant;
	class?: string;
};

export function Content<T extends ValidComponent = "div">(props: PolymorphicProps<T, ContentProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", ContentProps>, ["class", "variant"]);
	return (
		<KPopover.Content
			data-cui={popoverParts.content}
			class={mergeClasses(popoverStyles.content({ variant: local.variant }), local.class)}
			{...others}
		/>
	);
}

export function Arrow<T extends ValidComponent = "div">(props: PolymorphicProps<T, KPopoverArrowProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", KPopoverArrowProps>, ["class"]);
	return (
		<KPopover.Arrow
			data-cui={popoverParts.arrow}
			class={mergeClasses(popoverStyles.arrow(), local.class)}
			{...others}
		/>
	);
}

export function Title<T extends ValidComponent = "h2">(props: PolymorphicProps<T, KPopoverTitleProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"h2", KPopoverTitleProps>, ["class"]);
	return (
		<KPopover.Title
			data-cui={popoverParts.title}
			class={mergeClasses(popoverStyles.title(), local.class)}
			{...others}
		/>
	);
}

export function Description<T extends ValidComponent = "p">(
	props: PolymorphicProps<T, KPopoverDescriptionProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"p", KPopoverDescriptionProps>, ["class"]);
	return (
		<KPopover.Description
			data-cui={popoverParts.description}
			class={mergeClasses(popoverStyles.description(), local.class)}
			{...others}
		/>
	);
}

export type CloseButtonProps = Omit<PolymorphicProps<"button", IconButtonProps>, "aria-label"> &
	KPopoverCloseButtonProps & {
		/** Accessible name of the button. Defaults to "close". */
		"aria-label"?: string;
	};

export function CloseButton(props: CloseButtonProps) {
	const [local, others] = splitProps(props, ["class", "children", "aria-label"]);
	return (
		<KPopover.CloseButton
			as={IconButton}
			size={"xs"}
			theme={"secondary"}
			{...others}
			data-cui={popoverParts.closeButton}
			aria-label={local["aria-label"] ?? "close"}
			class={mergeClasses(popoverStyles.closeButton(), local.class)}
		>
			{local.children ?? <CloseIcon />}
		</KPopover.CloseButton>
	);
}
