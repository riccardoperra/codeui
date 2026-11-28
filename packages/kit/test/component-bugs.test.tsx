import { cleanup, render, screen, waitFor } from "@solidjs/testing-library";
import { press } from "./helpers";
import { NumberField } from "../src/components/NumberField/NumberField";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownSubMenu,
	DropdownSubMenuTrigger,
	DropdownSubMenuContent,
} from "../src/components/Dropdown/Dropdown";
afterEach(cleanup);
it.each([false, true])("masks invalid typing with a caller ref %s", async withRef => {
	render(() => (
		<NumberField aria-label="Amount" ref={withRef ? () => {} : undefined} precision={0} />
	));
	const input = screen.getByRole("spinbutton") as HTMLInputElement;
	input.focus();
	await Promise.resolve();
	const event = new InputEvent("beforeinput", {
		inputType: "insertText",
		data: "a",
		bubbles: true,
		cancelable: true,
	});
	input.dispatchEvent(event);
	expect(event.defaultPrevented).toBe(true);
});
it.each([undefined, 0, 20])("positions submenu with gutter %s", async gutter => {
	press("Tab");
	render(() => (
		<DropdownMenu open>
			<DropdownMenuTrigger>Menu</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownSubMenu open gutter={gutter}>
					<DropdownSubMenuTrigger>More</DropdownSubMenuTrigger>
					<DropdownSubMenuContent>Child</DropdownSubMenuContent>
				</DropdownSubMenu>
			</DropdownMenuContent>
		</DropdownMenu>
	));
	await waitFor(() =>
		expect(
			screen.getByText("Child").getBoundingClientRect().left -
				screen.getByText("More").getBoundingClientRect().right,
		).toBe(gutter ?? -4),
	);
});
