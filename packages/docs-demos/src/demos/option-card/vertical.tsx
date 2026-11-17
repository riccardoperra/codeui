import { OptionCardGroup } from "@codeui/kit";
export default function Vertical() {
	return <OptionCardGroup label="Export appearance" orientation="vertical" defaultValue="window" items={[
		{ value: "window", label: "Window", description: "Include window controls" },
		{ value: "plain", label: "Plain", description: "Show the code alone" },
	]} />;
}
