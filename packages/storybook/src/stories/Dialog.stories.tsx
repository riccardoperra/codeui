import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { expect, within } from "storybook/test";

import {
	Button,
	Checkbox,
	Dialog,
	DialogPanelContent,
	DialogPanelFooter,
	OptionCardGroup,
	SegmentedControl,
	SegmentedControlItem,
	Switch,
	TextField,
} from "@codeui/kit";
import { createSignal, For, type JSX } from "solid-js";
import { DocsItemsContainer } from "./components/Section.jsx";
import * as D from "@codeui/kit/dialog/parts";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
	title: "DesignSystem/Dialog",
	component: Dialog,
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
	render: () => (
		<DocsItemsContainer>
			<For each={["xs", "sm", "md", "lg", "xl", "full"] as const}>
				{size => {
					const [open, setOpen] = createSignal(false);
					return (
						<>
							<Button variant={"primary"} onClick={() => setOpen(true)}>
								Open ({size})
							</Button>
							<Dialog
								open={open()}
								title={`Dialog title ${size}`}
								size={size}
								onOpenChange={value => setOpen(value)}
							>
								<DialogPanelContent>
									Kobalte is a UI toolkit for building accessible web apps and design
									systems with SolidJS. It provides a set of low-level UI components and
									primitives which can be the foundation for your design system
									implementation.
								</DialogPanelContent>
							</Dialog>
						</>
					);
				}}
			</For>
		</DocsItemsContainer>
	),
};

export const OverflowContent: Story = {
	render: () => {
		const [open, setOpen] = createSignal(false);
		return (
			<DocsItemsContainer>
				<Button variant={"secondary"} onClick={() => setOpen(true)}>
					Open Dialog
				</Button>
				<Dialog open={open()} title={`Dialog title`} size={"md"} onOpenChange={setOpen}>
					<DialogPanelContent>
						{new Array(20).fill("").map(() => {
							return (
								<p>
									Kobalte is a UI toolkit for building accessible web apps and design
									systems with SolidJS. It provides a set of low-level UI components and
									primitives which can be the foundation for your design system
									implementation.
								</p>
							);
						})}
					</DialogPanelContent>
					<DialogPanelFooter>
						<Button variant={"secondary"}>Close</Button>
						<Button variant={"primary"}>Confirm</Button>
					</DialogPanelFooter>
				</Dialog>

				<Button variant={"secondary"} onClick={() => setOpen(true)}>
					Open Dialog (full)
				</Button>
				<Dialog open={open()} title={`Dialog title`} size={"full"} onOpenChange={setOpen}>
					<DialogPanelContent>
						{new Array(400).fill("").map(() => {
							return (
								<p>
									Kobalte is a UI toolkit for building accessible web apps and design
									systems with SolidJS. It provides a set of low-level UI components and
									primitives which can be the foundation for your design system
									implementation.
								</p>
							);
						})}
					</DialogPanelContent>
					<DialogPanelFooter>
						<Button variant={"secondary"}>Close</Button>
						<Button variant={"primary"}>Confirm</Button>
					</DialogPanelFooter>
				</Dialog>
			</DocsItemsContainer>
		);
	},
};

/** Opened on load to show the styled parts in a custom layout. Hidden from the docs page, where an open modal would cover it. */
export const Parts: Story = {
	tags: ["!autodocs"],
	render: () => (
		<D.Root defaultOpen>
			<D.Trigger as={Button} variant={"secondary"}>
				Export video
			</D.Trigger>
			<D.Portal>
				<D.Overlay />
				<D.Positioner size={"sm"}>
					<D.Content size={"sm"}>
						<D.Header>
							<D.Title>
								Export <strong>video</strong>
							</D.Title>
							<D.CloseButton />
						</D.Header>
						<D.Description>Pick a format and a frame rate.</D.Description>
						<D.Body>The export runs in the background. You can keep editing.</D.Body>
						<D.Footer>
							<Button variant={"primary"}>Export</Button>
						</D.Footer>
					</D.Content>
				</D.Positioner>
			</D.Portal>
		</D.Root>
	),
};

const row: JSX.CSSProperties = {
	display: "flex",
	"align-items": "center",
	"justify-content": "space-between",
	gap: "var(--cui-space-6)",
	"min-height": "56px",
	padding: "var(--cui-space-2) var(--cui-space-4)",
	"flex-wrap": "wrap",
};
const rowText: JSX.CSSProperties = { display: "flex", "flex-direction": "column", gap: "2px" };
const muted: JSX.CSSProperties = { color: "var(--cui-text-muted)", "font-size": "var(--cui-font-size-xs)" };

function SettingRow(props: { title: string; description: string; children: JSX.Element }) {
	return (
		<div style={row} role="group" aria-label={props.title}>
			<div style={rowText}>
				<span style={{ "font-size": "var(--cui-font-size-sm)", "font-weight": 500 }}>{props.title}</span>
				<span style={muted}>{props.description}</span>
			</div>
			{props.children}
		</div>
	);
}

const settingsSections = ["General", "Appearance", "Export", "Experiments", "What's new", "About"];

/** The settings layout: a sidebar with search and sections, and the section on screen. Opened on load. */
export const SettingsLayout: Story = {
	tags: ["!autodocs"],
	play: async () => {
		const panel = await within(document.body).findByRole("dialog", { name: "Settings / General" });
		await expect(getComputedStyle(panel).borderTopLeftRadius).toBe("14px");
	},
	render: () => {
		const [section, setSection] = createSignal("General");
		return (
			<D.Root defaultOpen>
				<D.Trigger as={Button} variant={"secondary"}>
					Open settings
				</D.Trigger>
				<D.Portal>
					<D.Overlay />
					<D.Positioner size={"settings"}>
						<D.Content size={"settings"} chrome={"inset"}>
							<D.Sidebar search={<TextField size={"sm"} aria-label={"Search settings"} placeholder={"Search settings"} />}>
								<D.Nav aria-label={"Settings sections"}>
									<For each={settingsSections}>
										{item => (
											<D.NavItem current={section() === item} onClick={() => setSection(item)}>
												{item}
											</D.NavItem>
										)}
									</For>
								</D.Nav>
							</D.Sidebar>
							<D.Main>
								<D.Header>
									<D.Title>Settings / {section()}</D.Title>
									<D.CloseButton aria-label={"Close settings"} />
								</D.Header>
								<D.Body>
									<D.Section title={"Interface"}>
										<SettingRow title={"Language"} description={"The language of the menus, labels and messages."}>
											<SegmentedControl size={"sm"} aria-label={"Language"} defaultValue={"en"}>
												<SegmentedControlItem value={"it"}>Italian</SegmentedControlItem>
												<SegmentedControlItem value={"en"}>English</SegmentedControlItem>
												<SegmentedControlItem value={"de"}>German</SegmentedControlItem>
											</SegmentedControl>
										</SettingRow>
										<SettingRow title={"Line numbers"} description={"Show a number before each line of code."}>
											<Switch aria-label={"Line numbers"} defaultChecked />
										</SettingRow>
									</D.Section>
								</D.Body>
							</D.Main>
						</D.Content>
					</D.Positioner>
				</D.Portal>
			</D.Root>
		);
	},
};

/** The export layout: inset chrome, a preview beside its options, an actions row and a More section. Opened on load. */
export const ExportLayout: Story = {
	tags: ["!autodocs"],
	render: () => (
		<D.Root defaultOpen>
			<D.Trigger as={Button} variant={"secondary"}>
				Export…
			</D.Trigger>
			<D.Portal>
				<D.Overlay />
				<D.Positioner size={"export"}>
					<D.Content size={"export"} chrome={"inset"}>
						<D.Header>
							<D.Title>Export</D.Title>
							<D.CloseButton aria-label={"Close"} />
						</D.Header>
						<D.Body layout={"split"}>
							<D.Section variant={"well"} aria-label={"Preview"}>
								<div
									role={"img"}
									aria-label={"Preview of index.tsx"}
									style={{ "min-height": "220px", "border-radius": "6px", background: "linear-gradient(135deg, #e0915c, #7c3aed)" }}
								/>
							</D.Section>
							<div style={{ display: "flex", "flex-direction": "column", gap: "var(--cui-space-4)" }}>
								<OptionCardGroup
									label={"Format"}
									orientation={"vertical"}
									defaultValue={"png"}
									items={[
										{ value: "png", label: "PNG", description: "Sharp text, transparent corners" },
										{ value: "jpeg", label: "JPEG", description: "Smaller file, no transparency" },
										{ value: "svg", label: "SVG", description: "Vector, sharp at any size" },
									]}
								/>
								<SegmentedControl aria-label={"Scale"} defaultValue={"3"} fluid autoWidth>
									<SegmentedControlItem value={"1"}>1x</SegmentedControlItem>
									<SegmentedControlItem value={"2"}>2x</SegmentedControlItem>
									<SegmentedControlItem value={"3"}>3x</SegmentedControlItem>
									<SegmentedControlItem value={"6"}>6x</SegmentedControlItem>
								</SegmentedControl>
								<Checkbox label={"Remember as default"} />
							</div>
						</D.Body>
						<D.Footer>
							<Button variant={"secondary"}>Copy image</Button>
							<Button variant={"primary"}>Download PNG · 3x</Button>
						</D.Footer>
						<D.Section variant={"well"} title={"More"} columns={2}>
							<Button variant={"secondary"} ghost>
								Copy alt text
							</Button>
							<Button variant={"secondary"} ghost>
								Export settings…
							</Button>
						</D.Section>
					</D.Content>
				</D.Positioner>
			</D.Portal>
		</D.Root>
	),
};
