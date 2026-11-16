import { Listbox } from "@codeui/kit";
const snippets = [{ id: "fetch", title: "Fetch with retries", disabled: false }, { id: "old", title: "Archived parser", disabled: true }];
export default function Customization() {
	return <Listbox aria-label="Saved snippets" options={snippets} optionValue="id" optionTextValue="title" optionDisabled="disabled" itemLabel={snippet => snippet.title} selectionMode="single" class="snippet-list" classes={{ item: "snippet-option", itemLabel: "snippet-label", itemIndicator: "snippet-check" }} size="sm" />;
}
