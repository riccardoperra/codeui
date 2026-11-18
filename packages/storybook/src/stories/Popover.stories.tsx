import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";
import { DocsItemsContainer } from "./components/Section.jsx";
import { For } from "solid-js";
import * as P from "@codeui/kit/popover/parts";

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
			<PopoverTrigger asChild as={Button} variant={"secondary"}>
				Click me
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
			<PopoverTrigger asChild as={Button} variant={"secondary"}>
				Click me
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
						<PopoverTrigger as={Button} variant={"secondary"}>
							{position}
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

/** Opened on load to show the styled parts. Hidden from the docs page, where open popovers would overlap. */
export const Parts: Story = {
	tags: ["!autodocs"],
	render: () => (
		<P.Root defaultOpen placement={"bottom-start"} gutter={10}>
			<P.Trigger as={Button} variant={"secondary"}>
				What's new
			</P.Trigger>
			<P.Portal>
				<P.Content variant={"bordered"}>
					<P.Title>New export panel</P.Title>
					<P.Description>Export styles now live next to the preview.</P.Description>
				</P.Content>
			</P.Portal>
		</P.Root>
	),
};

/** The ready component opened on load. Children render directly in the content, without a paragraph. */
export const OpenWithBlockContent: Story = {
	tags: ["!autodocs"],
	render: () => (
		<Popover defaultOpen placement={"bottom-start"}>
			<PopoverTrigger as={Button} variant={"secondary"}>
				Export styles
			</PopoverTrigger>
			<PopoverContent title={"Export styles"} description={"Applies to every new export."}>
				<div style={{ display: "grid", "grid-template-columns": "1fr 1fr", gap: "8px" }}>
					<Button variant={"secondary"}>PNG</Button>
					<Button variant={"secondary"}>SVG</Button>
				</div>
			</PopoverContent>
		</Popover>
	),
};
