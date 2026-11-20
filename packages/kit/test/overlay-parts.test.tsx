import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Dialog, DialogPanelContent } from "../src/components/Dialog/Dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../src/components/Popover/Popover";
import * as D from "../src/parts/dialog";
import * as P from "../src/parts/popover";
import { expectDismissed, expectFocus, expectFocusWithin, press, tick } from "./helpers";

afterEach(cleanup);


async function closeDialog(dialog: HTMLElement) {
	const overlay = document.querySelector<HTMLElement>('[data-cui="dialog-overlay"]');
	press("Escape");
	await tick();
	await expectDismissed(dialog);
	if (overlay) await expectDismissed(overlay);
	await tick();
}

describe("Dialog", () => {
	it("takes JSX as its title and names the dialog with it", () => {
		render(() => (
			<Dialog open title={<span>Export <strong>settings</strong></span>}>
				<DialogPanelContent>Body</DialogPanelContent>
			</Dialog>
		));
		expect(screen.getByRole("dialog", { name: "Export settings" })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Export settings" })).toBeInTheDocument();
	});

	it("describes the dialog with its description", () => {
		render(() => <Dialog open title="Delete" description={<em>This cannot be undone.</em>} />);
		expect(screen.getByRole("dialog")).toHaveAccessibleDescription("This cannot be undone.");
	});

	it("labels the close button with closeLabel and closes from it", async () => {
		const onOpenChange = vi.fn();
		render(() => <Dialog open title="Impostazioni" closeLabel="Chiudi" onOpenChange={onOpenChange} />);
		expect(screen.queryByRole("button", { name: "close" })).not.toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "Chiudi" }));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("keeps the default close label", () => {
		render(() => <Dialog open title="Settings" />);
		expect(screen.getByRole("button", { name: "close" })).toBeInTheDocument();
	});

	it("puts each class from classes on its part", () => {
		render(() => (
			<Dialog open title="Settings" classes={{ panel: "wide", title: "crumbs", closeButton: "corner" }} />
		));
		expect(screen.getByRole("dialog")).toHaveClass("wide");
		expect(screen.getByRole("heading", { name: "Settings" })).toHaveClass("crumbs");
		expect(screen.getByRole("button", { name: "close" })).toHaveClass("corner");
	});

	it("renders into the mount node", () => {
		const host = document.createElement("section");
		document.body.append(host);
		render(() => <Dialog open title="Settings" mount={host} />);
		expect(host).toContainElement(screen.getByRole("dialog"));
		host.remove();
	});

	it("lets onCloseAutoFocus keep focus elsewhere", async () => {
		render(() => {
			const [open, setOpen] = createSignal(false);
			return (
				<>
					<button onClick={() => setOpen(true)}>Open</button>
					<button>Elsewhere</button>
					<Dialog
						title="Settings"
						open={open()}
						onOpenChange={setOpen}
						onCloseAutoFocus={event => {
							event.preventDefault();
							screen.getByRole("button", { name: "Elsewhere", hidden: true }).focus();
						}}
					/>
				</>
			);
		});
		const opener = screen.getByRole("button", { name: "Open" });
		opener.focus();
		fireEvent.click(opener);
		const dialog = screen.getByRole("dialog");
		await expectFocusWithin(dialog);
		await closeDialog(dialog);
		await expectFocus(screen.getByRole("button", { name: "Elsewhere" }));
	});
});

describe("Dialog parts", () => {
	function renderParts(withTrigger: boolean) {
		render(() => {
			const [open, setOpen] = createSignal(false);
			return (
				<D.Root open={open()} onOpenChange={setOpen}>
					{withTrigger ? (
						<D.Trigger>Open</D.Trigger>
					) : (
						<button onClick={() => setOpen(true)}>Open</button>
					)}
					<D.Portal>
						<D.Overlay />
						<D.Positioner>
							<D.Content class="confirm">
								<D.Header>
									<D.Title>Export video</D.Title>
									<D.CloseButton aria-label="Close export" />
								</D.Header>
								<D.Description>Pick a format.</D.Description>
								<D.Body>
									<input aria-label="File name" />
								</D.Body>
								<D.Footer>
									<button>Export</button>
								</D.Footer>
							</D.Content>
						</D.Positioner>
					</D.Portal>
				</D.Root>
			);
		});
		const opener = screen.getByRole("button", { name: "Open" });
		opener.focus();
		fireEvent.click(opener);
		return opener;
	}

	it("compose an accessible dialog with the caller's class", async () => {
		renderParts(true);
		await tick();
		const dialog = screen.getByRole("dialog", { name: "Export video" });
		expect(dialog).toHaveAccessibleDescription("Pick a format.");
		expect(dialog).toHaveClass("confirm");
		expect(dialog).toHaveAttribute("data-cui", D.dialogParts.panel);
		expect(dialog).toContainElement(screen.getByRole("button", { name: "Close export" }));
	});

	it.each([
		["a Trigger", true],
		["a plain button", false],
	])("return focus to %s on close", async (_, withTrigger) => {
		const opener = renderParts(withTrigger);
		const dialog = screen.getByRole("dialog");
		await expectFocusWithin(dialog);
		await closeDialog(dialog);
		await expectFocus(opener);
	});
});

describe("Popover", () => {
	function renderPopover(content: () => ReturnType<typeof PopoverContent>, props = {}) {
		render(() => (
			<Popover {...props}>
				<PopoverTrigger>Share</PopoverTrigger>
				{content()}
			</Popover>
		));
		fireEvent.click(screen.getByRole("button", { name: "Share" }));
	}

	it("renders children directly in the content, without a paragraph", async () => {
		renderPopover(() => (
			<PopoverContent title="Share">
				<div data-testid="grid">Grid</div>
			</PopoverContent>
		));
		await tick();
		const dialog = screen.getByRole("dialog");
		expect(screen.getByTestId("grid").parentElement).toBe(dialog);
		expect(dialog.querySelector("p")).toBeNull();
	});

	it("takes JSX as its title and describes itself with description", async () => {
		renderPopover(() => (
			<PopoverContent title={<span>Share <em>snippet</em></span>} description="Anyone with the link can view.">
				Copy the link
			</PopoverContent>
		));
		await tick();
		const dialog = screen.getByRole("dialog", { name: "Share snippet" });
		expect(dialog).toHaveAccessibleDescription("Anyone with the link can view.");
	});

	it("puts classes on its parts and renders into the mount node", async () => {
		const host = document.createElement("section");
		document.body.append(host);
		renderPopover(() => (
			<PopoverContent title="Share" mount={host} class="own" classes={{ content: "panel", title: "heading" }}>
				Copy
			</PopoverContent>
		));
		await tick();
		const dialog = screen.getByRole("dialog");
		expect(host).toContainElement(dialog);
		expect(dialog).toHaveClass("own", "panel");
		expect(screen.getByRole("heading", { name: "Share" })).toHaveClass("heading");
		host.remove();
	});

	// The browser positions the content below the real trigger box plus its gutter.
	it.each([
		[undefined, "6px"],
		[20, "20px"],
	])("places the content with gutter %s", async (gutter, offset) => {
		renderPopover(() => <PopoverContent>Copy</PopoverContent>, { placement: "bottom", gutter });
		await tick();
		await tick();
		const positioner = screen.getByRole("dialog").parentElement!;
		const bottom = screen.getByRole("button", { name: "Share" }).getBoundingClientRect().bottom;
		expect(positioner.style.transform).toContain(`${bottom + parseFloat(offset)}px`);
	});
});

describe("Popover parts", () => {
	it("compose a popover that closes from its close button", async () => {
		render(() => (
			<P.Root>
				<P.Trigger>What's new</P.Trigger>
				<P.Portal>
					<P.Content class="coachmark" variant="bordered">
						<P.Title>New export panel</P.Title>
						<P.Description>Export styles live here now.</P.Description>
						<P.CloseButton aria-label="Dismiss" />
					</P.Content>
				</P.Portal>
			</P.Root>
		));
		const trigger = screen.getByRole("button", { name: "What's new" });
		trigger.focus();
		fireEvent.click(trigger);
		await tick();
		const dialog = screen.getByRole("dialog", { name: "New export panel" });
		expect(dialog).toHaveAccessibleDescription("Export styles live here now.");
		expect(dialog).toHaveClass("coachmark");
		fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
		await tick();
		await expectDismissed(dialog);
		expect(trigger).toHaveAttribute("aria-expanded", "false");
	});
});
