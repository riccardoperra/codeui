import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Combobox } from "../src/components/Combobox/Combobox";
import { Dialog } from "../src/components/Dialog/Dialog";
import { expectDismissed, press, tick } from "./helpers";

afterEach(cleanup);

const fruits = ["Apple", "Banana", "Blueberry", "Grapes"];

function activeOption(input: HTMLElement) {
	const id = input.getAttribute("aria-activedescendant");
	return id ? document.getElementById(id) : null;
}

function type(input: HTMLElement, value: string) {
	fireEvent.input(input, { target: { value } });
	return tick();
}

it("links rich field content, validation and form submission to the input", () => {
	const { container } = render(() => (
		<form>
			<Combobox
				label={<strong>Fruit</strong>}
				description="Pick one for the snippet"
				validationState="invalid"
				errorMessage="Fruit is required"
				name="fruit"
				inputId="fruit-input"
				options={fruits}
				defaultValue="Banana"
			/>
		</form>
	));
	const input = screen.getByRole("combobox");
	expect(input).toHaveAccessibleName("Fruit");
	expect(input).toHaveAccessibleDescription("Pick one for the snippet Fruit is required");
	expect(input).toHaveAttribute("aria-invalid", "true");
	expect(input).toHaveAttribute("id", "fruit-input");
	expect(new FormData(container.querySelector("form")!).get("fruit")).toBe("Banana");
	expect(container.querySelectorAll("input:not([type=hidden]), select")).toHaveLength(1);
});

it("filters by typed text, moves with the arrows and selects with Enter", async () => {
	const onChange = vi.fn();
	render(() => (
		<Combobox
			aria-label="Fruit"
			options={fruits}
			onChange={onChange}
			renderOption={fruit => <em>{fruit} fruit</em>}
		/>
	));
	const input = screen.getByRole("combobox", { name: "Fruit" });
	input.focus();
	await type(input, "b");
	expect(input).toHaveAttribute("aria-expanded", "true");
	expect(screen.getAllByRole("option").map(option => option.textContent)).toEqual([
		"Banana fruit",
		"Blueberry fruit",
	]);
	press("ArrowDown");
	expect(activeOption(input)).toHaveTextContent("Banana fruit");
	press("ArrowDown");
	expect(activeOption(input)).toHaveTextContent("Blueberry fruit");
	press("Enter");
	await tick();
	expect(onChange).toHaveBeenCalledWith("Blueberry");
	expect(input).toHaveValue("Blueberry");
	expect(input).toHaveAttribute("aria-expanded", "false");
});

it("closes on Escape and restores the selection, then clears the text on a second Escape", async () => {
	render(() => <Combobox aria-label="Fruit" options={fruits} defaultValue="Grapes" />);
	const input = screen.getByRole("combobox", { name: "Fruit" });
	input.focus();
	await type(input, "App");
	expect(input).toHaveAttribute("aria-expanded", "true");
	press("Escape");
	await tick();
	expect(input).toHaveAttribute("aria-expanded", "false");
	expect(input).toHaveValue("Grapes");
	press("Escape");
	await tick();
	expect(input).toHaveValue("");
});

it("filters and highlights from controlled input text and keeps out text the parent rejects", async () => {
	const onInputChange = vi.fn();
	let accept = true;
	const [text, setText] = createSignal("");
	render(() => (
		<Combobox
			aria-label="Fruit"
			options={fruits}
			inputValue={text()}
			onInputChange={value => {
				onInputChange(value);
				if (accept) setText(value);
			}}
		/>
	));
	const input = screen.getByRole("combobox", { name: "Fruit" });
	setText("Grapes");
	await tick();
	expect(input).toHaveValue("Grapes");
	expect(onInputChange).not.toHaveBeenCalled();
	input.focus();
	await type(input, "B");
	expect(onInputChange).toHaveBeenLastCalledWith("B");
	expect(screen.getAllByRole("option")).toHaveLength(2);
	setText("Blue");
	await tick();
	expect(input).toHaveValue("Blue");
	expect(screen.getAllByRole("option").map(option => option.textContent)).toEqual([
		"Blueberry",
	]);
	press("ArrowDown");
	expect(activeOption(input)).toHaveTextContent("Blueberry");
	accept = false;
	await type(input, "Blu");
	expect(onInputChange).toHaveBeenLastCalledWith("Blu");
	expect(input).toHaveValue("Blue");
});

it("shows empty content when no option matches", async () => {
	render(() => (
		<Combobox aria-label="Fruit" options={fruits} emptyContent="No fruit found" />
	));
	const input = screen.getByRole("combobox", { name: "Fruit" });
	input.focus();
	await type(input, "Kiwi");
	expect(input).toHaveAttribute("aria-expanded", "true");
	expect(screen.queryAllByRole("option")).toHaveLength(0);
	expect(screen.getByText("No fruit found")).toBeInTheDocument();
});

it("closes only its list on Escape inside a dialog and renders the list in the dialog", async () => {
	let panel!: HTMLDivElement;
	const [open, setOpen] = createSignal(true);
	render(() => (
		<Dialog open={open()} onOpenChange={setOpen} title="Rename tab">
			<div ref={panel}>
				<Combobox aria-label="Extension" options={["ts", "tsx", "js"]} mount={panel} />
			</div>
		</Dialog>
	));
	const input = screen.getByRole("combobox", { name: "Extension" });
	await tick();
	input.focus();
	await type(input, "ts");
	const listbox = screen.getByRole("listbox");
	expect(panel).toContainElement(listbox);
	press("Escape");
	await expectDismissed(listbox);
	expect(input).toHaveAttribute("aria-expanded", "false");
	expect(input).toHaveFocus();
	expect(open()).toBe(true);
	press("Escape");
	await tick();
	expect(open()).toBe(false);
});

it("ignores typing while disabled", async () => {
	render(() => <Combobox aria-label="Fruit" options={fruits} disabled />);
	const input = screen.getByRole("combobox", { name: "Fruit" });
	expect(input).toBeDisabled();
	await type(input, "b");
	expect(input).toHaveAttribute("aria-expanded", "false");
});

it("applies part classes after kit classes", async () => {
	render(() => (
		<Combobox
			aria-label="Fruit"
			options={fruits}
			class="app"
			classes={{
				root: "app-root",
				control: "app-control",
				input: "app-input",
				item: "app-item",
			}}
		/>
	));
	const input = screen.getByRole("combobox", { name: "Fruit" });
	expect(input).toHaveClass("app-input");
	expect(input.parentElement).toHaveClass("app-control");
	expect(input.closest('[data-cui="combobox"]')).toHaveClass("app", "app-root");
	input.focus();
	press("ArrowDown");
	await tick();
	expect(screen.getAllByRole("option")[0]).toHaveClass("app-item");
});

describe("clearing a controlled value", () => {
	function Controlled(props: { onChange: (value: string | null) => void }) {
		const [value, setValue] = createSignal<string | null>("Banana");
		return (
			<>
				<Combobox
					aria-label="Fruit"
					options={fruits}
					value={value()}
					onChange={next => {
						props.onChange(next);
						setValue(next);
					}}
				/>
				<output data-testid="value">{value() ?? "none"}</output>
			</>
		);
	}

	it("clears the selection when the user deletes the text", async () => {
		const onChange = vi.fn();
		render(() => <Controlled onChange={onChange} />);
		const input = screen.getByRole("combobox");
		expect(input).toHaveValue("Banana");
		input.focus();
		await type(input, "");
		expect(onChange).toHaveBeenLastCalledWith(null);
		expect(screen.getByTestId("value")).toHaveTextContent("none");
		input.blur();
		await tick();
		expect(input).toHaveValue("");
	});

	it("clears the selection on a second Escape", async () => {
		const onChange = vi.fn();
		render(() => <Controlled onChange={onChange} />);
		const input = screen.getByRole("combobox");
		input.focus();
		press("ArrowDown");
		await tick();
		press("Escape");
		await tick();
		expect(input).toHaveValue("Banana");
		expect(onChange).not.toHaveBeenCalled();
		press("Escape");
		await tick();
		expect(onChange).toHaveBeenLastCalledWith(null);
		expect(input).toHaveValue("");
		expect(screen.getByTestId("value")).toHaveTextContent("none");
	});
});
