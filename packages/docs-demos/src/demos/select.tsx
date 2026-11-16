import { createSignal } from "solid-js";
import { Select } from "@codeui/kit";

const fonts = ["Jetbrains Mono", "Fira Code", "Source Code Pro", "Cascadia Code"];

export default function SelectDemo() {
	const [font, setFont] = createSignal("Jetbrains Mono");
	return (
		<Select
			aria-label="Font"
			label="Font"
			placeholder="Choose a font"
			options={fonts}
			value={font()}
			onChange={value => value && setFont(value)}
		/>
	);
}
