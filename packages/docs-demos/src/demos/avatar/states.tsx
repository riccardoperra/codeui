import { Avatar, Stack, Text } from "@codeui/kit";
import { picture } from "./people";

export default function AvatarStates() {
	return (
		<Stack direction="row" gap="6" align="center">
			<Stack gap="2" align="center">
				<Avatar size="md" name="Ada Lovelace" identifier="user_ada" src={picture} />
				<Text size="xs" tone="muted">
					Picture
				</Text>
			</Stack>
			<Stack gap="2" align="center">
				<Avatar
					size="md"
					name="Ada Lovelace"
					identifier="user_ada"
					src="/missing-avatar.png"
				/>
				<Text size="xs" tone="muted">
					Picture failed
				</Text>
			</Stack>
			<Stack gap="2" align="center">
				<Avatar size="md" unassigned />
				<Text size="xs" tone="muted">
					Unassigned
				</Text>
			</Stack>
		</Stack>
	);
}
