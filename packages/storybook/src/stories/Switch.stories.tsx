import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Stack, Switch } from "@codeui/kit";
const meta = { title: "DesignSystem/Switch", component: Switch } satisfies Meta<
	typeof Switch
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const States: Story = {
	render: () => (
		<Stack gap="4">
			<Switch label="Notifications" description="Receive export updates" />
			<Switch label="Checked" defaultChecked />
			<Switch label="Compact" size="sm" />
			<Switch label="Compact checked" size="sm" defaultChecked />
			<Switch label="Disabled" disabled />
			<Switch label="Disabled checked" disabled defaultChecked />
			<Switch label="Read only" readOnly defaultChecked />
			<Switch label="Invalid" validationState="invalid" errorMessage="Choose a setting" />
		</Stack>
	),
};
export const Focus: Story = {
	render: () => <Switch label="Keyboard focus" defaultChecked />,
	play: async ({ canvasElement }) => {
		canvasElement.querySelector("input")?.focus();
	},
};
