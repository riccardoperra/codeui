import { cleanup, render, screen } from "@solidjs/testing-library";
import { Tooltip } from "../src/components/Tooltip/Tooltip";
import { expectDismissed, press, tick } from "./helpers";

afterEach(cleanup);

it("opens on child keyboard focus and closes on Escape without moving focus", async () => {
	render(() => (
		<Tooltip content="Copy to clipboard">
			<button>Copy</button>
		</Tooltip>
	));
	const button = screen.getByRole("button", { name: "Copy" });
	button.focus();
	await tick();
	const tooltip = screen.getByRole("tooltip");
	expect(tooltip).toHaveTextContent("Copy to clipboard");
	expect(document.activeElement).toBe(button);
	press("Escape");
	await tick();
	await expectDismissed(tooltip);
	expect(document.activeElement).toBe(button);
});

it.each([
	["undefined", undefined],
	["null", null],
	["an empty string", ""],
])("never opens and adds no description when content is %s", async (_, content) => {
	render(() => (
		<Tooltip content={content} slotClasses={{ trigger: "my-trigger" }}>
			<button>Copy</button>
		</Tooltip>
	));
	const button = screen.getByRole("button", { name: "Copy" });
	expect(button.parentElement).toHaveClass("my-trigger");
	button.focus();
	await tick();
	await new Promise(resolve => setTimeout(resolve, 300));
	expect(screen.queryByRole("tooltip")).toBeNull();
	expect(document.querySelector("[data-cui=tooltip-content]")).toBeNull();
	expect(button).not.toHaveAttribute("aria-describedby");
});
