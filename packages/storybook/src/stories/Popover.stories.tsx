import type { Meta, StoryObj } from "storybook-solidjs";

import { As, Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";
import { DocsItemsContainer } from "./components/Section.jsx";
import { For } from "solid-js";

const placements = [
	"top-start",
	"top-end",
	"right-start",
	"right-end",
	"bottom-start",
	"bottom-end",
	"left-start",
	"left-end",
] as const;

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
	title: "DesignSystem/Popover",
	component: props => {
		return <Popover {...props} />;
	},
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
					Click me
				</As>
			</PopoverTrigger>
			<PopoverContent title={"Title"}>
				About Kobalte A UI toolkit for building accessible web apps and design systems
				with SolidJS.
			</PopoverContent>
		</Popover>
	),
};

export const PopoverBordered: Story = {
	name: "Popover Bordered",
	render: props => (
		<Popover {...props}>
			<PopoverTrigger asChild>
				<As component={Button} theme={"secondary"}>
					Click me
				</As>
			</PopoverTrigger>
			<PopoverContent title={"Title"} variant={"bordered"}>
				About Kobalte A UI toolkit for building accessible web apps and design systems
				with SolidJS.
			</PopoverContent>
		</Popover>
	),
};

export const CustomPosition: Story = {
	render: () => (
		<DocsItemsContainer>
			<For each={placements}>
				{position => (
					<Popover placement={position}>
						<PopoverTrigger asChild>
							<As component={Button} theme={"secondary"}>
								{position}
							</As>
						</PopoverTrigger>
						<PopoverContent title={"Title"}>
							About Kobalte A UI toolkit for building accessible web apps and design
							systems with SolidJS.
						</PopoverContent>
					</Popover>
				)}
			</For>
		</DocsItemsContainer>
	),
};
