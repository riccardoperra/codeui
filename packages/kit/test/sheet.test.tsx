import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { createSignal } from "solid-js";
import { Sheet } from "../src/components/Sheet/Sheet";
import * as S from "../src/parts/sheet";
import { expectDismissed, press, tick } from "./helpers";

afterEach(cleanup);


async function expectSheetDismissed(sheet: HTMLElement) {
	const overlay = document.querySelector<HTMLElement>(`[data-cui="${S.sheetParts.overlay}"]`);
	await expectDismissed(sheet);
	if (overlay) await expectDismissed(overlay);
	await tick();
}

function renderOpener(props: Partial<Parameters<typeof Sheet>[0]> = {}) {
	render(() => {
		const [open, setOpen] = createSignal(false);
		return (
			<>
				<button onClick={() => setOpen(true)}>Open</button>
				<button>Outside</button>
				<Sheet title="Layers" open={open()} onOpenChange={setOpen} {...props}>
					<input aria-label="Name" />
				</Sheet>
			</>
		);
	});
	const opener = screen.getByRole("button", { name: "Open" });
	opener.focus();
	return opener;
}

describe("Sheet", () => {
	it("takes JSX as its title and description", () => {
		render(() => (
			<Sheet
				open
				title={
					<span>
						Export <strong>settings</strong>
					</span>
				}
				description={<em>Pick a format.</em>}
			/>
		));
		const sheet = screen.getByRole("dialog", { name: "Export settings" });
		expect(sheet).toHaveAccessibleDescription("Pick a format.");
		expect(sheet).toHaveAttribute("data-cui", S.sheetParts.content);
	});

	it("is named by aria-label when it has no title", () => {
		render(() => <Sheet open aria-label="Background" showCloseButton={false} />);
		expect(screen.getByRole("dialog", { name: "Background" })).toBeInTheDocument();
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("attaches to the bottom unless a side is given", () => {
		render(() => (
			<>
				<Sheet open aria-label="Bottom" modal={false} />
				<Sheet open aria-label="Right" side="right" modal={false} />
			</>
		));
		expect(screen.getByRole("dialog", { name: "Bottom" })).toHaveAttribute("data-side", "bottom");
		expect(screen.getByRole("dialog", { name: "Right" })).toHaveAttribute("data-side", "right");
	});

	it("labels the close button with closeLabel and closes from it", () => {
		const onOpenChange = vi.fn();
		render(() => <Sheet open title="Livelli" closeLabel="Chiudi" onOpenChange={onOpenChange} />);
		fireEvent.click(screen.getByRole("button", { name: "Chiudi" }));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("renders the footer and puts each class from classes on its part", () => {
		render(() => (
			<Sheet
				open
				title="Export"
				class="tall"
				footer={<button>Save</button>}
				classes={{ content: "wide", title: "crumbs", footer: "actions", overlay: "dim" }}
			/>
		));
		const sheet = screen.getByRole("dialog");
		expect(sheet).toHaveClass("tall", "wide");
		expect(screen.getByRole("heading", { name: "Export" })).toHaveClass("crumbs");
		expect(screen.getByRole("button", { name: "Save" }).parentElement).toHaveClass("actions");
		expect(document.querySelector(`[data-cui="${S.sheetParts.overlay}"]`)).toHaveClass("dim");
	});

	it("covers the page with a scrim only when modal", () => {
		render(() => <Sheet open title="Modal" />);
		expect(document.querySelector(`[data-cui="${S.sheetParts.overlay}"]`)).toBeInTheDocument();
		cleanup();
		render(() => <Sheet open title="Docked" modal={false} />);
		expect(document.querySelector(`[data-cui="${S.sheetParts.overlay}"]`)).not.toBeInTheDocument();
	});

	it("renders into the mount node", () => {
		const host = document.createElement("section");
		document.body.append(host);
		render(() => <Sheet open title="Layers" mount={host} modal={false} />);
		expect(host).toContainElement(screen.getByRole("dialog"));
		host.remove();
	});

	it("moves focus in, keeps it inside while modal, and returns it to the opener", async () => {
		const opener = renderOpener();
		fireEvent.click(opener);
		await tick();
		const sheet = screen.getByRole("dialog", { name: "Layers" });
		expect(sheet).toContainElement(document.activeElement as HTMLElement);

		screen.getByRole("button", { name: "Outside", hidden: true }).focus();
		await tick();
		expect(sheet).toContainElement(document.activeElement as HTMLElement);

		press("Escape");
		await expectSheetDismissed(sheet);
		expect(document.activeElement).toBe(opener);
	});

	it("lets contentProps keep focus elsewhere on close", async () => {
		const opener = renderOpener({
			contentProps: {
				onCloseAutoFocus: event => {
					event.preventDefault();
					screen.getByRole("button", { name: "Outside", hidden: true }).focus();
				},
			},
		});
		fireEvent.click(opener);
		await tick();
		const sheet = screen.getByRole("dialog");
		press("Escape");
		await expectDismissed(sheet);
		expect(document.activeElement).toHaveTextContent("Outside");
	});

	it("does not move when opened from the keyboard", async () => {
		const opener = renderOpener();
		press("Enter");
		fireEvent.click(opener);
		await tick();
		expect(screen.getByRole("dialog")).toHaveAttribute("data-motion", "none");
	});

	it("slides when opened with a pointer, unless motion is none", async () => {
		const opener = renderOpener();
		fireEvent.pointerDown(opener);
		fireEvent.click(opener);
		await tick();
		expect(screen.getByRole("dialog")).not.toHaveAttribute("data-motion");
		cleanup();

		const still = renderOpener({ motion: "none" });
		fireEvent.pointerDown(still);
		fireEvent.click(still);
		await tick();
		expect(screen.getByRole("dialog")).toHaveAttribute("data-motion", "none");
	});
});

describe("Sheet parts", () => {
	function renderParts() {
		render(() => (
			<S.Root>
				<S.Trigger>Open</S.Trigger>
				<S.Portal>
					<S.Overlay />
					<S.Content class="dock">
						<S.Handle aria-label="Close layers" />
						<S.Header>
							<S.Title>Layers</S.Title>
						</S.Header>
						<S.Body>
							<input aria-label="Name" />
						</S.Body>
					</S.Content>
				</S.Portal>
			</S.Root>
		));
		const trigger = screen.getByRole("button", { name: "Open" });
		trigger.focus();
		fireEvent.click(trigger);
		return trigger;
	}

	it("compose an accessible sheet with the caller's class", async () => {
		renderParts();
		await tick();
		const sheet = screen.getByRole("dialog", { name: "Layers" });
		expect(sheet).toHaveClass("dock");
		expect(sheet).toContainElement(screen.getByRole("button", { name: "Close layers" }));
	});

	it("close from a handle tap and return focus to the trigger", async () => {
		const trigger = renderParts();
		await tick();
		const sheet = screen.getByRole("dialog");
		fireEvent.click(screen.getByRole("button", { name: "Close layers" }));
		await expectSheetDismissed(sheet);
		expect(document.activeElement).toBe(trigger);
	});

	it("give every style function a class for each part", () => {
		for (const part of Object.keys(S.sheetParts) as S.SheetPart[]) {
			expect(typeof S.sheetStyles[part]()).toBe("string");
		}
		expect(S.sheetStyles.content()).toBe("cui-sheet-content");
	});
});
