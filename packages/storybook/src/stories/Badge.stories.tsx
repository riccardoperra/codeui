import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Badge, icons } from "@codeui/kit";
import { For } from "solid-js";
import { DocsContainerTitle, DocsItemsContainer } from "./components/Section.jsx";

const tones = ["neutral", "info", "success", "warning", "danger"] as const;

const meta = {
	title: "DesignSystem/Badge",
	component: Badge,
	tags: ["autodocs"],
	args: { children: "Default" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BadgeStory: Story = {
	name: "Badge",
};

export const Tones: Story = {
	render: () => (
		<For each={["soft", "outline"] as const}>
			{variant => (
				<For each={["sm", "md"] as const}>
					{size => (
						<>
							<DocsContainerTitle>
								{variant} {size}
							</DocsContainerTitle>
							<DocsItemsContainer>
								<For each={tones}>
									{tone => (
										<Badge tone={tone} size={size} variant={variant}>
											{tone}
										</Badge>
									)}
								</For>
							</DocsItemsContainer>
						</>
					)}
				</For>
			)}
		</For>
	),
};

export const WithIcon: Story = {
	render: () => (
		<DocsItemsContainer>
			<Badge tone="info" icon={<icons.CheckIcon />}>
				Experimental
			</Badge>
			<Badge size="md" tone="info" variant="outline" icon={<icons.CheckIcon />}>
				Experimental
			</Badge>
		</DocsItemsContainer>
	),
};
