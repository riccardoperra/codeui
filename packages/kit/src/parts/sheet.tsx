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
import {
	type Accessor,
	type ComponentProps,
	createContext,
	createMemo,
	type JSX,
	onMount,
	splitProps,
	useContext,
	type ValidComponent,
} from "solid-js";
import * as styles from "../components/Sheet/Sheet.css";
import { IconButton, type IconButtonProps } from "../components/IconButton/IconButton";
import { CloseIcon } from "../icons";
import { mergeClasses } from "../utils/css";
import { createFocusReturn } from "./dialog-focus";

export const sheetParts = {
	trigger: "sheet-trigger",
	overlay: "sheet-overlay",
	content: "sheet-content",
	header: "sheet-header",
	title: "sheet-title",
	description: "sheet-description",
	closeButton: "sheet-close-button",
	handle: "sheet-handle",
	body: "sheet-body",
	footer: "sheet-footer",
} as const;

export type SheetPart = keyof typeof sheetParts;
export type SheetClasses = Partial<Record<SheetPart, string>>;
export type SheetSide = "bottom" | "left" | "right";
/** `auto` slides on pointer opens and closes. `none` never moves. */
export type SheetMotion = "auto" | "none";

export type SheetStyles = {
	[P in SheetPart]: (variants?: { side?: SheetSide }) => string;
};

export const sheetStyles: SheetStyles = {
	trigger: () => "",
	overlay: () => styles.overlay,
	content: variants => styles.content({ side: variants?.side }),
	header: () => styles.header,
	title: () => styles.title,
	description: () => styles.description,
	closeButton: () => styles.closeButton,
	handle: () => styles.handle,
	body: () => styles.body,
	footer: () => styles.footer,
};

let lastInput: { pointer: boolean; time: number } | undefined;
let listening = false;

function trackInput() {
	if (listening) return;
	listening = true;
	const record = (pointer: boolean) => () => {
		lastInput = { pointer, time: performance.now() };
	};
	document.addEventListener("pointerdown", record(true), true);
	document.addEventListener("keydown", record(false), true);
}

// An open or close counts as a pointer one when the last input was a pointer
// press shortly before. Keyboard and programmatic changes do not move.
const pointerInitiated = () => !!lastInput?.pointer && performance.now() - lastInput.time < 1000;

const SheetContext = createContext<{ moves: Accessor<boolean> }>();

function MotionScope(props: { motion?: SheetMotion; children?: JSX.Element }) {
	const dialog = useDialogContext();
	const moves = createMemo(() => {
		dialog.isOpen();
		return props.motion !== "none" && pointerInitiated();
	});
	return <SheetContext.Provider value={{ moves }}>{props.children}</SheetContext.Provider>;
}

const motionAttribute = () => {
	const context = useContext(SheetContext);
	return () => (context?.moves() ? undefined : "none");
};

export type RootProps = KDialogRootProps & { motion?: SheetMotion };

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
	return <KDialog.Portal {...props} />;
}

export function Trigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, KDialogTriggerProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"button", KDialogTriggerProps>, ["class"]);
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
	const [local, others] = splitProps(props as PolymorphicProps<"div", KDialogOverlayProps>, ["class"]);
	const motion = motionAttribute();
	return (
		<KDialog.Overlay
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
	const [local, others] = splitProps(props as PolymorphicProps<"div", ContentProps>, [
		"class",
		"side",
		"onOpenAutoFocus",
		"onCloseAutoFocus",
		"onInteractOutside",
	]);
	const focus = createFocusReturn(local);
	const motion = motionAttribute();
	return (
		<KDialog.Content
			data-cui={sheetParts.content}
			data-side={local.side ?? "bottom"}
			data-motion={motion()}
			class={mergeClasses(sheetStyles.content({ side: local.side }), local.class)}
			{...focus}
			{...others}
		/>
	);
}

export function Header(props: ComponentProps<"div">) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div
			data-cui={sheetParts.header}
			class={mergeClasses(sheetStyles.header(), local.class)}
			{...others}
		/>
	);
}

export function Title<T extends ValidComponent = "h2">(props: PolymorphicProps<T, KDialogTitleProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"h2", KDialogTitleProps>, ["class"]);
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
	const [local, others] = splitProps(props as PolymorphicProps<"p", KDialogDescriptionProps>, ["class"]);
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
	const [local, others] = splitProps(props, ["class", "children", "aria-label"]);
	return (
		<KDialog.CloseButton
			as={IconButton}
			size={"xs"}
			theme={"secondary"}
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

/** The grabber at the top of a bottom sheet. A tap, Enter or Space closes the sheet. */
export function Handle(props: HandleProps) {
	const [local, others] = splitProps(props, ["class", "aria-label"]);
	return (
		<KDialog.CloseButton
			type="button"
			{...others}
			data-cui={sheetParts.handle}
			aria-label={local["aria-label"] ?? "close"}
			class={mergeClasses(sheetStyles.handle(), local.class)}
		/>
	);
}

export function Body(props: ComponentProps<"div">) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div data-cui={sheetParts.body} class={mergeClasses(sheetStyles.body(), local.class)} {...others} />
	);
}

export function Footer(props: ComponentProps<"div">) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div
			data-cui={sheetParts.footer}
			class={mergeClasses(sheetStyles.footer(), local.class)}
			{...others}
		/>
	);
}
