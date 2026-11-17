import { SegmentedControl, SegmentedControlItem, Dialog, Button } from "@codeui/kit";
import { createSignal } from "solid-js";
export default function Demo() {
	let trigger!: HTMLButtonElement;
	const [open, setOpen] = createSignal(false);
	const [escapes, setEscapes] = createSignal(0);
	return (
		<>
			<Button ref={trigger} onClick={() => setOpen(true)}>
				Editor settings
			</Button>
			<Dialog
				open={open()}
				onOpenChange={setOpen}
				title="Editor settings"
				onCloseAutoFocus={event => {
					event.preventDefault();
					trigger.focus();
				}}
			>
				<SegmentedControl
					aria-label="Editor theme"
					defaultValue="dark"
					onEscapeKeyDown={() => setEscapes(count => count + 1)}
				>
					<SegmentedControlItem value="light">Light</SegmentedControlItem>
					<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
					<SegmentedControlItem value="system" disabled>
						System
					</SegmentedControlItem>
				</SegmentedControl>
			</Dialog>
			<output>Escape callbacks: {escapes()}</output>
		</>
	);
}
