import { createSignal } from "solid-js";
import { Select } from "@codeui/kit";

const formats = ["PNG", "SVG", "JPEG", "WebP"];

export default function SelectMultipleDemo() {
	const [selected, setSelected] = createSignal(["PNG", "SVG"]);
	return (
		<Select<string>
			aria-label="Export formats"
			label="Export formats"
			placeholder="Choose formats"
			description="Each format downloads as a separate file."
			multiple
			options={formats}
			value={selected()}
			onChange={values => setSelected(values)}
			valueComponentMultiple={values => `${values().length} formats: ${values().join(", ")}`}
		/>
	);
}
