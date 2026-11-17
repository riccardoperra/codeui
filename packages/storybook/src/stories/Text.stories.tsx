import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Stack, Text } from "@codeui/kit";
const meta = { title: "DesignSystem/Text", component: Text } satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Variants: Story = {
	render: () => (
		<Stack gap="2">
			{(["badge", "xs", "caption", "sm", "md", "lg", "xl", "2xl"] as const).map(size => (
				<Text size={size}>{size} · Export settings 日本語</Text>
			))}
			{(["normal", "medium", "semibold"] as const).map(weight => (
				<Text weight={weight}>{weight} · Export settings</Text>
			))}
			{(["default", "muted", "hint", "label", "danger", "success"] as const).map(tone => (
				<Text tone={tone}>{tone} · Saved export settings</Text>
			))}
			<Text as="h2" size="lg">
				Semantic heading
			</Text>
		</Stack>
	),
};
