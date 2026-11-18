import { createSignal } from "solid-js";
import { Button, Dialog, DialogPanelContent, SegmentedControl, SegmentedControlItem } from "@codeui/kit";

export default function SegmentedInDialog() {
	const [open, setOpen] = createSignal(false);
	const [format, setFormat] = createSignal("png");
	return (
		<>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Export settings
			</Button>
			<Dialog open={open()} onOpenChange={setOpen} size="sm" title="Export settings">
				<DialogPanelContent>
					<SegmentedControl value={format()} onChange={setFormat} aria-label="Format">
						<SegmentedControlItem value="png">PNG</SegmentedControlItem>
						<SegmentedControlItem value="svg">SVG</SegmentedControlItem>
						<SegmentedControlItem value="jpeg">JPEG</SegmentedControlItem>
					</SegmentedControl>
				</DialogPanelContent>
			</Dialog>
		</>
	);
}
