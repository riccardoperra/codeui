import { For } from "solid-js";
import { Select } from "@codeui/kit";

const sizes = ["xs", "sm", "md", "lg"] as const;
const fonts = ["JetBrains Mono", "Fira Code", "Source Code Pro"];

export default function SelectSizesDemo() {
	return (
		<For each={sizes}>
			{size => (
				<Select
					aria-label={`Font, size ${size}`}
					label={`Size ${size}`}
					options={fonts}
					defaultValue="JetBrains Mono"
					size={size}
				/>
			)}
		</For>
	);
}
