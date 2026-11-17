import { OptionCardGroup, Stack, Text, type OptionCardEntry } from "@codeui/kit";
import { createSignal } from "solid-js";
type Mode = "dark" | "light" | "system";
export default function Controlled() {
	const [mode, setMode] = createSignal<Mode>("system");
	const items: readonly OptionCardEntry<Mode>[] = [{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }, { value: "system", label: "System" }];
	return <Stack><OptionCardGroup label="Colour mode" items={items} value={mode()} onChange={setMode} /><Text tone="muted">Saved mode: {mode()}</Text></Stack>;
}
