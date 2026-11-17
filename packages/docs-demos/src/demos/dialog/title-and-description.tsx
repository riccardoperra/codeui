import { createSignal } from "solid-js";
import { Badge, Button, Dialog, DialogPanelContent, Kbd } from "@codeui/kit";

export default function DialogTitleAndDescription() {
	const [open, setOpen] = createSignal(false);
	return (
		<>
			<Button theme="secondary" onClick={() => setOpen(true)}>
				Export as video
			</Button>
			<Dialog
				open={open()}
				onOpenChange={setOpen}
				size="md"
				title={
					<span style={{ display: "inline-flex", gap: "8px", "align-items": "center" }}>
						Export as video <Badge tone="info">Beta</Badge>
					</span>
				}
				description={
					<>
						Renders the timeline as MP4. Press <Kbd>Esc</Kbd> to cancel.
					</>
				}
			>
				<DialogPanelContent>The export runs in the background. You can keep editing.</DialogPanelContent>
			</Dialog>
		</>
	);
}
