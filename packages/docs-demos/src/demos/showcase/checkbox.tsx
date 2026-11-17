import { Checkbox } from "@codeui/kit";
import "./showcase.css";

export default function EmailTopics() {
	return (
		<div class="showcase-group" role="group" aria-labelledby="showcase-email-topics" style={{ gap: "var(--cui-space-3)" }}>
			<p id="showcase-email-topics" class="showcase-group-label">
				Email me about
			</p>
			<Checkbox size="sm" label="Comments" description="Replies to your posts." defaultChecked />
			<Checkbox size="sm" label="Mentions" description="When someone tags you." defaultChecked />
			<Checkbox size="sm" label="Product updates" description="One email a month." />
		</div>
	);
}
