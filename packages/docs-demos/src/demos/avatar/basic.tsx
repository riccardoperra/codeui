import { Avatar, Stack } from "@codeui/kit";
import { picture } from "./people";

export default function AvatarBasic() {
	return (
		<Stack direction="row" gap="2" align="center">
			<Avatar size="sm" name="Ada Lovelace" identifier="user_ada" src={picture} />
			<Avatar size="sm" name="Grace Hopper" identifier="user_grace" />
			<Avatar size="sm" name="Alan Turing" identifier="user_alan" />
			<Avatar size="sm" unassigned />
		</Stack>
	);
}
