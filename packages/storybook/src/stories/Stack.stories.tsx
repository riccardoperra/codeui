import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Stack, Text } from "@codeui/kit";
const meta = { title: "DesignSystem/Stack", component: Stack } satisfies Meta<
	typeof Stack
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Variants: Story = {
	render: () => (
		<Stack gap="4">
			{(["start", "center", "end", "stretch", "baseline"] as const).map(align => (
				<Stack direction="row" gap="2" align={align} wrap>
					<Text weight="semibold">{align}</Text>
					<Text size="xs">Short</Text>
					<Text size="xl">Long translated label 日本語 🌍</Text>
				</Stack>
			))}
			{(["start", "center", "end", "between", "around", "evenly"] as const).map(
				justify => (
					<Stack direction="row" gap="1" justify={justify}>
						<Text>{justify}</Text>
						<Text>Export</Text>
					</Stack>
				),
			)}
			<Stack direction="row" wrap gap="0.5">
				<Text>Wrapping content with a small gap</Text>
				<Text>Another label</Text>
			</Stack>
		</Stack>
	),
};
