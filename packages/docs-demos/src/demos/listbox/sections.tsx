import { Listbox } from "@codeui/kit";
const groups = [
	{ label: "Web", languages: ["TypeScript", "CSS"] },
	{ label: "Systems", languages: ["Rust", "Go"] },
];
export default function Sections() {
	return <Listbox<string, typeof groups[number]> aria-label="Language by category" options={groups} optionGroupChildren="languages" selectionMode="single" size="sm" renderSection={section => <li role="presentation">{section.rawValue.label}</li>} />;
}
