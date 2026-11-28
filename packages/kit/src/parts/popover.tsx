import { pickProps } from "../utils/pick-props";
import { popoverStyleProps } from "@codeui/styles/popover";
import { HydratablePortal } from "../utils/hydratable-portal";
import "@codeui/styles/theme.css";
import "@codeui/styles/popover.css";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	Popover as KPopover,
	usePopoverContext,
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
import { createEffect, createSignal, Show, omit } from "solid-js";
import { type ValidComponent } from "@solidjs/web";
import * as styles from "../components/Popover/Popover.css";
import { IconButton, type IconButtonProps } from "../components/IconButton/IconButton";
import { CloseIcon } from "../icons";
import { mergeClasses } from "../utils/css";
import { createLayer, LayerScope, useNestedLayerMarker } from "../utils/layer-scope";
import { createPopMotion, motionRef, PopMotionContext } from "../utils/pop-motion";

import { popoverParts, type PopoverPart, type PopoverClasses, type PopoverVariant, type PopoverStyles, popoverStyles } from "@codeui/styles/popover";
export { popoverParts, type PopoverPart, type PopoverClasses, type PopoverVariant, type PopoverStyles, popoverStyles } from "@codeui/styles/popover";
export type RootProps = KPopoverRootProps;

/** Kobalte's Popover root with a default `gutter` of 6. */
export function Root(props: RootProps) {
	const others = omit(props, "forceMount", "onOpenChange");
	const motion = createPopMotion(props);
	return (
		<PopMotionContext value={motion.setTarget}>
			<KPopover
				{...others}
				gutter={props.gutter ?? 6}
				forceMount={motion.forceMount()}
				onOpenChange={motion.onOpenChange}
			/>
		</PopMotionContext>
	);
}

export function Portal(props: KPopoverPortalProps) {
	const context = usePopoverContext();
	return <Show when={context.contentPresent()}><HydratablePortal {...props} /></Show>;
}

export function Trigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, KPopoverTriggerProps<T>>,
) {
	const local = props as PolymorphicProps<"button", KPopoverTriggerProps>;
	const others = omit(local, "class");
	return (
		<KPopover.Trigger
			data-cui={popoverParts.trigger}
			class={mergeClasses(popoverStyles.trigger(), local.class)}
			{...others}
		/>
	);
}

export function Anchor<T extends ValidComponent = "div">(props: PolymorphicProps<T, KPopoverAnchorProps<T>>) {
	const local = props as PolymorphicProps<"div", KPopoverAnchorProps>;
	const others = omit(local, "class");
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
	const local = props as PolymorphicProps<"div", ContentProps>;
	const others = omit(local, "class", "variant", "ref", "onInteractOutside", "onPointerDownOutside", "onFocusOutside");
	const context = usePopoverContext();
	const [element, setElement] = createSignal<HTMLElement>();
	const nestedLayerMarker = useNestedLayerMarker();
	const layer = createLayer({
		open: context.isOpen,
		modal: context.isModal,
		ref: element,
		close: context.close,
		onEscapeKeyDown: event => local.onEscapeKeyDown?.(event),
	});
	const layerOptions = { bypassTopMostLayerCheck: layer.bypassTopMostLayerCheck };
	let interactedOutside = false;
	// The engine's focus trap only runs for modal popovers.
	createEffect(
		() => context.isOpen() && !context.isModal() ? element() : undefined,
		content => {
			if (!content) return;
			interactedOutside = false;
			const previous = document.activeElement;
			const open = new CustomEvent("focusTrap.initialFocus", { cancelable: true });
			local.onOpenAutoFocus?.(open);
			if (!open.defaultPrevented) {
				const first = content.querySelector<HTMLElement>(
					'button:not([disabled]):not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]',
				);
				(first ?? content).focus({ preventScroll: true });
			}
			return () => {
				const outside = interactedOutside;
				queueMicrotask(() => {
					if (context.isOpen()) return;
					const close = new CustomEvent("focusTrap.finalFocus", { cancelable: true });
					local.onCloseAutoFocus?.(close);
					if (close.defaultPrevented || outside) return;
					const target = context.triggerRef() ?? previous;
					if (target instanceof HTMLElement && target.isConnected)
						target.focus({ preventScroll: true });
				});
			};
		},
	);

	return (
		<LayerScope layer={layer.scope}>
			<KPopover.Content
				{...layerOptions}
				ref={[motionRef(), local.ref, setElement]}
				onPointerDownOutside={event => {
					if (layer.allowsOutsideInteraction(event)) local.onPointerDownOutside?.(event);
				}}
				onFocusOutside={event => {
					if (layer.allowsOutsideInteraction(event)) local.onFocusOutside?.(event);
				}}
				onInteractOutside={event => {
					if (!layer.allowsOutsideInteraction(event)) return;
					local.onInteractOutside?.(event);
					if (!event.defaultPrevented && !context.triggerRef()?.contains(event.target as Node)) {
						interactedOutside = true;
					}
				}}
				data-cui={popoverParts.content}
				data-kb-top-layer={nestedLayerMarker()}
				data-variant={popoverStyleProps({ variant: local.variant })["data-variant"]}
				class={mergeClasses(styles.content(), local.class)}
				{...others}
			/>
		</LayerScope>
	);
}

export function Arrow<T extends ValidComponent = "div">(props: PolymorphicProps<T, KPopoverArrowProps<T>>) {
	const local = props as PolymorphicProps<"div", KPopoverArrowProps>;
	const others = omit(local, "class");
	return (
		<KPopover.Arrow
			data-cui={popoverParts.arrow}
			class={mergeClasses(popoverStyles.arrow(), local.class)}
			{...others}
		/>
	);
}

export function Title<T extends ValidComponent = "h2">(props: PolymorphicProps<T, KPopoverTitleProps<T>>) {
	const local = props as PolymorphicProps<"h2", KPopoverTitleProps>;
	const others = omit(local, "class");
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
	const local = props as PolymorphicProps<"p", KPopoverDescriptionProps>;
	const others = omit(local, "class");
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
	const local = pickProps(props, "class", "children", "aria-label");
	const others = omit(props, "class", "children", "aria-label");
	return (
		<KPopover.CloseButton
			as={IconButton}
			size={"xs"}
			variant={"secondary"}
			{...others}
			data-cui={popoverParts.closeButton}
			aria-label={local["aria-label"] ?? "close"}
			class={mergeClasses(popoverStyles.closeButton(), local.class)}
		>
			{local.children ?? <CloseIcon />}
		</KPopover.CloseButton>
	);
}
