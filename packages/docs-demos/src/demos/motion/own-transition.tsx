import { Text } from "@codeui/kit";
import { For } from "solid-js";
import "./own-transition.css";

const snippets = ["fibonacci.ts", "server.go", "styles.css"];

export default function OwnTransition() {
	return (
		<div style={{ width: "100%", "max-width": "320px" }}>
			<For each={snippets}>
				{name => (
					<div
						class="snippet-row"
						style={{
							padding: "var(--cui-space-2) var(--cui-space-3)",
							"border-radius": "var(--cui-radius-nav)",
						}}
					>
						<Text size="sm">{name}</Text>
					</div>
				)}
			</For>
		</div>
	);
}
