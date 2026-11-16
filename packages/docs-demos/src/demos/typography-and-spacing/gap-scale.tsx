import { Stack, Text, type Gap } from "@codeui/kit";
import { For } from "solid-js";

const gaps: Gap[] = ["0.5", "1", "1.5", "2", "3", "4", "6", "8"];

const chip = {
	width: "28px",
	height: "28px",
	"border-radius": "var(--cui-radius-nav)",
	background: "var(--cui-surface-input)",
} as const;

export default function GapScale() {
	return (
		<Stack gap="3">
			<For each={gaps}>
				{gap => (
					<Stack direction="row" gap="4" align="center">
						<Text size="xs" tone="hint" style={{ width: "40px" }}>
							{gap}
						</Text>
						<Stack direction="row" gap={gap}>
							<span style={chip} />
							<span style={chip} />
							<span style={chip} />
						</Stack>
					</Stack>
				)}
			</For>
		</Stack>
	);
}
