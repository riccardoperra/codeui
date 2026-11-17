import { createSignal, Show } from "solid-js";
import { Button, Dialog, DialogPanelContent } from "@codeui/kit";

export default function DialogMount() {
	const [open, setOpen] = createSignal(false);
	const [host, setHost] = createSignal<HTMLElement>();
	return (
		<div ref={setHost} data-demo-host="editor">
			<Button theme="secondary" onClick={() => setOpen(true)}>
				Open in the editor host
			</Button>
			<Show when={host()}>
				{node => (
					<Dialog open={open()} onOpenChange={setOpen} mount={node()} size="sm" title="Rename snippet">
						<DialogPanelContent>
							This dialog is portaled into the element marked data-demo-host, not into document.body.
						</DialogPanelContent>
					</Dialog>
				)}
			</Show>
		</div>
	);
}
