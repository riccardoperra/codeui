import { comboboxStyles } from "@codeui/kit/combobox/parts";

export default function ComboboxStylesDemo() {
	return (
		<div class={comboboxStyles.root()}>
			<span class={comboboxStyles.label()}>Detected language</span>
			<div class={comboboxStyles.control()} data-size="sm">
				<output class={comboboxStyles.input()}>TypeScript</output>
			</div>
		</div>
	);
}
