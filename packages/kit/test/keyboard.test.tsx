import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { createSignal } from "solid-js";
import { Select } from "../src/components/Select/Select";
import { Dialog } from "../src/components/Dialog/Dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../src/components/Popover/Popover";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from "../src/components/Dropdown/Dropdown";
import { Listbox } from "../src/components/Listbox/Listbox";
import { Tooltip } from "../src/components/Tooltip/Tooltip";
import { expectDismissed, press, tick } from "./helpers";

afterEach(cleanup);

beforeAll(() => {
	window.scrollTo = () => {};
});

describe("Select", () => {
	function renderSelect(onChange = jest.fn()) {
		render(() => (
			<Select
				aria-label="Fruit"
				options={["Apple", "Banana", "Cherry"]}
				placeholder="Pick one"
				onChange={onChange}
			/>
		));
		const trigger = screen.getByRole("button", { name: /Fruit/ });
		trigger.focus();
		return trigger;
	}

	it.each(["Enter", "ArrowDown"])("opens the list with %s", async key => {
		const trigger = renderSelect();
		press(key);
		await tick();
		expect(screen.getByRole("listbox")).toBeInTheDocument();
		expect(trigger).toHaveAttribute("aria-expanded", "true");
	});

	it("moves with the arrows and selects with Enter", async () => {
		const onChange = jest.fn();
		const trigger = renderSelect(onChange);
		press("ArrowDown");
		await tick();
		expect(document.activeElement).toHaveTextContent("Apple");
		press("ArrowDown");
		expect(document.activeElement).toHaveTextContent("Banana");
		const listbox = screen.getByRole("listbox");
		press("Enter");
		await tick();
		expect(onChange).toHaveBeenCalledWith("Banana");
		await expectDismissed(listbox);
		expect(trigger).toHaveTextContent("Banana");
	});

	it("closes with Escape and returns focus to the trigger", async () => {
		const onChange = jest.fn();
		const trigger = renderSelect(onChange);
		press("ArrowDown");
		await tick();
		const listbox = screen.getByRole("listbox");
		press("Escape");
		await tick();
		await expectDismissed(listbox);
		expect(document.activeElement).toBe(trigger);
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe("Dialog", () => {
	async function openDialog() {
		render(() => {
			const [open, setOpen] = createSignal(false);
			return (
				<>
					<button onClick={() => setOpen(true)}>Open settings</button>
					<Dialog title="Settings" open={open()} onOpenChange={setOpen}>
						<input aria-label="Name" />
					</Dialog>
				</>
			);
		});
		const opener = screen.getByRole("button", { name: "Open settings" });
		opener.focus();
		fireEvent.click(opener);
		await tick();
		const dialog = screen.getByRole("dialog");
		expect(dialog).toContainElement(document.activeElement as HTMLElement);
		return { opener, dialog };
	}

	it("closes with Escape", async () => {
		const { dialog } = await openDialog();
		press("Escape");
		await tick();
		await expectDismissed(dialog);
	});

	it("returns focus to the button that opened it", async () => {
		const { opener, dialog } = await openDialog();
		const overlay = document.querySelector<HTMLElement>('[data-cui="dialog-overlay"]')!;
		press("Escape");
		await tick();
		await expectDismissed(dialog);
		await expectDismissed(overlay);
		await tick();
		expect(document.activeElement).toBe(opener);
	});
});

describe("Popover", () => {
	it("closes with Escape and returns focus to the trigger", async () => {
		render(() => (
			<Popover>
				<PopoverTrigger>Share</PopoverTrigger>
				<PopoverContent title="Share snippet">Copy the link</PopoverContent>
			</Popover>
		));
		const trigger = screen.getByRole("button", { name: "Share" });
		trigger.focus();
		fireEvent.click(trigger);
		await tick();
		expect(screen.getByRole("dialog")).toHaveTextContent("Copy the link");

		const dialog = screen.getByRole("dialog");
		press("Escape");
		await tick();
		await expectDismissed(dialog);
		expect(document.activeElement).toBe(trigger);
	});
});

describe("DropdownMenu", () => {
	function renderMenu(onSelect = jest.fn()) {
		render(() => (
			<DropdownMenu>
				<DropdownMenuTrigger>Actions</DropdownMenuTrigger>
				<DropdownMenuPortal>
					<DropdownMenuContent>
						<DropdownMenuItem onSelect={() => onSelect("Copy")}>Copy</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => onSelect("Rename")}>Rename</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => onSelect("Delete")}>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenuPortal>
			</DropdownMenu>
		));
		const trigger = screen.getByRole("button", { name: "Actions" });
		trigger.focus();
		return trigger;
	}

	it("opens with ArrowDown, moves with the arrows and runs the item on Enter", async () => {
		const onSelect = jest.fn();
		renderMenu(onSelect);
		press("ArrowDown");
		await tick();
		expect(screen.getByRole("menu")).toBeInTheDocument();
		expect(document.activeElement).toHaveTextContent("Copy");
		press("ArrowDown");
		expect(document.activeElement).toHaveTextContent("Rename");
		press("ArrowDown");
		expect(document.activeElement).toHaveTextContent("Delete");
		press("ArrowUp");
		expect(document.activeElement).toHaveTextContent("Rename");
		const menu = screen.getByRole("menu");
		press("Enter");
		await tick();
		expect(onSelect).toHaveBeenCalledWith("Rename");
		await expectDismissed(menu);
	});

	it("closes with Escape and returns focus to the trigger", async () => {
		const onSelect = jest.fn();
		const trigger = renderMenu(onSelect);
		press("ArrowDown");
		await tick();
		const menu = screen.getByRole("menu");
		press("Escape");
		await tick();
		await expectDismissed(menu);
		expect(document.activeElement).toBe(trigger);
		expect(onSelect).not.toHaveBeenCalled();
	});
});

describe("Listbox inside a Dialog", () => {
	function renderListboxDialog(listboxProps: { disallowEmptySelection?: boolean } = {}) {
		render(() => {
			const [open, setOpen] = createSignal(true);
			return (
				<Dialog title="Language" open={open()} onOpenChange={setOpen}>
					<Listbox
						aria-label="Languages"
						options={["TypeScript", "Rust", "Go"]}
						defaultValue={["Rust"]}
						{...listboxProps}
					/>
				</Dialog>
			);
		});
		const selected = screen.getByRole("option", { name: "Rust" });
		selected.focus();
		return selected;
	}

	it("clears the selection on Escape and keeps the dialog open", async () => {
		const option = renderListboxDialog();
		expect(option).toHaveAttribute("aria-selected", "true");
		press("Escape");
		await tick();
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(option).toHaveAttribute("aria-selected", "false");
	});

	it("closes the dialog on Escape when empty selection is disallowed", async () => {
		const option = renderListboxDialog({ disallowEmptySelection: true });
		const dialog = screen.getByRole("dialog");
		press("Escape");
		await tick();
		await expectDismissed(dialog);
		expect(option).toHaveAttribute("aria-selected", "true");
	});
});

describe("Tooltip", () => {
	it("renders the trigger as a plain wrapper without a button type", () => {
		render(() => (
			<Tooltip content="Copy to clipboard">
				<button>Copy</button>
			</Tooltip>
		));
		const trigger = screen.getByRole("button", { name: "Copy" }).parentElement!;
		expect(trigger.tagName).toBe("DIV");
		expect(trigger).not.toHaveAttribute("type");
	});

	it("shows the tooltip when the pointer enters the trigger", async () => {
		render(() => (
			<Tooltip content="Copy to clipboard" openDelay={0}>
				<button>Copy</button>
			</Tooltip>
		));
		const trigger = screen.getByRole("button", { name: "Copy" }).parentElement!;
		fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
		await new Promise(resolve => setTimeout(resolve, 50));
		expect(screen.getByRole("tooltip")).toHaveTextContent("Copy to clipboard");
		// The description sits on the focusable child, where a screen reader reads it.
		const button = screen.getByRole("button", { name: "Copy" });
		expect(button).toHaveAttribute("aria-describedby", screen.getByRole("tooltip").id);
		expect(button).toHaveAccessibleDescription("Copy to clipboard");
		expect(trigger).not.toHaveAttribute("aria-describedby");
	});
});
