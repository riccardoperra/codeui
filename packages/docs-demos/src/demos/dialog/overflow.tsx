import { createSignal, For } from "solid-js";
import { Button, Dialog, DialogPanelContent, DialogPanelFooter } from "@codeui/kit";

const changes = Array.from({ length: 40 }, (_, i) => `Snippet ${i + 1} moved to the "Archive" folder`);

export default function DialogOverflow() {
	const [open, setOpen] = createSignal(false);
	return (
		<>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Show import log
			</Button>
			<Dialog open={open()} onOpenChange={setOpen} title="Import log" size="md">
				<DialogPanelContent>
					<ul style={{ margin: 0, "padding-left": "16px" }}>
						<For each={changes}>{change => <li>{change}</li>}</For>
					</ul>
				</DialogPanelContent>
				<DialogPanelFooter>
					<div style={{ display: "flex", "justify-content": "flex-end" }}>
						<Button variant="primary" onClick={() => setOpen(false)}>
							Done
						</Button>
					</div>
				</DialogPanelFooter>
			</Dialog>
		</>
	);
}
