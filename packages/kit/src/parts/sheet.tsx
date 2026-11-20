import { pickProps } from "../utils/pick-props";
import { HydratablePortal } from "../utils/hydratable-portal";
import "@codeui/styles/theme.css";
import "@codeui/styles/sheet.css";
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
import { type Accessor, createContext, createMemo, createSignal, onCleanup, onSettled, Show, useContext, omit } from "solid-js";
import { type ComponentProps, type JSX, type ValidComponent } from "@solidjs/web";
import * as styles from "../components/Sheet/Sheet.css";
import { IconButton, type IconButtonProps } from "../components/IconButton/IconButton";
import { CloseIcon } from "../icons";
import { mergeClasses } from "../utils/css";
import { LayerScope } from "../utils/layer-scope";
import { createDialogFocus } from "./dialog-focus";
import { createSheetDrag } from "./sheet-drag";
import { pointerInitiated, trackInput } from "../utils/open-source";

import { sheetParts, type SheetPart, type SheetClasses, type SheetSide, type SheetMotion, type SheetStyles, sheetStyles } from "@codeui/styles/sheet";
export { sheetParts, type SheetPart, type SheetClasses, type SheetSide, type SheetMotion, type SheetStyles, sheetStyles } from "@codeui/styles/sheet";
type SheetContextValue = {
	moves: Accessor<boolean>;
	overlay: Accessor<HTMLElement | undefined>;
	setOverlay: (element: HTMLElement | undefined) => void;
	/** Closes without the exit slide, for a sheet a drag already moved off screen. */
	closeInPlace: () => void;
};

const SheetContext = createContext<SheetContextValue | null>(null);

function MotionScope(props: { motion?: SheetMotion; children?: JSX.Element }) {
	const dialog = useDialogContext();
	const [overlay, setOverlay] = createSignal<HTMLElement>();
	let inPlace = false;
	const moves = createMemo(() => {
		dialog.isOpen();
		const still = inPlace;
		inPlace = false;
		return !still && props.motion !== "none" && pointerInitiated();
	});
	const closeInPlace = () => {
		inPlace = true;
		dialog.close();
	};
	return (
		<SheetContext value={{ moves, overlay, setOverlay, closeInPlace }}>
			{props.children}
		</SheetContext>
	);
}

const motionAttribute = () => {
	const context = useContext(SheetContext);
	return () => (context?.moves() ? undefined : "none");
};

export type RootProps = KDialogRootProps & { motion?: SheetMotion };

export function Root(props: RootProps) {
	const local = props;
	const others = omit(props, "motion", "children");
	onSettled(trackInput);
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
	const local = props as PolymorphicProps<"button", KDialogTriggerProps>;
	const others = omit(local, "class");
	return (
		<KDialog.Trigger
			data-cui={sheetParts.trigger}
			class={mergeClasses(sheetStyles.trigger(), local.class)}
			{...others}
		/>
	);
}

export function Overlay<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KDialogOverlayProps<T>>,
) {
	const local = props as PolymorphicProps<"div", KDialogOverlayProps>;
	const others = omit(local, "class", "ref");
	const motion = motionAttribute();
	const context = useContext(SheetContext);
	onCleanup(() => context?.setOverlay(undefined));
	return (
		<KDialog.Overlay
			ref={[local.ref, (element: HTMLElement) => context?.setOverlay(element)]}
			data-cui={sheetParts.overlay}
			data-motion={motion()}
			class={mergeClasses(sheetStyles.overlay(), local.class)}
			{...others}
		/>
	);
}

export type ContentProps<T extends ValidComponent = "div"> = KDialogContentProps<T> & {
	side?: SheetSide;
	class?: string;
};

/**
 * Without a Trigger, Content returns focus to the element that had it when
 * the sheet opened.
 */
export function Content<T extends ValidComponent = "div">(props: PolymorphicProps<T, ContentProps<T>>) {
	const allProps = props as PolymorphicProps<"div", ContentProps>;
	const local = pickProps(allProps, "class", "side");
	const others = omit(allProps, "class", "side", "onOpenAutoFocus", "onCloseAutoFocus", "onInteractOutside", "onFocusOutside", "onPointerDownOutside");
	const { layer, props: focus } = createDialogFocus(allProps);
	const motion = motionAttribute();
	return (
		<LayerScope layer={layer}>
			<KDialog.Content
				data-cui={sheetParts.content}
				data-side={local.side ?? "bottom"}
				data-motion={motion()}
				class={mergeClasses(styles.content(), local.class)}
				{...focus}
				{...others}
			/>
		</LayerScope>
	);
}

export function Header(props: ComponentProps<"div">) {
	const local = props;
	const others = omit(props, "class");
	return (
		<div
			data-cui={sheetParts.header}
			class={mergeClasses(sheetStyles.header(), local.class)}
			{...others}
		/>
	);
}

export function Title<T extends ValidComponent = "h2">(props: PolymorphicProps<T, KDialogTitleProps<T>>) {
	const local = props as PolymorphicProps<"h2", KDialogTitleProps>;
	const others = omit(local, "class");
	return (
		<KDialog.Title
			data-cui={sheetParts.title}
			class={mergeClasses(sheetStyles.title(), local.class)}
			{...others}
		/>
	);
}

export function Description<T extends ValidComponent = "p">(
	props: PolymorphicProps<T, KDialogDescriptionProps<T>>,
) {
	const local = props as PolymorphicProps<"p", KDialogDescriptionProps>;
	const others = omit(local, "class");
	return (
		<KDialog.Description
			data-cui={sheetParts.description}
			class={mergeClasses(sheetStyles.description(), local.class)}
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
	const local = pickProps(props, "class", "children", "aria-label");
	const others = omit(props, "class", "children", "aria-label");
	return (
		<KDialog.CloseButton
			as={IconButton}
			size={"xs"}
			variant={"secondary"}
			{...others}
			data-cui={sheetParts.closeButton}
			aria-label={local["aria-label"] ?? "close"}
			class={mergeClasses(sheetStyles.closeButton(), local.class)}
		>
			{local.children ?? <CloseIcon />}
		</KDialog.CloseButton>
	);
}

export type HandleProps = Omit<ComponentProps<"button">, "aria-label"> & {
	/** Accessible name of the handle, which closes the sheet. Defaults to "close". */
	"aria-label"?: string;
};

/**
 * The grabber at the top of a bottom sheet. A tap, Enter or Space closes the
 * sheet. Dragging it down past a distance, or flicking it, dismisses the sheet.
 * A drag that is cancelled or does not go far enough settles back open.
 */
export function Handle(props: HandleProps) {
	const local = pickProps(props, "class", "aria-label", "onClick", "onPointerDown", "onPointerMove", "onPointerUp", "onPointerCancel");
	const others = omit(props, "class", "aria-label", "onClick", "onPointerDown", "onPointerMove", "onPointerUp", "onPointerCancel");
	const dialog = useDialogContext();
	const context = useContext(SheetContext);
	let handle: HTMLButtonElement | undefined;
	const drag = createSheetDrag({
		content: () => handle?.closest<HTMLElement>(`[data-cui="${sheetParts.content}"]`) ?? null,
		overlay: () => context?.overlay(),
		dismiss: () => (context ? context.closeInPlace() : dialog.close()),
	});
	return (
		<button
			type="button"
			{...others}
			ref={[others.ref, (element: HTMLButtonElement) => (handle = element)]}
			data-cui={sheetParts.handle}
			aria-label={local["aria-label"] ?? "close"}
			class={mergeClasses(sheetStyles.handle(), local.class)}
			onPointerDown={event => {
				callHandler(event, local.onPointerDown);
				drag.onPointerDown(event);
			}}
			onPointerMove={event => {
				callHandler(event, local.onPointerMove);
				drag.onPointerMove(event);
			}}
			onPointerUp={event => {
				callHandler(event, local.onPointerUp);
				drag.onPointerUp(event);
			}}
			onPointerCancel={event => {
				callHandler(event, local.onPointerCancel);
				drag.onPointerCancel(event);
			}}
			onClick={event => {
				callHandler(event, local.onClick);
				if (drag.consumeClick() || event.defaultPrevented) return;
				dialog.close();
			}}
		/>
	);
}

export function Body(props: ComponentProps<"div">) {
	const local = props;
	const others = omit(props, "class");
	return (
		<div data-cui={sheetParts.body} class={mergeClasses(sheetStyles.body(), local.class)} {...others} />
	);
}

export function Footer(props: ComponentProps<"div">) {
	const local = props;
	const others = omit(props, "class");
	return (
		<div
			data-cui={sheetParts.footer}
			class={mergeClasses(sheetStyles.footer(), local.class)}
			{...others}
		/>
	);
}
