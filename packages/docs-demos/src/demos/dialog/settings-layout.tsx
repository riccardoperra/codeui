import { createSignal, For } from "solid-js";
import { Button, SegmentedControl, SegmentedControlItem, Switch } from "@codeui/kit";
import * as D from "@codeui/kit/dialog";
import { DownloadIcon, FlaskIcon, PaletteIcon, SlidersIcon } from "../build-settings/icons";
import "../build-settings/settings.css";

const sections = [
	{ name: "General", icon: SlidersIcon },
	{ name: "Appearance", icon: PaletteIcon },
	{ name: "Export", icon: DownloadIcon },
	{ name: "Experiments", icon: FlaskIcon },
] as const;

export default function DialogSettingsLayout() {
	const [section, setSection] = createSignal("General");
	return (
		<D.Root>
			<D.Trigger as={Button} theme="secondary">
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
										<D.NavItem
											icon={<item.icon />}
											current={section() === item.name}
											onClick={() => setSection(item.name)}
										>
											{item.name}
										</D.NavItem>
									)}
								</For>
							</D.Nav>
						</D.Sidebar>
						<D.Main>
							<D.Header>
								<D.Title>Settings / {section()}</D.Title>
								<D.CloseButton aria-label="Close settings" />
							</D.Header>
							<D.Body>
								<D.Section title="Editor">
									<div class="settings-demo-row" role="group" aria-label="Theme">
										<div class="settings-demo-row-text">
											<span class="settings-demo-row-title">Theme</span>
											<span class="settings-demo-row-description">Colours of the editor chrome.</span>
										</div>
										<SegmentedControl size="sm" defaultValue="dark" aria-label="Theme">
											<SegmentedControlItem value="light">Light</SegmentedControlItem>
											<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
											<SegmentedControlItem value="system">System</SegmentedControlItem>
										</SegmentedControl>
									</div>
									<div class="settings-demo-row" role="group" aria-label="Line numbers">
										<div class="settings-demo-row-text">
											<span class="settings-demo-row-title">Line numbers</span>
											<span class="settings-demo-row-description">Show a number before each line of code.</span>
										</div>
										<Switch aria-label="Line numbers" defaultChecked />
									</div>
								</D.Section>
							</D.Body>
						</D.Main>
					</D.Content>
				</D.Positioner>
			</D.Portal>
		</D.Root>
	);
}
