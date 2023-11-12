import type { Meta, StoryObj } from "storybook-solidjs";

import { Checkbox, CheckBoxProps } from "@codeui/kit";
import { For } from "solid-js";
import { DocsMultipleItemsContainer } from "./components/Section.jsx";

const checkboxSizes = ["xs", "sm", "md", "lg", "xl"] as const;

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
	title: "DesignSystem/Checkbox",
	component: (props: CheckBoxProps) => <Checkbox {...props} />,
	tags: ["autodocs"],
	argTypes: {
		label: {
			defaultValue: "My label",
			type: "string",
			control: { type: "text" },
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
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxStory: Story = {
	name: "Checkbox",
	args: {
		label: "My label",
	},
};

export const Sizes: Story = {
	render: props => (
		<DocsMultipleItemsContainer>
			<For each={checkboxSizes}>
				{size => (
					<Checkbox
						{...props}
						description={"This is just a description."}
						label={`Checkbox (${size})`}
						size={size}
					/>
				)}
			</For>
		</DocsMultipleItemsContainer>
	),
};

export const Validation: Story = {
	render: props => (
		<DocsMultipleItemsContainer>
			<For each={checkboxSizes}>
				{size => (
					<Checkbox
						{...props}
						label={`Checkbox (${size})`}
						validationState={"invalid"}
						errorMessage={"Invalid value"}
						size={size}
					/>
				)}
			</For>
		</DocsMultipleItemsContainer>
	),
};
