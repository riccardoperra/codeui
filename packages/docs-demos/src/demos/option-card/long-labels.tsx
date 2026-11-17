import { OptionCardGroup } from "@codeui/kit";
export default function LongLabels() {
	return <OptionCardGroup label="Appearance" defaultValue="device" items={[
		{ value: "device", label: "Match the colour mode selected in your device settings", description: "The workspace follows your device when its appearance changes.", badge: "Default" },
		{ value: "fixed", label: "Keep the workspace dark throughout the day", description: "Exported snippets keep their own theme." },
	]} />;
}
