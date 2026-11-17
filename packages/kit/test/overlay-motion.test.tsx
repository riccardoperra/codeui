import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from "../src";
import { Select } from "../src/components/Select/Select";
import { Tooltip } from "../src/components/Tooltip/Tooltip";
import * as P from "../src/parts/popover";
import { expectDismissed, press, tick } from "./helpers";

// Inkstone "keyboard first, keyboard instant": an overlay opened from the keyboard
// carries data-motion="none", which turns its Pop off. One opened by a pointer has
// no data-motion and plays it.

afterEach(cleanup);


function renderPopover() {
	render(() => (
		<P.Root>
			<P.Trigger>Export</P.Trigger>
			<P.Portal>
				<P.Content>
					<P.Title>Export</P.Title>
				</P.Content>
			</P.Portal>
		</P.Root>
	));
	return screen.getByRole("button", { name: "Export" });
}

describe("Popover", () => {
	it("opens in place from the keyboard", async () => {
		const trigger = renderPopover();
		trigger.focus();
		press("Enter");
		fireEvent.click(trigger);
		expect(await screen.findByRole("dialog")).toHaveAttribute("data-motion", "none");
	});

	it("pops when a pointer opens it, even if the pointer moved before the click", async () => {
		const trigger = renderPopover();
		press("Tab");
		await tick();
		fireEvent.pointerDown(trigger);
		fireEvent.pointerMove(trigger);
		fireEvent.click(trigger);
		expect(await screen.findByRole("dialog")).not.toHaveAttribute("data-motion");
	});

	it("keeps its motion while open, whatever input follows", async () => {
		const trigger = renderPopover();
		fireEvent.pointerDown(trigger);
		fireEvent.click(trigger);
		const dialog = await screen.findByRole("dialog");
		press("Shift");
		await tick();
		expect(dialog).not.toHaveAttribute("data-motion");
		press("Escape");
		await expectDismissed(dialog);
	});
});

describe("DropdownMenu", () => {
	function renderMenu() {
		render(() => (
			<DropdownMenu>
				<DropdownMenuTrigger>Actions</DropdownMenuTrigger>
				<DropdownMenuPortal>
					<DropdownMenuContent>
						<DropdownMenuItem>Copy</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenuPortal>
			</DropdownMenu>
		));
		return screen.getByRole("button", { name: "Actions" });
	}

	it("opens in place from the keyboard", async () => {
		const trigger = renderMenu();
		trigger.focus();
		fireEvent.keyDown(trigger, { key: "ArrowDown" });
		expect(await screen.findByRole("menu")).toHaveAttribute("data-motion", "none");
	});

	it("pops when a pointer opens it", async () => {
		const trigger = renderMenu();
		fireEvent(trigger, new PointerEvent("pointerdown", { bubbles: true, button: 0, pointerType: "mouse" }));
		expect(await screen.findByRole("menu")).not.toHaveAttribute("data-motion");
	});
});

describe("Select", () => {
	it("opens its list in place from the keyboard", async () => {
		render(() => <Select aria-label="Font" options={["Inter", "Mono"]} />);
		const trigger = screen.getByRole("button", { name: /Font/ });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: "ArrowDown" });
		const listbox = await screen.findByRole("listbox");
		expect(listbox.parentElement).toHaveAttribute("data-motion", "none");
	});
});

describe("Tooltip", () => {
	function renderTooltip() {
		render(() => (
			<Tooltip content="Copy to clipboard" openDelay={0}>
				<button>Copy</button>
			</Tooltip>
		));
		return screen.getByRole("button", { name: "Copy" });
	}

	it("opens in place on keyboard focus and describes the focused child", async () => {
		const button = renderTooltip();
		press("Tab");
		button.focus();
		const tooltip = await screen.findByRole("tooltip");
		expect(tooltip).toHaveAttribute("data-motion", "none");
		expect(button).toHaveAccessibleDescription("Copy to clipboard");
	});

	it("pops on hover", async () => {
		// Finish the prior tooltip's focus cleanup and skip-delay window before mounting.
		await new Promise(resolve => setTimeout(resolve, 350));
		const button = renderTooltip();
		fireEvent.pointerMove(button.parentElement!, { pointerType: "mouse" });
		fireEvent.pointerEnter(button.parentElement!, { pointerType: "mouse" });
		await new Promise(resolve => setTimeout(resolve, 50));
		expect(screen.getByRole("tooltip")).not.toHaveAttribute("data-motion");
	});
});
