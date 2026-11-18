import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Button } from "@codeui/kit";
import { For } from "solid-js";
import { ShareIcon } from "./components/ShareIcon.jsx";
import { DocsItemsContainer, DocsMultipleItemsContainer } from "./components/Section.jsx";

const buttonThemes = ["primary", "secondary", "tertiary", "negative", "caution"] as const;

const buttonSizes = ["xs", "sm", "md", "lg"] as const;

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
	title: "DesignSystem/Button",
	component: Button,
	argTypes: {
		variant: {
			options: buttonThemes,
			control: { type: "inline-radio" },
		},
		size: {
			options: buttonSizes,
			control: { type: "inline-radio" },
		},
		loading: {
			control: "boolean",
		},
	},

	tags: ["autodocs"],
	// argTypes: {
	// 	backgroundColor: { control: "color" },
	// },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const Primary: Story = {
	args: {
		variant: "primary",
		children: "Button",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		children: "Button",
	},
};

export const Tertiary: Story = {
	args: {
		variant: "tertiary",
		children: "Button",
	},
};

export const Caution: Story = {
	args: {
		variant: "caution",
		children: "Button",
	},
};

export const Negative: Story = {
	args: {
		variant: "negative",
		children: "Button",
	},
};

export const Disabled: Story = {
	args: {
		variant: "secondary",
		disabled: true,
		children: "Button",
	},
};

export const Sizes: Story = {
	render: () => (
		<div class="itemsContainer">
			<For each={buttonSizes}>
				{size => (
					<Button size={size} variant={"primary"}>
						Button ({size})
					</Button>
				)}
			</For>
		</div>
	),
};

export const WithLeftIcon: Story = {
	render: () => (
		<div class="itemsContainer">
			<For each={buttonSizes}>
				{size => (
					<Button leftIcon={<ShareIcon />} size={size} variant={"secondary"} pill>
						Button
					</Button>
				)}
			</For>
		</div>
	),
};

export const Pill: Story = {
	render: () => (
		<div class="itemsContainer">
			<For each={buttonSizes}>
				{size => (
					<Button size={size} variant={"secondary"} pill>
						Button
					</Button>
				)}
			</For>
		</div>
	),
};

export const Ghost: Story = {
	render: () => (
		<div class="itemsContainer">
			<For each={buttonThemes}>
				{theme => (
					<Button size={"md"} variant={theme} ghost>
						Button
					</Button>
				)}
			</For>
		</div>
	),
};

export const Loading: Story = {
	render: () => (
		<DocsMultipleItemsContainer>
			<For each={buttonThemes}>
				{theme => (
					<DocsItemsContainer>
						<For each={buttonSizes}>
							{size => (
								<Button size={size} variant={theme} loading>
									Button
								</Button>
							)}
						</For>
					</DocsItemsContainer>
				)}
			</For>
		</DocsMultipleItemsContainer>
	),
};
