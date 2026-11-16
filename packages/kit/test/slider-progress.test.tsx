import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { createSignal } from "solid-js";
import { Slider } from "../src/components/Slider/Slider";
import { Progress } from "../src/components/Progress/Progress";
afterEach(cleanup);
it("links rich slider content, validation and form input", () => {
	const { container } = render(() => (
		<form>
			<Slider
				label={<strong>Opacity</strong>}
				description="Frame opacity"
				validationState="invalid"
				errorMessage="Check opacity"
				inputId="opacity"
				name="opacity"
				defaultValue={0.5}
				minValue={0}
				maxValue={1}
				step={0.01}
				showValue
			/>
		</form>
	));
	const thumb = screen.getByRole("slider");
	expect(thumb).toHaveAccessibleName("Opacity");
	expect(thumb).toHaveAccessibleDescription("Frame opacity Check opacity");
	expect(thumb).toHaveAttribute("aria-invalid", "true");
	expect(container.querySelector("#opacity")).toBeTruthy();
	expect(new FormData(container.querySelector("form")!).get("opacity")).toBe("0.5");
});
it("preserves fractional values, keyboard steps and controlled updates", () => {
	const changed = jest.fn();
	const ended = jest.fn();
	const [value, setValue] = createSignal(0.5);
	render(() => (
		<Slider
			aria-label="Opacity"
			value={value()}
			onChange={v => {
				changed(v);
				setValue(v);
			}}
			onChangeEnd={ended}
			minValue={0}
			maxValue={1}
			step={0.01}
			getValueLabel={({ values }) => `${Math.round(values[0] * 100)}% opacity`}
			showValue
		/>
	));
	const thumb = screen.getByRole("slider");
	thumb.focus();
	expect(thumb).toHaveFocus();
	for (const [key, expected] of [
		["ArrowRight", 0.51],
		["ArrowLeft", 0.5],
		["PageUp", 0.6],
		["PageDown", 0.5],
		["Home", 0],
		["End", 1],
	] as const) {
		changed.mockClear();
		fireEvent.keyDown(thumb, { key });
		fireEvent.keyUp(thumb, { key });
		expect(thumb).toHaveAttribute("aria-valuenow", String(expected));
		expect(changed).toHaveBeenCalledTimes(1);
		expect(changed).toHaveBeenCalledWith(expected);
	}
	fireEvent.blur(thumb);
	expect(ended).toHaveBeenCalledWith(1);
	setValue(0.25);
	expect(thumb).toHaveAttribute("aria-valuetext", "25% opacity");
});
it.each([{ disabled: true }, { readOnly: true }])(
	"prevents slider edits for %o",
	state => {
		const changed = jest.fn();
		render(() => (
			<Slider label="Locked" defaultValue={50} {...state} onChange={changed} />
		));
		fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
		expect(changed).not.toHaveBeenCalled();
	},
);
it("exposes progress bounds and formatted value and responds to updates", () => {
	const [value, setValue] = createSignal(5);
	render(() => (
		<Progress label={<strong>Export</strong>} value={value()} maxValue={20} showValue />
	));
	const bar = screen.getByRole("progressbar", { name: "Export" });
	expect(bar).toHaveAttribute("aria-valuenow", "5");
	expect(bar).toHaveAttribute("aria-valuemax", "20");
	expect(screen.getByText("25%")).toBeTruthy();
	setValue(20);
	expect(bar).toHaveAttribute("aria-valuenow", "20");
});
it("omits current value for indeterminate progress", () => {
	render(() => <Progress aria-label="Preparing export" indeterminate />);
	expect(
		screen.getByRole("progressbar", { name: "Preparing export" }),
	).not.toHaveAttribute("aria-valuenow");
});
