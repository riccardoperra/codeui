import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button, Spinner } from "@codeui/kit";
import { For } from "solid-js";
import { DocsItemsContainer } from "./components/Section.jsx";

const meta = {
	title: "DesignSystem/Spinner",
	component: Spinner,
	tags: ["autodocs"],
	args: { label: "Loading" },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpinnerStory: Story = {
	name: "Spinner",
};

export const Sizes: Story = {
	render: () => (
		<DocsItemsContainer>
			<For each={["sm", "md", "lg"] as const}>{size => <Spinner size={size} label={`Loading ${size}`} />}</For>
		</DocsItemsContainer>
	),
};

export const InsideBusyButton: Story = {
	render: () => (
		<Button theme="secondary" aria-busy="true" leftIcon={<Spinner size="sm" />}>
			Exporting
		</Button>
	),
};
