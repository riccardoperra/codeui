import { createSignal } from "solid-js";
import { Button } from "@codeui/kit";
import * as D from "@codeui/kit/dialog/parts";

export default function DialogParts() {
	const [open, setOpen] = createSignal(false);
	return (
		<D.Root open={open()} onOpenChange={setOpen}>
			<D.Trigger as={Button} theme="secondary">
				Export as video
			</D.Trigger>
			<D.Portal>
				<D.Overlay />
				<D.Positioner size="sm">
					<D.Content size="sm">
						<D.Header>
							<D.Title>Export as video</D.Title>
							<D.CloseButton />
						</D.Header>
						<D.Description>Pick a format and a frame rate.</D.Description>
						<D.Body>The export runs in the background. You can keep editing.</D.Body>
						<D.Footer>
							<div style={{ display: "flex", "justify-content": "flex-end" }}>
								<Button theme="primary" onClick={() => setOpen(false)}>
									Start export
								</Button>
							</div>
						</D.Footer>
					</D.Content>
				</D.Positioner>
			</D.Portal>
		</D.Root>
	);
}
