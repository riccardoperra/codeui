import { createSignal } from "solid-js";
import { Button, Dialog, DialogPanelContent } from "@codeui/kit";

export default function DialogFocusReturn() {
	const [open, setOpen] = createSignal(false);
	return (
		<>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Rename
			</Button>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Duplicate
			</Button>
			<Dialog open={open()} onOpenChange={setOpen} size="sm" title="Snippet actions">
				<DialogPanelContent>
					Close this dialog with Escape. Focus goes back to the button that opened it.
				</DialogPanelContent>
			</Dialog>
		</>
	);
}
