import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Alert, Button, icons } from "@codeui/kit";
import { For } from "solid-js";
import { DocsContainerTitle } from "./components/Section.jsx";

const tones = ["neutral", "info", "success", "warning", "danger"] as const;

const meta = {
	title: "DesignSystem/Alert",
	component: Alert,
	tags: ["autodocs"],
	args: { children: "This feature is not available in your browser." },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AlertStory: Story = {
	name: "Alert",
};

const stack = {
	display: "flex",
	"flex-direction": "column",
	"align-items": "flex-start",
	gap: "12px",
	"max-width": "560px",
} as const;

export const Tones: Story = {
	render: () => (
		<div style={stack}>
			<For each={tones}>
				{tone => (
					<Alert tone={tone} showIcon fluid>
						The {tone} tone keeps its message readable.
					</Alert>
				)}
			</For>
		</div>
	),
};

export const WithTitleAndAction: Story = {
	render: () => (
		<div style={stack}>
			<DocsContainerTitle>Title, description and action</DocsContainerTitle>
			<Alert
				tone="info"
				showIcon
				fluid
				title="A new version is available"
				description="Reload to use the latest editor."
				action={
					<Button size="xs" theme="secondary">
						Reload
					</Button>
				}
			/>
			<DocsContainerTitle>Custom icon</DocsContainerTitle>
			<Alert showIcon icon={<icons.CheckIcon />}>
				Snippets sync across your devices.
			</Alert>
			<DocsContainerTitle>Inline width</DocsContainerTitle>
			<Alert tone="warning">Unsaved changes.</Alert>
		</div>
	),
};
