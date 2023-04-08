import { As, Dialog as KDialog } from "@kobalte/core";
import { JSXElement, ParentProps, Show, splitProps } from "solid-js";
import * as styles from "./Dialog.css";
import { mergeClasses } from "../../utils/css";
import { IconButton } from "../IconButton/IconButton";

export type DialogProps = KDialog.DialogRootOptions &
	styles.DialogPanelVariants & {
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

type DialogPanelProps = styles.DialogPanelVariants &
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

export function Dialog(props: ParentProps<DialogProps>) {
	const [local, others] = splitProps(props, ["size", "children", "title"]);
	return (
		<KDialog.Root {...others}>
			<KDialog.Portal>
				<KDialog.Overlay class={styles.overlay} />
				<div class={mergeClasses(styles.dialogTheme, styles.positioner)}>
					<DialogPanel size={local.size}>
						<Show when={local.title} keyed={false}>
							<div class={styles.title}>
								<KDialog.Title>{props.title}</KDialog.Title>
								<KDialog.CloseButton asChild>
									<As
										component={IconButton}
										theme={"secondary"}
										size={"xs"}
										aria-label={"close"}
									>
										<CloseIcon />
									</As>
								</KDialog.CloseButton>
							</div>
						</Show>
						{local.children}
					</DialogPanel>
				</div>
			</KDialog.Portal>
		</KDialog.Root>
	);
}
