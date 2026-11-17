import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { NumberField } from "../src";
import { press, tick } from "./helpers";

afterEach(cleanup);

const increment = () => screen.getByRole("button", { name: /Increment/, hidden: true });
const decrement = () => screen.getByRole("button", { name: /Decrement/, hidden: true });

describe("NumberField", () => {
	it("is a spinbutton that reports its value and bounds", () => {
		render(() => <NumberField label="Padding" min={0} max={128} value={32} />);
		const input = screen.getByRole("spinbutton", { name: "Padding" });
		expect(input).toHaveAttribute("aria-valuenow", "32");
		expect(input).toHaveAttribute("aria-valuemin", "0");
		expect(input).toHaveAttribute("aria-valuemax", "128");
	});

	it("shows a value of 0", () => {
		render(() => <NumberField label="Offset" value={0} />);
		expect(screen.getByRole("spinbutton", { name: "Offset" })).toHaveValue("0");
	});

	it("disables the step buttons when the field is disabled", () => {
		render(() => <NumberField label="Padding" value={4} disabled />);
		expect(increment()).toBeDisabled();
		expect(decrement()).toBeDisabled();
	});

	it("keeps a read-only value from the step buttons and the arrow keys", async () => {
		const onChange = vi.fn();
		render(() => <NumberField label="Padding" value={4} readOnly onChange={onChange} />);
		expect(increment()).toBeDisabled();
		expect(decrement()).toBeDisabled();
		const input = screen.getByRole("spinbutton", { name: "Padding" });
		input.focus();
		press("ArrowUp");
		press("ArrowDown");
		await tick();
		expect(onChange).not.toHaveBeenCalled();
	});

	it("steps up to max by step, then disables increment", async () => {
		const onChange = vi.fn();
		render(() => (
			<NumberField label="Opacity" defaultValue={9.5} max={10} step={0.5} precision={1} onChange={onChange} />
		));
		expect(increment()).toBeEnabled();
		fireEvent.click(increment());
		await tick();
		expect(onChange).toHaveBeenLastCalledWith(10);
		expect(increment()).toBeDisabled();
	});

	it("steps down to min by step, then disables decrement", async () => {
		const onChange = vi.fn();
		render(() => (
			<NumberField label="Opacity" defaultValue={0.5} min={0} step={0.5} precision={1} onChange={onChange} />
		));
		expect(decrement()).toBeEnabled();
		fireEvent.click(decrement());
		await tick();
		expect(onChange).toHaveBeenLastCalledWith(0);
		expect(decrement()).toBeDisabled();
	});

	it("keeps the step buttons out of the tab order", () => {
		render(() => <NumberField label="Padding" value={4} />);
		expect(increment()).toHaveAttribute("tabindex", "-1");
		expect(decrement()).toHaveAttribute("tabindex", "-1");
	});
});
