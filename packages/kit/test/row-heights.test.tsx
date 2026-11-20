import { cleanup, render, waitFor } from "@solidjs/testing-library";
import { createSignal, createStore } from "solid-js";
import { Listbox } from "../src/components/Listbox/Listbox";
import { VirtualizedListbox } from "../src/components/Listbox/VirtualizedListbox";
import { Select } from "../src/components/Select/Select";
import * as Menu from "../src/parts/dropdown-menu";

afterEach(cleanup);

const options = ["PNG", "SVG"];

async function expectRows(
	container: Element,
	selector: string,
	count: number,
	height: number,
) {
	await waitFor(() => {
		const rows = container.querySelectorAll(selector);
		expect(rows, selector).toHaveLength(count);
		for (const row of rows)
			expect(row.getBoundingClientRect().height, selector).toBe(height);
	});
}

describe.each([
	["comfortable", 36],
	["compact", 32],
	["touch", 40],
] as const)("%s row density", (density, height) => {
	it("sizes Select options in the portal scope", async () => {
		const { container } = render(() => {
			let scope!: HTMLDivElement;
			return (
				<div ref={scope} data-cui-density={density}>
					<Select aria-label="Export format" options={options} open mount={scope} />
				</div>
			);
		});
		await expectRows(container, ".cui-select-item", 2, height);
	});

	it("sizes Listbox rows regardless of their typography size", async () => {
		const { container } = render(() => (
			<div data-cui-density={density}>
				<Listbox aria-label="File format" options={options} />
				<Listbox aria-label="Compact labels" size="xs" options={options} />
			</div>
		));
		await expectRows(container, ".cui-listbox-item", 4, height);
	});

	it("sizes DropdownMenu rows", async () => {
		const { container } = render(() => (
			<div data-cui-density={density}>
				<Menu.Root open modal={false}>
					<Menu.Trigger>Actions</Menu.Trigger>
					<Menu.Content>
						<Menu.Item>Copy</Menu.Item>
					</Menu.Content>
				</Menu.Root>
			</div>
		));
		await expectRows(container, '[role="menuitem"]', 1, height);
	});
});

it("repositions virtualized rows when density changes", async () => {
	const [density, setDensity] = createSignal<"compact" | "touch">("compact");
	const { container } = render(() => (
		<div data-cui-density={density()}>
			<style>{".virtualized-row-test { height: 120px; overflow: auto; }"}</style>
			<VirtualizedListbox
				aria-label="File format"
				options={options.map(value => ({ value, label: value }))}
				class="virtualized-row-test"
				size="xs"
			/>
		</div>
	));
	const expectSpacing = (height: number) =>
		waitFor(() => {
			const [first, second] = container.querySelectorAll('[role="option"]');
			expect(first.getBoundingClientRect().height).toBe(height);
			expect(second.getBoundingClientRect().top - first.getBoundingClientRect().top).toBe(
				height,
			);
		});

	await expectSpacing(32);
	setDensity("touch");
	await expectSpacing(40);
});

it("renders new virtualized options when the row count stays the same", async () => {
	const [formats, setFormats] = createStore(
		options.map(value => ({ value, label: value })),
	);
	const { findByRole, queryByRole } = render(() => (
		<>
			<style>{".virtualized-row-test { height: 120px; overflow: auto; }"}</style>
			<VirtualizedListbox
				aria-label="File format"
				options={formats}
				class="virtualized-row-test"
			/>
		</>
	));

	await findByRole("option", { name: "PNG" });
	setFormats(draft => {
		draft[0] = { value: "WebP", label: "WebP" };
	});
	await findByRole("option", { name: "WebP" });
	expect(queryByRole("option", { name: "PNG" })).toBeNull();
});
