import { OptionCardGroup } from "@codeui/kit";
import { createSignal } from "solid-js";

// Before, with @codeimage/ui: one <RadioBlock> per choice, with click
// handlers on a div. OptionCardGroup renders real radio inputs, so arrow
// keys, Space, and form submission work.
export default function WindowStyle() {
	const [style, setStyle] = createSignal("mac");
	return (
		<OptionCardGroup
			label="Window style"
			value={style()}
			onChange={setStyle}
			items={[
				{ value: "mac", label: "macOS", description: "Traffic lights on the left" },
				{ value: "windows", label: "Windows", description: "Controls on the right" },
				{ value: "none", label: "None", description: "No window chrome" },
			]}
		/>
	);
}
