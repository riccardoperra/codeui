import { Avatar, Stack } from "@codeui/kit";
import { picture } from "./people";

export default function AvatarAnatomy() {
	return (
		<Stack direction="row" gap="4" align="center">
			<Avatar size="lg" name="Grace Hopper" identifier="user_grace" tooltip={false} />
			<Avatar
				size="lg"
				name="Ada Lovelace"
				identifier="user_ada"
				src={picture}
				tooltip={false}
			/>
		</Stack>
	);
}
