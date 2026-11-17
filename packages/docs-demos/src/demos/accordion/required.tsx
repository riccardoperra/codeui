import { Accordion } from "@codeui/kit";
import { createSignal } from "solid-js";
export default function Demo() {
	const [value, setValue] = createSignal<string | null>("frame");
	return <Accordion aria-label="Snippet appearance" collapsible={false} defaultValue="frame" items={[
	{ value: "frame", title: "Frame", icon: <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor"><rect x="2" y="3" width="12" height="10" rx="2" /></svg>, summary: "64 px", content: <p>Padding around your code is 64 px.</p> },
	{ value: "window", title: "Window", summary: "macOS", content: <p>The title bar uses macOS window controls.</p> },
	{ value: "watermark", title: "Watermark", disabled: true, content: <p>Watermarks are unavailable for this snippet.</p> },
]} />;
}
