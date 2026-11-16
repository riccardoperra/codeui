import { TextArea } from "../src/components/TextArea/TextArea";
import { NumberField } from "../src/components/NumberField/NumberField";
import { renderToString } from "solid-js/web";
import { Button } from "../src/components/Button/Button";
import { TextField } from "../src/components/TextField/TextField";

it("server-renders the button text", () => {
	const html = renderToString(() => <Button>Save</Button>);
	expect(html).toContain("Save");
	expect(html).toContain("<button");
});

it("server-renders the text field label", () => {
	const html = renderToString(() => <TextField label="Email address" />);
	expect(html).toContain("Email address");
});

it.each([TextField, TextArea, NumberField])(
	"server-renders the field label pointing at its input",
	Field => {
		const html = renderToString(() => <Field label="Email address" />);
		const labelFor = html.match(/<label[^>]*\sfor="([^"]+)"/)?.[1];
		const inputId = html.match(/<(?:input|textarea)[^>]*\sid="([^"]+)"/)?.[1];
		expect(inputId).toBeTruthy();
		expect(labelFor).toBe(inputId);
	},
);

import { Stack } from "../src/components/Stack/Stack";
import { Text } from "../src/components/Text/Text";
it("server renders Stack tokens and semantic Text content", () => {
	const html = renderToString(() => (
		<Stack as="section" gap="4" justify="between" wrap>
			<Text as="h2" size="lg" weight="medium" tone="muted">
				<em>Export</em>
			</Text>
		</Stack>
	));
	expect(html).toContain("<section");
	expect(html).toContain("--cui-stack-gap:var(--cui-space-4)");
	expect(html).toContain('data-justify="between"');
	expect(html).toContain("<h2");
	expect(html).toMatch(/<em[^>]*>Export<\/em>/);
});

import { Switch } from "../src/components/Switch/Switch";
it("server renders a switch label linked to its input", () => {
	const html = renderToString(() => (
		<Switch label="Notifications" description="Updates" />
	));
	const labelFor = html.match(/<label[^>]*\sfor="([^"]+)"/)?.[1];
	const inputId = html.match(/<input[^>]*\sid="([^"]+)"/)?.[1];
	expect(inputId).toBeTruthy();
	expect(labelFor).toBe(inputId);
});

import { Slider } from "../src/components/Slider/Slider";
import { Progress } from "../src/components/Progress/Progress";
it("server renders slider field content and determinate and indeterminate progress", () => {
	const html = renderToString(() => (
		<>
			<Slider label="Opacity" defaultValue={0.5} minValue={0} maxValue={1} step={0.01} />
			<Progress label="Export" value={5} maxValue={20} />
			<Progress aria-label="Preparing" indeterminate />
		</>
	));
	expect(html).toContain('role="slider"');
	expect(html).toContain('aria-valuetext="0.5"');
	expect(html).toContain("right:50%");
	expect(html).toContain('aria-valuenow="5"');
	expect(html).toContain("data-indeterminate");
	expect(html).toContain("Opacity");
});

import { ComboboxParts } from "../src/parts/combobox";
it("server renders closed combobox parts with a label and an input", () => {
	const html = renderToString(() => (
		<ComboboxParts.Root options={["TypeScript", "Rust"]} defaultValue="Rust">
			<ComboboxParts.Label>Language</ComboboxParts.Label>
			<ComboboxParts.Control>
				<ComboboxParts.Input />
			</ComboboxParts.Control>
			<ComboboxParts.Portal>
				<ComboboxParts.Content>
					<ComboboxParts.Listbox />
				</ComboboxParts.Content>
			</ComboboxParts.Portal>
		</ComboboxParts.Root>
	));
	expect(html).toContain('role="combobox"');
	expect(html).toContain('data-cui="combobox-input"');
	expect(html).toContain('aria-expanded="false"');
	expect(html).not.toContain('role="listbox"');
	expect(html).toContain("Language");
});

import { Combobox } from "../src/components/Combobox/Combobox";
it("server renders the ready combobox label and controlled input text", () => {
	const html = renderToString(() => (
		<Combobox label="Tab name" options={["ts", "js"]} inputValue="index.ts" />
	));
	expect(html).toContain("Tab name");
	expect(html).toContain('role="combobox"');
	expect(html).toContain('value="index.ts"');
});

import { CommandMenuParts } from "../src/parts/command-menu";
it("server renders a closed command menu as its trigger only", () => {
	const html = renderToString(() => (
		<CommandMenuParts.Root open={false}>
			<CommandMenuParts.Trigger>Commands</CommandMenuParts.Trigger>
			<CommandMenuParts.Portal>
				<CommandMenuParts.Content options={["Randomize"]}>
					<CommandMenuParts.Search>
						<CommandMenuParts.SearchInput aria-label="Search" />
					</CommandMenuParts.Search>
					<CommandMenuParts.Listbox />
				</CommandMenuParts.Content>
			</CommandMenuParts.Portal>
		</CommandMenuParts.Root>
	));
	expect(html).toContain('data-cui="command-menu-trigger"');
	expect(html).toContain("Commands");
	expect(html).not.toContain('role="dialog"');
	expect(html).not.toContain('role="combobox"');
});
