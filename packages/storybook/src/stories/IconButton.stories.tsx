import type { Meta, StoryObj } from "storybook-solidjs";

import { Button, IconButton } from "@codeui/kit";
import { For } from "solid-js";
import { ShareIcon } from "./components/ShareIcon.jsx";

const buttonThemes = ["primary", "secondary", "tertiary", "negative", "caution"] as const;

const buttonSizes = ["xs", "sm", "md", "lg", "xl"] as const;

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
	title: "DesignSystem/IconButton",
	component: props => (
		<IconButton aria-label={"Icon"} {...props}>
			<ShareIcon />
		</IconButton>
	),
	args: {
		"aria-label": "Icon",
	},
	argTypes: {
		theme: {
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
		"aria-label": "Primary Icon",
		theme: "primary",
		children: <ShareIcon />,
	},
};

export const Secondary: Story = {
	args: {
		"aria-label": "Secondary Icon",
		theme: "secondary",
		children: <ShareIcon />,
	},
};

export const Tertiary: Story = {
	args: {
		"aria-label": "Tertiary Icon",
		theme: "tertiary",
		children: <ShareIcon />,
	},
};

export const Caution: Story = {
	args: {
		"aria-label": "Caution Icon",
		theme: "caution",
		children: <ShareIcon />,
	},
};

export const Negative: Story = {
	args: {
		"aria-label": "Negative Icon",
		theme: "negative",
		children: <ShareIcon />,
	},
};

export const Disabled: Story = {
	args: {
		"aria-label": "Negative Icon",
		theme: "secondary",
		disabled: true,
		children: <ShareIcon />,
	},
};

export const Sizes: Story = {
	render: () => (
		<div class="itemsContainer">
			<For each={buttonSizes}>
				{size => (
					<IconButton aria-label={`Icon (${size})`} size={size} theme={"primary"}>
						<ShareIcon />
					</IconButton>
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
					<IconButton aria-label={"Icon"} size={size} theme={"secondary"} pill>
						<ShareIcon />
					</IconButton>
				)}
			</For>
		</div>
	),
};

export const Loading: Story = {
	render: () => (
		<div class={"multipleItemsContainer"}>
			<For each={buttonThemes}>
				{theme => (
					<div class={"itemsContainer"}>
						<For each={buttonSizes}>
							{size => (
								<IconButton aria-label={"Icon"} size={size} theme={theme} loading>
									<ShareIcon />
								</IconButton>
							)}
						</For>
					</div>
				)}
			</For>
		</div>
	),
};
