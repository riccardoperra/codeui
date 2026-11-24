import { createSignal } from "solid-js";
import { Resizable, ResizableHandle, ResizablePanel, Text } from "@codeui/kit";

/** Padding goes on a child: on the panel it would add to the size Kobalte sets. */
const pane = { padding: "var(--cui-space-4)" };

export default function ResizableCollapsible() {
	const [collapsed, setCollapsed] = createSignal(false);
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-2)" }}>
			<Resizable
				style={{
					height: "240px",
					background: "var(--cui-surface-canvas)",
					"border-radius": "var(--cui-radius-card)",
				}}
			>
				<ResizablePanel>
					<Text as="div" weight="semibold" style={pane}>
						fetch-retry.ts
					</Text>
				</ResizablePanel>
				<ResizableHandle aria-label="Resize settings panel" />
				<ResizablePanel
					initialSize={0.35}
					minSize={0.25}
					collapsible
					onCollapse={() => setCollapsed(true)}
					onExpand={() => setCollapsed(false)}
				>
					<Text as="div" weight="semibold" style={pane}>
						Settings
					</Text>
				</ResizablePanel>
			</Resizable>
			<Text tone="muted">{collapsed() ? "Settings is collapsed." : "Settings is open."}</Text>
		</div>
	);
}
