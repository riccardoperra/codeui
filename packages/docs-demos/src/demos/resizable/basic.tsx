import { Resizable, ResizableHandle, ResizablePanel, Text } from "@codeui/kit";

/** Padding goes on a child: on the panel it would add to the size Kobalte sets. */
const pane = { padding: "var(--cui-space-4)" };

export default function ResizableBasic() {
	return (
		<Resizable
			style={{
				height: "200px",
				background: "var(--cui-surface-canvas)",
				"border-radius": "var(--cui-radius-card)",
			}}
		>
			<ResizablePanel initialSize={0.6} minSize={0.3}>
				<Text as="div" weight="semibold" style={pane}>Editor</Text>
			</ResizablePanel>
			<ResizableHandle aria-label="Resize editor and preview" />
			<ResizablePanel minSize={0.2}>
				<Text as="div" weight="semibold" style={pane}>Preview</Text>
			</ResizablePanel>
		</Resizable>
	);
}
