import { Button, TextField, TextFieldProps } from "@codeui/kit";
import type { Meta, StoryObj } from "storybook-solidjs";
import { DocsItemsContainer, DocsMultipleItemsContainer } from "./components/Section.tsx";
import { For } from "solid-js";

// TODO: fix
const sizes = ["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][];

// TODO: why outline not exist in type?
const themes = ["inline", "outline", "filled"] as TextFieldProps["theme"][];

type Story = StoryObj<typeof meta>;

const meta = {
	title: "DesignSystem/TextField",
	component: TextField,
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
} satisfies Meta<typeof TextField>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextFieldStory: Story = {
	name: "TextField",
	args: {
		placeholder: "Insert a value...",
		label: "Input label",
		theme: "filled",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextFieldFilledVariant: Story = {
	name: "Filled variant",
	args: {
		placeholder: "Insert a value",
		label: "Input label",
		theme: "filled",
		description: "Your username is description",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextFieldOutlineVariant: Story = {
	name: "Outline variant",
	args: {
		placeholder: "Insert a value",
		label: "Input label",
		// @ts-expect-error TODO: fix type
		theme: "outline",
		description: "Lorem ipsum dolor sit amet",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextFieldInlineVariant: Story = {
	name: "Inline variant",
	args: {
		placeholder: "Insert a value",
		label: "Input label",
		theme: "inline",
		description: "Lorem ipsum dolor sit amet",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextFieldDisabled: Story = {
	name: "Disabled",
	render: () => (
		<DocsItemsContainer>
			<For each={themes}>
				{theme => (
					<TextField
						description={"Lorem ipsum dolor sit amet."}
						label={"Input"}
						size={"md"}
						theme={theme}
						disabled
					/>
				)}
			</For>
		</DocsItemsContainer>
	),
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextFieldReadonly: Story = {
	name: "Readonly",
	render: () => (
		<DocsItemsContainer>
			<For each={themes}>
				{theme => (
					<TextField
						description={"Lorem ipsum dolor sit amet."}
						label={"Input"}
						size={"md"}
						theme={theme}
						readOnly
					/>
				)}
			</For>
		</DocsItemsContainer>
	),
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextFieldRequired: Story = {
	name: "Required",
	render: () => (
		<form>
			<DocsItemsContainer>
				<For each={themes}>
					{theme => (
						<TextField
							description={"Lorem ipsum dolor sit amet."}
							label={"Input"}
							size={"md"}
							theme={theme}
							required
						/>
					)}
				</For>
			</DocsItemsContainer>
			<Button theme={"secondary"} type={"submit"}>
				Submit
			</Button>
		</form>
	),
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const Sizes: Story = {
	render: () => (
		<DocsMultipleItemsContainer>
			<For each={sizes}>
				{size => (
					<TextField
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
	render: () => (
		<DocsMultipleItemsContainer>
			<For each={sizes}>
				{size => (
					<TextField
						placeholder={"Insert value"}
						validationState={"invalid"}
						errorMessage={"Value is required."}
						description={"Lorem ipsum dolor sit amet."}
						label={`Input size (${size})`}
						size={size}
					/>
				)}
			</For>
		</DocsMultipleItemsContainer>
	),
};

export const TextFieldCustomClasses: Story = {
	name: "Custom classes",
	args: {
		placeholder: "Insert a value",
		label: "TextField label",
		theme: "inline",
		description: "Lorem ipsum dolor sit amet",
		slotClasses: {
			input: "text-center",
			label: "font-italic",
		},
	},
};
