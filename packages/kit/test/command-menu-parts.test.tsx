import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { flush } from "solid-js";
import { CommandMenuParts as M } from "../src/parts/command-menu";
import { expectDismissed, press, tick } from "./helpers";

afterEach(cleanup);

type Command = { id: string; label: string; disabled?: boolean };
type Group = { name: string; commands: Command[] };
const groups: Group[] = [
	{
		name: "Actions",
		commands: [
			{ id: "randomize", label: "Randomize theme" },
			{ id: "shortcuts", label: "Keyboard shortcuts" },
		],
	},
	{
		name: "Themes",
		commands: [
			{ id: "legacy", label: "Legacy theme", disabled: true },
			{ id: "dracula", label: "Dracula" },
			{ id: "nord", label: "Nord" },
		],
	},
];

function renderMenu() {
	const highlights: Array<string | undefined> = [];
	const onSelect = vi.fn();
	const [open, setOpen] = createSignal(true);
	const [query, setQuery] = createSignal("");
	const options = () =>
		groups
			.map(group => ({
				...group,
				commands: group.commands.filter(command =>
					command.label.toLowerCase().includes(query().toLowerCase()),
				),
			}))
			.filter(group => group.commands.length > 0);
	render(() => (
		<M.Root open={open()} onOpenChange={setOpen}>
			<M.Portal>
				<M.Content<Command, Group>
					options={options()}
					optionValue="id"
					optionTextValue="label"
					optionDisabled="disabled"
					optionGroupChildren="commands"
					defaultFilter={() => true}
					onInputChange={setQuery}
					onHighlightChange={command => highlights.push(command?.id)}
					onSelect={onSelect}
					sectionComponent={props => (
						<M.Group>
							<M.GroupLabel>{props.section.rawValue.name}</M.GroupLabel>
						</M.Group>
					)}
					itemComponent={props => (
						<M.Item item={props.item}>
							<M.Leading>•</M.Leading>
							<M.ItemLabel>{props.item.rawValue.label}</M.ItemLabel>
							<M.Shortcut>⌘K</M.Shortcut>
						</M.Item>
					)}
				>
					<M.Title>Commands</M.Title>
					<M.Search>
						<M.SearchInput aria-label="Search commands" />
						<M.Hint>↑↓ preview · ↵ apply · esc cancel</M.Hint>
					</M.Search>
					<M.Listbox aria-label="Commands" />
					<M.Empty>No command found</M.Empty>
				</M.Content>
			</M.Portal>
		</M.Root>
	));
	const input = screen.getByRole("combobox", { name: "Search commands" });
	input.focus();
	return { input, highlights, onSelect, setOpen };
}

function highlighted(input: HTMLElement) {
	const id = input.getAttribute("aria-activedescendant");
	return id
		? document.getElementById(id)?.querySelector("[data-cui=commandmenu-item-label]")
				?.textContent
		: undefined;
}

async function type(input: HTMLElement, value: string) {
	fireEvent.input(input, { target: { value } });
	await tick();
}

it("renders the search and the grouped list inline in one dialog", () => {
	const { input } = renderMenu();
	const dialog = screen.getByRole("dialog", { name: "Commands" });
	const listbox = screen.getByRole("listbox", { name: "Commands" });
	expect(dialog).toContainElement(input);
	expect(dialog).toContainElement(listbox);
	expect(input).toHaveAttribute("aria-expanded", "true");
	expect(input).toHaveAttribute("aria-controls", listbox.id);
	expect(screen.getAllByRole("dialog")).toHaveLength(1);
	expect(screen.getByText("Themes")).toHaveAttribute(
		"data-cui",
		"commandmenu-group-label",
	);
	expect(screen.getAllByRole("option").map(option => option.textContent)).toEqual([
		"•Randomize theme⌘K",
		"•Keyboard shortcuts⌘K",
		"•Legacy theme⌘K",
		"•Dracula⌘K",
		"•Nord⌘K",
	]);
	expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

it("highlights the first option on open and reports each arrow move, wrapping at the ends and skipping disabled options", () => {
	const { input, highlights } = renderMenu();
	expect(highlighted(input)).toBe("Randomize theme");
	press("ArrowDown");
	press("ArrowDown");
	expect(highlighted(input)).toBe("Dracula");
	press("ArrowDown");
	press("ArrowDown");
	expect(highlighted(input)).toBe("Randomize theme");
	press("ArrowUp");
	expect(highlighted(input)).toBe("Nord");
	expect(highlights).toEqual([
		"randomize",
		"shortcuts",
		"dracula",
		"nord",
		"randomize",
		"nord",
	]);
});

it("reports pointer hover through the same highlight", () => {
	const { input, highlights } = renderMenu();
	const nord = screen.getByRole("option", { name: "Nord" });
	const move = new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse" });
	flush(() => nord.dispatchEvent(move));
	expect(highlighted(input)).toBe("Nord");
	expect(highlights.at(-1)).toBe("nord");
});

it("reports no highlight while filtering, then the first match, and shows the empty state", async () => {
	const { input, highlights } = renderMenu();
	press("ArrowDown");
	highlights.length = 0;
	await type(input, "no");
	expect(screen.getAllByRole("option").map(option => option.textContent)).toEqual([
		"•Nord⌘K",
	]);
	expect(highlights).toEqual([undefined, "nord"]);
	expect(highlighted(input)).toBe("Nord");
	await type(input, "zzz");
	expect(screen.queryAllByRole("option")).toHaveLength(0);
	expect(screen.getByRole("status")).toHaveTextContent("No command found");
	expect(highlights.at(-1)).toBeUndefined();
});

it("selects with Enter or a click without keeping a selection", async () => {
	const { input, onSelect } = renderMenu();
	press("ArrowDown");
	press("Enter");
	await tick();
	expect(onSelect).toHaveBeenCalledTimes(1);
	expect(onSelect).toHaveBeenLastCalledWith(groups[0].commands[1]);
	expect(input).toHaveValue("");
	expect(
		screen
			.getAllByRole("option")
			.every(option => option.getAttribute("aria-selected") !== "true"),
	).toBe(true);
	press("Enter");
	await tick();
	expect(onSelect).toHaveBeenCalledTimes(2);
	const nord = screen.getByRole("option", { name: "Nord" });
	fireEvent.pointerDown(nord, { pointerType: "mouse", button: 0 });
	fireEvent.pointerUp(nord, { pointerType: "mouse", button: 0 });
	fireEvent.click(nord);
	await tick();
	expect(onSelect).toHaveBeenCalledTimes(3);
	expect(onSelect).toHaveBeenLastCalledWith(groups[1].commands[2]);
});

it("reports no highlight when the menu closes", async () => {
	const { highlights, setOpen } = renderMenu();
	press("ArrowDown");
	const dialog = screen.getByRole("dialog");
	setOpen(false);
	await expectDismissed(dialog);
	expect(highlights.at(-1)).toBeUndefined();
});

it("marks every rendered part with its data-cui name", () => {
	renderMenu();
	const dialog = screen.getByRole("dialog");
	expect(dialog).toHaveAttribute("data-cui", "commandmenu-content");
	for (const part of [
		"title",
		"search",
		"search-input",
		"hint",
		"listbox",
		"group",
		"item",
		"leading",
		"item-label",
		"shortcut",
	]) {
		expect(dialog.querySelector(`[data-cui=commandmenu-${part}]`)).not.toBeNull();
	}
});
