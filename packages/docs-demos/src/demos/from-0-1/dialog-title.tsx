import { Badge, Button, Dialog, DialogPanelContent, Stack } from "@codeui/kit";
import { createSignal } from "solid-js";

// In 0.1.x, `title` took a string and there was no `description`.
// Both take JSX now.
export default function DialogTitle() {
	const [open, setOpen] = createSignal(false);
	return (
		<>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Export settings
			</Button>
			<Dialog
				open={open()}
				onOpenChange={setOpen}
				size="sm"
				closeLabel="Close export settings"
				title={
					<Stack as="span" direction="row" gap="2" align="center">
						Export settings <Badge tone="info">Beta</Badge>
					</Stack>
				}
				description="Applies to every PNG and SVG export of this project."
			>
				<DialogPanelContent>Pick a format and a scale in the export panel.</DialogPanelContent>
			</Dialog>
		</>
	);
}
