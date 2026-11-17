import { cleanup, fireEvent, render, screen, waitFor } from "solid-testing-library";
import { createSignal } from "solid-js";
import { Accordion } from "../src/components/Accordion/Accordion";
import { expectDismissed, tick } from "./helpers";
import * as A from "../src/parts/accordion";
afterEach(cleanup);
const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
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
it.each(["Enter", " "])("toggles with %s and marks the input as keyboard", async key => {
	render(() => <Accordion items={items} />);
	const trigger = screen.getByRole("button", { name: "Size 64" });
	trigger.focus();
	fireEvent.keyDown(trigger, { key });
	fireEvent.keyUp(trigger, { key });
	await tick();
	expect(trigger).toHaveAttribute("aria-expanded", "true");
	// Styles drop the height transition while the last input is the keyboard.
	expect(document.documentElement).toHaveAttribute("data-cui-input", "keyboard");
	expect(trigger.closest('[data-cui="accordion-root"]')).toHaveAttribute(
		"data-motion",
		"auto",
	);
});
it("opens a closed section on the first click while another is open", async () => {
	render(() => <Accordion items={items} defaultValue="size" />);
	await tick();
	const size = screen.getByRole("button", { name: "Size 64" });
	const theme = screen.getByRole("button", { name: "Theme macOS" });
	const open = screen.getByRole("region", { name: "Size 64" });
	// A press must not restyle the open section: in a browser that restarted
	// its height animation and moved the next header from under the pointer.
	const changes: string[] = [];
	const observer = new MutationObserver(records =>
		records.forEach(record => changes.push(`${record.attributeName}`)),
	);
	observer.observe(size.closest('[data-cui="accordion-root"]')!, {
		attributes: true,
		subtree: true,
	});
	fireEvent.pointerDown(theme);
	fireEvent.mouseDown(theme);
	await tick();
	expect(changes.filter(name => name !== "data-cui-input")).toEqual([]);
	observer.disconnect();
	fireEvent.pointerUp(theme);
	fireEvent.mouseUp(theme);
	fireEvent.click(theme);
	await tick();
	expect(theme).toHaveAttribute("aria-expanded", "true");
	expect(size).toHaveAttribute("aria-expanded", "false");
	expect(open).not.toHaveAttribute("data-open");
});
it("keeps a closing section mounted until its transition ends", async () => {
	render(() => <Accordion items={items} defaultValue="size" />);
	await frame();
	const size = screen.getByRole("button", { name: "Size 64" });
	const region = document.getElementById(size.getAttribute("aria-controls")!)!;
	await waitFor(() => expect(region.getAnimations()).toHaveLength(0));
	fireEvent.pointerDown(size);
	region.style.transition = "height 200ms";
	fireEvent.click(size);
	await tick();
	expect(size).toHaveAttribute("aria-expanded", "false");
	expect(region).toBeInTheDocument();
	expect(region).not.toHaveAttribute("data-open");
	expect(region).toHaveAttribute("aria-hidden", "true");
	fireEvent.transitionEnd(region, { propertyName: "height" });
	await expectDismissed(region);
});
it("reopens a closing section from where it is", async () => {
	render(() => <Accordion items={items} defaultValue="size" />);
	await frame();
	const size = screen.getByRole("button", { name: "Size 64" });
	const region = document.getElementById(size.getAttribute("aria-controls")!)!;
	await waitFor(() => expect(region.getAnimations()).toHaveLength(0));
	fireEvent.pointerDown(size);
	region.style.transition = "height 200ms";
	fireEvent.click(size);
	await tick();
	fireEvent.click(size);
	await tick();
	// The same element turns around; a new one would start again from 0.
	expect(document.getElementById(region.id)).toBe(region);
	expect(region).toHaveAttribute("data-open");
});
