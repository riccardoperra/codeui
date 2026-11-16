import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { createSignal } from "solid-js";
import { Switch } from "../src/components/Switch/Switch";
afterEach(cleanup);
it("links rich field content, exposes invalid state and submits checked values", () => {
	const { container } = render(() => (
		<form>
			<Switch
				label={<strong>Notifications</strong>}
				inputId="notifications"
				name="notifications"
				defaultChecked
				description="Email updates"
				validationState="invalid"
				errorMessage="Choose a setting"
			/>
		</form>
	));
	const input = screen.getByRole("switch");
	expect(input).toHaveAccessibleName("Notifications");
	expect(input).toHaveAccessibleDescription("Email updates Choose a setting");
	expect(input).toHaveAttribute("aria-invalid", "true");
	expect(container.querySelector("label")).toHaveAttribute("for", "notifications");
	expect(new FormData(container.querySelector("form")!).get("notifications")).toBe("on");
});
it("forwards controlled boolean changes and explicit names to the input", () => {
	const changed = jest.fn();
	const [checked, setChecked] = createSignal(false);
	render(() => (
		<Switch
			aria-label="Preview"
			checked={checked()}
			onChange={value => {
				changed(value);
				setChecked(value);
			}}
		/>
	));
	const input = screen.getByRole("switch", { name: "Preview" });
	input.focus();
	expect(input).toHaveFocus();
	fireEvent.click(input);
	expect(changed).toHaveBeenCalledWith(true);
	expect(input).toBeChecked();
	setChecked(false);
	expect(input).not.toBeChecked();
});
it.each([{ disabled: true }, { readOnly: true }])("prevents changes for %o", state => {
	const changed = jest.fn();
	render(() => <Switch label="Locked" {...state} onChange={changed} />);
	fireEvent.click(screen.getByRole("switch"));
	expect(changed).not.toHaveBeenCalled();
});
it("supports CodeImage row labels and changes through the track", () => {
	const changed = jest.fn();
	const { container } = render(() => (
		<>
			<label for="row-switch">Show preview</label>
			<Switch
				inputId="row-switch"
				onChange={changed}
				classes={{ control: "row-control" }}
			/>
		</>
	));
	expect(screen.getByRole("switch")).toHaveAccessibleName("Show preview");
	const track = container.querySelector('[data-cui="switch-control"]')!;
	expect(track).toHaveClass("row-control");
	fireEvent.click(track);
	expect(changed).toHaveBeenCalledWith(true);
});
