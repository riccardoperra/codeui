import { Resizable, ResizableHandle, ResizablePanel, Text } from "@codeui/kit";

/** Each island leaves 4px on the handle side, so two islands sit 8px apart and the handle fills the gap. */
const island = (side: "start" | "end") => ({
	height: "100%",
	"box-sizing": "border-box" as const,
	padding: "var(--cui-space-4)",
	[`margin-inline-${side}`]: "4px",
	background: "var(--cui-surface-canvas)",
	"border-radius": "var(--cui-radius-command)",
});

export default function ResizableIslands() {
	return (
		<Resizable style={{ height: "240px" }}>
			<ResizablePanel>
				<Text as="div" weight="semibold" style={island("end")}>
					fetch-retry.ts
				</Text>
			</ResizablePanel>
			<ResizableHandle
				aria-label="Resize side panel"
				style={{ "--cui-resizable-handle-line-color": "transparent" }}
			/>
			<ResizablePanel initialSize="360px" minSize="280px" maxSize="480px">
				<Text as="div" weight="semibold" style={island("start")}>
					Side panel
				</Text>
			</ResizablePanel>
		</Resizable>
	);
}
