import type { Meta, StoryObj } from "storybook-solidjs";

import { Link } from "@codeui/kit";

// TODO: improve?
// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
	title: "DesignSystem/Link",
	component: Link,
	args: {
		target: "_blank",
		href: "https://github.com/riccardoperra/codeui",
	},
	argTypes: {},

	tags: ["autodocs"],
	// argTypes: {
	// 	backgroundColor: { control: "color" },
	// },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LinkStory: Story = {
	name: "Link",
	args: {
		children: "Link",
	},
};

export const LinkVariantUnderline: Story = {
	name: "Underline",
	args: {
		variant: "underline",
		children: "Link",
	},
};

export const LinkDisabled: Story = {
	name: "Disabled",
	args: {
		disabled: true,
		children: "Link",
	},
};
