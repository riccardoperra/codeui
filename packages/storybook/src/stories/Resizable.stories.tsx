import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Resizable, ResizableHandle, ResizablePanel } from "@codeui/kit";

const meta = {
	title: "DesignSystem/Resizable",
	component: Resizable,
	tags: ["autodocs"],
} satisfies Meta<typeof Resizable>;

export default meta;

type Story = StoryObj<typeof meta>;

const pane = {
	height: "100%",
	padding: "16px",
	"box-sizing": "border-box",
	color: "var(--cui-text-muted)",
} as const;

export const Sidebar: Story = {
	name: "Sidebar with min and max width",
	render: () => (
		<Resizable style={{ width: "800px", height: "320px" }}>
			<ResizablePanel initialSize="240px" minSize="200px" maxSize="360px" data-testid="sidebar">
				<div style={pane}>Threads</div>
			</ResizablePanel>
			<ResizableHandle aria-label="Resize sidebar" />
			<ResizablePanel>
				<div style={pane}>Conversation</div>
			</ResizablePanel>
		</Resizable>
	),
};

export const Vertical: Story = {
	render: () => (
		<Resizable orientation="vertical" style={{ width: "480px", height: "400px" }}>
			<ResizablePanel initialSize={0.6} minSize={0.2}>
				<div style={pane}>Editor</div>
			</ResizablePanel>
			<ResizableHandle aria-label="Resize terminal" />
			<ResizablePanel minSize="80px">
				<div style={pane}>Terminal</div>
			</ResizablePanel>
		</Resizable>
	),
};

export const Collapsible: Story = {
	render: () => (
		<Resizable style={{ width: "800px", height: "320px" }}>
			<ResizablePanel initialSize="240px" minSize="200px" maxSize="360px" collapsible>
				<div style={pane}>Threads (Enter on the handle collapses)</div>
			</ResizablePanel>
			<ResizableHandle aria-label="Resize sidebar" />
			<ResizablePanel>
				<div style={pane}>Conversation</div>
			</ResizablePanel>
		</Resizable>
	),
};
