import { Button, SegmentedControl, SegmentedControlItem, TextField } from "@codeui/kit";
import { For } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

const sizes = ["xs", "sm", "md", "lg"] as const;

const meta = {
	title: "DesignSystem/Control Sizes",
	parameters: { layout: "centered" },
} satisfies Meta;

export default meta;

export const Aligned: StoryObj<typeof meta> = {
	render: () => (
		<div style={{ display: "grid", gap: "var(--cui-space-4)" }}>
			<For each={sizes}>
				{size => (
					<div
						style={{
							display: "grid",
							"grid-template-columns": "2ch auto minmax(0, 10rem) auto",
							"align-items": "center",
							gap: "var(--cui-space-2)",
						}}
					>
						<span>{size}</span>
						<Button theme="primary" size={size}>
							Save
						</Button>
						<TextField aria-label={`Name (${size})`} placeholder="Name" size={size} />
						<SegmentedControl
							aria-label={`Format (${size})`}
							size={size}
							defaultValue="png"
						>
							<SegmentedControlItem value="png">PNG</SegmentedControlItem>
							<SegmentedControlItem value="svg">SVG</SegmentedControlItem>
						</SegmentedControl>
					</div>
				)}
			</For>
		</div>
	),
};
