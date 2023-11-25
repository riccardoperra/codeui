import { Button, TextArea, TextAreaProps } from "@codeui/kit";
import type { Meta, StoryObj } from "storybook-solidjs";
import { DocsItemsContainer, DocsMultipleItemsContainer } from "./components/Section.jsx";
import { For } from "solid-js";

// TODO: fix
const sizes = ["xs", "sm", "md", "lg", "xl"] as TextAreaProps["size"][];

// TODO: why outline not exist in type?
const themes = ["inline", "outline", "filled"] as TextAreaProps["theme"][];

const placeholder =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus scelerisque nunc ut lorem tincidunt, sit amet condimentum ipsum porta. Donec commodo consectetur mauris, ac tincidunt erat maximus eu.";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "DesignSystem/TextArea",
	component: TextArea,
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
} satisfies Meta<typeof TextArea>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextAreaStory: Story = {
	name: "TextArea",
	args: {
		// TODO: should be default?
		options: { autoResize: true },
		placeholder: "Insert a value...",
		label: "Textarea label",
		theme: "filled",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextAreaFilledVariant: Story = {
	name: "Filled variant",
	args: {
		options: { autoResize: true },
		placeholder: "Insert a value",
		label: "Textarea label",
		theme: "filled",
		description: "Your username is description",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextAreaOutlineVariant: Story = {
	name: "Outline variant",
	args: {
		options: { autoResize: true },
		placeholder: "Insert a value",
		label: "Textarea label",
		theme: "outline",
		description: "Lorem ipsum dolor sit amet",
	},
};

// TODO shuold not have this variant.
// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextAreaInlineVariant: Story = {
	name: "Inline variant",
	args: {
		options: { autoResize: true },
		placeholder: "Insert a value",
		label: "Textarea label",
		theme: "inline",
		description: "Lorem ipsum dolor sit amet",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextAreaDisabled: Story = {
	name: "Disabled",
	render: () => (
		<DocsItemsContainer>
			<For each={themes}>
				{theme => (
					<TextArea
						options={{ autoResize: true }}
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
export const TextAreaReadonly: Story = {
	name: "Readonly",
	render: () => (
		<DocsItemsContainer>
			<For each={themes}>
				{theme => (
					<TextArea
						options={{ autoResize: true }}
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
export const TextAreaRequired: Story = {
	name: "Required",
	render: () => (
		<form>
			<DocsItemsContainer>
				<For each={themes}>
					{theme => (
						<TextArea
							options={{ autoResize: true }}
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
					<TextArea
						options={{ autoResize: true }}
						placeholder={placeholder}
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
					<TextArea
						options={{ autoResize: true }}
						placeholder={placeholder}
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

export const TextAreaCustomClasses: Story = {
	name: "Custom classes",
	args: {
		options: { autoResize: true },
		placeholder: "Insert a value",
		label: "Textarea label",
		theme: "inline",
		description: "Lorem ipsum dolor sit amet",
		slotClasses: {
			input: "text-center",
			label: "font-italic",
		},
	},
};
