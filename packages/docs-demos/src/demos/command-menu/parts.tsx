import { createSignal, Show } from "solid-js";
import { Button, icons } from "@codeui/kit";
import * as M from "@codeui/kit/command-menu/parts";

type Command = { id: string; label: string; shortcut?: string; current?: boolean; disabled?: boolean };
type Group = { name: string; commands: Command[] };

const groups: Group[] = [
	{
		name: "Export",
		commands: [
			{ id: "png", label: "Export as PNG", shortcut: "⌘ E" },
			{ id: "svg", label: "Export as SVG" },
		],
	},
	{
		name: "Background",
		commands: [
			{ id: "gradient", label: "Gradient", current: true },
			{ id: "solid", label: "Solid color" },
			{ id: "image", label: "Image", disabled: true },
		],
	},
];

export default function PartsDemo() {
	const [open, setOpen] = createSignal(false);
	return (
		<M.Root open={open()} onOpenChange={setOpen}>
			<M.Trigger as={Button} variant="secondary">
				Open commands
			</M.Trigger>
			<M.Portal>
				<M.Content<Command, Group>
					options={groups}
					optionValue="id"
					optionTextValue="label"
					optionDisabled="disabled"
					optionGroupChildren="commands"
					onSelect={() => setOpen(false)}
					sectionComponent={section => (
						<M.Group>
							<M.GroupLabel>{section.section.rawValue.name}</M.GroupLabel>
						</M.Group>
					)}
					itemComponent={item => (
						<M.Item item={item.item}>
							<M.ItemLabel>{item.item.rawValue.label}</M.ItemLabel>
							<Show when={item.item.rawValue.current}>
								<M.ItemIndicator forceMount>
									<icons.CheckIcon />
								</M.ItemIndicator>
							</Show>
							<Show when={item.item.rawValue.shortcut}>
								{shortcut => <M.Shortcut>{shortcut()}</M.Shortcut>}
							</Show>
						</M.Item>
					)}
				>
					<M.Title>Commands</M.Title>
					<M.Search>
						<M.SearchInput aria-label="Search commands" placeholder="Search commands" />
						<M.Hint>↑↓ preview · ↵ apply · esc cancel</M.Hint>
					</M.Search>
					<M.Listbox aria-label="Commands" />
					<M.Empty>No command matches</M.Empty>
				</M.Content>
			</M.Portal>
		</M.Root>
	);
}
