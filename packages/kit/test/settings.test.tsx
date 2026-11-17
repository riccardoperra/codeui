import { cleanup, render, screen } from "solid-testing-library";
import { createSignal } from "solid-js";
import { SettingsGroup, SettingsRow } from "../src/components/Settings/Settings";
import { Switch } from "../src/components/Switch/Switch";
import { SegmentedControl } from "../src/components/SegmentedControl/SegmentedControl";
import { SegmentedControlItem } from "../src/components/SegmentedControl/SegmentedControlItem";
import * as S from "../src/parts/settings";
import { createSettingsRowProps } from "../src/components/Settings/createSettingsRowProps";

afterEach(cleanup);

it("names and describes the control from the row text", () => {
	render(() => (
		<SettingsRow id="visible" label="Visible" description="Show the sidebar.">
			{control => <Switch {...control} />}
		</SettingsRow>
	));
	const toggle = screen.getByRole("switch");
	expect(toggle).toHaveAccessibleName("Visible");
	expect(toggle).toHaveAccessibleDescription("Show the sidebar.");
	const row = screen.getByRole("group", { name: "Visible" });
	expect(row).toHaveAccessibleDescription("Show the sidebar.");
	expect(row).toContainElement(toggle);
});

it("labels one native input with a real label element", () => {
	render(() => (
		<SettingsRow label="Padding" controlId="padding">
			<input id="padding" type="number" value="64" />
		</SettingsRow>
	));
	const input = screen.getByRole("spinbutton", { name: "Padding" });
	expect(screen.getByText("Padding")).toHaveAttribute("for", "padding");
	expect(screen.getByText("Padding").tagName).toBe("LABEL");
	expect(input).not.toHaveAttribute("aria-describedby");
});

it("keeps the same control while the description link comes and goes", () => {
	const [description, setDescription] = createSignal<string | undefined>();
	render(() => (
		<SettingsRow label="Language" description={description()}>
			{control => (
				<select {...control}>
					<option>English</option>
				</select>
			)}
		</SettingsRow>
	));
	const select = screen.getByRole("combobox", { name: "Language" });
	expect(select).not.toHaveAttribute("aria-describedby");
	setDescription("The language of the menus.");
	expect(select).toHaveAccessibleDescription("The language of the menus.");
	setDescription(undefined);
	expect(select).not.toHaveAttribute("aria-describedby");
});

it("puts markers in the label and gives each row its own ids", () => {
	render(() => (
		<>
			<SettingsRow label="Takumi" marker={<span>Experimental</span>}>
				{control => <Switch {...control} />}
			</SettingsRow>
			<SettingsRow label="Takumi">{control => <Switch {...control} />}</SettingsRow>
		</>
	));
	const [first, second] = screen.getAllByRole("switch");
	expect(first).toHaveAccessibleName("Takumi Experimental");
	expect(second).toHaveAccessibleName("Takumi");
	expect(first.getAttribute("aria-labelledby")).not.toBe(
		second.getAttribute("aria-labelledby"),
	);
});

it("names the group island by its heading and merges part classes", () => {
	render(() => (
		<SettingsGroup
			title="Sidebar"
			description="Where the controls sit."
			classes={{ content: "island" }}
		>
			<SettingsRow label="Panel side" classes={{ label: "title" }} layout="wide">
				{control => <Switch {...control} />}
			</SettingsRow>
		</SettingsGroup>
	));
	const group = screen.getByRole("region", { name: "Sidebar" });
	expect(group).toHaveAccessibleDescription("Where the controls sit.");
	expect(screen.getByRole("heading", { level: 3, name: "Sidebar" })).toBeInTheDocument();
	expect(group.querySelector("[data-cui=settings-group-content]")).toHaveClass("island");
	expect(screen.getByText("Panel side")).toHaveClass("title");
	expect(screen.getByRole("group", { name: "Panel side" })).toHaveAttribute(
		"data-layout",
		"wide",
	);
});

it("wires styled parts through the helper", () => {
	function Row() {
		const row = createSettingsRowProps(() => ({
			id: "scale",
			description: "Export scale.",
		}));
		return (
			<S.Row {...row.root()} compactControl>
				<S.Label {...row.label()}>Scale</S.Label>
				<S.Description {...row.description()}>Export scale.</S.Description>
				<S.Control>
					<button {...row.control()}>2x</button>
				</S.Control>
			</S.Row>
		);
	}
	render(() => <Row />);
	const button = screen.getByRole("button", { name: "Scale" });
	expect(button).toHaveAccessibleDescription("Export scale.");
	expect(screen.getByRole("group", { name: "Scale" })).toHaveAttribute(
		"data-compact-control",
	);
});

it("names a segmented control's tab list from the row", () => {
	render(() => (
		<SettingsRow
			label="Panel side"
			description="The side of the canvas the sidebar sits on."
		>
			{control => (
				<SegmentedControl {...control} defaultValue="left">
					<SegmentedControlItem value="left">Left</SegmentedControlItem>
					<SegmentedControlItem value="right">Right</SegmentedControlItem>
				</SegmentedControl>
			)}
		</SettingsRow>
	));
	const list = screen.getByRole("tablist", { name: "Panel side" });
	expect(list).toHaveAccessibleDescription("The side of the canvas the sidebar sits on.");
});

it("creates each piece of content once, so markers with side effects run once", () => {
	let mounts = 0;
	function NewDot() {
		mounts++;
		return <span>New</span>;
	}
	render(() => (
		<SettingsGroup
			title={
				<>
					Local AI <NewDot />
				</>
			}
			description={<NewDot />}
		>
			<SettingsRow
				label="Takumi"
				marker={<NewDot />}
				description={<NewDot />}
				details={<NewDot />}
				picture={<NewDot />}
			>
				{control => <Switch {...control} />}
			</SettingsRow>
		</SettingsGroup>
	));
	expect(mounts).toBe(6);
	expect(screen.getByRole("switch")).toHaveAccessibleName("Takumi New");
});
