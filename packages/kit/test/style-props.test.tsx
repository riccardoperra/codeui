import { createSignal } from "solid-js";
import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { buttonStyleProps } from "@codeui/styles/button";
import { switchStyleProps } from "@codeui/styles/switch";
import { Button, IconButton, Switch, SwitchParts } from "../src";

afterEach(cleanup);

it("updates Button appearance on the same node and clears the previous class and flags", () => {
	const [compact, setCompact] = createSignal(true);
	render(() => (
		<>
			<Button
				size={compact() ? "sm" : "lg"}
				block={compact()}
				pill={compact()}
				class={compact() ? "checkout-compact" : "checkout-wide"}
			>
				Save
			</Button>
			<IconButton aria-label="Close" />
		</>
	));

	const button = screen.getByRole("button", { name: "Save" });
	expect(button).toHaveClass("cui-button-button", "checkout-compact");
	expect(button).toHaveAttribute("data-size", "sm");
	expect(button).toHaveAttribute("data-block", "");
	expect(button).toHaveAttribute("data-pill", "");
	expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute(
		"data-cui",
		"icon-button",
	);

	setCompact(false);

	expect(screen.getByRole("button", { name: "Save" })).toBe(button);
	expect(button).toHaveClass("cui-button-button", "checkout-wide");
	expect(button).not.toHaveClass("checkout-compact");
	expect(button).toHaveAttribute("data-size", "lg");
	expect(button).not.toHaveAttribute("data-block");
	expect(button).not.toHaveAttribute("data-pill");
});

it("uses the same Button defaults for custom markup and the kit component", () => {
	render(() => (
		<>
			<button {...buttonStyleProps({ theme: "primary", block: true })}>Custom</button>
			<Button theme="primary" block>
				Kit
			</Button>
		</>
	));
	const custom = screen.getByRole("button", { name: "Custom" });
	const kit = screen.getByRole("button", { name: "Kit" });
	for (const attribute of [
		"class",
		"data-cui",
		"data-size",
		"data-theme",
		"data-block",
	]) {
		expect(custom.getAttribute(attribute)).toBe(kit.getAttribute(attribute));
	}
	expect(custom).toHaveAttribute("data-size", "sm");
});

it("updates all styled Switch parts and keeps checked state under Kobalte", () => {
	const [compact, setCompact] = createSignal(true);
	const { container } = render(() => (
		<Switch
			label="Preview"
			size={compact() ? "sm" : "md"}
			classes={{ control: compact() ? "compact-track" : "regular-track" }}
		/>
	));

	const root = container.querySelector('[data-cui="switch-root"]');
	const control = container.querySelector<HTMLElement>('[data-cui="switch-control"]')!;
	const thumb = container.querySelector('[data-cui="switch-thumb"]');
	expect(root).toHaveAttribute("data-size", "sm");
	expect(control).toHaveAttribute("data-size", "sm");
	expect(thumb).toHaveAttribute("data-size", "sm");
	expect(control).toHaveClass("cui-switch-control", "compact-track");

	fireEvent.click(control);
	expect(screen.getByRole("switch", { name: "Preview" })).toBeChecked();

	setCompact(false);

	expect(container.querySelector('[data-cui="switch-control"]')).toBe(control);
	expect(root).toHaveAttribute("data-size", "md");
	expect(control).toHaveAttribute("data-size", "md");
	expect(thumb).toHaveAttribute("data-size", "md");
	expect(control).toHaveClass("cui-switch-control", "regular-track");
	expect(control).not.toHaveClass("compact-track");
	expect(control).toHaveAttribute("data-checked");
	expect(thumb).toHaveAttribute("data-checked");
});

it("matches the class and sizing of standalone Switch parts", () => {
	const { container } = render(() => (
		<SwitchParts.Root>
			<SwitchParts.Input />
			<SwitchParts.Control>
				<SwitchParts.Thumb />
			</SwitchParts.Control>
			<SwitchParts.Label class="preview-label">Preview</SwitchParts.Label>
		</SwitchParts.Root>
	));
	const expected = switchStyleProps.label({ class: "preview-label" });
	const label = container.querySelector('[data-cui="switch-label"]');
	const control = container.querySelector('[data-cui="switch-control"]');
	expect(label).toHaveAttribute("class", expected.class);
	expect(expected["data-size"]).toBe("md");
	expect(label).toHaveAttribute("data-size", "md");
	expect(control).toHaveAttribute("data-size", "md");
});
