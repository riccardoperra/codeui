import { Button, OptionCardGroup, SegmentedControl, SegmentedControlItem, Stack, Switch, Text } from "@codeui/kit";
import * as Dialog from "@codeui/kit/dialog";
import { createSignal, Show } from "solid-js";
import ColourMode from "../option-card/basic";
import Navigation from "../option-card/navigation";
import Themes from "../option-card/themes";
import "./settings.css";

export default function Settings() {
	const [section, setSection] = createSignal("appearance");
	return <Dialog.Root>
		<Dialog.Trigger as={Button}>Open settings</Dialog.Trigger>
		<Dialog.Portal><Dialog.Overlay /><Dialog.Positioner size="xl"><Dialog.Content size="xl">
			<Dialog.Header><Dialog.Title>Settings</Dialog.Title><Dialog.CloseButton aria-label="Close settings" /></Dialog.Header>
			<Dialog.Description>Choose your workspace appearance and export defaults.</Dialog.Description>
			<Dialog.Body><div class="settings-demo-layout">
				<Stack as="nav" aria-label="Settings sections" gap="2">
					<Button theme="secondary" aria-current={section() === "appearance" ? "page" : undefined} onClick={() => setSection("appearance")}>Appearance</Button>
					<Button theme="secondary" aria-current={section() === "export" ? "page" : undefined} onClick={() => setSection("export")}>Export</Button>
				</Stack>
				<Stack gap="6" class="settings-demo-content">
					<Show when={section() === "appearance"} fallback={<>
						<Text as="h3" size="md">Export</Text>
						<Stack class="settings-demo-island" gap="0">
							<Stack class="settings-demo-row"><Stack gap="1"><Text>Export scale</Text><Text size="xs" tone="muted">Set the resolution of saved images.</Text></Stack><SegmentedControl aria-label="Export scale" defaultValue="2"><SegmentedControlItem value="1">1×</SegmentedControlItem><SegmentedControlItem value="2">2×</SegmentedControlItem><SegmentedControlItem value="4">4×</SegmentedControlItem></SegmentedControl></Stack>
							<Stack class="settings-demo-row"><Stack gap="1"><Text>Transparent background</Text><Text size="xs" tone="muted">Keep the area outside the snippet clear.</Text></Stack><Switch aria-label="Transparent background" /></Stack>
						</Stack>
					</>}>
						<Text as="h3" size="md">Appearance</Text>
						<Stack class="settings-demo-island" gap="6"><ColourMode /><Navigation /><Themes /></Stack>
						<Stack class="settings-demo-island"><OptionCardGroup label="Editor font" defaultValue="mono" items={[{ value: "mono", label: "JetBrains Mono" }, { value: "system", label: "System monospace" }]} /></Stack>
					</Show>
				</Stack>
			</div></Dialog.Body>
		</Dialog.Content></Dialog.Positioner></Dialog.Portal>
	</Dialog.Root>;
}
