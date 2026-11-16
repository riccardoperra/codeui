import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { createSignal } from "solid-js";
import { Accordion } from "../src/components/Accordion/Accordion";
import { tick } from "./helpers";
import * as A from "../src/parts/accordion";
afterEach(cleanup);
const items = [
	{
		value: "size",
		title: <strong>Size</strong>,
		icon: "□",
		summary: "64",
		content: <input aria-label="Pixels" />,
	},
	{ value: "theme", title: "Theme", summary: "macOS", content: "Appearance" },
	{ value: "disabled", title: "Unavailable", disabled: true, content: "Hidden" },
];
it("opens one section at a time and collapses it", () => {
	render(() => <Accordion items={items} />);
	const size = screen.getByRole("button", { name: "Size 64" });
	const theme = screen.getByRole("button", { name: "Theme macOS" });
	fireEvent.click(size);
	expect(size).toHaveAttribute("aria-expanded", "true");
	expect(screen.getByRole("region", { name: "Size 64" })).toBeInTheDocument();
	fireEvent.click(theme);
	expect(size).toHaveAttribute("aria-expanded", "false");
	expect(theme).toHaveAttribute("aria-expanded", "true");
	fireEvent.click(theme);
	expect(theme).toHaveAttribute("aria-expanded", "false");
	expect(screen.getByRole("button", { name: "Unavailable" })).toBeDisabled();
});
it("supports controlled null state and keeps closed children inaccessible", () => {
	render(() => {
		const [value, setValue] = createSignal<string | null>("size");
		return <Accordion items={items} keepMounted value={value()} onChange={setValue} />;
	});
	const input = screen.getByRole("textbox", { name: "Pixels" });
	fireEvent.input(input, { target: { value: "128" } });
	fireEvent.click(screen.getByRole("button", { name: "Size 64" }));
	expect(screen.queryByRole("textbox")).toBeNull();
	expect(input.closest('[data-cui="accordion-content"]')).toHaveProperty("inert", true);
	fireEvent.click(screen.getByRole("button", { name: "Size 64" }));
	expect(screen.getByRole("textbox")).toHaveValue("128");
});
it("moves header focus with arrows, Home and End, skipping disabled items", async () => {
	render(() => <Accordion items={items} />);
	const first = screen.getByRole("button", { name: "Size 64" });
	const last = screen.getByRole("button", { name: "Theme macOS" });
	await tick();
	first.focus();
	await tick();
	fireEvent.keyDown(first, { key: "ArrowDown" });
	await tick();
	expect(last).toHaveFocus();
	fireEvent.keyDown(last, { key: "Home" });
	await tick();
	expect(first).toHaveFocus();
	fireEvent.keyDown(first, { key: "End" });
	await tick();
	expect(last).toHaveFocus();
});
it("preserves multiple-open parts and class overrides", () => {
	render(() => (
		<A.Root multiple defaultValue={["a", "b"]}>
			<A.Item value="a">
				<A.Header>
					<A.Trigger>A</A.Trigger>
				</A.Header>
				<A.Content class="custom">Alpha</A.Content>
			</A.Item>
			<A.Item value="b">
				<A.Header>
					<A.Trigger>B</A.Trigger>
				</A.Header>
				<A.Content>Beta</A.Content>
			</A.Item>
		</A.Root>
	));
	expect(screen.getAllByRole("region")).toHaveLength(2);
	expect(screen.getByRole("region", { name: "A" })).toHaveClass("custom");
});
it.each(["Enter", " "])("toggles with %s and suppresses keyboard motion", async key => {
	render(() => <Accordion items={items} />);
	const trigger = screen.getByRole("button", { name: "Size 64" });
	trigger.focus();
	fireEvent.keyDown(trigger, { key });
	fireEvent.keyUp(trigger, { key });
	await tick();
	expect(trigger).toHaveAttribute("aria-expanded", "true");
	expect(trigger.closest('[data-cui="accordion-root"]')).toHaveAttribute(
		"data-motion",
		"none",
	);
});
