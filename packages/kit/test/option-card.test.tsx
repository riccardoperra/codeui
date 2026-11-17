import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { createSignal } from "solid-js";
import { OptionCardGroup } from "../src/components/OptionCard/OptionCard";
import { tick } from "./helpers";

afterEach(cleanup);
const items = [
	{
		value: "dark",
		label: "Dark",
		description: "Dark workspace",
		preview: <span>Decorative</span>,
		badge: "Default",
	},
	{ value: "disabled", label: "Unavailable", disabled: true },
	{ value: "light", label: "Light" },
];
it("names and describes radios, hides preview art, and submits the selection", () => {
	const { container } = render(() => (
		<form>
			<OptionCardGroup
				label="Colour mode"
				name="mode"
				items={items}
				defaultValue="dark"
			/>
		</form>
	));
	expect(screen.getByRole("radiogroup", { name: "Colour mode" })).toBeInTheDocument();
	const dark = screen.getByRole("radio", { name: /Dark/ });
	expect(dark).toBeChecked();
	expect(dark).toHaveAccessibleDescription("Dark workspace");
	expect(screen.getByText("Decorative").closest("[aria-hidden]")).toHaveAttribute(
		"aria-hidden",
		"true",
	);
	expect(new FormData(container.querySelector("form")!).get("mode")).toBe("dark");
});
it("disables unavailable choices without changing selection", () => {
	render(() => <OptionCardGroup aria-label="Mode" items={items} defaultValue="dark" />);
	expect(screen.getByRole("radio", { name: "Unavailable" })).toBeDisabled();
	expect(screen.getByRole("radio", { name: /Dark/ })).toBeChecked();
});
it("reflects controlled changes and reports card clicks", async () => {
	const [value, setValue] = createSignal("dark");
	render(() => (
		<OptionCardGroup label="Mode" items={items} value={value()} onChange={setValue} />
	));
	setValue("light");
	expect(screen.getByRole("radio", { name: "Light" })).toBeChecked();
	fireEvent.click(screen.getByRole("radio", { name: /Dark/ }));
	await tick();
	expect(value()).toBe("dark");
});
it("marks a vertical group, so its cards stack in one column", () => {
	render(() => <OptionCardGroup label="Format" orientation="vertical" items={items} />);
	const group = screen.getByRole("radiogroup", { name: "Format" });
	expect(group).toHaveAttribute("aria-orientation", "vertical");
	expect(group).toHaveAttribute("data-orientation", "vertical");
});
