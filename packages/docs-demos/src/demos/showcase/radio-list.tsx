import { RadioList, RadioListItem } from "@codeui/kit";

export default function Visibility() {
	return (
		<RadioList size="sm" label="Visibility" description="Who can find this project." defaultValue="team">
			<RadioListItem value="public" label="Public" />
			<RadioListItem value="team" label="Team only" />
			<RadioListItem value="private" label="Private" />
		</RadioList>
	);
}
