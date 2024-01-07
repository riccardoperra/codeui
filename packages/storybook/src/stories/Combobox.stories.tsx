import { Button, createSelectOptions, Combobox, ComboboxProps } from "@codeui/kit";
import type { Meta, StoryObj } from "storybook-solidjs";
import {
	DocsContainerFlex,
	DocsItemsContainer,
	DocsMultipleItemsContainer,
} from "./components/Section.tsx";
import { For } from "solid-js";

// TODO: fix
const sizes = ["xs", "sm", "md", "lg", "xl"] as ComboboxProps["size"][];

// TODO: why outline not exist in type?
const themes = ["inline", "outline", "filled"] as ComboboxProps["theme"][];

type Story = StoryObj<typeof meta>;

const meta = {
	title: "DesignSystem/Combobox",
	component: Combobox,
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
} satisfies Meta<typeof Combobox>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const ComboboxStory: Story = {
	name: "Combobox",
	args: {
		triggerMode: "focus",
		// TODO is this correct?
		"aria-label": "Fruit",
		placeholder: "Insert a value...",
		label: "Input label",
		theme: "filled",
		options: ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"],
	},
};

// TODO SHOULD SUPPORT MULTIPLE Combobox

// // More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const ComboboxStoryFilledVariant: Story = {
	name: "Filled variant",
	args: {
		...ComboboxStory.args,
		theme: "filled",
	},
};
//
// // More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const ComboboxOutlineVariant: Story = {
	name: "Outline variant",
	args: {
		...ComboboxStory.args,
		theme: "outline",
	},
};

export const ComboboxInlineVariant: Story = {
	name: "Inline variant",
	args: {
		...ComboboxStory.args,
		theme: "inline",
	},
};

export const ComboboxDisabled: Story = {
	name: "Disabled",
	args: { ...ComboboxStory.args },
	render: args => (
		<DocsItemsContainer>
			<For each={themes}>{theme => <Combobox {...args} theme={theme} disabled />}</For>
		</DocsItemsContainer>
	),
};

export const ComboboxReadonly: Story = {
	name: "Readonly",
	args: { ...ComboboxStory.args },
	render: args => (
		<DocsItemsContainer>
			<For each={themes}>{theme => <Combobox {...args} theme={theme} readOnly />}</For>
		</DocsItemsContainer>
	),
};

export const ComboboxRequired: Story = {
	name: "Required",
	args: { ...ComboboxStory.args },
	render: args => (
		<form>
			<DocsContainerFlex>
				<DocsItemsContainer>
					<Combobox {...args} theme={"filled"} required />
				</DocsItemsContainer>
				<Button theme={"secondary"} type={"submit"}>
					Submit
				</Button>
			</DocsContainerFlex>
		</form>
	),
};

export const Sizes: Story = {
	args: { ...ComboboxStory.args },
	render: args => (
		<DocsMultipleItemsContainer>
			<For each={sizes}>
				{size => (
					<Combobox
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
	args: { ...ComboboxStory.args },
	render: args => (
		<DocsMultipleItemsContainer>
			<For each={sizes}>
				{size => (
					<Combobox
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

export const ComboboxCustomObject: Story = {
	name: "Custom Object",
	args: {
		"aria-label": "Fruit",
		options,
	},
	render: args => (
		<Combobox
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

export const ComboboxCustomObjectWithControlledFunction: Story = {
	args: {
		"aria-label": "Fruit",
		options,
	},
	name: "Custom Object (Controlled Helper)",
	render: () => {
		const ComboboxOptions = createSelectOptions(options, {
			key: "name",
			valueKey: "value",
		});

		return (
			<Combobox
				options={ComboboxOptions.options()}
				{...ComboboxOptions.props()}
				aria-label={"Fruit"}
				placeholder={"Choose a fruit."}
				label={"Fruit"}
				theme={"filled"}
			/>
		);
	},
};
