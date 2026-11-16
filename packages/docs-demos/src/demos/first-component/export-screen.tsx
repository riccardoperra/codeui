import { createSignal } from "solid-js";
import { Button, Stack, Text, TextField } from "@codeui/kit";
export default function ExportScreen() {
	const [name, setName] = createSignal("Fetch example");
	const [saved, setSaved] = createSignal(false);
	return <Stack gap="4" style={{ padding: "var(--cui-space-4)", background: "var(--cui-surface-canvas)", "border-radius": "var(--cui-radius-card)", width: "100%", "max-width": "360px" }}>
		<Text as="h2" size="md" weight="semibold">Export snippet</Text>
		<TextField label="Snippet name" value={name()} onChange={value => { setName(value); setSaved(false); }} />
		<Text size="xs" tone="muted">Save a PNG for your documentation.</Text>
		<Stack direction="row"><Button theme="primary" disabled={!name().trim()} onClick={() => setSaved(true)}>Save export settings</Button></Stack>
		<Text size="xs" tone="muted" role="status">{saved() ? `Settings saved for ${name()}.` : "Settings are ready to save."}</Text>
	</Stack>;
}
