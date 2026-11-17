import { cleanup, render, screen, waitFor } from "solid-testing-library";
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
beforeAll(() => {
	global.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});
it.each([false, true])("masks invalid typing with a caller ref %s", async withRef => {
	render(() => (
		<NumberField aria-label="Amount" ref={withRef ? () => {} : undefined} precision={0} />
	));
	const input = screen.getByRole("textbox") as HTMLInputElement;
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
		expect(screen.getByText("Child").parentElement?.style.transform).toContain(
			`translate3d(${gutter ?? -4}px`,
		),
	);
});
