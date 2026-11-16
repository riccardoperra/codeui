import { Badge, type Gap, Stack, Text } from "@codeui/kit";
import { For } from "solid-js";

const gaps: Gap[] = [
	"0",
	"px",
	"0.5",
	"1",
	"1.5",
	"2",
	"3",
	"4",
	"6",
	"8",
	"10",
	"12",
	"16",
	"20",
	"24",
	"32",
	"40",
	"48",
	"56",
	"64",
];

export default function StackGap() {
	return (
		<Stack gap="2">
			<For each={gaps}>
				{gap => (
					<Stack direction="row" gap="4" align="center">
						<Text size="xs" tone="muted" style={{ width: "3rem" }}>
							{gap}
						</Text>
						<Stack direction="row" gap={gap}>
							<Badge>PNG</Badge>
							<Badge>SVG</Badge>
						</Stack>
					</Stack>
				)}
			</For>
		</Stack>
	);
}
