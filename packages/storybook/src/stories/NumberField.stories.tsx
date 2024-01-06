import { Button, NumberField, NumberFieldProps } from "@codeui/kit";
import type { Meta, StoryObj } from "storybook-solidjs";
import { DocsItemsContainer, DocsMultipleItemsContainer } from "./components/Section.jsx";
import { For, createSignal } from "solid-js";
import { render } from "solid-js/web";

// TODO: fix
const sizes = ["xs", "sm", "md", "lg", "xl"] as NumberFieldProps["size"][];

// TODO: why outline not exist in type?
const themes = ["inline", "outline", "filled"] as NumberFieldProps["theme"][];

type Story = StoryObj<typeof meta>;

const meta = {
	title: "DesignSystem/NumberField",
	component: NumberField,
	argTypes: {
		min: {
			type: "number",
			defaultValue: 0,
		},
		max: {
			type: "number",
			defaultValue: 0,
		},
		prefix: {
			type: "string",
			defaultValue: "",
		},
		postfix: {
			type: "string",
			defaultValue: "",
		},
		precision: {
			type: "number",
			defaultValue: 1,
		},
		step: {
			type: "number",
			step: 1,
		},
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
} satisfies Meta<typeof NumberField>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const TextFieldStory: Story = {
	name: "NumberField",
	args: {
		placeholder: "Insert a value...",
		label: "Input label",
		theme: "filled",
	},
};

const [d, setX] = createSignal(60);
export const MinMax: Story = {
	name: "NumberField with min/max value",
	render: args => (
		<NumberField
			value={d()}
			onChange={x => console.warn("value change", x, setX(x))}
			{...args}
		/>
	),
	args: {
		min: 40,
		max: 500,
		placeholder: "Insert a value...",
		label: "Input label",
		theme: "filled",
	},
};

export const Precision: Story = {
	name: "NumberField with custom precision",
	args: {
		precision: 4,
		placeholder: "Insert a value...",
		label: "Input label",
		theme: "filled",
	},
};

export const Step: Story = {
	name: "NumberField with steps",
	args: {
		precision: 2,
		step: 0.01,
		placeholder: "Insert a value...",
		label: "Input label",
		theme: "filled",
	},
};

export const Prefix: Story = {
	name: "NumberField with prefix",
	args: {
		precision: 2,
		prefix: "$",
		placeholder: "Insert a value...",
		label: "Input label",
		theme: "filled",
	},
};

export const Postfix: Story = {
	name: "NumberField with postfix",
	args: {
		precision: 2,
		postfix: "$",
		placeholder: "Insert a value...",
		label: "Input label",
		theme: "filled",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const NumberFieldFilledVariant: Story = {
	name: "Filled variant",
	args: {
		placeholder: "Insert a value",
		label: "Input label",
		theme: "filled",
		description: "Your username is description",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const NumberFieldOutlineVariant: Story = {
	name: "Outline variant",
	args: {
		placeholder: "Insert a value",
		label: "Input label",
		theme: "outline",
		description: "Lorem ipsum dolor sit amet",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const NumberFieldInlineVariant: Story = {
	name: "Inline variant",
	args: {
		placeholder: "Insert a value",
		label: "Input label",
		theme: "inline",
		description: "Lorem ipsum dolor sit amet",
	},
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const NumberFieldDisabled: Story = {
	name: "Disabled",
	render: () => (
		<DocsItemsContainer>
			<For each={themes}>
				{theme => (
					<NumberField
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
export const NumberFieldReadonly: Story = {
	name: "Readonly",
	render: () => (
		<DocsItemsContainer>
			<For each={themes}>
				{theme => (
					<NumberField
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
export const NumberFieldRequired: Story = {
	name: "Required",
	render: () => (
		<form>
			<DocsItemsContainer>
				<For each={themes}>
					{theme => (
						<NumberField
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
					<NumberField
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
					<NumberField
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
