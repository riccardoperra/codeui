import { createSignal } from "solid-js";
import { Button, Dialog, DialogPanelContent, DialogPanelFooter } from "@codeui/kit";

export default function DialogDemo() {
	const [open, setOpen] = createSignal(false);
	return (
		<>
			<Button theme="primary" onClick={() => setOpen(true)}>
				Open dialog
			</Button>
			<Dialog open={open()} onOpenChange={setOpen} title="Delete snippet" size="sm">
				<DialogPanelContent>
					The snippet and its export history are removed. This cannot be undone.
				</DialogPanelContent>
				<DialogPanelFooter>
					<Button theme="secondary" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button theme="negative" onClick={() => setOpen(false)}>
						Delete
					</Button>
				</DialogPanelFooter>
			</Dialog>
		</>
	);
}
