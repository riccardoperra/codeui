import type { Meta, StoryObj } from "storybook-solidjs";

import { RadioList, RadioListItem, RadioListProps } from "@codeui/kit";
import { For } from "solid-js";

const radioSizes = ["xs", "sm", "md", "lg", "xl"] as const;

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
	title: "DesignSystem/RadioList",
	component: (props: RadioListProps) => (
		<RadioList {...props} defaultValue={"Apple"}>
			<RadioListItem label={"Apple"} value={"Apple"} />
			<RadioListItem label={"Fruit"} value={"Fruit"} />
			<RadioListItem label={"Garden"} value={"Garden"} />
		</RadioList>
	),
	tags: ["autodocs"],
	argTypes: {
		label: {
			defaultValue: "My label",
			type: "string",
			control: { type: "text" },
		},
		orientation: {
			defaultValue: "horizontal",
			type: "string",
			options: ["horizontal", "vertical"],
			control: { type: "inline-radio" },
		},
		description: {
			defaultValue: "",
			control: { type: "text" },
		},
		validationState: {
			options: ["valid", "invalid"],
			control: { type: "inline-radio" },
		},
		errorMessage: {
			if: { arg: "validationState", eq: "invalid" },
			defaultValue: "Value is not valid.",
			control: { type: "text" },
		},
	},
} satisfies Meta<typeof RadioList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RadioListHorizontal: Story = {
	args: {
		orientation: "horizontal",
	},
};

export const RadioListVertical: Story = {
	args: {
		orientation: "vertical",
	},
};

export const Sizes: Story = {
	render: (props: RadioListProps) => (
		<div class={"multipleItemsContainer"}>
			<For each={radioSizes}>
				{size => (
					<meta.component
						{...props}
						description={"This is just a description."}
						label={`Radio List (${size})`}
						size={size}
					/>
				)}
			</For>
		</div>
	),
};

export const Validation: Story = {
	render: (props: RadioListProps) => (
		<div class={"multipleItemsContainer"}>
			<For each={radioSizes}>
				{size => (
					<meta.component
						{...props}
						label={`Radio List (${size})`}
						validationState={"invalid"}
						errorMessage={"Invalid value"}
						size={size}
					/>
				)}
			</For>
		</div>
	),
};
