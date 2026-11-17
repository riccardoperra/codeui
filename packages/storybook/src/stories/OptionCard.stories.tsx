import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { OptionCardGroup } from "@codeui/kit";

const items = [
	{
		value: "dark",
		label: "Dark",
		description: "A darker workspace",
		preview: <span>◐</span>,
		badge: "Default",
	},
	{
		value: "light",
		label: "Light",
		description: "A brighter workspace",
		preview: <span>◯</span>,
	},
	{
		value: "system",
		label: "System",
		description: "Follow your device",
		preview: <span>◑</span>,
	},
	{ value: "unavailable", label: "Unavailable", disabled: true },
];
const meta = {
	title: "DesignSystem/OptionCard",
	component: OptionCardGroup,
	tags: ["autodocs"],
} satisfies Meta<typeof OptionCardGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Cards: Story = {
	render: () => <OptionCardGroup label="Colour mode" items={items} defaultValue="dark" />,
};
export const Tiles: Story = {
	render: () => (
		<OptionCardGroup
			label="Window style"
			variant="tile"
			items={items}
			defaultValue="light"
		/>
	),
};
export const Disabled: Story = {
	render: () => (
		<OptionCardGroup label="Colour mode" items={items} defaultValue="dark" disabled />
	),
};
export const Invalid: Story = {
	render: () => (
		<OptionCardGroup
			label="Colour mode"
			items={items}
			validationState="invalid"
			errorMessage="Choose a colour mode"
			required
		/>
	),
};
export const LongLabels: Story = {
	render: () => (
		<OptionCardGroup
			label="Appearance"
			items={[
				{
					value: "long",
					label: "A translated label that wraps onto several lines",
					description:
						"Long descriptions wrap inside the card at narrow viewport widths.",
					badge: "Default",
				},
				{ value: "short", label: "短い名前" },
			]}
		/>
	),
};
