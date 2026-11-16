import { Accordion } from "@codeui/kit";

export default function MotionKeyboard() {
	return (
		<div style={{ width: "100%", "max-width": "360px" }}>
			<Accordion
				aria-label="Snippet appearance"
				items={[
					{ value: "frame", title: "Frame", summary: "64 px", content: <p>Padding around your code is 64 px.</p> },
					{ value: "window", title: "Window", summary: "macOS", content: <p>The title bar uses macOS window controls.</p> },
				]}
			/>
		</div>
	);
}
