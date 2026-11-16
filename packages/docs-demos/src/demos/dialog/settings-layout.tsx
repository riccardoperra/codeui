import { createSignal, For } from "solid-js";
import { Button, SegmentedControl, SegmentedControlItem, Switch } from "@codeui/kit";
import * as D from "@codeui/kit/dialog";
import "./settings-layout.css";

const sections = ["Appearance", "Editor", "Export", "Experiments"] as const;

export default function DialogSettingsLayout() {
	const [section, setSection] = createSignal<(typeof sections)[number]>("Editor");
	const [theme, setTheme] = createSignal("dark");
	return (
		<D.Root>
			<D.Trigger as={Button} theme="secondary">
				Open settings
			</D.Trigger>
			<D.Portal>
				<D.Overlay />
				<D.Positioner size="lg">
					<D.Content size="lg" class="settings-demo-panel">
						<D.Header>
							<D.Title class="settings-demo-breadcrumb">
								<span data-crumb="parent">Settings</span>
								<span aria-hidden="true">/</span>
								<span>{section()}</span>
							</D.Title>
							<D.CloseButton aria-label="Close settings" />
						</D.Header>
						<div class="settings-demo-columns">
							<nav class="settings-demo-nav" aria-label="Settings sections">
								<For each={sections}>
									{item => (
										<button
											type="button"
											aria-current={section() === item ? "page" : undefined}
											onClick={() => setSection(item)}
										>
											{item}
										</button>
									)}
								</For>
							</nav>
							<D.Body>
								<div class="settings-demo-row">
									<div>
										<div>Theme</div>
										<p>Colors of the editor chrome.</p>
									</div>
									<SegmentedControl size="sm" value={theme()} onChange={setTheme} aria-label="Theme">
										<SegmentedControlItem value="light">Light</SegmentedControlItem>
										<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
										<SegmentedControlItem value="system">System</SegmentedControlItem>
									</SegmentedControl>
								</div>
								<div class="settings-demo-row">
									<div>
										<div>Line numbers</div>
										<p>Show a number before each line of code.</p>
									</div>
									<Switch aria-label="Line numbers" defaultChecked />
								</div>
							</D.Body>
						</div>
					</D.Content>
				</D.Positioner>
			</D.Portal>
		</D.Root>
	);
}
