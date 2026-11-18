import { Alert } from "../src/components/Alert/Alert";
import { createToaster, Toaster } from "../src/components/Toast/Toaster";
import * as T from "../src/parts/toast";
import { Badge } from "../src/components/Badge/Badge";
import { Kbd } from "../src/components/Kbd/Kbd";
import { Skeleton } from "../src/components/Skeleton/Skeleton";
import { Spinner } from "../src/components/Spinner/Spinner";
import { TextArea } from "../src/components/TextArea/TextArea";
import { NumberField } from "../src/components/NumberField/NumberField";
import { renderToString } from "solid-js/web";
import { Button } from "../src/components/Button/Button";
import { TextField } from "../src/components/TextField/TextField";
import * as S from "../src/parts/sheet";

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
	expect(html).toContain('data-gap="4"');
	expect(html).toContain('data-wrap="true"');
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
	expect(html).toContain('data-cui="commandmenu-trigger"');
	expect(html).toContain("Commands");
	expect(html).not.toContain('role="dialog"');
	expect(html).not.toContain('role="combobox"');
});

import { CommandMenu } from "../src/components/CommandMenu/CommandMenu";
it("server renders nothing for a closed ready command menu", () => {
	const html = renderToString(() => (
		<CommandMenu
			open={false}
			onOpenChange={() => {}}
			items={[{ id: "randomize", textValue: "Randomize", label: "Randomize" }]}
			title="Commands"
			onSelect={() => {}}
		/>
	));
	expect(html).not.toContain("Randomize");
	expect(html).not.toContain('role="dialog"');
});

it("server-renders a labelled spinner as a named status", () => {
	const html = renderToString(() => <Spinner label="Loading" />);
	expect(html).toMatch(/<svg[^>]*role="status"/);
	expect(html).toMatch(/<svg[^>]*aria-label="Loading"/);
});

it("server-renders a skeleton hidden from assistive technology", () => {
	const html = renderToString(() => <Skeleton width="8rem" height="1rem" />);
	expect(html).toMatch(/aria-hidden="true"/);
	expect(html).toContain("width:8rem");
});

it("server-renders the badge and key labels", () => {
	const html = renderToString(() => (
		<>
			<Badge>Default</Badge>
			<Kbd>⌘K</Kbd>
		</>
	));
	expect(html).toContain("Default");
	expect(html).toMatch(/<kbd[^>]*>⌘K<\/kbd>/);
});

it("server-renders an alert with its message", () => {
	const html = renderToString(() => (
		<Alert title="Offline">Changes are saved locally.</Alert>
	));
	expect(html).toMatch(/role="alert"/);
	expect(html).toContain("Changes are saved locally.");
});

it("server-renders an empty toast region", () => {
	const html = renderToString(() => (
		<T.Region>
			<T.List />
		</T.Region>
	));
	expect(html).toMatch(/<div[^>]*role="region"/);
	expect(html).toMatch(/<div[^>]*data-cui="toast-list"[^>]*><\/div>/);
});

it("server-renders an empty toaster and keeps shown toasts off the shared engine", () => {
	const firstRequest = createToaster();
	expect(firstRequest.show({ description: "First request" })).toBe(1);
	const html = renderToString(() => (
		<Toaster toaster={firstRequest} closeLabel="Close" aria-label="Notifications" />
	));
	expect(html).toMatch(/role="region"/);
	expect(html).not.toContain("First request");

	const secondRequest = createToaster();
	const secondHtml = renderToString(() => (
		<Toaster toaster={secondRequest} closeLabel="Close" aria-label="Notifications" />
	));
	expect(secondHtml).not.toContain("First request");
});

import { OptionCardGroup } from "../src/components/OptionCard/OptionCard";
it("server-renders named option cards and the selected form value", () => {
	const html = renderToString(() => (
		<OptionCardGroup
			label="Mode"
			name="mode"
			defaultValue="dark"
			items={[{ value: "dark", label: "Dark", description: "Dim workspace" }]}
		/>
	));
	expect(html).toContain('role="radiogroup"');
	expect(html).toContain('type="radio"');
	expect(html).toContain('value="dark"');
	expect(html).toContain("Dim workspace");
});

it("server-renders a sheet trigger and leaves the closed sheet to the client", () => {
	const html = renderToString(() => (
		<S.Root>
			<S.Trigger>Layers</S.Trigger>
			<S.Portal>
				<S.Content>Body</S.Content>
			</S.Portal>
		</S.Root>
	));
	expect(html).toContain('data-cui="sheet-trigger"');
	expect(html).not.toContain('data-cui="sheet-content"');
});

import { SettingsGroup, SettingsRow } from "../src/components/Settings/Settings";
it("server-renders a settings group with rows wired to their controls", () => {
	const html = renderToString(() => (
		<SettingsGroup id="interface" title="Interface">
			<SettingsRow id="language" label="Language" description="The language of the menus.">
				{control => <select {...control} />}
			</SettingsRow>
		</SettingsGroup>
	));
	expect(html).toMatch(/<section[^>]*aria-labelledby="interface-title"/);
	expect(html).toMatch(/<h3[^>]*id="interface-title"[^>]*>Interface<\/h3>/);
	expect(html).toMatch(/role="group"[^>]*aria-labelledby="language-label"/);
	expect(html).toMatch(/<select[^>]*aria-labelledby="language-label"[^>]*aria-describedby="language-description"/);
	expect(html).toContain("The language of the menus.");
});
