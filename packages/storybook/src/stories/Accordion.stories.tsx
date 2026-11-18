import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Accordion } from "@codeui/kit";
import * as A from "@codeui/kit/accordion";
const items = [
	{
		value: "size",
		icon: "□",
		title: "Size",
		summary: "64",
		content: <p>Choose the padding around your code.</p>,
	},
	{
		value: "theme",
		icon: "◈",
		title: "Window",
		summary: "macOS",
		content: <p>Window appearance and title bar settings.</p>,
	},
	{
		value: "language",
		icon: "⌘",
		title: "Language",
		summary: "Typescript",
		content: <p>Syntax highlighting options.</p>,
	},
	{
		value: "disabled",
		icon: "◇",
		title: "Unavailable",
		disabled: true,
		content: "Disabled",
	},
];
const meta = {
	title: "DesignSystem/Accordion",
	component: Accordion,
	tags: ["autodocs"],
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Settings: Story = {
	render: () => (
		<Accordion items={items} defaultValue="size" aria-label="Editor settings" />
	),
};
export const Retained: Story = {
	render: () => <Accordion items={items} keepMounted motion="none" />,
};
export const Densities: Story = {
	render: () => (
		<>
			<A.Root defaultValue={["compact"]}>
				<A.Item value="compact">
					<A.Header>
						<A.Trigger density="compact">
							<A.Title>Compact</A.Title>
							<A.Chevron />
						</A.Trigger>
					</A.Header>
					<A.Content>Compact header spacing.</A.Content>
				</A.Item>
			</A.Root>
			<A.Root defaultValue={["comfortable"]}>
				<A.Item value="comfortable">
					<A.Header>
						<A.Trigger density="comfortable">
							<A.Title>Comfortable</A.Title>
							<A.Chevron />
						</A.Trigger>
					</A.Header>
					<A.Content>Comfortable header spacing.</A.Content>
				</A.Item>
			</A.Root>
		</>
	),
};
