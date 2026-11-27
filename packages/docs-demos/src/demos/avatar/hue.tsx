import { Avatar, Stack, Text } from "@codeui/kit";

export default function AvatarHue() {
	return (
		<Stack gap="3">
			<Stack direction="row" gap="2" align="center">
				<Avatar size="sm" name="Sam Lee" identifier="user_1041" />
				<Avatar size="sm" name="Sam Lee" identifier="user_2288" />
				<Text size="xs" tone="muted">
					Two people named Sam Lee: two ids, two hues.
				</Text>
			</Stack>
			<Stack direction="row" gap="2" align="center">
				<Avatar size="sm" name="Sam Lee" identifier="user_1041" />
				<Avatar size="sm" name="Samantha Lee" identifier="user_1041" />
				<Text size="xs" tone="muted">
					One person who changed their name: one id, one hue.
				</Text>
			</Stack>
			<Stack direction="row" gap="2" align="center">
				<Avatar size="sm" name="Guest" />
				<Text size="xs" tone="muted">
					No id: a neutral fill.
				</Text>
			</Stack>
		</Stack>
	);
}
