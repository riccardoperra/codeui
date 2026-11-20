import { cleanup, fireEvent, render, screen, within } from "@solidjs/testing-library";
import { createSignal, For } from "solid-js";
import { Dialog } from "../src/components/Dialog/Dialog";
import * as D from "../src/parts/dialog";
import { expectDismissed, press, tick } from "./helpers";

afterEach(cleanup);


const sections = ["General", "Appearance", "Export", "About"] as const;

function SettingsDialog() {
	const [section, setSection] = createSignal<(typeof sections)[number]>("General");
	return (
		<D.Root defaultOpen>
			<D.Portal>
				<D.Overlay />
				<D.Positioner size="settings">
					<D.Content size="settings" chrome="inset">
						<D.Sidebar search={<input aria-label="Search settings" />}>
							<D.Nav aria-label="Settings sections">
								<For each={sections}>
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
								<D.CloseButton aria-label="Close settings" />
							</D.Header>
							<D.Body>
								<D.Section title="Interface">
									<div>Language</div>
								</D.Section>
							</D.Body>
						</D.Main>
					</D.Content>
				</D.Positioner>
			</D.Portal>
		</D.Root>
	);
}

describe("Dialog settings layout", () => {
	it("lists the sections and marks the current one with aria-current", () => {
		render(() => <SettingsDialog />);
		const nav = screen.getByRole("navigation", { name: "Settings sections" });
		const items = within(nav).getAllByRole("button");
		expect(within(nav).getAllByRole("listitem")).toHaveLength(4);
		expect(items.map(item => item.getAttribute("aria-current"))).toEqual(["page", null, null, null]);
	});

	it("moves focus with the arrow keys, wraps, and jumps with Home and End", () => {
		render(() => <SettingsDialog />);
		const items = within(screen.getByRole("navigation")).getAllByRole("button");
		items[0].focus();
		press("ArrowDown");
		expect(document.activeElement).toBe(items[1]);
		press("ArrowRight");
		expect(document.activeElement).toBe(items[2]);
		press("ArrowUp");
		expect(document.activeElement).toBe(items[1]);
		press("End");
		expect(document.activeElement).toBe(items[3]);
		press("ArrowDown");
		expect(document.activeElement).toBe(items[0]);
		press("ArrowLeft");
		expect(document.activeElement).toBe(items[3]);
		press("Home");
		expect(document.activeElement).toBe(items[0]);
	});

	it("selects the focused section with Enter and moves aria-current to it", () => {
		render(() => <SettingsDialog />);
		const items = within(screen.getByRole("navigation")).getAllByRole("button");
		items[0].focus();
		press("ArrowDown");
		press("ArrowDown");
		// A button activates on Enter; jsdom does not synthesize the click.
		fireEvent.click(document.activeElement!);
		expect(items[2]).toHaveAttribute("aria-current", "page");
		expect(items[0]).not.toHaveAttribute("aria-current");
		expect(screen.getByRole("dialog")).toHaveAccessibleName("Settings / Export");
	});

	it("keeps arrow keys for the search field", () => {
		render(() => <SettingsDialog />);
		const search = screen.getByRole("textbox", { name: "Search settings" });
		search.focus();
		press("ArrowDown");
		expect(document.activeElement).toBe(search);
	});

	it("puts the search in the sidebar and the section title over its island", () => {
		render(() => <SettingsDialog />);
		const sidebar = document.querySelector(`[data-cui="${D.dialogParts.sidebar}"]`)!;
		expect(within(sidebar as HTMLElement).getByRole("textbox")).toBeInTheDocument();
		const section = screen.getByRole("heading", { name: "Interface" }).closest("section")!;
		expect(section).toHaveAttribute("data-variant", "group");
		expect(section.querySelector(`[data-cui="${D.dialogParts.sectionContent}"]`)).toHaveTextContent(
			"Language",
		);
	});

	it("gives inset chrome a ghost close button", () => {
		render(() => <SettingsDialog />);
		const dialog = screen.getByRole("dialog");
		expect(dialog).toHaveAttribute("data-chrome", "inset");
		const close = screen.getByRole("button", { name: "Close settings" });
		expect(close.className).not.toBe("");
		cleanup();
		render(() => <Dialog open title="Export" />);
		expect(screen.getByRole("dialog")).toHaveAttribute("data-chrome", "bar");
	});
});

describe("Dialog split body", () => {
	it("marks the body as split and lays out a well and a two-column section", () => {
		render(() => (
			<Dialog open title="Export" size="export" chrome="inset">
				<D.Body layout="split">
					<D.Section variant="well" aria-label="Preview">
						<img alt="Preview of the snippet" />
					</D.Section>
					<div>Options</div>
				</D.Body>
				<D.Footer>
					<button>Download PNG</button>
				</D.Footer>
				<D.Section variant="well" title="More" columns={2}>
					<button>Copy alt text</button>
					<button>Export settings…</button>
				</D.Section>
			</Dialog>
		));
		const body = document.querySelector(`[data-cui="${D.dialogParts.body}"]`)!;
		expect(body).toHaveAttribute("data-layout", "split");
		expect(body.children).toHaveLength(2);
		const more = screen.getByRole("heading", { name: "More" }).closest("section")!;
		expect(more).toHaveAttribute("data-variant", "well");
		expect(more).toHaveAttribute("data-columns", "2");
	});
});

describe("Dialog motion", () => {
	function renderOpener(props: Partial<Parameters<typeof Dialog>[0]> = {}) {
		render(() => {
			const [open, setOpen] = createSignal(false);
			return (
				<>
					<button onClick={() => setOpen(true)}>Open</button>
					<Dialog title="Export" open={open()} onOpenChange={setOpen} {...props} />
				</>
			);
		});
		const opener = screen.getByRole("button", { name: "Open" });
		opener.focus();
		return opener;
	}

	const positioner = () => document.querySelector(`[data-cui="${D.dialogParts.positioner}"]`);

	it("does not animate the panel or the scrim when opened from the keyboard", async () => {
		const opener = renderOpener();
		press("Enter");
		fireEvent.click(opener);
		await tick();
		expect(screen.getByRole("dialog")).toHaveAttribute("data-motion", "none");
		expect(positioner()).toHaveAttribute("data-motion", "none");
	});

	it("animates when opened with a pointer, unless motion is none", async () => {
		const opener = renderOpener();
		fireEvent.pointerDown(opener);
		fireEvent.click(opener);
		await tick();
		expect(screen.getByRole("dialog")).not.toHaveAttribute("data-motion");
		expect(positioner()).not.toHaveAttribute("data-motion");
		cleanup();

		const still = renderOpener({ motion: "none" });
		fireEvent.pointerDown(still);
		fireEvent.click(still);
		await tick();
		expect(screen.getByRole("dialog")).toHaveAttribute("data-motion", "none");
	});

	it("closes from Escape without the exit animation", async () => {
		const opener = renderOpener();
		fireEvent.pointerDown(opener);
		fireEvent.click(opener);
		await tick();
		const dialog = screen.getByRole("dialog");
		expect(dialog).not.toHaveAttribute("data-motion");
		const closingPositioner = positioner();
		press("Escape");
		// The exit plays only when the close starts with a pointer.
		expect(dialog).toHaveAttribute("data-motion", "none");
		expect(closingPositioner).toHaveAttribute("data-motion", "none");
		await expectDismissed(dialog);
	});
});
