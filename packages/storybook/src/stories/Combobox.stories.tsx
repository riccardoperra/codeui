import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button, Combobox, createComboboxOptions, icons, Stack } from "@codeui/kit";
import * as C from "@codeui/kit/combobox/parts";
import { createSignal, type JSX } from "solid-js";

const meta = { title: "DesignSystem/Combobox", component: Combobox } satisfies Meta<
	typeof Combobox
>;
export default meta;
type Story = StoryObj<typeof meta>;

type Language = { extension: string; name: string; legacy?: boolean };
const languages: Language[] = [
	{ extension: "ts", name: "TypeScript" },
	{ extension: "tsx", name: "TypeScript JSX" },
	{ extension: "js", name: "JavaScript" },
	{ extension: "as", name: "ActionScript", legacy: true },
	{ extension: "rs", name: "Rust" },
];

function LanguageParts(props: {
	label: string;
	size?: "sm" | "md";
	defaultOpen?: boolean;
	disabled?: boolean;
	validationState?: "invalid";
	description?: JSX.Element;
	errorMessage?: JSX.Element;
}) {
	const options = C.createComboboxOptions(languages, {
		valueKey: "extension",
		labelKey: "name",
		disabledKey: "legacy",
	});
	return (
		<C.Root
			{...options.props()}
			defaultValue={props.defaultOpen ? undefined : options.optionFromValue("ts")}
			defaultOpen={props.defaultOpen}
			disabled={props.disabled}
			validationState={props.validationState}
			placeholder="Search languages"
			itemComponent={item => (
				<C.Item item={item.item}>
					<C.ItemLabel>{item.item.rawValue.label}</C.ItemLabel>
					<C.ItemIndicator>
						<icons.CheckIcon />
					</C.ItemIndicator>
				</C.Item>
			)}
		>
			<C.Label>{props.label}</C.Label>
			<C.Control size={props.size}>
				<C.Input />
				<C.Trigger aria-label="Show languages">
					<C.Icon>
						<icons.SelectorIcon />
					</C.Icon>
				</C.Trigger>
			</C.Control>
			{props.description && <C.Description>{props.description}</C.Description>}
			{props.errorMessage && <C.ErrorMessage>{props.errorMessage}</C.ErrorMessage>}
			<C.Portal>
				<C.Content>
					<C.Listbox />
				</C.Content>
			</C.Portal>
		</C.Root>
	);
}

export const PartsStates: Story = {
	render: () => (
		<Stack gap="4" style={{ "max-width": "320px" }}>
			<LanguageParts label="Language" description="Used for highlighting" />
			<LanguageParts label="Compact" size="sm" />
			<LanguageParts label="Disabled" disabled />
			<LanguageParts
				label="Invalid"
				validationState="invalid"
				errorMessage="Choose a supported language"
			/>
		</Stack>
	),
};

export const PartsOpen: Story = {
	tags: ["!autodocs"],
	render: () => (
		<div style={{ "max-width": "320px", "min-height": "320px" }}>
			<LanguageParts label="Language" defaultOpen />
		</div>
	),
};

export const PartsFocus: Story = {
	render: () => (
		<div style={{ "max-width": "320px" }}>
			<LanguageParts label="Keyboard focus" />
		</div>
	),
	play: async ({ canvasElement }) => {
		canvasElement.querySelector("input")?.focus();
	},
};

const fruits = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

export const States: Story = {
	render: () => (
		<Stack gap="4" style={{ "max-width": "320px" }}>
			<Combobox label="Fruit" placeholder="Insert a value..." options={fruits} />
			<Combobox
				label="With description"
				description="Used in the snippet title"
				options={fruits}
				defaultValue="Banana"
			/>
			<Combobox label="Compact" size="sm" options={fruits} defaultValue="Apple" />
			<Combobox label="Disabled" disabled options={fruits} defaultValue="Grapes" />
			<Combobox label="Read only" readOnly options={fruits} defaultValue="Grapes" />
			<Combobox
				label="Invalid"
				validationState="invalid"
				errorMessage="Value is required."
				options={fruits}
			/>
			<Combobox
				aria-label="Fruit without visible label"
				options={fruits}
				placeholder="Fruit"
			/>
		</Stack>
	),
};

export const Required: Story = {
	render: () => (
		<form
			style={{
				display: "flex",
				gap: "8px",
				"align-items": "flex-end",
				"max-width": "420px",
			}}
		>
			<Combobox label="Fruit" name="fruit" required options={fruits} />
			<Button theme="secondary" type="submit">
				Submit
			</Button>
		</form>
	),
};

export const Open: Story = {
	tags: ["!autodocs"],
	render: () => (
		<div style={{ "max-width": "320px", "min-height": "300px" }}>
			<Combobox label="Fruit" options={fruits} defaultValue="Banana" defaultOpen />
		</div>
	),
};

export const Empty: Story = {
	tags: ["!autodocs"],
	render: () => (
		<div style={{ "max-width": "320px", "min-height": "160px" }}>
			<Combobox
				label="Fruit"
				options={fruits}
				inputValue="Kiwi"
				emptyContent="No fruit matches"
				defaultOpen
			/>
		</div>
	),
};

interface Fruit {
	value: string;
	name: string;
	disabled: boolean;
}

const fruitObjects: Fruit[] = [
	{ value: "apple", name: "Apple", disabled: false },
	{ value: "banana", name: "Banana", disabled: false },
	{ value: "blueberry", name: "Blueberry", disabled: false },
	{ value: "grapes", name: "Grapes", disabled: true },
	{ value: "pineapple", name: "Pineapple", disabled: false },
];

export const CustomObject: Story = {
	render: () => (
		<div style={{ "max-width": "320px" }}>
			<Combobox
				label="Fruit"
				placeholder="Choose a fruit."
				options={fruitObjects}
				optionValue="value"
				optionTextValue="name"
				optionLabel="name"
				optionDisabled="disabled"
				renderOption={fruit => <strong>{fruit.name}</strong>}
			/>
		</div>
	),
};

export const OptionsHelper: Story = {
	render: () => {
		const options = createComboboxOptions(fruitObjects, {
			valueKey: "value",
			labelKey: "name",
			disabledKey: "disabled",
		});
		return (
			<div style={{ "max-width": "320px" }}>
				<Combobox
					{...options.props()}
					label="Fruit"
					placeholder="Choose a fruit."
					defaultValue={options.optionFromValue("pineapple")}
				/>
			</div>
		);
	},
};

/** A controlled value from `createComboboxOptions().controlled()`. Clearing the text clears it. */
export const Controlled: Story = {
	render: () => {
		const options = createComboboxOptions(languages, { valueKey: "extension", labelKey: "name" });
		const [extension, setExtension] = createSignal<string | undefined>("rs");
		return (
			<Stack gap="2" style={{ "max-width": "320px" }}>
				<Combobox
					{...options.props()}
					{...options.controlled(extension, setExtension)}
					label="Language"
					placeholder="Search languages"
				/>
				<output>Selected: {extension() ?? "none"}</output>
			</Stack>
		);
	},
};

export const Focus: Story = {
	render: () => (
		<div style={{ "max-width": "320px" }}>
			<Combobox label="Keyboard focus" options={fruits} defaultValue="Apple" />
		</div>
	),
	play: async ({ canvasElement }) => {
		canvasElement.querySelector("input")?.focus();
	},
};
