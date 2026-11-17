import { Button, Sheet } from "@codeui/kit";
import { createSignal, For } from "solid-js";

function Example(props: { side?: "left" | "right" | "bottom" }) {
	const [open, setOpen] = createSignal(false);
	return <>
		<Button theme="secondary" onClick={() => setOpen(true)}>Open {props.side ?? "export options"}</Button>
		<Sheet open={open()} onOpenChange={setOpen} side={props.side} title="Export options" description="Choose how to share your snippet." closeLabel="Close export options"
			footer={<Button theme="primary" onClick={() => setOpen(false)}>Done</Button>}>
			<p>PNG preserves the frame background. SVG keeps text sharp at any size.</p>
		</Sheet>
	</>;
}
export default function Demo() {
	return <div style={{ display: "flex", gap: "var(--cui-space-3)", "flex-wrap": "wrap" }}><For each={["left", "right", "bottom"] satisfies ("left" | "right" | "bottom")[]}>{side => <Example side={side} />}</For></div>;
}
