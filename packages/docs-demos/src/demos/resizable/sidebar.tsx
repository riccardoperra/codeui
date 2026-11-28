import { Resizable, ResizableHandle, ResizablePanel, Text } from "@codeui/kit";

/** Padding goes on a child: on the panel it would add to the size Kobalte sets. */
const pane = { padding: "var(--cui-space-4)" };

export default function ResizableSidebar() {
	return (
		<Resizable
			style={{
				height: "240px",
				background: "var(--cui-surface-canvas)",
				"border-radius": "var(--cui-radius-card)",
			}}
		>
			<ResizablePanel initialSize="240px" minSize="200px" maxSize="360px">
				<Text as="div" weight="semibold" style={pane}>Snippets</Text>
			</ResizablePanel>
			<ResizableHandle aria-label="Resize snippet list" />
			<ResizablePanel>
				<Text as="div" weight="semibold" style={pane}>fetch-retry.ts</Text>
			</ResizablePanel>
		</Resizable>
	);
}
