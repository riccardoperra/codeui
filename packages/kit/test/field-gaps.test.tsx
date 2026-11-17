import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { createSignal } from "solid-js";
import { TextField } from "../src/components/TextField/TextField";
import { TextArea } from "../src/components/TextArea/TextArea";
import { NumberField } from "../src/components/NumberField/NumberField";
import { RadioList, RadioListItem } from "../src/components/RadioList/RadioList";
import { Checkbox } from "../src/components/CheckBox/CheckBox";
import { VirtualizedListbox } from "../src/components/Listbox/VirtualizedListbox";
import { Listbox } from "../src/components/Listbox/Listbox";
import { SegmentedControl } from "../src/components/SegmentedControl/SegmentedControl";
import { SegmentedControlItem } from "../src/components/SegmentedControl/SegmentedControlItem";
import { Dialog } from "../src/components/Dialog/Dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../src/components/Popover/Popover";

beforeAll(() => {
	global.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
	window.scrollTo = () => {};
});
afterEach(cleanup);

it.each([TextField, TextArea, NumberField])(
	"routes input attributes and renders rich field content",
	Field => {
		const [name, setName] = createSignal("Account");
		const { container } = render(() => (
			<Field
				aria-label={name()}
				autocomplete="off"
				label="Name"
				description={<strong>Required</strong>}
				classes={{ input: "custom-input", description: "custom-description" }}
			/>
		));
		const input = container.querySelector("input, textarea")!;
		expect(input).toHaveAttribute("aria-label", "Account");
		expect(input).toHaveAttribute("autocomplete", "off");
		expect(input).toHaveClass("custom-input");
		expect(screen.getByText("Required").parentElement).toHaveClass("custom-description");
		expect(container.firstElementChild).not.toHaveAttribute("aria-label");
		expect(screen.getByText("Required")).toHaveProperty("tagName", "STRONG");
		expect(container.querySelector("label")).toHaveAttribute("for", input.id);
		setName("Updated");
		expect(input).toHaveAttribute("aria-label", "Updated");
	},
);

it("forwards radio item attributes, handlers, disabled state and rich labels", () => {
	const click = vi.fn();
	render(() => (
		<RadioList class="group" classes={{ item: "group-item" }} aria-label="Choices">
			<RadioListItem
				value="one"
				id="one"
				class="choice"
				onClick={click}
				label={<strong>One</strong>}
			/>
			<RadioListItem value="two" disabled label="Two" />
		</RadioList>
	));
	expect(screen.getByRole("radiogroup")).toHaveClass("group");
	const one = screen.getByText("One");
	fireEvent.click(one);
	expect(click).toHaveBeenCalled();
	expect(document.getElementById("one")).toHaveClass("choice", "group-item");
	expect(screen.getByRole("radio", { name: "Two" })).toBeDisabled();
});

it("applies listbox part classes while preserving selection", () => {
	render(() => (
		<Listbox
			aria-label="Fruit"
			options={["Apple", "Pear"]}
			class="list"
			classes={{
				root: "root",
				item: "item",
				itemLabel: "label",
				itemIndicator: "indicator",
			}}
		/>
	));
	expect(screen.getByRole("listbox")).toHaveClass("list", "root");
	expect(screen.getAllByRole("option")[0]).toHaveClass("item");
	expect(screen.getByText("Apple")).toHaveClass("label");
});

function Segments(props: { cancel?: boolean }) {
	return (
		<SegmentedControl
			defaultValue="one"
			onEscapeKeyDown={event => {
				if (props.cancel) event.preventDefault();
			}}
			classes={{ item: "segment" }}
		>
			<SegmentedControlItem value="one">One</SegmentedControlItem>
			<SegmentedControlItem value="two">Two</SegmentedControlItem>
		</SegmentedControl>
	);
}

it.each([false, true])(
	"releases Escape to a dialog unless cancelled (%s)",
	async cancel => {
		const changed = vi.fn();
		render(() => (
			<Dialog open onOpenChange={changed} title="Settings">
				<Segments cancel={cancel} />
			</Dialog>
		));
		const tab = screen.getByRole("tab", { name: "One" });
		expect(tab).toHaveClass("segment");
		tab.focus();
		await new Promise(resolve => setTimeout(resolve, 0));
		fireEvent.keyDown(tab, { key: "Escape" });
		expect(changed).toHaveBeenCalledTimes(cancel ? 0 : 1);
		if (!cancel) expect(changed).toHaveBeenCalledWith(false);
	},
);

it.each([false, true])(
	"releases Escape to a popover unless cancelled (%s)",
	async cancel => {
		render(() => (
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent>
					<Segments cancel={cancel} />
				</PopoverContent>
			</Popover>
		));
		fireEvent.click(screen.getByText("Open"));
		await new Promise(resolve => setTimeout(resolve, 0));
		const tab = screen.getByRole("tab", { name: "One" });
		tab.focus();
		fireEvent.keyDown(tab, { key: "Escape" });
		await new Promise(resolve => setTimeout(resolve, 0));
		expect(screen.getByText("Open")).toHaveAttribute(
			"aria-expanded",
			cancel ? "true" : "false",
		);
	},
);

it("keeps arrow navigation and Enter selection", () => {
	render(() => <Segments />);
	const one = screen.getByRole("tab", { name: "One" });
	one.focus();
	fireEvent.keyDown(one, { key: "ArrowRight" });
	expect(document.activeElement).toHaveTextContent("Two");
	fireEvent.keyDown(document.activeElement!, { key: "Enter" });
	expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
		"aria-selected",
		"true",
	);
});

it("accepts a class on a virtualized listbox", () => {
	render(() => (
		<VirtualizedListbox
			aria-label="Fonts"
			class="fonts"
			classes={{ root: "font-root" }}
			options={[{ value: "mono", label: "Mono" }]}
		/>
	));
	expect(screen.getByRole("listbox", { name: "Fonts" })).toHaveClass(
		"fonts",
		"font-root",
	);
});

it("links a textarea label to an explicit options input ID", () => {
	render(() => <TextArea label="Notes" options={{ id: "notes-input" }} />);
	expect(screen.getByLabelText("Notes")).toHaveAttribute("id", "notes-input");
});
it.each(["filled", "inline"] as const)("Checkbox and RadioList apply theme %s", theme => {
	const { container } = render(() => (
		<>
			<Checkbox label="Wrap lines" theme={theme} />
			<RadioList label="Mode" theme={theme}>
				<RadioListItem value="dark" label="Dark" />
			</RadioList>
		</>
	));
	expect(container.querySelector('[data-cui="checkbox"]')).toHaveAttribute("data-field-theme", theme);
	expect(container.querySelector('[data-cui="radio-group-field"]')).toHaveAttribute(
		"data-field-theme",
		theme,
	);
});
it("gives filled and inline checkboxes different control styles", () => {
	const { container } = render(() => (
		<>
			<Checkbox label="Filled" theme="filled" />
			<Checkbox label="Inline" theme="inline" />
		</>
	));
	const [filled, inline] = container.querySelectorAll('[data-cui="checkbox"] > div');
	expect(filled.className).not.toBe(inline.className);
});
