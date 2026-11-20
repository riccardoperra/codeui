import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { expect, within } from "storybook/test";
import {
	Button,
	type CommandItem,
	CommandMenu,
	CommandMenuParts,
	icons,
} from "@codeui/kit";
import * as M from "@codeui/kit/command-menu/parts";
import { createSignal, Show } from "solid-js";
import { type JSX } from "@solidjs/web";

const meta = {
	title: "DesignSystem/CommandMenu",
	component: CommandMenu,
} satisfies Meta<typeof CommandMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

type Command = {
	id: string;
	label: string;
	orb?: [string, string];
	shortcut?: string;
	current?: boolean;
	disabled?: boolean;
};
type Group = { name: string; commands: Command[] };

const groups: Group[] = [
	{
		name: "Actions",
		commands: [
			{ id: "randomize", label: "Randomize theme and style" },
			{ id: "shortcuts", label: "Keyboard shortcuts", shortcut: "?" },
			{ id: "highlight", label: "Highlight lines", shortcut: "⌘ ⌥ 1" },
		],
	},
	{
		name: "Themes",
		commands: [
			{ id: "vercel", label: "Vercel", orb: ["#0a0a0a", "#ededed"], current: true },
			{ id: "dracula", label: "Dracula", orb: ["#282a36", "#ff79c6"] },
			{ id: "nord", label: "Nord", orb: ["#2e3440", "#88c0d0"] },
			{
				id: "legacy",
				label: "Legacy light",
				orb: ["#ffffff", "#999999"],
				disabled: true,
			},
		],
	},
];

function SearchIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<circle cx="7" cy="7" r="4.25" />
			<path d="m10.25 10.25 3.25 3.25" />
		</svg>
	);
}

function Orb(props: { colors: [string, string] }) {
	return (
		<span
			style={{
				width: "16px",
				height: "16px",
				"border-radius": "50%",
				background: `linear-gradient(135deg, ${props.colors[0]} 50%, ${props.colors[1]} 50%)`,
				"box-shadow": "inset 0 0 0 1px rgb(127 127 127 / 35%)",
			}}
		/>
	);
}

function PartsMenu(props: { options: Group[]; placeholder?: string }): JSX.Element {
	const [open, setOpen] = createSignal(true);
	return (
		<M.Root open={open()} onOpenChange={setOpen}>
			<M.Trigger as={Button} variant="secondary">
				Open commands
			</M.Trigger>
			<M.Portal>
				<M.Content<Command, Group>
					options={props.options}
					optionValue="id"
					optionTextValue="label"
					optionDisabled="disabled"
					optionGroupChildren="commands"
					sectionComponent={section => (
						<M.Group>
							<M.GroupLabel>{section.section.rawValue.name}</M.GroupLabel>
						</M.Group>
					)}
					itemComponent={item => (
						<M.Item item={item.item}>
							<M.Leading>
								<Show when={item.item.rawValue.orb}>{orb => <Orb colors={orb()} />}</Show>
							</M.Leading>
							<M.ItemLabel>{item.item.rawValue.label}</M.ItemLabel>
							<Show when={item.item.rawValue.current}>
								<M.ItemIndicator forceMount>
									<icons.CheckIcon />
								</M.ItemIndicator>
							</Show>
							<Show when={item.item.rawValue.shortcut}>
								<M.Shortcut>{item.item.rawValue.shortcut}</M.Shortcut>
							</Show>
						</M.Item>
					)}
				>
					<M.Title>Commands</M.Title>
					<M.Search>
						<SearchIcon />
						<M.SearchInput
							aria-label="Search themes and options"
							placeholder={props.placeholder ?? "Search themes and options"}
						/>
						<M.Hint>↑↓ preview · ↵ apply · esc cancel</M.Hint>
					</M.Search>
					<M.Listbox aria-label="Commands" />
					<M.Empty>No command matches</M.Empty>
				</M.Content>
			</M.Portal>
		</M.Root>
	);
}

export const PartsOpen: Story = {
	tags: ["!autodocs"],
	render: () => <PartsMenu options={groups} />,
};

export const PartsEmpty: Story = {
	tags: ["!autodocs"],
	render: () => <PartsMenu options={[]} />,
};

const commands: CommandItem[] = [
	...groups.flatMap(group =>
		group.commands.map(command => ({
			id: command.id,
			textValue: command.label,
			label: command.label,
			group: group.name,
			leading: command.orb ? <Orb colors={command.orb} /> : undefined,
			shortcut: command.shortcut,
			current: command.current,
			disabled: command.disabled,
		})),
	),
	{
		id: "font",
		textValue: "JetBrains Mono",
		label: "JetBrains Mono",
		description: "Monospace with ligatures",
		group: "Font",
		section: "Editor",
	},
];

function Ready(props: { defaultOpen?: boolean; query?: string }) {
	const [open, setOpen] = createSignal(props.defaultOpen ?? false);
	const [previewed, setPreviewed] = createSignal<string>();
	return (
		<>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Commands ⌘K
			</Button>
			<p>Previewing: {previewed() ?? "nothing"}</p>
			<CommandMenu
				open={open()}
				onOpenChange={setOpen}
				items={commands}
				title="Search themes and options"
				placeholder="Search themes and options"
				hint="↑↓ preview · ↵ apply · esc cancel"
				emptyContent="No command matches"
				query={props.query}
				onHighlightChange={item => setPreviewed(item?.textValue)}
				onBeforeClose={() => setPreviewed(undefined)}
				onSelect={() => {}}
			/>
		</>
	);
}

export const Default: Story = {
	render: () => <Ready />,
};

export const Open: Story = {
	tags: ["!autodocs"],
	render: () => <Ready defaultOpen />,
	play: async () => {
		const panel = await within(document.body).findByRole("dialog");
		const { left, right, width } = panel.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		await expect(width).toBeCloseTo(Math.min(640, viewportWidth - 32));
		await expect(left).toBeCloseTo(viewportWidth - right);
		await expect(getComputedStyle(panel).animationName).toBe("none");
	},
};

export const Empty: Story = {
	tags: ["!autodocs"],
	render: () => <Ready defaultOpen query="kiwi" />,
};
