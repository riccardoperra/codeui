import { icons } from "@codeui/kit";
import * as C from "@codeui/kit/combobox";

type Language = { extension: string; name: string; description: string; legacy?: boolean };

const languages: Language[] = [
	{ extension: "ts", name: "TypeScript", description: ".ts and .mts files" },
	{ extension: "tsx", name: "TypeScript JSX", description: "React and Solid components" },
	{ extension: "js", name: "JavaScript", description: ".js, .mjs and .cjs files" },
	{ extension: "as", name: "ActionScript", description: "Legacy Flash projects", legacy: true },
	{ extension: "rs", name: "Rust", description: ".rs files" },
];

export default function ComboboxPartsDemo() {
	const options = C.createComboboxOptions(languages, {
		valueKey: "extension",
		labelKey: "name",
		disabledKey: "legacy",
	});
	return (
		<C.Root
			{...options.props()}
			defaultValue={options.optionFromValue("ts")}
			placeholder="Search languages"
			itemComponent={props => (
				<C.Item item={props.item}>
					<div>
						<C.ItemLabel>{props.item.rawValue.label}</C.ItemLabel>
						<C.ItemDescription>{props.item.rawValue.item.description}</C.ItemDescription>
					</div>
					<C.ItemIndicator>
						<icons.CheckIcon />
					</C.ItemIndicator>
				</C.Item>
			)}
		>
			<C.Label>Language</C.Label>
			<C.Control size="md">
				<C.Input />
				<C.Trigger aria-label="Show languages">
					<C.Icon>
						<icons.SelectorIcon />
					</C.Icon>
				</C.Trigger>
			</C.Control>
			<C.Description>Sets the syntax highlighting of the snippet.</C.Description>
			<C.Portal>
				<C.Content>
					<C.Listbox />
				</C.Content>
			</C.Portal>
		</C.Root>
	);
}
