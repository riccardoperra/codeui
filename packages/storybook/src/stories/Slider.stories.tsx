import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Slider, Stack } from "@codeui/kit";
const meta = { title: "DesignSystem/Slider", component: Slider } satisfies Meta<
	typeof Slider
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const States: Story = {
	render: () => (
		<Stack gap="4">
			<Slider
				label="Opacity"
				defaultValue={0.75}
				minValue={0}
				maxValue={1}
				step={0.01}
				showValue
			/>
			<Slider label="Disabled" defaultValue={45} disabled showValue />
			<Slider label="Read only" defaultValue={25} readOnly />
			<Slider
				label="Invalid"
				validationState="invalid"
				errorMessage="Choose opacity"
				defaultValue={60}
			/>
			<Slider label="Vertical" orientation="vertical" defaultValue={40} showValue />
		</Stack>
	),
};
export const Focus: Story = {
	render: () => <Slider label="Keyboard focus" defaultValue={50} />,
	play: async ({ canvasElement }) => {
		canvasElement.querySelector<HTMLElement>('[role="slider"]')?.focus();
	},
};
