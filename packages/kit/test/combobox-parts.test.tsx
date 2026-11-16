import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { createSignal } from "solid-js";
import { ComboboxParts as C, createComboboxOptions } from "../src/parts/combobox";
import type { ComboboxOption } from "../src/parts/combobox";
import { press, tick } from "./helpers";

afterEach(cleanup);
beforeAll(() => {
	window.scrollTo = () => {};
});

type Language = { id: string; name: string; deprecated?: boolean };
const languages: Language[] = [
	{ id: "ts", name: "TypeScript" },
	{ id: "js", name: "JavaScript" },
	{ id: "as", name: "ActionScript", deprecated: true },
	{ id: "rs", name: "Rust" },
];

function renderLanguages(onChange = jest.fn()) {
	const [value, setValue] = createSignal<string | undefined>("rs");
	const languageOptions = createComboboxOptions(languages, {
		valueKey: "id",
		labelKey: "name",
		disabledKey: "deprecated",
	});
	const controlled = languageOptions.controlled(value, (next, option) => {
		onChange(next, option?.item);
		setValue(next);
	});
	render(() => (
		<C.Root<ComboboxOption<string, Language>>
			{...languageOptions.props()}
			value={controlled.value}
			onChange={controlled.onChange}
			class="app-root"
			itemComponent={props => (
				<C.Item item={props.item}>
					<C.ItemLabel>{props.item.rawValue.label}</C.ItemLabel>
					<C.ItemIndicator>✓</C.ItemIndicator>
				</C.Item>
			)}
		>
			<C.Label>Language</C.Label>
			<C.Control size="sm">
				<C.Input />
				<C.Trigger>
					<C.Icon>v</C.Icon>
				</C.Trigger>
			</C.Control>
			<C.Portal>
				<C.Content>
					<C.Listbox />
				</C.Content>
			</C.Portal>
		</C.Root>
	));
	return { input: screen.getByRole("combobox", { name: "Language" }), setValue };
}

it("filters options by typed text and selects the highlighted option with Enter", async () => {
	const onChange = jest.fn();
	const { input } = renderLanguages(onChange);
	expect(input).toHaveValue("Rust");
	input.focus();
	fireEvent.input(input, { target: { value: "script" } });
	await tick();
	expect(input).toHaveAttribute("aria-expanded", "true");
	expect(screen.getAllByRole("option").map(option => option.textContent)).toEqual([
		"TypeScript",
		"JavaScript",
		"ActionScript",
	]);
	press("ArrowDown");
	press("ArrowDown");
	const active = document.getElementById(input.getAttribute("aria-activedescendant")!);
	expect(active).toHaveTextContent("JavaScript");
	expect(active).toHaveAttribute("data-highlighted");
	press("Enter");
	await tick();
	expect(onChange).toHaveBeenCalledWith("js", languages[1]);
	expect(input).toHaveValue("JavaScript");
});

it("skips disabled options during keyboard navigation", async () => {
	const onChange = jest.fn();
	const { input } = renderLanguages(onChange);
	input.focus();
	fireEvent.input(input, { target: { value: "script" } });
	await tick();
	press("ArrowUp");
	const active = document.getElementById(input.getAttribute("aria-activedescendant")!);
	expect(active).toHaveTextContent("JavaScript");
	expect(screen.getByRole("option", { name: "ActionScript" })).toHaveAttribute(
		"aria-disabled",
		"true",
	);
});

it("closes on Escape and restores the selection, then clears the text on a second Escape", async () => {
	render(() => (
		<C.Root
			options={["TypeScript", "Rust"]}
			defaultValue="Rust"
			itemComponent={props => (
				<C.Item item={props.item}>
					<C.ItemLabel>{props.item.rawValue}</C.ItemLabel>
				</C.Item>
			)}
		>
			<C.Label>Language</C.Label>
			<C.Control>
				<C.Input />
			</C.Control>
			<C.Portal>
				<C.Content>
					<C.Listbox />
				</C.Content>
			</C.Portal>
		</C.Root>
	));
	const input = screen.getByRole("combobox", { name: "Language" });
	input.focus();
	fireEvent.input(input, { target: { value: "Ty" } });
	await tick();
	expect(input).toHaveAttribute("aria-expanded", "true");
	press("Escape");
	await tick();
	expect(input).toHaveAttribute("aria-expanded", "false");
	expect(input).toHaveValue("Rust");
	press("Escape");
	await tick();
	expect(input).toHaveValue("");
});

it("reflects controlled value changes in the input", async () => {
	const { input, setValue } = renderLanguages();
	setValue("ts");
	await tick();
	expect(input).toHaveValue("TypeScript");
});

it("marks every rendered part and merges app classes after kit classes", async () => {
	const { input } = renderLanguages();
	const root = input.closest('[data-cui="combobox-root"]')!;
	expect(root).toHaveClass("app-root");
	expect(root.className.split(" ").at(-1)).toBe("app-root");
	expect(input).toHaveAttribute("data-cui", "combobox-input");
	expect(input.parentElement).toHaveAttribute("data-cui", "combobox-control");
	expect(input.parentElement).toHaveAttribute("data-size", "sm");
	input.focus();
	press("ArrowDown");
	await tick();
	expect(screen.getByRole("listbox")).toHaveAttribute("data-cui", "combobox-listbox");
	expect(screen.getByRole("listbox").parentElement).toHaveAttribute(
		"data-cui",
		"combobox-content",
	);
});

it("normalizes primitive options and maps object keys", () => {
	const fruits = createComboboxOptions(["Apple", "Banana"]);
	expect(fruits.options()).toEqual([
		{ value: "Apple", label: "Apple", disabled: false, item: "Apple" },
		{ value: "Banana", label: "Banana", disabled: false, item: "Banana" },
	]);
	const [list, setList] = createSignal<Language[]>(languages.slice(0, 1));
	const reactive = createComboboxOptions(list, { valueKey: "id", labelKey: "name" });
	expect(reactive.optionFromValue("ts")?.label).toBe("TypeScript");
	setList(languages.slice(3));
	expect(reactive.options().map(option => option.label)).toEqual(["Rust"]);
	expect(reactive.optionFromValue("ts")).toBeUndefined();
});
