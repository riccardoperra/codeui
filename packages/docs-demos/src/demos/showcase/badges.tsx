import { Badge, type BadgeProps } from "@codeui/kit";
import { For } from "solid-js";
import "./showcase.css";

const tones: [NonNullable<BadgeProps["tone"]>, string][] = [
	["neutral", "Draft"],
	["info", "Beta"],
	["success", "Active"],
	["warning", "Pending"],
	["danger", "Failed"],
];

export default function Badges() {
	return (
		<div class="showcase-stack">
			<For each={["soft", "outline"] as const}>
				{variant => (
					<div class="showcase-group">
						<p class="showcase-group-label">{variant === "soft" ? "Soft" : "Outline"}</p>
						<div class="showcase-row">
							<For each={tones}>{([tone, label]) => <Badge tone={tone} variant={variant}>{label}</Badge>}</For>
						</div>
					</div>
				)}
			</For>
		</div>
	);
}
