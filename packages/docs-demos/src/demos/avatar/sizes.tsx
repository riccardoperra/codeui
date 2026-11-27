import { Avatar, Stack, Text } from "@codeui/kit";
import { For } from "solid-js";

export default function AvatarSizes() {
	return (
		<Stack gap="3">
			<For each={["compact", "comfortable", "touch"] as const}>
				{density => (
					<Stack direction="row" gap="3" align="center" data-cui-density={density}>
						<Text size="xs" tone="muted" style={{ width: "6rem" }}>
							{density}
						</Text>
						<For each={["xs", "sm", "md", "lg"] as const}>
							{size => <Avatar size={size} name="Grace Hopper" identifier="user_grace" />}
						</For>
					</Stack>
				)}
			</For>
		</Stack>
	);
}
