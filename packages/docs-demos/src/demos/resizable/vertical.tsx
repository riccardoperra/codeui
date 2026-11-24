import { Resizable, ResizableHandle, ResizablePanel, Text } from "@codeui/kit";

/** Padding goes on a child: on the panel it would add to the size Kobalte sets. */
const pane = { padding: "var(--cui-space-4)" };

export default function ResizableVertical() {
	return (
		<Resizable
			orientation="vertical"
			style={{
				height: "280px",
				background: "var(--cui-surface-canvas)",
				"border-radius": "var(--cui-radius-card)",
			}}
		>
			<ResizablePanel initialSize={0.7} minSize={0.3}>
				<Text as="div" weight="semibold" style={pane}>fetch-retry.ts</Text>
			</ResizablePanel>
			<ResizableHandle aria-label="Resize editor and console" />
			<ResizablePanel minSize={0.15}>
				<Text as="div" weight="semibold" style={pane}>Console</Text>
			</ResizablePanel>
		</Resizable>
	);
}
