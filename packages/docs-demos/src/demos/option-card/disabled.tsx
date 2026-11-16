import { OptionCardGroup, Stack } from "@codeui/kit";
const items = [{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }, { value: "system", label: "System", disabled: true }];
export default function Disabled() {
	return <Stack gap="6">
		<OptionCardGroup label="Unavailable option" items={items} defaultValue="dark" />
		<OptionCardGroup label="Locked appearance" items={items} defaultValue="dark" disabled />
	</Stack>;
}
