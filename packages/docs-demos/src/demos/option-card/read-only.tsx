import { OptionCardGroup } from "@codeui/kit";
export default function ReadOnly() {
	return <OptionCardGroup label="Managed colour mode" description="Your workspace administrator manages this preference." defaultValue="system" readOnly items={[
		{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }, { value: "system", label: "System" },
	]} />;
}
