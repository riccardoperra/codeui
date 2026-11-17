import { createSignal } from "solid-js";
import { Combobox, createComboboxOptions } from "@codeui/kit";

type Font = { id: string; name: string; ligatures: boolean; premium: boolean };

const fonts: Font[] = [
	{ id: "jetbrains-mono", name: "JetBrains Mono", ligatures: true, premium: false },
	{ id: "fira-code", name: "Fira Code", ligatures: true, premium: false },
	{ id: "source-code-pro", name: "Source Code Pro", ligatures: false, premium: false },
	{ id: "operator-mono", name: "Operator Mono", ligatures: false, premium: true },
];

export default function ComboboxOptionsHelperDemo() {
	const [fontId, setFontId] = createSignal<string | undefined>("fira-code");
	const fontOptions = createComboboxOptions(fonts, {
		valueKey: "id",
		labelKey: "name",
		disabledKey: "premium",
	});
	const font = () => fontOptions.optionFromValue(fontId())?.item;
	return (
		<>
			<Combobox
				{...fontOptions.props()}
				{...fontOptions.controlled(fontId, setFontId)}
				label="Font"
				placeholder="Search fonts"
			/>
			<p>
				{font() ? `${font()!.name}, ligatures ${font()!.ligatures ? "on" : "off"}` : "No font"}
			</p>
		</>
	);
}
