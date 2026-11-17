import { Button, Dialog, DialogPanelContent, DialogPanelFooter } from "@codeui/kit";
import { createSignal } from "solid-js";

export default function DialogInset() {
	const [open, setOpen] = createSignal(false);
	return (
		<>
			<Button theme="secondary" onClick={() => setOpen(true)}>
				Delete snippet
			</Button>
			<Dialog open={open()} onOpenChange={setOpen} size="sm" chrome="inset" title="Delete index.tsx?">
				<DialogPanelContent>The snippet and its export settings are removed from this device.</DialogPanelContent>
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
