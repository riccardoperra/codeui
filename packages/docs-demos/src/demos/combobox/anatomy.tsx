import { icons } from "@codeui/kit";
import * as C from "@codeui/kit/combobox/parts";

type Language = { extension: string; name: string; description: string };
type Group = { label: string; options: Language[] };

const groups: Group[] = [
	{
		label: "Web",
		options: [
			{ extension: "ts", name: "TypeScript", description: ".ts and .mts files" },
			{ extension: "js", name: "JavaScript", description: ".js and .mjs files" },
		],
	},
];

/** Open, with the list rendered inline instead of in a portal. */
export default function ComboboxAnatomy() {
	return (
		<div style={{ width: "280px" }}>
			<C.Root<Language, Group>
				options={groups}
				optionValue="extension"
				optionTextValue="name"
				optionLabel="name"
				optionGroupChildren="options"
				defaultValue={groups[0].options[0]}
				placeholder="Search languages"
				validationState="invalid"
				open
				sectionComponent={props => <C.Section>{props.section.rawValue.label}</C.Section>}
				itemComponent={props => (
					<C.Item item={props.item}>
						<div>
							<C.ItemLabel>{props.item.rawValue.name}</C.ItemLabel>
							<C.ItemDescription>{props.item.rawValue.description}</C.ItemDescription>
						</div>
						<C.ItemIndicator>
							<icons.CheckIcon />
						</C.ItemIndicator>
					</C.Item>
				)}
			>
				<C.HiddenSelect />
				<C.Label>Language</C.Label>
				<C.Control size="md">
					<C.Input />
					<C.Trigger aria-label="Show languages">
						<C.Icon>
							<icons.SelectorIcon />
						</C.Icon>
					</C.Trigger>
				</C.Control>
				<C.Description>Sets the syntax highlighting.</C.Description>
				<C.ErrorMessage>This language has no grammar.</C.ErrorMessage>
				<C.Content>
					<C.Arrow />
					<C.Listbox />
				</C.Content>
			</C.Root>
		</div>
	);
}
