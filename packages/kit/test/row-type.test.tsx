import { cleanup, render, waitFor } from "solid-testing-library";
import { Checkbox } from "../src/components/CheckBox/CheckBox";
import { Listbox } from "../src/components/Listbox/Listbox";
import { Select } from "../src/components/Select/Select";

afterEach(cleanup);

const options = ["PNG", "SVG"];

// DESIGN.md §4: menu items and row titles use the 14px Label style.
it("uses the 14px Label style for sm Listbox and Select options", async () => {
	const { container } = render(() => {
		let scope!: HTMLDivElement;
		return (
			<div ref={scope}>
				<Listbox aria-label="File format" size="sm" options={options} />
				<Select aria-label="Export format" size="sm" options={options} open mount={scope} />
			</div>
		);
	});
	await waitFor(() => {
		const rows = container.querySelectorAll(".cui-listbox-item, .cui-select-item");
		expect(rows).toHaveLength(4);
		for (const row of rows) expect(getComputedStyle(row).fontSize).toBe("14px");
	});
});

it.each(["sm", "md"] as const)("uses the 14px Label style for %s Checkbox labels", size => {
	const { getByText } = render(() => <Checkbox size={size} label="Show line numbers" />);
	const label = getComputedStyle(getByText("Show line numbers"));
	expect(label.fontSize).toBe("14px");
	expect(label.lineHeight).toBe("18.2px");
});
