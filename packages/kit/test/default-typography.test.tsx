import { cleanup, render } from "solid-testing-library";
import { Checkbox } from "../src/components/CheckBox/CheckBox";
import { Listbox } from "../src/components/Listbox/Listbox";
import { Select } from "../src/components/Select/Select";
import { TextField } from "../src/components/TextField/TextField";

afterEach(cleanup);

it.each(["light", "dark"])("uses the default size's typography in %s mode", theme => {
	const { getByText } = render(() => (
		<div data-cui-theme={theme} style={{ "font-size": "23px" }}>
			<TextField label="Name" description="Full name" />
			<TextField size="sm" label="Name (sm)" description="Full name (sm)" />
			<Select label="Format" description="File format" options={["PNG"]} />
			<Select
				size="sm"
				label="Format (sm)"
				description="File format (sm)"
				options={["PNG"]}
			/>
			<Checkbox label="Preview" description="Show the preview" />
			<Checkbox size="md" label="Preview (md)" description="Show the preview (md)" />
			<Listbox aria-label="Formats" options={["PNG"]} />
			<Listbox size="sm" aria-label="Formats (sm)" options={["PNG (sm)"]} />
		</div>
	));

	for (const [implicit, explicit, expected] of [
		["Name", "Name (sm)", "14px"],
		["Full name", "Full name (sm)", "12px"],
		["Format", "Format (sm)", "14px"],
		["File format", "File format (sm)", "12px"],
		["Preview", "Preview (md)", "12px"],
		["Show the preview", "Show the preview (md)", "12px"],
		["PNG", "PNG (sm)", "16px"],
	]) {
		const explicitSize = getComputedStyle(getByText(explicit)).fontSize;
		expect(explicitSize, explicit).toBe(expected);
		expect(getComputedStyle(getByText(implicit)).fontSize, implicit).toBe(explicitSize);
	}
});
