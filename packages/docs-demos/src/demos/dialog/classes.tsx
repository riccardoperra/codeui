import { createSignal } from "solid-js";
import { Button, Dialog, DialogPanelContent } from "@codeui/kit";
import "./classes.css";

export default function DialogClasses() {
	const [open, setOpen] = createSignal(false);
	return (
		<>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Open share settings
			</Button>
			<Dialog
				open={open()}
				onOpenChange={setOpen}
				size="sm"
				title="Share snippet"
				description="Anyone with the link can view the snippet."
				classes={{
					panel: "dialog-classes-demo-panel",
					header: "dialog-classes-demo-header",
					description: "dialog-classes-demo-description",
				}}
			>
				<DialogPanelContent>The link stays valid until you delete the snippet.</DialogPanelContent>
			</Dialog>
		</>
	);
}
