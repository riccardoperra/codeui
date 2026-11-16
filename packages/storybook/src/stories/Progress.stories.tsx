import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Progress, Stack } from "@codeui/kit";
const meta = { title: "DesignSystem/Progress", component: Progress } satisfies Meta<
	typeof Progress
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const States: Story = {
	render: () => (
		<Stack gap="4">
			<Progress label="Export frames" value={25} maxValue={100} showValue />
			<Progress label="Medium" size="md" value={60} showValue />
			<Progress label="Complete" value={100} showValue />
			<Progress label="Waiting" value={0} showValue />
			<Progress label="Preparing export" indeterminate />
		</Stack>
	),
};
