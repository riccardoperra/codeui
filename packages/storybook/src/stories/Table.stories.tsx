import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Table } from "@codeui/kit";
import ExportFormats from "../../../docs-demos/src/demos/table/basic";

const meta = { title: "DesignSystem/Table", component: Table } satisfies Meta<
	typeof Table
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <ExportFormats />,
};

export const Compact: Story = {
	render: () => <ExportFormats size="sm" />,
};

export const Striped: Story = {
	render: () => <ExportFormats striped />,
};

export const HorizontalScroll: Story = {
	render: () => (
		<div style={{ "max-inline-size": "12rem" }}>
			<ExportFormats />
		</div>
	),
};
