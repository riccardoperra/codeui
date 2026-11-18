import type { JSX } from "solid-js";
import { Accordion } from "../../src/components/Accordion/Accordion";
import { Alert } from "../../src/components/Alert/Alert";
import { Badge } from "../../src/components/Badge/Badge";
import { Button } from "../../src/components/Button/Button";
import { Checkbox } from "../../src/components/CheckBox/CheckBox";
import { Combobox } from "../../src/components/Combobox/Combobox";
import * as DialogParts from "../../src/parts/dialog";
import { NumberField } from "../../src/components/NumberField/NumberField";
import { OptionCardGroup } from "../../src/components/OptionCard/OptionCard";
import { Progress } from "../../src/components/Progress/Progress";
import { RadioList, RadioListItem } from "../../src/components/RadioList/RadioList";
import { Select } from "../../src/components/Select/Select";
import { SettingsGroup, SettingsRow } from "../../src/components/Settings/Settings";
import { Slider } from "../../src/components/Slider/Slider";
import { Switch } from "../../src/components/Switch/Switch";
import { TextArea } from "../../src/components/TextArea/TextArea";
import { TextField } from "../../src/components/TextField/TextField";

// Every content prop gets an element. A component that builds such an element
// without rendering it (a prop read twice, or read for a part that stays hidden)
// makes the client ask for a hydration key the server never wrote. Dialog, Sheet,
// Popover and CommandMenu have lifecycle checks in portal-fixtures.tsx. DropdownMenu
// still omits its portal content on the server. Dialog's layout parts need no
// dialog around them, and a docs figure renders them open and inline.
const el = (name: string) => <em data-prop={name}>{name}</em>;

type State = "valid" | "invalid";

// Fields render the error message only while invalid, so each runs in both states.
// Props are written inline: spreading an object of elements would build them
// before the component runs.
const fields: Record<string, (state: State) => JSX.Element> = {
	TextField: state => (
		<TextField
			label={el("label")}
			description={el("description")}
			errorMessage={el("errorMessage")}
			validationState={state}
		/>
	),
	TextArea: state => (
		<TextArea
			label={el("label")}
			description={el("description")}
			errorMessage={el("errorMessage")}
			validationState={state}
		/>
	),
	NumberField: state => (
		<NumberField
			label={el("label")}
			description={el("description")}
			errorMessage={el("errorMessage")}
			validationState={state}
		/>
	),
	// Checkbox and Select type `description` as a string.
	Checkbox: state => (
		<Checkbox
			label={el("label")}
			description="description"
			errorMessage={el("errorMessage")}
			validationState={state}
		/>
	),
	RadioList: state => (
		<RadioList
			label={el("label")}
			description={el("description")}
			errorMessage={el("errorMessage")}
			validationState={state}
		>
			<RadioListItem value="a" label={el("item label")} />
		</RadioList>
	),
	Select: state => (
		<Select
			multiple={false}
			aria-label="Select"
			options={["a", "b"]}
			label={el("label")}
			description="description"
			errorMessage={el("errorMessage")}
			validationState={state}
		/>
	),
	Combobox: state => (
		<Combobox
			options={["a", "b"]}
			emptyContent={el("emptyContent")}
			label={el("label")}
			description={el("description")}
			errorMessage={el("errorMessage")}
			validationState={state}
		/>
	),
	Switch: state => (
		<Switch
			label={el("label")}
			description={el("description")}
			errorMessage={el("errorMessage")}
			validationState={state}
		/>
	),
	Slider: state => (
		<Slider
			label={el("label")}
			description={el("description")}
			errorMessage={el("errorMessage")}
			validationState={state}
		/>
	),
	OptionCardGroup: state => (
		<OptionCardGroup
			label={el("label")}
			description={el("description")}
			errorMessage={el("errorMessage")}
			validationState={state}
			items={[
				{
					value: "a",
					label: el("item label"),
					description: el("item description"),
					preview: el("item preview"),
					badge: el("item badge"),
				},
			]}
		/>
	),
};

export const hydrationFixtures: Record<string, () => JSX.Element> = {
	Alert: () => (
		<Alert
			showIcon
			icon={el("icon")}
			title={el("title")}
			description={el("description")}
			action={<Button size="xs">action</Button>}
		/>
	),
	"Alert children": () => <Alert>{el("children")}</Alert>,
	"Alert tone icon": () => (
		<Alert showIcon tone="success" title="Saved" description={el("description")} />
	),
	"Alert icon without showIcon": () => <Alert icon={el("icon")} title={el("title")} />,
	Badge: () => <Badge icon={el("icon")}>{el("children")}</Badge>,
	Button: () => <Button leftIcon={el("leftIcon")}>{el("children")}</Button>,
	Accordion: () => (
		<Accordion
			defaultValue="a"
			items={[
				{
					value: "a",
					title: el("title"),
					icon: el("icon"),
					summary: el("summary"),
					content: el("content"),
				},
			]}
		/>
	),
	Progress: () => <Progress value={40} label={el("label")} />,
	SettingsGroup: () => (
		<SettingsGroup title={el("title")} description={el("description")}>
			<SettingsRow
				label={el("label")}
				description={el("description")}
				details={el("details")}
				picture={el("picture")}
				marker={el("marker")}
			>
				{el("control")}
			</SettingsRow>
		</SettingsGroup>
	),
	"Dialog layout parts": () => (
		<>
			<DialogParts.Sidebar search={el("search")}>
				<DialogParts.Nav aria-label="Sections">
					<DialogParts.NavItem icon={el("icon")}>{el("children")}</DialogParts.NavItem>
				</DialogParts.Nav>
			</DialogParts.Sidebar>
			<DialogParts.Section title={el("title")}>{el("children")}</DialogParts.Section>
		</>
	),
	...Object.fromEntries(
		Object.entries(fields).flatMap(([name, field]) => [
			[name, () => field("invalid")],
			[`${name} valid`, () => field("valid")],
		]),
	),
};
