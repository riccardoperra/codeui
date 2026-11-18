import { createSignal } from "solid-js";
import { Select } from "@codeui/kit/select";

const fonts = ["JetBrains Mono", "Fira Code", "Source Code Pro", "Cascadia Code"];

export default function SelectBasicDemo() {
	const [font, setFont] = createSignal("JetBrains Mono");
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
