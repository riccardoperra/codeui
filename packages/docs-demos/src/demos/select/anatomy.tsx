import { createSignal } from "solid-js";
import { Select } from "@codeui/kit";

const fonts = ["JetBrains Mono", "Fira Code", "Source Code Pro"];

/** Open, with the list rendered under the trigger instead of on document.body. */
export default function SelectAnatomy() {
	const [list, setList] = createSignal<HTMLElement>();
	return (
		<div style={{ width: "260px" }}>
			<Select
				aria-label="Font"
				label="Font"
				description="Used by every new snippet."
				options={fonts}
				defaultValue="JetBrains Mono"
				validationState="invalid"
				errorMessage="This font has no ligatures."
				open
				mount={list()}
			/>
			<div ref={setList} />
		</div>
	);
}
