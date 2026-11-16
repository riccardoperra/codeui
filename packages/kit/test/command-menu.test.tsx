import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { createSignal } from "solid-js";
import { type CommandItem, CommandMenu } from "../src/components/CommandMenu/CommandMenu";
import { expectDismissed, press, tick } from "./helpers";

afterEach(cleanup);
beforeAll(() => {
	window.scrollTo = () => {};
});

type Theme = CommandItem & { theme?: string };
const items: Theme[] = [
	{
		id: "randomize",
		textValue: "Randomize theme",
		label: "Randomize theme",
		group: "Actions",
	},
	{
		id: "shortcuts",
		textValue: "Keyboard shortcuts",
		label: "Keyboard shortcuts",
		group: "Actions",
		shortcut: "?",
	},
	{
		id: "vercel",
		textValue: "Vercel",
		label: "Vercel",
		group: "Themes",
		leading: <i>orb</i>,
		current: true,
		theme: "vercel",
	},
	{
		id: "dracula",
		textValue: "Dracula",
		label: <b>Dracula</b>,
		group: "Themes",
		description: "Dark purple",
		theme: "dracula",
	},
	{
		id: "nord",
		textValue: "Nord",
		label: "Nord",
		group: "Themes",
		section: "Appearance",
		theme: "nord",
	},
];

function renderMenu(
	extra: { query?: () => string; onQueryChange?: (q: string) => void } = {},
) {
	const calls: string[] = [];
	const [open, setOpen] = createSignal(false);
	render(() => (
		<>
			<button onClick={() => setOpen(true)}>Commands</button>
			<CommandMenu
				open={open()}
				onOpenChange={value => {
					calls.push(`openChange:${value}`);
					setOpen(value);
				}}
				items={items}
				title="Search themes and options"
				placeholder="Search themes and options"
				hint="↑↓ preview · ↵ apply · esc cancel"
				emptyContent="No command found"
				query={extra.query?.()}
				onQueryChange={extra.onQueryChange}
				onHighlightChange={item => calls.push(`highlight:${item?.id}`)}
				onSelect={item => calls.push(`select:${item.id}`)}
				onBeforeClose={() => calls.push("beforeClose")}
				onCancel={() => calls.push("cancel")}
			/>
		</>
	));
	const opener = screen.getByRole("button", { name: "Commands" });
	const openMenu = async () => {
		opener.focus();
		fireEvent.click(opener);
		await tick();
		await tick();
		return screen.getByRole("combobox", { name: "Search themes and options" });
	};
	return { calls, opener, openMenu, setOpen };
}

function highlighted(input: HTMLElement) {
	const id = input.getAttribute("aria-activedescendant");
	return id
		? document.getElementById(id)?.querySelector("[data-cui=command-menu-item-label]")
				?.textContent
		: undefined;
}

it("opens with the search focused, the dialog named by the title and no list popup", async () => {
	const { openMenu } = renderMenu();
	const input = await openMenu();
	const dialog = screen.getByRole("dialog", { name: "Search themes and options" });
	expect(input).toHaveFocus();
	expect(dialog).toContainElement(
		screen.getByRole("listbox", { name: "Search themes and options" }),
	);
	expect(screen.getByText("Actions")).toBeInTheDocument();
	expect(screen.getByText("Appearance / Themes")).toBeInTheDocument();
	expect(screen.getByText("↑↓ preview · ↵ apply · esc cancel")).toHaveAttribute(
		"aria-hidden",
		"true",
	);
	expect(highlighted(input)).toBe("Randomize theme");
});

it("renders rich content: the leading visual, the current check, the description and the shortcut", async () => {
	const { openMenu } = renderMenu();
	await openMenu();
	const vercel = screen.getByRole("option", { name: "Vercel" });
	expect(vercel.querySelector("[data-cui=command-menu-leading]")).toHaveTextContent(
		"orb",
	);
	expect(vercel.querySelector("[data-cui=command-menu-item-indicator]")).not.toBeNull();
	const dracula = screen.getByRole("option", { name: "Dracula" });
	expect(dracula.querySelector("b")).toHaveTextContent("Dracula");
	expect(dracula).toHaveTextContent("Dark purple");
	expect(dracula.querySelector("[data-cui=command-menu-leading]")).not.toBeNull();
	expect(dracula.querySelector("[data-cui=command-menu-item-indicator]")).toBeNull();
	const shortcuts = screen.getByRole("option", { name: "Keyboard shortcuts" });
	expect(shortcuts.querySelector("[data-cui=command-menu-shortcut]")).toHaveTextContent(
		"?",
	);
	expect(shortcuts.querySelector("[data-cui=command-menu-leading]")).toBeNull();
});

it("previews on highlight and commits only on Enter: before close, close, then select", async () => {
	const { openMenu, calls, opener } = renderMenu();
	await openMenu();
	press("ArrowDown");
	press("ArrowDown");
	expect(calls).toEqual([
		"highlight:randomize",
		"highlight:shortcuts",
		"highlight:vercel",
	]);
	calls.length = 0;
	press("Enter");
	await expectDismissed(screen.getByRole("dialog"));
	expect(calls.filter(call => !call.startsWith("highlight"))).toEqual([
		"beforeClose",
		"openChange:false",
		"select:vercel",
	]);
	expect(opener).toHaveFocus();
});

it("commits a clicked item", async () => {
	const { openMenu, calls } = renderMenu();
	await openMenu();
	fireEvent.pointerDown(screen.getByRole("option", { name: "Nord" }), { button: 0 });
	fireEvent.pointerUp(screen.getByRole("option", { name: "Nord" }), { button: 0 });
	fireEvent.click(screen.getByRole("option", { name: "Nord" }));
	await tick();
	expect(calls.filter(call => call.startsWith("select"))).toEqual(["select:nord"]);
	expect(calls).toContain("openChange:false");
});

it("cancels on Escape: the highlight clears, then before close, cancel and close, and focus returns", async () => {
	const { openMenu, calls, opener } = renderMenu();
	await openMenu();
	press("ArrowDown");
	calls.length = 0;
	press("Escape");
	await expectDismissed(screen.getByRole("dialog"));
	expect(calls).toEqual([
		"highlight:undefined",
		"beforeClose",
		"cancel",
		"openChange:false",
	]);
	expect(calls.some(call => call.startsWith("select"))).toBe(false);
	expect(opener).toHaveFocus();
});

it("cancels when the app closes the menu, such as a second shortcut press", async () => {
	const { openMenu, calls, setOpen } = renderMenu();
	await openMenu();
	calls.length = 0;
	const dialog = screen.getByRole("dialog");
	setOpen(false);
	await expectDismissed(dialog);
	expect(calls).toEqual(["beforeClose", "cancel", "highlight:undefined"]);
});

it("filters by every word across label text, group, section and plain descriptions, and resets the query on close", async () => {
	const { openMenu, calls } = renderMenu();
	let input = await openMenu();
	fireEvent.input(input, { target: { value: "themes purple" } });
	await tick();
	expect(screen.getAllByRole("option").map(option => option.textContent)).toEqual([
		"DraculaDark purple",
	]);
	expect(highlighted(input)).toBe("Dracula");
	expect(calls.at(-1)).toBe("highlight:dracula");
	fireEvent.input(input, { target: { value: "appearance" } });
	await tick();
	expect(highlighted(input)).toBe("Nord");
	fireEvent.input(input, { target: { value: "kiwi" } });
	await tick();
	expect(screen.queryAllByRole("option")).toHaveLength(0);
	expect(screen.getByRole("status")).toHaveTextContent("No command found");
	press("Escape");
	await expectDismissed(screen.getByRole("dialog"));
	input = await openMenu();
	expect(input).toHaveValue("");
	expect(screen.getAllByRole("option")).toHaveLength(items.length);
});

it("follows a controlled query and asks the app to clear it on close", async () => {
	const [query, setQuery] = createSignal("nord");
	const onQueryChange = jest.fn((value: string) => setQuery(value));
	const { openMenu } = renderMenu({ query, onQueryChange });
	const input = await openMenu();
	expect(input).toHaveValue("nord");
	expect(screen.getAllByRole("option").map(option => option.textContent)).toEqual([
		"Nord",
	]);
	setQuery("dra");
	await tick();
	expect(input).toHaveValue("dra");
	expect(screen.getAllByRole("option").map(option => option.textContent)).toEqual([
		"DraculaDark purple",
	]);
	press("Escape");
	await tick();
	expect(onQueryChange).toHaveBeenLastCalledWith("");
});

it("rejects duplicate item ids", async () => {
	const [open] = createSignal(true);
	const duplicate = [items[0], { ...items[1], id: items[0].id }];
	expect(() =>
		render(() => (
			<CommandMenu
				open={open()}
				onOpenChange={() => {}}
				items={duplicate}
				title="Commands"
				onSelect={() => {}}
			/>
		)),
	).toThrow('CommandMenu item id "randomize" is not unique');
});
