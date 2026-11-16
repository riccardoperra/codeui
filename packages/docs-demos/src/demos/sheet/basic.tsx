import { Button, Sheet } from "@codeui/kit";
import { createSignal, For } from "solid-js";

function Example(props: { side?: "left" | "right" | "bottom" }) {
	const [open, setOpen] = createSignal(false);
	return <>
		<Button theme="secondary" onClick={() => setOpen(true)}>Open {props.side ?? "export options"}</Button>
		<Sheet open={open()} onOpenChange={setOpen}  title="Export options" description="Choose how to share your snippet." closeLabel="Close export options"
			footer={<Button theme="primary" onClick={() => setOpen(false)}>Done</Button>}>
			<p>PNG preserves the frame background. SVG keeps text sharp at any size.</p>
		</Sheet>
	</>;
}
export default function Demo() {
	return <Example />;
}
