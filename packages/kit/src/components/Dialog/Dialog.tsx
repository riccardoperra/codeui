import { As, Dialog as KDialog } from "@kobalte/core";
import { JSXElement, ParentProps, Show, splitProps } from "solid-js";
import * as styles from "./Dialog.css";
import { mergeClasses } from "../../utils/css";
import { IconButton } from "../IconButton/IconButton";
import { CloseIcon } from "../../icons/CloseIcon";

export type DialogProps = KDialog.DialogRootOptions &
	styles.DialogPanelVariants & {
		title?: string;
	};

export function DialogPanelContent(props: ParentProps): JSXElement {
	return <div data-cui="dialog-panel-content" class={styles.panelContent}>{props.children}</div>;
}

export function DialogPanelFooter(props: ParentProps): JSXElement {
	return <div data-cui="dialog-panel-footer" class={styles.panelFooter}>{props.children}</div>;
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
		<KDialog.Root {...others} data-cui="cui-dialog-root">
			<KDialog.Portal>
				<KDialog.Overlay class={styles.overlay} />
				<div class={mergeClasses(styles.dialogTheme, styles.positioner)} data-panel-size={local.size}>
					<DialogPanel size={local.size}>
						<Show when={local.title} keyed={false}>
							<div class={styles.title} data-cui="dialog-panel-title">
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
