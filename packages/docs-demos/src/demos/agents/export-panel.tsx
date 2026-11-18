import { Button, createToaster, Select, Stack, Switch, Text, Toaster } from "@codeui/kit";
import { createSignal } from "solid-js";
import "./export-panel.css";

const formats = ["PNG", "SVG", "JPEG"];

export default function ExportPanel() {
	const notifications = createToaster();
	const [format, setFormat] = createSignal("PNG");
	const [lineNumbers, setLineNumbers] = createSignal(true);

	return (
		<Stack as="section" gap="4" class="export-panel" aria-labelledby="export-title">
			<Text as="h3" id="export-title" size="md" weight="semibold">
				Export snippet
			</Text>
			<Select
				aria-label="Format"
				label="Format"
				options={formats}
				value={format()}
				onChange={value => value && setFormat(value)}
			/>
			<Switch label="Show line numbers" checked={lineNumbers()} onChange={setLineNumbers} />
			<Button
				variant="primary"
				onClick={() =>
					notifications.show({ tone: "success", description: `hello-world.${format().toLowerCase()} exported` })
				}
			>
				Export
			</Button>
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</Stack>
	);
}
