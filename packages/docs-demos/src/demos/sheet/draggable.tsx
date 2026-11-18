import { Button, Sheet } from "@codeui/kit";
import { createSignal, For } from "solid-js";

function Example(props: { side?: "left" | "right" | "bottom" }) {
	const [open, setOpen] = createSignal(false);
	return <>
		<Button variant="secondary" onClick={() => setOpen(true)}>Open {props.side ?? "export options"}</Button>
		<Sheet open={open()} onOpenChange={setOpen} draggable title="Export options" description="Choose how to share your snippet." closeLabel="Close export options"
			footer={<Button variant="primary" onClick={() => setOpen(false)}>Done</Button>}>
			<div style={{ "max-height": "160px", overflow: "auto" }}><For each={Array.from({ length: 20 }, (_, index) => `Snippet ${index + 1}.png`)}>{name => <p>{name}</p>}</For></div>
		</Sheet>
	</>;
}
export default function Demo() {
	return <Example />;
}
