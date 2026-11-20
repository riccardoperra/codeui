import { cleanup, render, screen } from "@solidjs/testing-library";
import { Select } from "../src/components/Select/Select";
import { press, tick } from "./helpers";

afterEach(cleanup);

describe("Select classes", () => {
	it("puts classes.content on the list popover and classes.trigger on the trigger", async () => {
		render(() => (
			<Select
				aria-label="Font"
				options={["Inter", "Mono"]}
				classes={{ content: "font-list", trigger: "font-trigger" }}
			/>
		));
		const trigger = screen.getByRole("button", { name: /Font/ });
		expect(trigger).toHaveClass("font-trigger");
		trigger.focus();
		press("ArrowDown");
		await tick();
		expect(screen.getByRole("listbox").parentElement).toHaveClass("font-list");
	});

	it("still applies the deprecated slotClasses.input to the trigger", () => {
		render(() => (
			<Select aria-label="Font" options={["Inter"]} slotClasses={{ input: "legacy" }} />
		));
		expect(screen.getByRole("button", { name: /Font/ })).toHaveClass("legacy");
	});
});
