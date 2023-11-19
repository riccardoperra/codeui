import type { Meta, StoryObj } from "storybook-solidjs";

import { icons, Tabs } from "@codeui/kit";
import { For } from "solid-js";
import { DocsContainerFlex } from "./components/Section.jsx";

const meta = {
	title: "DesignSystem/Icons",
	component: Tabs,
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
	name: "All Exported Icons",
	render: () => (
		<DocsContainerFlex direction={"column"} wrap={true}>
			<For each={Object.entries(icons)}>
				{([name, Icon]) => (
					<DocsContainerFlex direction={"row"} gap={"6rem"}>
						<h4 style={{ width: "100px" }}>{name}</h4>
						<Icon />
					</DocsContainerFlex>
				)}
			</For>
		</DocsContainerFlex>
	),
};

export const CustomSizeIcon: Story = {
	name: "Custom size icon",
	render: () => <icons.NextIcon size={"5rem"} />,
};
