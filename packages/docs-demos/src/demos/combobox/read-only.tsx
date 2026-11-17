import { Combobox } from "@codeui/kit";

export default function ComboboxReadOnlyDemo() {
	return (
		<Combobox
			label="Language"
			description="Detected from the file extension."
			options={["TypeScript", "Rust", "Python"]}
			defaultValue="Rust"
			readOnly
		/>
	);
}
