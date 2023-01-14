import { Dialog as KDialog, DialogOptions } from "@kobalte/core";
import {
	createEffect,
	createSignal,
	JSXElement,
	on,
	ParentProps,
	Show,
	splitProps,
} from "solid-js";
import * as styles from "./Dialog.css";
import { mergeClasses } from "../../utils/css";
import { animate } from "motion";
import { IconButton } from "../IconButton/IconButton";

type DialogProps = DialogOptions &
	DialogPanelProps & {
		title?: string;
	};

function CloseIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			width={"1.1em"}
			height={"1.1em"}
		>
			<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
		</svg>
	);
}

export function DialogPanelContent(props: ParentProps): JSXElement {
	return <div class={styles.panelContent}>{props.children}</div>;
}

export function DialogPanelFooter(props: ParentProps): JSXElement {
	return <div class={styles.panelFooter}>{props.children}</div>;
}

export type DialogPanelProps = styles.DialogPanelVariants &
	Parameters<typeof KDialog.Content>[0];

export function DialogPanel(props: ParentProps<DialogPanelProps>): JSXElement {
	return (
		<KDialog.Content
			{...props}
			class={styles.panel({
				size: props.size,
			})}
		>
			{props.children}
		</KDialog.Content>
	);
}

const enterAnimation = {
	opacity: [0, 1],
	transform: [`scale(0.95) translateY(10px)`, "scale(1) translateY(0px)"],
};

const exitAnimation = {
	opacity: [1, 0],
	transform: [`scale(1)`, "scale(0.95)"],
};

const animationOptions = {
	duration: 0.2,
	easing: "ease-in-out",
} as const;

export function Dialog(props: ParentProps<DialogProps>) {
	const [local, others] = splitProps(props, [
		"size",
		"children",
		"title",
		"onOpenChange",
	]);
	const [ref, setRef] = createSignal<HTMLElement>();
	const [open, setOpen] = createSignal(false);

	createEffect(
		on(
			() => props.isOpen,
			isOpen => {
				if (isOpen) {
					setOpen(true);
					createEffect(
						on(ref, ref => {
							if (ref) {
								animate(ref, enterAnimation, animationOptions);
								createEffect(
									on(open, open => {
										if (!open) {
											animate(ref, exitAnimation, animationOptions).finished.then(() =>
												local.onOpenChange?.(false),
											);
										}
									}),
								);
							}
						}),
					);
				}
			},
		),
	);

	return (
		<KDialog {...others} onOpenChange={setOpen}>
			<KDialog.Portal>
				<KDialog.Overlay class={styles.overlay} />
				<div class={mergeClasses(styles.dialogTheme, styles.positioner)}>
					<DialogPanel size={local.size} ref={setRef}>
						<Show when={local.title} keyed={false}>
							<div class={styles.title}>
								<KDialog.Title>{props.title}</KDialog.Title>
								<KDialog.CloseButton as={IconButton} size={"xs"} aria-label={"close"}>
									<CloseIcon />
								</KDialog.CloseButton>
							</div>
						</Show>
						{local.children}
					</DialogPanel>
				</div>
			</KDialog.Portal>
		</KDialog>
	);
}
