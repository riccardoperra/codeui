import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Kbd } from "@codeui/kit";
import { For } from "solid-js";
import { DocsContainerTitle, DocsItemsContainer } from "./components/Section.jsx";

const meta = {
	title: "DesignSystem/Kbd",
	component: Kbd,
	tags: ["autodocs"],
	args: { children: "⌘K" },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const KbdStory: Story = {
	name: "Kbd",
};

export const Variants: Story = {
	render: () => (
		<For each={["keycap", "hint"] as const}>
			{variant => (
				<>
					<DocsContainerTitle>{variant}</DocsContainerTitle>
					<DocsItemsContainer>
						<For each={["sm", "md"] as const}>
							{size => (
								<span style={{ display: "inline-flex", gap: "4px" }}>
									<Kbd size={size} variant={variant}>
										⌘
									</Kbd>
									<Kbd size={size} variant={variant}>
										Shift
									</Kbd>
									<Kbd size={size} variant={variant}>
										?
									</Kbd>
								</span>
							)}
						</For>
					</DocsItemsContainer>
				</>
			)}
		</For>
	),
};
