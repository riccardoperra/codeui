import { cleanup, fireEvent, render, screen, waitFor, within } from "@solidjs/testing-library";
import { userEvent } from "vitest/browser";
import {
	Combobox, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger,
	DropdownSubMenu, DropdownSubMenuContent, DropdownSubMenuTrigger,
} from "../src";
import { Select } from "../src/components/Select/Select";
import { Tooltip } from "../src/components/Tooltip/Tooltip";
import * as P from "../src/parts/popover";
import { expectDismissed, expectFocus, press, tick } from "./helpers";

// Inkstone "keyboard first, keyboard instant": an overlay opened from the keyboard
// carries data-motion="none", which turns its Pop off. One opened by a pointer has
// no data-motion and plays it.

afterEach(cleanup);

async function expectPopExit(panel: HTMLElement) {
	await waitFor(() => expect(panel).toHaveAttribute("data-closed"));
	expect(panel).toBeInTheDocument();
	expect(panel).toHaveAttribute("inert");
	const exit = panel.getAnimations().find(animation =>
		animation instanceof CSSAnimation && animation.animationName === "cui-motion-pop-out",
	);
	expect(exit).toBeDefined();
	const onEnd = vi.fn();
	panel.addEventListener("animationend", onEnd, { once: true });
	await exit!.finished;
	await expectDismissed(panel);
	expect(onEnd).toHaveBeenCalledWith(expect.objectContaining({ animationName: "cui-motion-pop-out" }));
}

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

	it("cancels an exit when a pointer reopens the same popover", async () => {
		const trigger = renderPopover();
		const pointerToggle = () => {
			fireEvent.pointerDown(trigger);
			fireEvent.click(trigger);
		};
		pointerToggle();
		const dialog = await screen.findByRole("dialog");

		pointerToggle();
		await waitFor(() => expect(dialog).toHaveAttribute("data-closed"));
		const exit = dialog.getAnimations()[0]!;
		expect(dialog).toHaveAttribute("inert");

		pointerToggle();
		await waitFor(() => expect(dialog).toHaveAttribute("data-expanded"));
		await expect(exit.finished).rejects.toThrow();
		expect(screen.getByRole("dialog")).toBe(dialog);
		expect(dialog).not.toHaveAttribute("inert");
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
		return screen.findByRole("button", { name: "Actions" });
	}

	it("opens in place from the keyboard", async () => {
		const trigger = await renderMenu();
		trigger.focus();
		fireEvent.keyDown(trigger, { key: "ArrowDown" });
		const menu = await screen.findByRole("menu");
		expect(getComputedStyle(menu).animationName).toBe("none");
		await expectFocus(within(menu).getByRole("menuitem", { name: "Copy" }));
		press("Escape");
		expect(menu).not.toBeInTheDocument();
	});

	it("pops when a pointer opens it", async () => {
		const trigger = await renderMenu();
		fireEvent(trigger, new PointerEvent("pointerdown", { bubbles: true, button: 0, pointerType: "mouse" }));
		const menu = await screen.findByRole("menu");
		expect(getComputedStyle(menu).animationName).toBe("cui-motion-pop-in");
		await expectFocus(menu);
		press("ArrowDown");
		await expectFocus(within(menu).getByRole("menuitem", { name: "Copy" }));
		press("Enter");
		await expectPopExit(menu);
		await expectFocus(trigger);
	});

	it("opens by pointer without focusing an item or moving the page", async () => {
		const itemFocus = vi.fn();
		render(() => (
			<div style={{ height: "200vh", "padding-top": "110vh" }}>
				<DropdownMenu>
					<DropdownMenuTrigger>Actions</DropdownMenuTrigger>
					<DropdownMenuPortal>
						<DropdownMenuContent>
							<DropdownMenuItem onFocus={itemFocus}>Copy</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenuPortal>
				</DropdownMenu>
			</div>
		));
		const trigger = screen.getByRole("button", { name: "Actions" });
		window.scrollBy(0, trigger.getBoundingClientRect().top - innerHeight / 2);
		const initialScroll = window.scrollY;
		try {
			await userEvent.click(trigger);
			const menu = await screen.findByRole("menu");
			await expectFocus(menu);
			await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
			expect(window.scrollY).toBe(initialScroll);
			expect(itemFocus).not.toHaveBeenCalled();
			press("Escape");
			await expectDismissed(menu);
			await expectFocus(trigger);
		} finally {
			window.scrollTo(0, 0);
		}
	});

	it("animates a hovered submenu closing while the parent remains open", async () => {
		render(() => (
			<DropdownMenu>
				<DropdownMenuTrigger>Actions</DropdownMenuTrigger>
				<DropdownMenuPortal>
					<DropdownMenuContent>
						<DropdownSubMenu>
							<DropdownSubMenuTrigger>Export</DropdownSubMenuTrigger>
							<DropdownMenuPortal>
								<DropdownSubMenuContent>
									<DropdownMenuItem>PNG</DropdownMenuItem>
								</DropdownSubMenuContent>
							</DropdownMenuPortal>
						</DropdownSubMenu>
						<DropdownMenuItem>Copy</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenuPortal>
			</DropdownMenu>
		));
		await userEvent.click(screen.getByRole("button", { name: "Actions" }));
		const parent = await screen.findByRole("menu");
		const exportItem = within(parent).getByRole("menuitem", { name: "Export" });
		await userEvent.hover(exportItem);
		const item = await screen.findByRole("menuitem", { name: "PNG" });
		const submenu = item.closest<HTMLElement>('[role="menu"]')!;
		expect(getComputedStyle(submenu).animationName).toBe("cui-motion-pop-in");
		item.focus({ preventScroll: true });
		press("ArrowLeft");
		await expectPopExit(submenu);
		expect(parent).toHaveAttribute("data-expanded");
		await expectFocus(exportItem);
	});
});

describe("Select", () => {
	it("opens its list in place from the keyboard", async () => {
		render(() => <Select aria-label="Font" options={["Inter", "Mono"]} />);
		const trigger = await screen.findByRole("button", { name: /Font/ });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: "ArrowDown" });
		const listbox = await screen.findByRole("listbox");
		expect(listbox.parentElement).toHaveAttribute("data-motion", "none");
	});

	it("animates the list closing after a pointer selection", async () => {
		render(() => <Select aria-label="Font" options={["Inter", "Mono"]} />);
		await userEvent.click(screen.getByRole("button", { name: /Font/ }));
		const option = await screen.findByRole("option", { name: "Mono" });
		const panel = option.closest<HTMLElement>('[data-cui="select-content"]')!;
		expect(getComputedStyle(panel).animationName).toBe("cui-motion-pop-in");
		await userEvent.click(option);
		await expectPopExit(panel);
	});

	it("reveals the selected option without scrolling the ancestor that contains the popup", async () => {
		let scroller!: HTMLDivElement;
		const options = Array.from({ length: 36 }, (_, index) => `Font ${index}`);
		render(() => (
			<div ref={scroller} style={{ overflow: "auto", height: "100px", position: "relative" }}>
				<div style={{ height: "180px", "padding-top": "64px" }}>
					<Select
						aria-label="Font"
						options={options}
						defaultValue="Font 29"
						mount={scroller}
						placement="bottom-start"
						flip={false}
						slide={false}
					/>
				</div>
			</div>
		));
		const trigger = screen.getByRole("button", { name: /Font/ });
		trigger.focus({ preventScroll: true });
		press("ArrowDown");
		const option = await screen.findByRole("option", { name: "Font 29" });
		await expectFocus(option);
		const panel = option.closest<HTMLElement>('[data-cui="select-content"]')!;
		expect(panel.scrollTop).toBeGreaterThan(0);
		expect(scroller.scrollTop).toBe(0);
	});
});

describe("Combobox", () => {
	it("animates the list closing after a pointer selection", async () => {
		render(() => <Combobox aria-label="Font" options={["Inter", "Mono"]} />);
		const trigger = screen.getByRole("button");
		await userEvent.click(trigger);
		const option = await screen.findByRole("option", { name: "Mono" });
		const panel = option.closest<HTMLElement>('[data-cui="combobox-content"]')!;
		expect(getComputedStyle(panel).animationName).toBe("cui-motion-pop-in");
		await userEvent.click(option);
		await expectPopExit(panel);
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
