import { Listbox, VirtualizedListbox } from "@codeui/kit";
import type { Meta, StoryObj } from "storybook-solidjs";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "DesignSystem/Listbox",
	component: Listbox,
	argTypes: {
		selectionMode: {
			control: { type: "radio" },
			options: ["multiple", "none", "single"],
		},
	},

	tags: ["autodocs"],
	// argTypes: {
	// 	backgroundColor: { control: "color" },
	// },
} satisfies Meta<typeof Listbox>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const ListboxStory: Story = {
	name: "Listbox",
	args: {
		options: ["Item1", "Item2", "Item3"],
		selectionMode: "single",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const ListboxMultiple: Story = {
	name: "Listbox (Multiple)",
	args: {
		options: ["Item1", "Item2", "Item3"],
		selectionMode: "multiple",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const ListboxXs: Story = {
	name: "Listbox - Extra Small Size",
	args: {
		defaultValue: ["Item1"],
		size: "xs",
		options: ["Item1", "Item2", "Item3"],
		selectionMode: "multiple",
	},
};

export const ListboxSm: Story = {
	name: "Listbox - Small Size",
	args: {
		size: "sm",
		defaultValue: ["Item1"],
		options: ["Item1", "Item2", "Item3"],
		selectionMode: "multiple",
	},
};

export const ListboxMedium: Story = {
	name: "Listbox - Medium Size",
	args: {
		size: "md",
		defaultValue: ["Item1"],
		options: ["Item1", "Item2", "Item3"],
		selectionMode: "multiple",
	},
};

export const ListboxVirtualized: Story = {
	name: "Listbox Virtualized",
	render: args => {
		const options = args.options!.map((option, index) => ({
			label: option as string,
			value: String(index),
			disabled: false,
		}));

		return <VirtualizedListbox options={options} />;
	},
	args: {
		options: new Array(100_000).fill(null).map((_, index) => `Item ${index}`),
		virtualized: true,
		style: {
			height: "400px",
		},
	},
};
