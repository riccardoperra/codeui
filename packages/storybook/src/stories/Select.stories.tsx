import { Button, createSelectOptions, Select, TextFieldProps } from "@codeui/kit";
import type { Meta, StoryObj } from "storybook-solidjs";
import {
	DocsContainerFlex,
	DocsItemsContainer,
	DocsMultipleItemsContainer,
} from "./components/Section.jsx";
import { For } from "solid-js";

// TODO: fix
const sizes = ["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][];

// TODO: why outline not exist in type?
const themes = ["inline", "outline", "filled"] as TextFieldProps["theme"][];

type Story = StoryObj<typeof meta>;

const meta = {
	title: "DesignSystem/Select",
	component: Select,
	argTypes: {
		value: {
			type: "string",
			control: { type: "text" },
		},
		theme: {
			options: themes,
			default: "filled",
			control: { type: "radio" },
		},
		description: {
			control: { type: "description" },
		},
		size: {
			options: sizes,
			defaultValue: "md",
			control: { type: "radio" },
		},
		validationState: {
			options: ["valid", "invalid"],
			type: "string",
			control: { type: "inline-radio" },
		},
		errorMessage: {
			if: { arg: "validationState", eq: "invalid" },
			defaultValue: "Value is not valid.",
			type: "string",
			control: { type: "text" },
		},
	},

	tags: ["autodocs"],
	// argTypes: {
	// 	backgroundColor: { control: "color" },
	// },
} satisfies Meta<typeof Select>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const SelectStory: Story = {
	name: "Select",
	args: {
		// TODO is this correct?
		"aria-label": "Fruit",
		placeholder: "Insert a value...",
		label: "Input label",
		theme: "filled",
		options: ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"],
	},
};

// TODO SHOULD SUPPORT MULTIPLE SELECT

// // More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const SelectStoryFilledVariant: Story = {
	name: "Filled variant",
	args: {
		...SelectStory.args,
		theme: "filled",
	},
};
//
// // More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const SelectOutlineVariant: Story = {
	name: "Outline variant",
	args: {
		...SelectStory.args,
		// @ts-expect-error fix type
		theme: "outline",
	},
};

export const SelectInlineVariant: Story = {
	name: "Inline variant",
	args: {
		...SelectStory.args,
		theme: "inline",
	},
};

export const SelectDisabled: Story = {
	name: "Disabled",
	args: { ...SelectStory.args },
	render: args => (
		<DocsItemsContainer>
			<For each={themes}>{theme => <Select {...args} theme={theme} disabled />}</For>
		</DocsItemsContainer>
	),
};

export const SelectReadonly: Story = {
	name: "Readonly",
	args: { ...SelectStory.args },
	render: args => (
		<DocsItemsContainer>
			<For each={themes}>{theme => <Select {...args} theme={theme} readOnly />}</For>
		</DocsItemsContainer>
	),
};

export const SelectRequired: Story = {
	name: "Required",
	args: { ...SelectStory.args },
	render: args => (
		<form>
			<DocsContainerFlex>
				<DocsItemsContainer>
					<Select {...args} theme={"filled"} required />
				</DocsItemsContainer>
				<Button theme={"secondary"} type={"submit"}>
					Submit
				</Button>
			</DocsContainerFlex>
		</form>
	),
};

export const Sizes: Story = {
	args: { ...SelectStory.args },
	render: args => (
		<DocsMultipleItemsContainer>
			<For each={sizes}>
				{size => (
					<Select
						{...args}
						description={"Lorem ipsum dolor sit amet."}
						label={`Input size (${size})`}
						size={size}
					/>
				)}
			</For>
		</DocsMultipleItemsContainer>
	),
};

export const Validation: Story = {
	args: { ...SelectStory.args },
	render: args => (
		<DocsMultipleItemsContainer>
			<For each={sizes}>
				{size => (
					<Select
						{...args}
						description={"Lorem ipsum dolor sit amet."}
						label={`Input size (${size})`}
						validationState={"invalid"}
						errorMessage={"Value is required."}
						size={size}
					/>
				)}
			</For>
		</DocsMultipleItemsContainer>
	),
};

interface Fruit {
	value: string;
	name: string;
	disabled: boolean;
}

const options: Fruit[] = [
	{ value: "apple", name: "Apple", disabled: false },
	{ value: "banana", name: "Banana", disabled: false },
	{ value: "blueberry", name: "Blueberry", disabled: false },
	{ value: "grapes", name: "Grapes", disabled: true },
	{ value: "pineapple", name: "Pineapple", disabled: false },
];

export const SelectCustomObject: Story = {
	name: "Custom Object",
	args: {
		"aria-label": "Fruit",
		options,
	},
	render: args => (
		<Select
			aria-label={"Fruit"}
			placeholder={"Choose a fruit."}
			label={"Fruit"}
			theme={"filled"}
			options={args.options as Fruit[]}
			optionValue="value"
			optionTextValue="name"
			optionDisabled="disabled"
			itemLabel={props => props.name}
			valueComponent={value => value().name}
		/>
	),
};

export const SelectCustomObjectWithControlledFunction: Story = {
	args: {
		"aria-label": "Fruit",
		options,
	},
	name: "Custom Object (Controlled Helper)",
	render: () => {
		const selectOptions = createSelectOptions(options, {
			key: "name",
			valueKey: "value",
		});

		return (
			<Select
				options={selectOptions.options()}
				{...selectOptions.props()}
				aria-label={"Fruit"}
				placeholder={"Choose a fruit."}
				label={"Fruit"}
				theme={"filled"}
			/>
		);
	},
};
