import { Resizable, ResizableHandle, ResizablePanel, Text } from "@codeui/kit";

export default function ResizableAnatomy() {
	return (
		<Resizable style={{ height: "120px" }}>
			<ResizablePanel initialSize={0.5}>
				<Text tone="muted">Panel</Text>
			</ResizablePanel>
			<ResizableHandle aria-label="Resize panels" />
			<ResizablePanel>
				<Text tone="muted">Panel</Text>
			</ResizablePanel>
		</Resizable>
	);
}
