import { createSignal, For, Show } from "solid-js";
import { Button, SettingsGroup, SettingsRow, Switch } from "@codeui/kit";
import * as D from "@codeui/kit/dialog/parts";
import { DownloadIcon, FlaskIcon, PaletteIcon, SlidersIcon } from "../build-settings/icons";

const sections = [
	{ name: "General", icon: SlidersIcon, group: "Editor", label: "Line numbers", description: "Show a number before each line of code." },
	{ name: "Appearance", icon: PaletteIcon, group: "Motion", label: "Reduce motion", description: "Fade overlays instead of moving them." },
	{ name: "Export", icon: DownloadIcon, group: "Image", label: "Transparent background", description: "Keep the area outside the frame clear." },
	{ name: "Experiments", icon: FlaskIcon, group: "Rendering engine", label: "Takumi", description: "Use the experimental Takumi engine for image exports." },
];

export default function DialogSettingsLayout() {
	const [current, setCurrent] = createSignal(sections[0]);
	return (
		<D.Root>
			<D.Trigger as={Button} variant="secondary">
				Open settings
			</D.Trigger>
			<D.Portal>
				<D.Overlay />
				<D.Positioner size="settings">
					<D.Content size="settings" chrome="inset">
						<D.Sidebar>
							<D.Nav aria-label="Settings sections">
								<For each={sections}>
									{item => (
										<D.NavItem icon={<item.icon />} current={current() === item} onClick={() => setCurrent(item)}>
											{item.name}
										</D.NavItem>
									)}
								</For>
							</D.Nav>
						</D.Sidebar>
						<D.Main>
							<D.Header>
								<D.Title>Settings / {current().name}</D.Title>
								<D.CloseButton aria-label="Close settings" />
							</D.Header>
							<D.Body>
								{/* Keyed, so each section gets its own switch. */}
								<Show when={current()} keyed>
									{item => (
										<SettingsGroup title={item.group}>
											<SettingsRow label={item.label} description={item.description} compactControl>
												{control => <Switch {...control} />}
											</SettingsRow>
										</SettingsGroup>
									)}
								</Show>
							</D.Body>
						</D.Main>
					</D.Content>
				</D.Positioner>
			</D.Portal>
		</D.Root>
	);
}
