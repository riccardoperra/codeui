import { Button, SettingsRow, Switch, TextField } from "@codeui/kit";
import * as D from "@codeui/kit/dialog/parts";
import { DownloadIcon, SlidersIcon } from "../build-settings/icons";

/**
 * Open and non-modal, with the scrim and panel drawn inside the figure instead of over the page. It
 * keeps focus where it is, so the page does not scroll to the figure.
 */
export default function DialogAnatomy() {
	return (
		<D.Root modal={false} open motion="none">
			<div style={{ display: "grid", gap: "var(--cui-space-3)", "justify-items": "center", width: "100%" }}>
				<D.Trigger as={Button} theme="secondary">
					Settings
				</D.Trigger>
				<div style={{ position: "relative", width: "100%", "max-width": "640px", "border-radius": "16px", overflow: "hidden" }}>
					<D.Overlay style={{ position: "absolute", "z-index": 0 }} />
					<D.Positioner style={{ position: "relative", inset: "auto", "z-index": 0, padding: "24px 12px" }}>
						<D.Content chrome="inset" style={{ width: "100%", height: "400px" }} onOpenAutoFocus={event => event.preventDefault()}>
							<D.Sidebar search={<TextField size="sm" aria-label="Search settings" placeholder="Search" />}>
								<D.Nav aria-label="Settings sections">
									<D.NavItem icon={<SlidersIcon />} current>
										General
									</D.NavItem>
									<D.NavItem icon={<DownloadIcon />}>Export</D.NavItem>
								</D.Nav>
							</D.Sidebar>
							<D.Main>
								<D.Header>
									<D.Title>Settings / General</D.Title>
									<D.CloseButton aria-label="Close settings" />
								</D.Header>
								<D.Description style={{ padding: "0 24px" }}>Changes apply at once.</D.Description>
								<D.Body>
									<D.Section title="Editor">
										<SettingsRow label="Line numbers" compactControl>
											{control => <Switch {...control} defaultChecked />}
										</SettingsRow>
									</D.Section>
								</D.Body>
								<D.Footer style={{ padding: "0 24px 16px" }}>
									<Button size="sm" theme="secondary">
										Done
									</Button>
								</D.Footer>
							</D.Main>
						</D.Content>
					</D.Positioner>
				</div>
			</div>
		</D.Root>
	);
}
