import { createSignal } from "solid-js";
import { Button, Dialog, DialogPanelContent, SegmentedControl, SegmentedControlItem } from "@codeui/kit";

export default function KeepOpenOnEscape() {
	const [open, setOpen] = createSignal(false);
	const [align, setAlign] = createSignal("left");
	return (
		<>
			<Button theme="secondary" onClick={() => setOpen(true)}>
				Text alignment
			</Button>
			<Dialog open={open()} onOpenChange={setOpen} size="sm" title="Text alignment">
				<DialogPanelContent>
					<SegmentedControl
						value={align()}
						onChange={setAlign}
						aria-label="Alignment"
						onEscapeKeyDown={event => event.preventDefault()}
					>
						<SegmentedControlItem value="left">Left</SegmentedControlItem>
						<SegmentedControlItem value="center">Center</SegmentedControlItem>
						<SegmentedControlItem value="right">Right</SegmentedControlItem>
					</SegmentedControl>
				</DialogPanelContent>
			</Dialog>
		</>
	);
}
