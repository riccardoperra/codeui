import { createSignal } from "solid-js";
import { Button, Dialog, DialogPanelContent, DialogPanelFooter } from "@codeui/kit";

export default function DialogBasic() {
	const [open, setOpen] = createSignal(false);
	return (
		<>
			<Button variant="negative" onClick={() => setOpen(true)}>
				Delete snippet
			</Button>
			<Dialog open={open()} onOpenChange={setOpen} title="Delete snippet" size="sm">
				<DialogPanelContent>
					The snippet and its export history are removed. This cannot be undone.
				</DialogPanelContent>
				<DialogPanelFooter>
					<div style={{ display: "flex", gap: "8px", "justify-content": "flex-end" }}>
						<Button variant="secondary" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button variant="negative" onClick={() => setOpen(false)}>
							Delete
						</Button>
					</div>
				</DialogPanelFooter>
			</Dialog>
		</>
	);
}
