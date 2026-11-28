import { userEvent } from "vitest/browser";
import { cleanup, render, screen, within } from "@solidjs/testing-library";
import { Table, TableScrollArea, type TableSize } from "../src/components/Table/Table";

afterEach(cleanup);

function Releases(props: { size?: TableSize; striped?: boolean }) {
	return (
		<Table size={props.size} striped={props.striped}>
			<caption>Releases</caption>
			<thead>
				<tr>
					<th scope="col">Version</th>
					<th scope="col">Downloads</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">0.1.0</th>
					<td>1,204</td>
				</tr>
				<tr>
					<th scope="row">0.2.0</th>
					<td>988</td>
				</tr>
				<tr>
					<th scope="row">0.3.0</th>
					<td>17</td>
				</tr>
			</tbody>
		</Table>
	);
}

const height = (element: Element) => element.getBoundingClientRect().height;
const fill = (element: Element) => getComputedStyle(element).backgroundColor;
const transparent = "rgba(0, 0, 0, 0)";

describe("Table", () => {
	it("keeps native table semantics without wrappers", () => {
		render(() => <Releases />);
		const table = screen.getByRole("table", { name: "Releases" });
		expect(
			within(table)
				.getAllByRole("columnheader")
				.map(cell => cell.textContent),
		).toEqual(["Version", "Downloads"]);
		expect(within(table).getAllByRole("rowheader")).toHaveLength(3);
		expect(within(table).getByRole("cell", { name: "988" })).toBeInTheDocument();
		expect(within(table).getAllByRole("row")).toHaveLength(4);
	});

	it("passes native attributes and merges class and classes.root on the table", () => {
		render(() => (
			<Table
				id="releases"
				aria-describedby="note"
				class="own"
				classes={{ root: "keyed" }}
			>
				<tbody>
					<tr>
						<td>1</td>
					</tr>
				</tbody>
			</Table>
		));
		const table = screen.getByRole("table");
		expect(table).toHaveAttribute("id", "releases");
		expect(table).toHaveAttribute("aria-describedby", "note");
		expect(table).toHaveClass("own", "keyed");
	});

	it("marks the size and stripes on the table for app CSS", () => {
		render(() => (
			<>
				<Releases />
				<Releases size="sm" striped />
			</>
		));
		const [plain, dense] = screen.getAllByRole("table");
		expect(plain).toHaveAttribute("data-size", "md");
		expect(plain).not.toHaveAttribute("data-striped");
		expect(dense).toHaveAttribute("data-size", "sm");
		expect(dense).toHaveAttribute("data-striped");
	});

	describe.each([
		["comfortable", 36, 28],
		["compact", 32, 24],
		["touch", 40, 32],
	] as const)("%s density", (density, md, sm) => {
		it("sizes single-line rows to the control height of each table size", () => {
			render(() => (
				<div data-cui-density={density}>
					<Releases />
					<Releases size="sm" />
				</div>
			));
			const [medium, small] = screen.getAllByRole("table");
			for (const row of within(medium).getAllByRole("row")) expect(height(row)).toBe(md);
			for (const row of within(small).getAllByRole("row")) expect(height(row)).toBe(sm);
		});
	});

	it("grows a row for wrapped text", () => {
		render(() => (
			<div style={{ width: "160px" }}>
				<Table>
					<tbody>
						<tr>
							<td>A description long enough to wrap onto several lines</td>
						</tr>
					</tbody>
				</Table>
			</div>
		));
		expect(height(screen.getByRole("row"))).toBeGreaterThan(36);
	});

	it("fills the header and, when striped, every second body row", () => {
		render(() => (
			<>
				<Releases />
				<Releases striped />
			</>
		));
		const [plain, striped] = screen.getAllByRole("table");
		const header = within(plain).getByRole("columnheader", { name: "Version" });
		expect(fill(header)).not.toBe(transparent);
		for (const cell of within(plain).getAllByRole("rowheader"))
			expect(fill(cell)).toBe(transparent);

		const [first, second, third] = within(striped).getAllByRole("rowheader").map(fill);
		expect(first).toBe(transparent);
		expect(second).not.toBe(transparent);
		expect(second).not.toBe(fill(header));
		expect(third).toBe(transparent);
	});

	it("uses tabular numbers", () => {
		render(() => <Releases />);
		expect(
			getComputedStyle(screen.getByRole("cell", { name: "988" })).fontVariantNumeric,
		).toBe("tabular-nums");
	});

	it("keeps Markdown column alignment and starts unaligned headers", () => {
		render(() => (
			<Table>
				<thead>
					<tr>
						<th>Name</th>
						<th style={{ "text-align": "right" }}>Size</th>
						<th align="center">Type</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>a</td>
						<td style={{ "text-align": "right" }}>12</td>
						<td align="center">png</td>
					</tr>
				</tbody>
			</Table>
		));
		const align = (name: string) => getComputedStyle(screen.getByText(name)).textAlign;
		expect(align("Name")).toBe("start");
		expect(align("Size")).toBe("right");
		expect(align("Type")).toMatch(/center$/);
		expect(align("12")).toBe("right");
		expect(align("png")).toMatch(/center$/);
	});

	it("does not pass its size or stripes to a nested table", () => {
		render(() => (
			<Table size="sm" striped aria-label="Outer">
				<tbody>
					<tr>
						<td>one</td>
					</tr>
					<tr>
						<td>
							<table aria-label="Native">
								<tbody>
									<tr>
										<td>a</td>
									</tr>
									<tr>
										<td>b</td>
									</tr>
								</tbody>
							</table>
							<Table aria-label="Kit">
								<tbody>
									<tr>
										<td>c</td>
									</tr>
									<tr>
										<td>d</td>
									</tr>
								</tbody>
							</Table>
						</td>
					</tr>
				</tbody>
			</Table>
		));
		const native = screen.getByRole("table", { name: "Native" });
		const kit = screen.getByRole("table", { name: "Kit" });
		expect(fill(within(native).getByText("b"))).toBe(transparent);
		expect(getComputedStyle(within(native).getByText("b")).paddingInlineStart).toBe(
			"1px",
		);
		expect(fill(within(kit).getByText("d"))).toBe(transparent);
		for (const row of within(kit).getAllByRole("row")) expect(height(row)).toBe(36);
	});
});

describe("TableScrollArea", () => {
	function Wide(props: { label?: string }) {
		return (
			<div style={{ width: "240px" }}>
				<TableScrollArea
					aria-label={props.label}
					class="own"
					classes={{ scrollArea: "keyed" }}
				>
					<Table>
						<tbody>
							<tr>
								<td style={{ "white-space": "nowrap" }}>{"A long value ".repeat(12)}</td>
							</tr>
						</tbody>
					</Table>
				</TableScrollArea>
			</div>
		);
	}

	it("scrolls a wide table inside its own box", () => {
		render(() => <Wide label="Wide table" />);
		const area = screen.getByRole("region", { name: "Wide table" });
		expect(area.scrollWidth).toBeGreaterThan(area.clientWidth);
		expect(area.getBoundingClientRect().width).toBe(240);
		expect(area).toHaveClass("own", "keyed");
	});

	it("lets the keyboard reach and scroll a labelled area", async () => {
		render(() => (
			<>
				<button>Before</button>
				<Wide label="Wide table" />
			</>
		));
		screen.getByRole("button", { name: "Before" }).focus();
		await userEvent.tab();
		const area = screen.getByRole("region", { name: "Wide table" });
		expect(area).toHaveFocus();
		await userEvent.keyboard("{ArrowRight}");
		await expect.poll(() => area.scrollLeft).toBeGreaterThan(0);
	});

	it("adds no region or focus stop without a name", () => {
		const { container } = render(() => <Wide />);
		const area = container.querySelector('[data-cui="table-scroll-area"]')!;
		expect(screen.queryByRole("region")).not.toBeInTheDocument();
		expect(area).not.toHaveAttribute("tabindex");
	});
});
