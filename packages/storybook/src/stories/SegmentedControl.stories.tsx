import type { Meta, StoryObj } from "storybook-solidjs";

import { Button, SegmentedControl, SegmentedControlItem } from "@codeui/kit";
import { createSignal, For } from "solid-js";
import { DocsItemsContainer } from "./components/Section.jsx";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
	title: "DesignSystem/SegmentedControl",
	component: SegmentedControl,
	tags: ["autodocs"],
	argTypes: {
		size: {
			options: sizes,
			control: { type: "select" },
		},
		variant: {
			options: ["solid", "bordered"],
			control: { type: "inline-radio" },
		},
		pill: {
			type: "boolean",
		},
		theme: {
			defaultValue: "neutral",
			options: ["neutral", "primary"],
			control: { type: "inline-radio" },
		},
	},
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

const SegmentedControlSizesTemplate: Story = {
	render: props => {
		return (
			<DocsItemsContainer>
				<For each={sizes}>
					{size => (
						<SegmentedControl size={size} {...props} defaultValue={"1"}>
							<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
							<SegmentedControlItem value={"2"}>Center</SegmentedControlItem>
							<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
						</SegmentedControl>
					)}
				</For>
			</DocsItemsContainer>
		);
	},
};

export const SegmentedControlStory: Story = {
	name: "SegmentedControl",
	render: props => (
		<SegmentedControl {...props} defaultValue={"1"}>
			<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
			<SegmentedControlItem value={"2"}>Center</SegmentedControlItem>
			<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
		</SegmentedControl>
	),
	args: {
		variant: "solid",
		size: "md",
	},
};

export const SolidStyle: Story = {
	...SegmentedControlSizesTemplate,
	args: {
		variant: "solid",
	},
};

export const BorderedStyle: Story = {
	...SegmentedControlSizesTemplate,
	args: {
		variant: "bordered",
	},
};

export const PillStyleSolidVariant: Story = {
	...SegmentedControlSizesTemplate,
	name: "Pill - Solid Variant",
	args: {
		variant: "solid",
		pill: true,
	},
};

export const PillStyleBorderedVariant: Story = {
	...SegmentedControlSizesTemplate,
	name: "Pill - Bordered Variant",
	args: {
		variant: "bordered",
		pill: true,
	},
};

export const ThemePrimary: Story = {
	name: "Theme Primary",
	render: props => (
		<SegmentedControl {...props} size={"md"} defaultValue={"1"}>
			<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
			<SegmentedControlItem value={"2"}>Center</SegmentedControlItem>
			<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
		</SegmentedControl>
	),
	args: {
		theme: "primary",
	},
};

export const DisabledSegmentedControl: Story = {
	name: "Disabled Segmented Control",
	render: props => (
		<DocsItemsContainer>
			<SegmentedControl {...props} size={"md"} defaultValue={"1"} disabled>
				<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
				<SegmentedControlItem value={"2"}>Center</SegmentedControlItem>
				<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
			</SegmentedControl>

			<SegmentedControl
				{...props}
				size={"md"}
				variant={"bordered"}
				defaultValue={"1"}
				disabled
			>
				<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
				<SegmentedControlItem value={"2"}>Center</SegmentedControlItem>
				<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
			</SegmentedControl>
		</DocsItemsContainer>
	),
};

export const DisabledSegmentedItem: Story = {
	name: "Disabled Segmented Item",
	render: props => (
		<DocsItemsContainer>
			<SegmentedControl {...props} size={"md"} defaultValue={"1"}>
				<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
				<SegmentedControlItem value={"2"} disabled>
					Center
				</SegmentedControlItem>
				<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
			</SegmentedControl>
			<SegmentedControl {...props} size={"md"} variant={"bordered"} defaultValue={"1"}>
				<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
				<SegmentedControlItem value={"2"} disabled>
					Center
				</SegmentedControlItem>
				<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
			</SegmentedControl>
		</DocsItemsContainer>
	),
};

export const FluidWidth: Story = {
	name: "Adapt to container size",
	render: props => {
		const [toggled, setToggled] = createSignal(true);
		const [width, setWidth] = createSignal(100);
		const [height, setHeight] = createSignal(60);

		function toggle() {
			if (toggled()) {
				setWidth(70);
				setHeight(40);
			} else {
				setWidth(100);
				setHeight(60);
			}
			setToggled(v => !v);
		}

		return (
			<div>
				<div style={{ display: "flex", gap: "1rem" }}>
					<ul style={{ "margin-bottom": "1rem" }}>
						<li>Width: {width()}%</li>
						<li>Height: {height()}px</li>
					</ul>
					<div style={{ "margin-bottom": "1rem" }}>
						<Button size={"xs"} theme={"secondary"} onClick={toggle}>
							Change sizes
						</Button>
					</div>
				</div>

				<DocsItemsContainer style={{ width: `${width()}%`, height: `${height()}px` }}>
					<SegmentedControl {...props} size={"md"} defaultValue={"1"} fluid autoWidth>
						<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
						<SegmentedControlItem value={"2"} disabled>
							Center
						</SegmentedControlItem>
						<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
					</SegmentedControl>
				</DocsItemsContainer>
			</div>
		);
	},
};
