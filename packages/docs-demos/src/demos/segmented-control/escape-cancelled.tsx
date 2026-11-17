import { SegmentedControl, SegmentedControlItem } from "@codeui/kit";
import { createSignal } from "solid-js";
export default function Demo() {
	const [message, setMessage] = createSignal("Press Escape inside the control.");
	return (
		<>
			<SegmentedControl
				aria-label="Editor theme"
				defaultValue="dark"
				onEscapeKeyDown={event => {
					event.preventDefault();
					setMessage("Escape handled here. The enclosing layer stays open.");
				}}
			>
				<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
				<SegmentedControlItem value="light">Light</SegmentedControlItem>
			</SegmentedControl>
			<output>{message()}</output>
		</>
	);
}
