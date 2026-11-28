import { Listbox, VirtualizedListbox } from "@codeui/kit";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "DesignSystem/Listbox",
	component: Listbox,
	argTypes: {
		shouldSelectOnPressUp: {
			type: "boolean",
		},
		shouldFocusOnHover: {
			type: "boolean",
		},
		disallowEmptySelection: {
			type: "boolean",
		},
		allowsTabNavigation: {
			type: "boolean",
		},
		selectionMode: {
			control: { type: "radio" },
			options: ["multiple", "none", "single"],
		},
		size: {
			control: { type: "radio" },
			options: ["xs", "sm", "md"],
		},
		bordered: {
			type: "boolean",
		},
		variant: {
			control: { type: "radio" },
			options: ["primary", "neutral"],
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
		variant: "neutral",
		size: "md",
		bordered: false,
		options: ["Item1", "Item2", "Item3"],
		selectionMode: "single",
		shouldFocusOnHover: true,
		shouldSelectOnPressUp: false,
		disallowEmptySelection: false,
		allowsTabNavigation: false,
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

export const ListboxBordered: Story = {
	name: "Listbox - Bordered",
	args: {
		size: "md",
		bordered: true,
		defaultValue: ["Item1"],
		options: ["Item1", "Item2", "Item3"],
		selectionMode: "multiple",
	},
};

export const ListboxOptionWithCustomItemLabel: Story = {
	name: "Listbox - Custom Item Label",
	args: {
		size: "md",
		defaultValue: ["Item1"],
		options: ["Item1", "Item2", "Item3"],
		selectionMode: "multiple",
		// @ts-ignore
		itemLabel: (item: string) => <span style={{ color: "yellow" }}>Custom {item}</span>,
	},
};

// A plain array, not an arg. Solid 2 renders args as a store, which would wrap
// all 100k rows in reactive proxies.
const virtualizedOptions = Array.from({ length: 100_000 }, (_, index) => ({
	label: `Item ${index + 1}`,
	value: String(index),
	disabled: false,
}));

export const ListboxVirtualized: Story = {
	name: "Listbox Virtualized",
	render: args => <VirtualizedListbox options={virtualizedOptions} style={args.style} />,
	args: {
		style: {
			height: "400px",
			overflow: "auto",
		},
	},
};

export const FieldApi: Story = {
	render: () => (
		<>
			<Listbox
				aria-label="Fruit"
				options={["Apple", "Pear"]}
				class="fruit-list"
				classes={{ item: "fruit-option" }}
			/>
			<VirtualizedListbox
				aria-label="Fonts"
				class="font-list"
				classes={{ itemLabel: "font-label" }}
				options={Array.from({ length: 100 }, (_, i) => ({
					value: String(i),
					label: `Font ${i}`,
				}))}
			/>
		</>
	),
};
