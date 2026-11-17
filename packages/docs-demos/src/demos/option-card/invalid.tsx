import { OptionCardGroup } from "@codeui/kit";
export default function Invalid() {
	return <OptionCardGroup label="Colour mode" required validationState="invalid" errorMessage="Choose a colour mode." items={[
		{ value: "dark", label: "Dark" }, { value: "light", label: "Light" },
	]} />;
}
