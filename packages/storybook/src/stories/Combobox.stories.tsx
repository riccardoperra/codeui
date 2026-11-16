import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { icons, Stack } from "@codeui/kit";
import * as C from "@codeui/kit/combobox";
import type { JSX } from "solid-js";

const meta = { title: "DesignSystem/Combobox" } satisfies Meta;
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
