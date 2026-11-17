import { Alert, type AlertProps } from "@codeui/kit";
import { For } from "solid-js";
import "./showcase.css";

const alerts: [NonNullable<AlertProps["tone"]>, string, string][] = [
	["neutral", "Scheduled maintenance", "The workspace is read-only on Sunday from 02:00."],
	["info", "New sign-in", "Your account was opened from a new browser."],
	["success", "Payment received", "Your plan renews on 1 December."],
	["warning", "Storage almost full", "You have used 92% of your space."],
	["danger", "Sync failed", "Check your connection and try again."],
];

export default function Alerts() {
	return (
		<div class="showcase-stack" style={{ gap: "var(--cui-space-2)" }}>
			<For each={alerts}>
				{([tone, title, text]) => (
					<Alert tone={tone} showIcon title={title} fluid>
						{text}
					</Alert>
				)}
			</For>
		</div>
	);
}
