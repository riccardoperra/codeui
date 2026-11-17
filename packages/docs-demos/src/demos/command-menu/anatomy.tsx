import "./anatomy.css";
import { For } from "solid-js";
import { Button, icons } from "@codeui/kit";
import * as M from "@codeui/kit/command-menu";

type Command = { id: string; label: string; description?: string; shortcut?: string; current?: boolean };
type Group = { name: string; commands: Command[] };

const groups: Group[] = [
	{
		name: "Export",
		commands: [
			{ id: "png", label: "Export as PNG", description: "1280 × 720", shortcut: "⌘ E", current: true },
			{ id: "svg", label: "Export as SVG" },
		],
	},
];

/** Open and non-modal, drawn inside the figure. The second panel shows the empty state. */
export default function CommandMenuAnatomy() {
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-3)", "justify-items": "center", width: "100%" }}>
			<For each={[groups, [] as Group[]]}>
				{(options, index) => (
					<M.Root modal={false} open>
						{index() === 0 ? (
							<M.Trigger as={Button} theme="secondary">
								Open commands
							</M.Trigger>
						) : null}
						<div style={{ position: "relative", width: "100%", "max-width": "440px", padding: "8px" }}>
							{index() === 0 ? <M.Overlay style={{ position: "absolute", inset: 0, "border-radius": "22px" }} /> : null}
							<M.Content<Command, Group>
								class="command-menu-anatomy-panel"
								options={options}
								optionValue="id"
								optionTextValue="label"
								optionGroupChildren="commands"
								sectionComponent={section => (
									<M.Group>
										<M.GroupLabel>{section.section.rawValue.name}</M.GroupLabel>
									</M.Group>
								)}
								itemComponent={item => (
									<M.Item item={item.item}>
										<M.Leading>
											<icons.CheckIcon />
										</M.Leading>
										<div>
											<M.ItemLabel>{item.item.rawValue.label}</M.ItemLabel>
											{item.item.rawValue.description ? (
												<M.ItemDescription>{item.item.rawValue.description}</M.ItemDescription>
											) : null}
										</div>
										{item.item.rawValue.current ? (
											<M.ItemIndicator forceMount>
												<icons.CheckIcon />
											</M.ItemIndicator>
										) : null}
										{item.item.rawValue.shortcut ? <M.Shortcut>{item.item.rawValue.shortcut}</M.Shortcut> : null}
									</M.Item>
								)}
							>
								<M.Title>Commands</M.Title>
								<M.Search>
									<M.SearchInput aria-label="Search commands" placeholder={index() ? "Watermark" : "Search commands"} />
									<M.Hint>↑↓ preview · ↵ apply · esc cancel</M.Hint>
								</M.Search>
								<M.Listbox aria-label="Commands" />
								<M.Empty>No command matches</M.Empty>
							</M.Content>
						</div>
					</M.Root>
				)}
			</For>
		</div>
	);
}
