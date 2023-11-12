import type { Meta, StoryObj } from "storybook-solidjs";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";
import { DocsItemsContainer } from "./components/Section.jsx";
import { As } from "@kobalte/core";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
	title: "DesignSystem/Popover",
	component: Popover,
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PopoverStory: Story = {
	name: "Popover",
	render: props => (
		<Popover {...props}>
			<PopoverTrigger asChild>
				<As component={Button} theme={"secondary"}>
					Open
				</As>
			</PopoverTrigger>
			<PopoverContent title={"Title"}>
				About Kobalte A UI toolkit for building accessible web apps and design systems
				with SolidJS.
			</PopoverContent>
		</Popover>
	),
};

export const CustomPosition: Story = {
	render: () => (
		<DocsItemsContainer>
			<Popover placement={"bottom-start"}>
				<PopoverTrigger asChild>
					<As component={Button} theme={"secondary"}>
						Custom position
					</As>
				</PopoverTrigger>
				<PopoverContent title={"Title"}>
					About Kobalte A UI toolkit for building accessible web apps and design systems
					with SolidJS.
				</PopoverContent>
			</Popover>
		</DocsItemsContainer>
	),
};
