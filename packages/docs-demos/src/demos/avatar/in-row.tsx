import { Avatar, Stack, Text } from "@codeui/kit";
import { For } from "solid-js";

const reviews = [
	{
		title: "Fix flaky hydration test",
		owner: "Grace Hopper",
		id: "user_grace",
		time: "2h",
	},
	{
		title: "Port the tooltip to Solid 2",
		owner: "Alan Turing",
		id: "user_alan",
		time: "5h",
	},
	{ title: "Draft the release notes", owner: undefined, id: undefined, time: "1d" },
];

export default function AvatarInRow() {
	return (
		<Stack gap="0" style={{ width: "100%", "max-width": "360px" }}>
			<For each={reviews}>
				{review => (
					<Stack
						direction="row"
						gap="2"
						align="center"
						style={{ "min-height": "var(--cui-control-height-sm)" }}
					>
						<Avatar
							size="xs"
							name={review.owner}
							identifier={review.id}
							unassigned={!review.owner}
						/>
						<Text style={{ flex: "1", "min-width": "0" }}>{review.title}</Text>
						<Text
							size="xs"
							tone="muted"
							style={{ "font-variant-numeric": "tabular-nums" }}
						>
							{review.time}
						</Text>
					</Stack>
				)}
			</For>
		</Stack>
	);
}
