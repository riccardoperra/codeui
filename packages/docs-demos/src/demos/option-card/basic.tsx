import { OptionCardGroup } from "@codeui/kit";
export default function ColourMode() {
	return <OptionCardGroup label="Colour mode" defaultValue="dark" items={[
		{ value: "dark", label: "Dark", description: "A darker workspace", preview: <span aria-hidden="true">◐</span>, badge: "Default" },
		{ value: "light", label: "Light", description: "A brighter workspace", preview: <span aria-hidden="true">◯</span> },
		{ value: "system", label: "System", description: "Follow your device", preview: <span aria-hidden="true">◑</span> },
	]} />;
}
